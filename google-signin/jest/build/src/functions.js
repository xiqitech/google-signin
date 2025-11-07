"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isErrorWithCode = void 0;
exports.isCancelledResponse = isCancelledResponse;
exports.isNoSavedCredentialFoundResponse = isNoSavedCredentialFoundResponse;
exports.isSuccessResponse = isSuccessResponse;
/**
 * TypeScript helper to check if an object has the `code` property.
 * This is used to avoid `as` casting when you access the `code` property on errors returned by the module.
 */
const isErrorWithCode = (error) => {
    // to account for https://github.com/facebook/react-native/issues/41950
    // fixed in https://github.com/facebook/react-native/commit/9525074a194b9cf2b7ef8ed270978e3f7f2c41f7 0.74
    const isNewArchErrorIOS = typeof error === 'object' && error != null;
    return (error instanceof Error || isNewArchErrorIOS) && 'code' in error;
};
exports.isErrorWithCode = isErrorWithCode;
function isCancelledResponse(response) {
    return response.type === 'cancelled';
}
function isNoSavedCredentialFoundResponse(response) {
    return response.type === 'noSavedCredentialFound';
}
function isSuccessResponse(response) {
    return response.type === 'success';
}
