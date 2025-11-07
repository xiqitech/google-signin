/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import type { NativeModuleError } from '../types';

const statusCodesRaw = {
  ONE_TAP_START_FAILED: 'start_failed',
  // NOTE the following codes are arbitrary, but they are used to match the native module
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
};
export const SIGN_IN_CANCELLED_CODE = 'cancel_called';

// keep separate variable statusCodesRaw because if passed directly to Object.freeze,
// the types for web and native would differ
export const statusCodes = Object.freeze(statusCodesRaw);

export const createGoogleSdkNotFoundError = (): NativeModuleError => {
  const err = new Error(
    'Google Identity SDK not found. Follow the web setup guide.',
  );
  Object.assign(err, {
    code: statusCodes.PLAY_SERVICES_NOT_AVAILABLE,
  });
  return <NativeModuleError>err;
};

export const createRevokeAccessFailedError = (
  error?: string,
): NativeModuleError => {
  const err = new Error(`revoking access failed: ${error}`);
  Object.assign(err, {
    code: 'revokeAccess',
  });
  return <NativeModuleError>err;
};
