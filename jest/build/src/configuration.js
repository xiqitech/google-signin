"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsetConfigurationTestsOnly = exports.setConfiguration = void 0;
exports.throwMissingWebClientId = throwMissingWebClientId;
exports.getConfigOrThrow = getConfigOrThrow;
const validateWebClientId_1 = require("./oneTap/validateWebClientId");
let currentConfiguration;
const setConfiguration = (configuration, requireWebClientId) => {
    if (requireWebClientId && !('webClientId' in configuration)) {
        throwMissingWebClientId();
    }
    (0, validateWebClientId_1.validateWebClientId)(configuration);
    currentConfiguration = configuration;
};
exports.setConfiguration = setConfiguration;
const unsetConfigurationTestsOnly = () => {
    currentConfiguration = undefined;
};
exports.unsetConfigurationTestsOnly = unsetConfigurationTestsOnly;
function throwMissingConfig() {
    const err = new Error('You must call `configure()` before attempting authentication, authorization, or related methods.');
    Object.assign(err, {
        code: 'configure',
    });
    throw err;
}
function throwMissingWebClientId() {
    const err = new Error('`webClientId` is required for OneTap sign-in. Please provide it in the `configure` method.');
    Object.assign(err, {
        code: 'configure',
    });
    throw err;
}
function getConfigOrThrow() {
    if (!currentConfiguration) {
        throwMissingConfig();
    }
    return currentConfiguration;
}
