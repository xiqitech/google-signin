"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.noSavedCredentialFoundResult = exports.cancelledResult = void 0;
exports.cancelledResult = Object.freeze({
    type: 'cancelled',
    data: null,
});
exports.noSavedCredentialFoundResult = Object.freeze({
    type: 'noSavedCredentialFound',
    data: null,
});
