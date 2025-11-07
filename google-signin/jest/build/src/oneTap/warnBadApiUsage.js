"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnBadApiUsage = void 0;
const warnBadApiUsage = (callbacks) => {
    if (process.env.NODE_ENV !== 'production') {
        const isWebBrowser = typeof window !== 'undefined';
        if (isWebBrowser && !callbacks) {
            console.error('RNGoogleSignIn: web platform requires callback-based implementation. Promise-based implementation only works on native platforms.');
        }
    }
};
exports.warnBadApiUsage = warnBadApiUsage;
