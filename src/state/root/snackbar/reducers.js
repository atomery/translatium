import { OPEN_SNACKBAR, CLOSE_SNACKBAR } from '../../../constants/actions';

const initialState = {
  open: false,
  message: null,
};

const snackbar = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SNACKBAR:
      return {
        ...state,
        open: true,
        message: action.message,
      };
    case CLOSE_SNACKBAR:
      return { ...state, open: false };
    default:
      return state;
  }
};

export default snackbar;
