import { state } from '../state.js';
import type { Status } from '../types.js';

/**
 * Internal function registry managed by the library
 */
let functionRegistry: Record<string, (...args: any[]) => any> = {};

/**
 * Store for registered function types - gets populated by registerFunctions
 */
let registeredFunctionTypes: Record<string, any> = {};

/**
 * Register functions with the library - captures exact types for inference
 */
export function registerFunctions<T extends Record<string, (...args: any[]) => any>>(functions: T): T {
  functionRegistry = { ...functionRegistry, ...functions };
  
  // Store the function types for later use
  registeredFunctionTypes = { ...registeredFunctionTypes, ...functions };
  
  return functions;
}

/**
 * Extract error types from a function's Promise return type
 */
type ExtractErrorTypes<T> = T extends (...args: any[]) => Promise<infer R>
  ? Extract<R, Error>
  : never;

/**
 * Base FunctionError type that applications will override
 */
export type FunctionError = {
  id: string;
  error: any;
};

/**
 * Helper type for inferring function error types from registered functions
 */
export type InferFunctionError<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T]: {
    id: K;
    error: ExtractErrorTypes<T[K]>;
  }
}[keyof T];

/**
 * Enhanced error type that includes function metadata
 */
interface FunctionErrorThrown<K extends string = string, E = unknown> {
  functionId: K;
  error: E;
}

/**
 * Gets a function from the registry and wraps it to automatically include function metadata when errors occur
 */
export function getFunction(functionId: string): (...args: any[]) => Promise<any> {
  const fn = functionRegistry[functionId];
  if (!fn) {
    throw new Error(`Function '${functionId}' not found in registry. Make sure to register it first.`);
  }
  return async (...args: any[]) => {
    const result = await (fn as any)(...args);
    // Check if result is an Error instance (including specific error types)
    if (result instanceof Error) {
      const enhancedError: FunctionErrorThrown = { functionId, error: result };
      throw enhancedError;
    }
    return result;
  };
}

/**
 * Configuration for a stateful action
 */
interface ActionConfig<T extends any[]> {
  preStatus?: Status;
  postStatus?: Status;
  action: (...args: T) => Promise<any>;
}

/**
 * Creates a function that automatically handles setting status and error signals
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
      if (err && typeof err === 'object' && 'functionId' in err && 'error' in err) {
        const enhancedError = err as FunctionErrorThrown;
        state.error.value = { id: enhancedError.functionId, error: enhancedError.error } as any;
      } else {
        state.status.value = 'ERROR';
        throw err;
      }
      state.status.value = 'ERROR';
    }
  };
}

