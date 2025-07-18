"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// TODO change imports - will break compatibility with RN < 0.80
const react_native_1 = require("react-native");
exports.default = (0, react_native_1.codegenNativeComponent)('RNGoogleSigninButton', {
    // @ts-expect-error we would like to not generate anything on macos but this doesn't work. Maybe it will later
    excludedPlatforms: ['macos'],
});
