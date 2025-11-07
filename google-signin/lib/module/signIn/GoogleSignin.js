"use strict";

/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import { Platform } from 'react-native';
import { NativeModule } from "../spec/NativeGoogleSignin.js";
import { ios_only_SCOPES_ALREADY_GRANTED, SIGN_IN_REQUIRED_CODE } from '../errors/errorCodes';
import { isErrorWithCode } from "../functions.js";
import { setConfiguration, getConfigOrThrow } from "../configuration.js";
import { noSavedCredentialFoundResult } from "../constants.js";
import { translateCancellationError } from "../translateNativeRejection.js";
let configPromise;
const finishConfiguration = async () => {
  getConfigOrThrow();
  await configPromise;
};
export const getOriginalConfigPromise = () => configPromise;
export function configureInternal(options = {}, requireWebClientId) {
  // we set the config on the JS side as well so that we can validate it on the JS side as well
  setConfiguration(options, requireWebClientId);
  configPromise = NativeModule.configure(options);
  return configPromise;
}
function configure(options) {
  configureInternal(options, false);
}
async function signIn(options = {}) {
  await finishConfiguration();
  try {
    const user = await NativeModule.signIn(options);
    return createSuccessResponse(user);
  } catch (err) {
    return translateCancellationError(err);
  }
}
async function hasPlayServices(options) {
  return NativeModule.playServicesAvailable(options?.showPlayServicesUpdateDialog !== false);
}
async function addScopes(options) {
  await finishConfiguration();
  if (Platform.OS === 'android') {
    // false if no user is signed in
    const hasUser = await NativeModule.addScopes(options);
    if (!hasUser) {
      return null;
    }
    // on Android, the user returned in onActivityResult() will contain only the scopes added, not the ones present previously
    // we work around it by calling signInSilently() which returns the user object with all scopes
    // @ts-expect-error `no_saved_credential_found` is not possible here, because we just added scopes
    return signInSilently();
  } else {
    try {
      const user = await NativeModule.addScopes(options);
      if (!user) {
        return null;
      }
      return createSuccessResponse(user);
    } catch (err) {
      if (isErrorWithCode(err) && err.code === ios_only_SCOPES_ALREADY_GRANTED) {
        // return the scopes that are already granted
        const user = GoogleSignin.getCurrentUser();
        if (!user) {
          return null;
        }
        return createSuccessResponse(user);
      }
      return translateCancellationError(err);
    }
  }
}
async function signInSilently() {
  try {
    await finishConfiguration();
    const user = await NativeModule.signInSilently();
    return createSuccessResponse(user);
  } catch (err) {
    if (isErrorWithCode(err) && err.code === SIGN_IN_REQUIRED_CODE) {
      return noSavedCredentialFoundResult;
    }
    throw err;
  }
}
async function signOut() {
  return NativeModule.signOut();
}
async function revokeAccess() {
  // api alignment across platforms
  await finishConfiguration();
  return NativeModule.revokeAccess();
}
function hasPreviousSignIn() {
  return NativeModule.hasPreviousSignIn();
}
function getCurrentUser() {
  return NativeModule.getCurrentUser();
}
async function enableAppCheck(params) {
  return NativeModule.enableAppCheck(params?.debugProviderAPIKey);
}
async function clearCachedAccessToken(tokenString) {
  if (!tokenString || typeof tokenString !== 'string') {
    return Promise.reject('GoogleSignIn: clearCachedAccessToken() expects a string token.');
  }
  return Platform.OS === 'android' ? NativeModule.clearCachedAccessToken(tokenString) : null;
}
async function getTokens() {
  if (Platform.OS === 'android') {
    const userObject = await NativeModule.getTokens();
    return {
      idToken: userObject.idToken,
      accessToken: userObject.accessToken
    };
  } else {
    return NativeModule.getTokens();
  }
}
const createSuccessResponse = data => ({
  type: 'success',
  data
});

/**
 * The entry point of the Google Sign In API, exposed as `GoogleSignin`.
 * @group Original Google sign in
 * */
export const GoogleSignin = {
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
  enableAppCheck
};
//# sourceMappingURL=GoogleSignin.js.map