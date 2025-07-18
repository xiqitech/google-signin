/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

export { GoogleSignin } from './signIn/GoogleSignin';
export { statusCodes } from './errors/errorCodes';

export { GoogleSigninButton } from './buttons/GoogleSigninButton';
export { GoogleLogoButton } from './buttons/GoogleLogoButton';

export type {
  GoogleSigninButtonProps,
  GoogleLogoButtonProps,
} from './buttons/statics';
export { WebGoogleSigninButton } from './buttons/WebGoogleSigninButton';
export type * from './types';
export { GoogleOneTapSignIn } from './oneTap/OneTapSignIn';
export type * from './oneTap/types';
export * from './functions';
