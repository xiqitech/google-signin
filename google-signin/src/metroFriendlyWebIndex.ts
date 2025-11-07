/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

export { GoogleSignin } from './signIn/GoogleSignin.web';
export { statusCodes } from './errors/errorCodes.web';

export { GoogleSigninButton } from './buttons/GoogleSigninButton.web';
export { GoogleLogoButton } from './buttons/GoogleLogoButton.web';

export type {
  GoogleSigninButtonProps,
  GoogleLogoButtonProps,
} from './buttons/statics';
export { WebGoogleSigninButton } from './buttons/WebGoogleSigninButton.web';
export type * from './types';
export { GoogleOneTapSignIn } from './oneTap/OneTapSignIn.web';
export type * from './oneTap/types';
export * from './functions';
