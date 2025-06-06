import { state } from '../state.js';
import type { Status } from '../types.js';

/**
 * Configuration for a stateful action.
 * @template T - The type of the arguments for the action function.
 */
interface ActionConfig<T extends any[]> {
  // The status to set before the action's logic is executed.
  preStatus?: Status;
  // The status to set after the action's logic successfully completes.
  postStatus?: Status;
  // The core async business logic.
  action: (...args: T) => Promise<any>;
}

/**
 * Creates a function that automatically handles setting status and error signals
 * throughout the lifecycle of an async operation.
 *
 * @param config The configuration for the action.
 * @returns A new, safe async function to be called from the UI or effects.
 */
export function createStatefulAction<T extends any[]>(config: ActionConfig<T>) {
  return async (...args: T) => {
    if (config.preStatus) {
      state.status.value = config.preStatus;
    }
    state.error.value = null;

    try {
      await config.action(...args);
      if (config.postStatus) {
        state.status.value = config.postStatus;
      }
    } catch (err) {
      state.error.value = err as Error;
      state.status.value = 'ERROR';
    }
  };
}