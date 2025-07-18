/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import type { WebClientId } from '../types';

export const validateWebClientId = (params: {
  webClientId?: WebClientId;
}): void => {
  if (process.env.NODE_ENV !== 'production') {
    const { webClientId } = params;
    if (webClientId && !webClientId.endsWith('.apps.googleusercontent.com')) {
      console.error(
        `RNGoogleSignIn: You provided an invalid webClientId. It should end with '.apps.googleusercontent.com'. 'autoDetect' is not supported on Web.`,
      );
    }
  }
};
