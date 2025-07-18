"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeModule = void 0;
const react_native_1 = require("react-native");
exports.NativeModule = react_native_1.TurboModuleRegistry.getEnforcing('RNGoogleSignin');
