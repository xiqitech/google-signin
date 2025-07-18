"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUrlScheme = validateUrlScheme;
exports.reverseUrlScheme = reverseUrlScheme;
function validateUrlScheme(iosUrlScheme) {
    const messagePrefix = `google-sign-in config plugin`;
    if (!iosUrlScheme) {
        throw new Error(`${messagePrefix}: Missing \`iosUrlScheme\` in provided options.`);
    }
    if (!iosUrlScheme.startsWith('com.googleusercontent.apps.')) {
        throw new Error(`${messagePrefix}: \`iosUrlScheme\` must start with "com.googleusercontent.apps": ${iosUrlScheme}`);
    }
    if (iosUrlScheme.trim() !== iosUrlScheme) {
        throw new Error(`${messagePrefix}: \`iosUrlScheme\` must not contain leading or trailing whitespace: ${iosUrlScheme}`);
    }
    return true;
}
function reverseUrlScheme(reversedClientId) {
    if (validateUrlScheme(reversedClientId)) {
        return reversedClientId.split('.').reverse().join('.');
    }
    throw new Error('Invalid reversed client ID');
}
