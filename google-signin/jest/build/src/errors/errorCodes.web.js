"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRevokeAccessFailedError = exports.createGoogleSdkNotFoundError = exports.statusCodes = exports.SIGN_IN_CANCELLED_CODE = void 0;
const statusCodesRaw = {
    ONE_TAP_START_FAILED: 'start_failed',
    // NOTE the following codes are arbitrary, but they are used to match the native module
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
};
exports.SIGN_IN_CANCELLED_CODE = 'cancel_called';
// keep separate variable statusCodesRaw because if passed directly to Object.freeze,
// the types for web and native would differ
exports.statusCodes = Object.freeze(statusCodesRaw);
const createGoogleSdkNotFoundError = () => {
    const err = new Error('Google Identity SDK not found. Follow the web setup guide.');
    Object.assign(err, {
        code: exports.statusCodes.PLAY_SERVICES_NOT_AVAILABLE,
    });
    return err;
};
exports.createGoogleSdkNotFoundError = createGoogleSdkNotFoundError;
const createRevokeAccessFailedError = (error) => {
    const err = new Error(`revoking access failed: ${error}`);
    Object.assign(err, {
        code: 'revokeAccess',
    });
    return err;
};
exports.createRevokeAccessFailedError = createRevokeAccessFailedError;
