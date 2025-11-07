/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import type {
  OneTapConfigureParams,
  OneTapSignInParams,
  WebOneTapSignInCallbacks,
} from './types';
import { validateWebClientId } from './validateWebClientId';
import { warnBadApiUsage } from './warnBadApiUsage';
import { getConfigOrThrow, throwMissingWebClientId } from '../configuration';

export const createdValidatedOneTapConfig = (
  extendWith: OneTapSignInParams | undefined,
  callbacks?: WebOneTapSignInCallbacks,
): OneTapConfigureParams => {
  warnBadApiUsage(callbacks);
  const configuration = getConfigOrThrow();

  validateWebClientId(configuration);
  const webClientId = configuration?.webClientId;
  if (!webClientId) {
    throwMissingWebClientId();
  }
  if (process.env.NODE_ENV !== 'production') {
    if ('androidClientId' in configuration) {
      console.error(
        'RNGoogleSignIn: `androidClientId` is not a valid configuration parameter, remove it.',
      );
    }
  }
  return {
    ...configuration,
    ...extendWith,
    webClientId,
  };
};

export function validateOneTapConfig(callbacks?: WebOneTapSignInCallbacks) {
  // even if native module would reject, we can already reject here
  // this makes the test behavior more in line with reality
  // and provides unified error messages across platforms
  createdValidatedOneTapConfig(undefined, callbacks);
}
