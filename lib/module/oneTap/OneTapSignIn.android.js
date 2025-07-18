"use strict";

/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import { OneTapNativeModule } from "../spec/NativeOneTapSignIn.android.js";
import { createdValidatedOneTapConfig } from "./oneTapConfiguration.js";
import { setConfiguration, getConfigOrThrow } from "../configuration.js";

// functions are marked as async to make sure they return a promise (even if they throw in `createdValidatedOneTapConfig`)
// so that they are in line with iOS

const signIn = async (params, callbacks) => {
  const newParams = createdValidatedOneTapConfig(params, callbacks);
  return OneTapNativeModule.signIn({
    autoSignIn: true,
    filterByAuthorizedAccounts: true,
    ...newParams
  });
};
const presentExplicitSignIn = async (params, callbacks) => {
  const newParams = createdValidatedOneTapConfig(params, callbacks);
  return OneTapNativeModule.explicitSignIn(newParams);
};
const createAccount = async (params, callbacks) => {
  const newParams = createdValidatedOneTapConfig(params, callbacks);
  return OneTapNativeModule.signIn({
    autoSignIn: false,
    filterByAuthorizedAccounts: false,
    ...newParams
  });
};
const signOut = () => {
  // making sure no params are passed to the native module
  // because native module doesn't expect any
  return OneTapNativeModule.signOut();
};
const requestAuthorization = async params => {
  getConfigOrThrow(); // for api alignment across platforms
  const offlineAccessEnabled = !!params?.offlineAccess?.enabled;
  const validatedConfig = offlineAccessEnabled ? createdValidatedOneTapConfig(undefined) : undefined;

  // Android might only return the scopes that we asked for, not those that were already granted.
  // That is documented in the docs.
  return OneTapNativeModule.requestAuthorization({
    scopes: params.scopes,
    hostedDomain: params?.hostedDomain,
    webClientId: validatedConfig?.webClientId,
    offlineAccessEnabled,
    forceCodeForRefreshToken: !!params?.offlineAccess?.forceCodeForRefreshToken,
    accountName: params?.accountName
  });
};
const configure = config => {
  setConfiguration(config, true);
};
const checkPlayServices = async (showErrorResolutionDialog = true) => {
  return OneTapNativeModule.checkPlayServices(showErrorResolutionDialog);
};
const enableAppCheck = () => Promise.resolve(null);
import { getOriginalConfigPromise, GoogleSignin } from '../signIn/GoogleSignin';
const revokeAccess = async () => {
  const didConfigure = getOriginalConfigPromise() !== undefined;
  if (!didConfigure) {
    // this re-sets the config to the same value so it's safe
    const configurationJS = getConfigOrThrow();
    GoogleSignin.configure(configurationJS);
    await getOriginalConfigPromise();
  }
  await GoogleSignin.revokeAccess();
  return signOut();
};
export const GoogleOneTapSignIn = {
  signIn,
  createAccount,
  signOut,
  presentExplicitSignIn,
  requestAuthorization,
  configure,
  checkPlayServices,
  enableAppCheck,
  revokeAccess
};
//# sourceMappingURL=OneTapSignIn.android.js.map