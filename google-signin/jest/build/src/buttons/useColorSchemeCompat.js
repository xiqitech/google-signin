"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useColorSchemeCompat = void 0;
const react_native_1 = require("react-native");
// https://github.com/facebook/react-native/pull/53397/files introduced a (maybe unintended) breaking change and this counters it
const useColorSchemeCompat = () => {
    const colorScheme = (0, react_native_1.useColorScheme)() || 'light'; // stay compatible with older versions
    return colorScheme === 'unspecified' ? 'light' : colorScheme;
};
exports.useColorSchemeCompat = useColorSchemeCompat;
