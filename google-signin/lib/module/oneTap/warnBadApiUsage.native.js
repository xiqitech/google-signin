"use strict";

/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import { Platform } from 'react-native';
export const warnBadApiUsage = callbacks => {
  if (__DEV__ && Platform.OS === 'web' && !callbacks) {
    console.error('RNGoogleSignIn: web platform requires callback-based implementation. Promise-based implementation only works on native platforms.');
  }
};
//# sourceMappingURL=warnBadApiUsage.native.js.map