import { UPDATE_PHRASEBOOK, UPDATE_OUTPUT } from '../../../constants/actions';
import phrasebookDb from '../../../helpers/phrasebook-db';

const defaultOptions = {
  include_docs: true,
  descending: true,
  limit: 10,
};

export const loadPhrasebook = (init, limit) => ((dispatch, getState) => {
  const { phrasebook } = getState().pages;
  const { canLoadMore } = phrasebook;

  const items = (init === true) ? [] : phrasebook.items;

  dispatch({
    type: UPDATE_PHRASEBOOK,
    items,
    canLoadMore,
    loading: true,
  });

  const options = { ...defaultOptions };
  const l = items.length;
  if (l > 0) {
    options.startkey = items[l - 1].phrasebookId;
    options.skip = 1;
  }
  if (limit) options.limit = limit;

  phrasebookDb.allDocs(options)
    .then((response) => {
      let newItems = items;

      response.rows.forEach((row) => {
        // Old data compatibility
        if (row.doc.inputObj) { // Version 1
          const { inputLang, outputLang, inputText } = row.doc.inputObj;
          const { outputText } = row.doc.outputObj;
          const { _id, _rev } = row.doc;

          newItems = [
            ...newItems,
            {
              phrasebookId: _id,
              rev: _rev,
              inputLang,
              outputLang,
              inputText,
              outputText,
            },
          ];
        } else if (row.doc.phrasebookVersion === 3) { // Latest
          const newItem = row.doc.data;
          /* eslint-disable no-underscore-dangle */
          newItem.phrasebookId = row.doc._id;
          newItem.rev = row.doc._rev;
          /* eslint-enable no-underscore-dangle */

          newItems = [...newItems, newItem];
        } else { // Version 2
          const {
            _id, _rev,
            inputLang, outputLang,
            inputText, outputText,
            inputDict, outputDict,
          } = row.doc;

          newItems = [
            ...newItems,
            {
              phrasebookId: _id,
              rev: _rev,
              inputLang,
              outputLang,
              inputText,
              outputText,
              inputDict,
              outputDict,
            },
          ];
        }
      });

      dispatch({
        type: UPDATE_PHRASEBOOK,
        items: newItems,
        canLoadMore: (response.total_rows > 0 && items.length < response.total_rows),
        loading: false,
      });
    })
    .catch((e) => {
      // eslint-disable-next-line
      console.log(e);
    });
});

export const deletePhrasebookItem = (id, rev) => ((dispatch, getState) => {
  const { home, phrasebook } = getState().pages;
  const { items, loading, canLoadMore } = phrasebook;
  const { output } = home;

  phrasebookDb.remove(id, rev)
    .then(() => {
      items.every((doc, i) => {
        if (doc.phrasebookId === id) {
          dispatch({
            type: UPDATE_PHRASEBOOK,
            items: items.filter((_, _i) => _i !== i),
            loading,
            canLoadMore,
          });

          return false;
        }
        return true;
      });

      // Update toggle star status of output
      if (output && id === output.phrasebookId) {
        const newOutput = { ...output, phrasebookId: null };

        dispatch({
          type: UPDATE_OUTPUT,
          output: newOutput,
        });
      }

      if (canLoadMore) {
        dispatch(loadPhrasebook(false, 1));
      }
    })
    .catch((e) => {
      // eslint-disable-next-line
      console.log(e);
    });
});
