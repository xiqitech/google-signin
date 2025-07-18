"use strict";

/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

export const validateWebClientId = params => {
  // in Universal sign in, the presence of webClientId is verified later
  if (process.env.NODE_ENV !== 'production') {
    const {
      webClientId
    } = params;
    if (webClientId && webClientId !== 'autoDetect' && !webClientId.endsWith('.apps.googleusercontent.com')) {
      console.error(`RNGoogleSignIn: You provided an invalid webClientId. It should be either 'autoDetect' or it should end with '.apps.googleusercontent.com'.`);
    }
  }
};
//# sourceMappingURL=validateWebClientId.js.map