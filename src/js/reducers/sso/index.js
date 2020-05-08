import { SsoActionTypes  } from 'src/js/actions/action-types';

const initialState = {};

export const sso = (state = initialState, action) => {

  switch (action.type) {
    case SsoActionTypes.UPDATE_PROVIDER_STATUS:
      return {
        ...state,
        [action.provider]: action.status
      };
    default:
      return state;
  }

};
