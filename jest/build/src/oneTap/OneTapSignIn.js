"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOneTapSignIn = void 0;
const GoogleSignin_1 = require("../signIn/GoogleSignin");
const oneTapConfiguration_1 = require("./oneTapConfiguration");
const configuration_1 = require("../configuration");
async function checkPrerequisites(callbacks) {
    (0, oneTapConfiguration_1.validateOneTapConfig)(callbacks);
    await (0, GoogleSignin_1.getOriginalConfigPromise)();
}
const signIn = async (_params, callbacks) => {
    await checkPrerequisites(callbacks);
    const signInResult = await GoogleSignin_1.GoogleSignin.signInSilently();
    // cannot be cancelled, because there's no user interaction
    if (signInResult.type === 'noSavedCredentialFound') {
        return signInResult;
    }
    return getSignInResult(signInResult);
};
const presentSignInDialog = async (params, callbacks) => {
    await checkPrerequisites(callbacks);
    const signInResult = await GoogleSignin_1.GoogleSignin.signIn({
        loginHint: params?.accountName,
        nonce: params?.nonce,
    });
    return getSignInResult(signInResult);
};
const presentExplicitSignIn = presentSignInDialog;
const createAccount = presentSignInDialog;
function getSignInResult(data) {
    if (data.type === 'cancelled') {
        return data;
    }
    const { user, idToken, serverAuthCode } = data.data;
    if (!idToken) {
        throwNoIdToken();
    }
    const oneTapUser = {
        user: {
            ...user,
            phoneNumber: null,
        },
        idToken,
        serverAuthCode,
        // credentialOrigin is not available on the iOS side and is added for compatibility with Web
        credentialOrigin: 'user',
    };
    return { type: 'success', data: oneTapUser };
}
const requestAuthorization = async (options) => {
    const result = await GoogleSignin_1.GoogleSignin.addScopes(options);
    const hasNoUser = result === null;
    if (hasNoUser) {
        // need to reconfigure because of the scopes
        const currentConfiguration = (0, configuration_1.getConfigOrThrow)();
        const configureParams = {
            ...currentConfiguration,
            scopes: options.scopes.concat(currentConfiguration?.scopes ?? []),
            hostedDomain: options.hostedDomain,
            offlineAccess: !!options.offlineAccess?.enabled,
        };
        await (0, GoogleSignin_1.configureInternal)(configureParams, true);
        // for behavior parity with Android, we launch a sign-in flow with the requested options
        const signInResult = await GoogleSignin_1.GoogleSignin.signIn();
        if (signInResult.type === 'cancelled') {
            return signInResult;
        }
        return getAuthorizationSuccessResult(signInResult.data, options);
    }
    else if (result.type === 'cancelled') {
        return result;
    }
    return getAuthorizationSuccessResult(result.data, options);
};
async function getAuthorizationSuccessResult(user, options) {
    const { accessToken } = await GoogleSignin_1.GoogleSignin.getTokens();
    return {
        type: 'success',
        data: {
            grantedScopes: user.scopes,
            accessToken,
            // for the same behavior as Android
            serverAuthCode: options.offlineAccess?.enabled
                ? user.serverAuthCode
                : null,
        },
    };
}
function throwNoIdToken() {
    // this should never happen on iOS, it's more about making TS happy
    const e = new Error(`No idToken present in the response.`);
    // the docs say that the errors produced by the module should have a code property
    Object.assign(e, { code: 'ID_TOKEN_EXPECTED' });
    throw e;
}
function configure(options) {
    (0, GoogleSignin_1.configureInternal)(options, true);
}
const signOut = GoogleSignin_1.GoogleSignin.signOut;
const revokeAccess = GoogleSignin_1.GoogleSignin.revokeAccess;
const checkPlayServices = async () => {
    return {
        minRequiredVersion: -1,
        installedVersion: -1,
    };
};
const enableAppCheck = GoogleSignin_1.GoogleSignin.enableAppCheck;
/**
 * The entry point of the Universal Sign In API, exposed as `GoogleOneTapSignIn`.
 *
 * On the web, the signatures of `signIn`, `presentExplicitSignIn`, and `createAccount` are callback-based and on native they are Promise-based. Read more in the [guide](/docs/one-tap#web-support).
 *
 * @group Universal sign in module
 * */
exports.GoogleOneTapSignIn = {
    signIn,
    createAccount,
    presentExplicitSignIn,
    signOut,
    requestAuthorization,
    checkPlayServices,
    enableAppCheck,
    configure,
    revokeAccess,
};
