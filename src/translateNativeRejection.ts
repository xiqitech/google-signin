/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import { isErrorWithCode } from './functions';
import { cancelledResult } from './constants';
import { SIGN_IN_CANCELLED_CODE } from './errors/errorCodes';

/**
 * Since the introduction of a new JS api, the native rejections need to be processed in JS layer.
 *
 * This is easier than reworking 2 native modules
 **/
export function translateCancellationError(e: unknown) {
  if (isErrorWithCode(e) && e.code === SIGN_IN_CANCELLED_CODE) {
    return cancelledResult;
  } else {
    throw e;
  }
}
