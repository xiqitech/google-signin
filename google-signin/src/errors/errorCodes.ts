/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import { NativeModule } from '../spec/NativeGoogleSignin';
import { statusCodes as webStatusCodes } from './errorCodes.web';

const {
  SIGN_IN_CANCELLED,
  IN_PROGRESS,
  PLAY_SERVICES_NOT_AVAILABLE,
  SIGN_IN_REQUIRED,
  ONE_TAP_START_FAILED,
  SCOPES_ALREADY_GRANTED,
} = NativeModule.getConstants();

export const SIGN_IN_REQUIRED_CODE = SIGN_IN_REQUIRED;
export const SIGN_IN_CANCELLED_CODE = SIGN_IN_CANCELLED;

export const ios_only_SCOPES_ALREADY_GRANTED = SCOPES_ALREADY_GRANTED;

/**
 * Read more about the meaning of the error codes in the [guide](/docs/errors).
 * @group Constants
 * */
export const statusCodes = Object.freeze({
  IN_PROGRESS,
  PLAY_SERVICES_NOT_AVAILABLE,
  ONE_TAP_START_FAILED,
}) satisfies typeof webStatusCodes;
// if we instead specify the type directly on the const, typedoc will not generate the docs as I want
