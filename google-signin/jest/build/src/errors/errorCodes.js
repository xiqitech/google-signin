"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCodes = exports.ios_only_SCOPES_ALREADY_GRANTED = exports.SIGN_IN_CANCELLED_CODE = exports.SIGN_IN_REQUIRED_CODE = void 0;
const NativeGoogleSignin_1 = require("../spec/NativeGoogleSignin");
const { SIGN_IN_CANCELLED, IN_PROGRESS, PLAY_SERVICES_NOT_AVAILABLE, SIGN_IN_REQUIRED, ONE_TAP_START_FAILED, SCOPES_ALREADY_GRANTED, } = NativeGoogleSignin_1.NativeModule.getConstants();
exports.SIGN_IN_REQUIRED_CODE = SIGN_IN_REQUIRED;
exports.SIGN_IN_CANCELLED_CODE = SIGN_IN_CANCELLED;
exports.ios_only_SCOPES_ALREADY_GRANTED = SCOPES_ALREADY_GRANTED;
/**
 * Read more about the meaning of the error codes in the [guide](/docs/errors).
 * @group Constants
 * */
exports.statusCodes = Object.freeze({
    IN_PROGRESS,
    PLAY_SERVICES_NOT_AVAILABLE,
    ONE_TAP_START_FAILED,
});
// if we instead specify the type directly on the const, typedoc will not generate the docs as I want
