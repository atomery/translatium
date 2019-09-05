import { UPDATE_LOCALE } from '../../../constants/actions';

import enStrings from '../../../strings/en.json';
import viStrings from '../../../strings/vi.json';
import esStrings from '../../../strings/es.json';
import itStrings from '../../../strings/it.json';
import deStrings from '../../../strings/de.json';

export const updateLocale = (langId) => (dispatch) => {
  let strings;
  switch (langId.substring(0, 2)) {
    case 'vi': {
      strings = viStrings;
      break;
    }
    case 'es': {
      strings = esStrings;
      break;
    }
    case 'it': {
      strings = itStrings;
      break;
    }
    case 'de': {
      strings = deStrings;
      break;
    }
    default: {
      strings = enStrings;
      break;
    }
  }

  dispatch({
    type: UPDATE_LOCALE,
    locale: strings,
  });
};
