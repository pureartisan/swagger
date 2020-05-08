import { store } from 'src/js/store';
import { SsoActionTypes } from 'src/js/actions/action-types';

export const updateSsoProviderStatus = (provider, status) => store.dispatch({
  type: SsoActionTypes.UPDATE_PROVIDER_STATUS,
  provider,
  status
});
