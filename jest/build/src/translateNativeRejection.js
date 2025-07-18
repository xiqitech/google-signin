"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateCancellationError = translateCancellationError;
const functions_1 = require("./functions");
const constants_1 = require("./constants");
const errorCodes_1 = require("./errors/errorCodes");
/**
 * Since the introduction of a new JS api, the native rejections need to be processed in JS layer.
 *
 * This is easier than reworking 2 native modules
 **/
function translateCancellationError(e) {
    if ((0, functions_1.isErrorWithCode)(e) && e.code === errorCodes_1.SIGN_IN_CANCELLED_CODE) {
        return constants_1.cancelledResult;
    }
    else {
        throw e;
    }
}
