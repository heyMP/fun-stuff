import { effect } from '@preact/signals';
import { state } from './state';
import { syncUsers } from './actions';

/**
 * This effect listens for the application status to change and triggers
 * the next logical step in the application's startup process.
 */
effect(() => {
  // When the status becomes 'FETCHING_USERS', it means login was successful.
  // We can now proceed to fetch the user data.
  if (state.status.value === 'FETCHING_USERS') {
    syncUsers();
  }
});