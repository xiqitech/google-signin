"use strict";

/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

// TODO
// import type { Spec } from './NativeOneTapSignIn.android';

function unsupported() {
  return Promise.reject(new Error('unsupported call'));
}
export const OneTapNativeModule = {
  signIn: unsupported,
  explicitSignIn: unsupported,
  signOut: unsupported,
  requestAuthorization: unsupported,
  checkPlayServices: unsupported,
  revokeAccess: unsupported
};
//# sourceMappingURL=NativeOneTapSignIn.js.map