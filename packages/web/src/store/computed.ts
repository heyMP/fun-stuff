import { computed } from '@preact/signals';
import { state } from './state';
import type { View } from './types';

/**
 * A computed signal that derives the current UI view based on the overall
 * application status and other stateful values.
 */
export const view = computed<View>(() => {
  // If a user is selected, always show the detail view.
  if (state.selectedUser.value) {
    return 'USER_DETAIL';
  }

  // Use a switch on the main status signal for clear, readable logic.
  switch (state.status.value) {
    case 'INITIALIZING':
    case 'PENDING_AUTH':
    case 'AUTHENTICATING':
    case 'FETCHING_USERS':
      return 'LOADING';

    case 'READY':
      return 'DASHBOARD';

    case 'ERROR':
      return 'LOGIN';

    default:
      return 'LOADING';
  }
});
