import { UPDATE_PHRASEBOOK } from '../../../constants/actions';

const initialState = {
  items: [],
  canLoadMore: false,
  loading: true,
};

const phrasebook = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PHRASEBOOK:
      return {
        ...state,
        items: action.items,
        canLoadMore: action.canLoadMore,
        loading: action.loading,
      };
    default:
      return state;
  }
};

export default phrasebook;
