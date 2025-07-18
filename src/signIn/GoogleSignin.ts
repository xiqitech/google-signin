/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import { Platform } from 'react-native';
import type {
  AddScopesParams,
  ConfigureParams,
  GetTokensResponse,
  HasPlayServicesParams,
  SignInParams,
  SignInResponse,
  SignInSilentlyResponse,
  SignInSuccessResponse,
  User,
} from '../types';
import { NativeModule } from '../spec/NativeGoogleSignin';
import {
  ios_only_SCOPES_ALREADY_GRANTED,
  SIGN_IN_REQUIRED_CODE,
} from '../errors/errorCodes';
import { isErrorWithCode } from '../functions';
import { setConfiguration, getConfigOrThrow } from '../configuration';
import { noSavedCredentialFoundResult } from '../constants';
import { translateCancellationError } from '../translateNativeRejection';
import type { EnableAppCheckParams } from '../oneTap/types';

let configPromise: Promise<void> | undefined;

const finishConfiguration = async () => {
  getConfigOrThrow();
  await configPromise;
};

export const getOriginalConfigPromise = () => configPromise;

export function configureInternal(
  options: ConfigureParams = {},
  requireWebClientId: boolean,
): Promise<void> {
  // we set the config on the JS side as well so that we can validate it on the JS side as well
  setConfiguration(options, requireWebClientId);
  configPromise = NativeModule.configure(options);
  return configPromise;
}

function configure(options?: ConfigureParams): void {
  configureInternal(options, false);
}

async function signIn(options: SignInParams = {}): Promise<SignInResponse> {
  await finishConfiguration();
  try {
    const user = (await NativeModule.signIn(options)) as User;
    return createSuccessResponse(user);
  } catch (err) {
    return translateCancellationError(err);
  }
}

async function hasPlayServices(
  options?: HasPlayServicesParams,
): Promise<boolean> {
  return NativeModule.playServicesAvailable(
    options?.showPlayServicesUpdateDialog !== false,
  );
}

async function addScopes(
  options: AddScopesParams,
): Promise<SignInResponse | null> {
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
      const user = (await NativeModule.addScopes(options)) as User | null;
      if (!user) {
        return null;
      }
      return createSuccessResponse(user);
    } catch (err) {
      if (
        isErrorWithCode(err) &&
        err.code === ios_only_SCOPES_ALREADY_GRANTED
      ) {
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

async function signInSilently(): Promise<SignInSilentlyResponse> {
  try {
    await finishConfiguration();
    const user = (await NativeModule.signInSilently()) as User;
    return createSuccessResponse(user);
  } catch (err) {
    if (isErrorWithCode(err) && err.code === SIGN_IN_REQUIRED_CODE) {
      return noSavedCredentialFoundResult;
    }
    throw err;
  }
}

async function signOut(): Promise<null> {
  return NativeModule.signOut();
}

async function revokeAccess(): Promise<null> {
  // api alignment across platforms
  await finishConfiguration();
  return NativeModule.revokeAccess();
}

function hasPreviousSignIn(): boolean {
  return NativeModule.hasPreviousSignIn();
}

function getCurrentUser(): User | null {
  return NativeModule.getCurrentUser() as User | null;
}

async function enableAppCheck(params?: EnableAppCheckParams): Promise<null> {
  return NativeModule.enableAppCheck(params?.debugProviderAPIKey);
}

async function clearCachedAccessToken(tokenString: string): Promise<null> {
  if (!tokenString || typeof tokenString !== 'string') {
    return Promise.reject(
      'GoogleSignIn: clearCachedAccessToken() expects a string token.',
    );
  }
  return Platform.OS === 'android'
    ? NativeModule.clearCachedAccessToken(tokenString)
    : null;
}

async function getTokens(): Promise<GetTokensResponse> {
  if (Platform.OS === 'android') {
    const userObject = await NativeModule.getTokens();
    return {
      idToken: userObject.idToken,
      accessToken: userObject.accessToken,
    };
  } else {
    return NativeModule.getTokens();
  }
}

const createSuccessResponse = (data: User): SignInSuccessResponse => ({
  type: 'success',
  data,
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
  enableAppCheck,
};
