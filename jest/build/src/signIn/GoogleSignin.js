"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSignin = exports.getOriginalConfigPromise = void 0;
exports.configureInternal = configureInternal;
const react_native_1 = require("react-native");
const NativeGoogleSignin_1 = require("../spec/NativeGoogleSignin");
const errorCodes_1 = require("../errors/errorCodes");
const functions_1 = require("../functions");
const configuration_1 = require("../configuration");
const constants_1 = require("../constants");
const translateNativeRejection_1 = require("../translateNativeRejection");
let configPromise;
const finishConfiguration = async () => {
    (0, configuration_1.getConfigOrThrow)();
    await configPromise;
};
const getOriginalConfigPromise = () => configPromise;
exports.getOriginalConfigPromise = getOriginalConfigPromise;
function configureInternal(options = {}, requireWebClientId) {
    // we set the config on the JS side as well so that we can validate it on the JS side as well
    (0, configuration_1.setConfiguration)(options, requireWebClientId);
    configPromise = NativeGoogleSignin_1.NativeModule.configure(options);
    return configPromise;
}
function configure(options) {
    configureInternal(options, false);
}
async function signIn(options = {}) {
    await finishConfiguration();
    try {
        const user = (await NativeGoogleSignin_1.NativeModule.signIn(options));
        return createSuccessResponse(user);
    }
    catch (err) {
        return (0, translateNativeRejection_1.translateCancellationError)(err);
    }
}
async function hasPlayServices(options) {
    return NativeGoogleSignin_1.NativeModule.playServicesAvailable(options?.showPlayServicesUpdateDialog !== false);
}
async function addScopes(options) {
    await finishConfiguration();
    if (react_native_1.Platform.OS === 'android') {
        // false if no user is signed in
        const hasUser = await NativeGoogleSignin_1.NativeModule.addScopes(options);
        if (!hasUser) {
            return null;
        }
        // on Android, the user returned in onActivityResult() will contain only the scopes added, not the ones present previously
        // we work around it by calling signInSilently() which returns the user object with all scopes
        // @ts-expect-error `no_saved_credential_found` is not possible here, because we just added scopes
        return signInSilently();
    }
    else {
        try {
            const user = (await NativeGoogleSignin_1.NativeModule.addScopes(options));
            if (!user) {
                return null;
            }
            return createSuccessResponse(user);
        }
        catch (err) {
            if ((0, functions_1.isErrorWithCode)(err) &&
                err.code === errorCodes_1.ios_only_SCOPES_ALREADY_GRANTED) {
                // return the scopes that are already granted
                const user = exports.GoogleSignin.getCurrentUser();
                if (!user) {
                    return null;
                }
                return createSuccessResponse(user);
            }
            return (0, translateNativeRejection_1.translateCancellationError)(err);
        }
    }
}
async function signInSilently() {
    try {
        await finishConfiguration();
        const user = (await NativeGoogleSignin_1.NativeModule.signInSilently());
        return createSuccessResponse(user);
    }
    catch (err) {
        if ((0, functions_1.isErrorWithCode)(err) && err.code === errorCodes_1.SIGN_IN_REQUIRED_CODE) {
            return constants_1.noSavedCredentialFoundResult;
        }
        throw err;
    }
}
async function signOut() {
    return NativeGoogleSignin_1.NativeModule.signOut();
}
async function revokeAccess() {
    // api alignment across platforms
    await finishConfiguration();
    return NativeGoogleSignin_1.NativeModule.revokeAccess();
}
function hasPreviousSignIn() {
    return NativeGoogleSignin_1.NativeModule.hasPreviousSignIn();
}
function getCurrentUser() {
    return NativeGoogleSignin_1.NativeModule.getCurrentUser();
}
async function enableAppCheck(params) {
    return NativeGoogleSignin_1.NativeModule.enableAppCheck(params?.debugProviderAPIKey);
}
async function clearCachedAccessToken(tokenString) {
    if (!tokenString || typeof tokenString !== 'string') {
        return Promise.reject('GoogleSignIn: clearCachedAccessToken() expects a string token.');
    }
    return react_native_1.Platform.OS === 'android'
        ? NativeGoogleSignin_1.NativeModule.clearCachedAccessToken(tokenString)
        : null;
}
async function getTokens() {
    if (react_native_1.Platform.OS === 'android') {
        const userObject = await NativeGoogleSignin_1.NativeModule.getTokens();
        return {
            idToken: userObject.idToken,
            accessToken: userObject.accessToken,
        };
    }
    else {
        return NativeGoogleSignin_1.NativeModule.getTokens();
    }
}
const createSuccessResponse = (data) => ({
    type: 'success',
    data,
});
/**
 * The entry point of the Google Sign In API, exposed as `GoogleSignin`.
 * @group Original Google sign in
 * */
exports.GoogleSignin = {
    hasPlayServices,
    configure,
    signIn,
    addScopes,
    signInSilently,
    signOut,
    revokeAccess,
    hasPreviousSignIn,
    getCurrentUser,
    clearCachedAccessToken,
    getTokens,
    enableAppCheck,
};
