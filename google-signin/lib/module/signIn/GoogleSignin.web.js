"use strict";

/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import { statusCodes } from "../errors/errorCodes.web.js";
const errorMessage = 'RNGoogleSignIn: you are calling a not-implemented method';
const logNotImplementedError = () => {
  console.warn(errorMessage);
};
function throwNotImplementedError() {
  const e = new Error(errorMessage);
  // the docs say that the errors produced by the module should have a code property
  Object.assign(e, {
    code: statusCodes.PLAY_SERVICES_NOT_AVAILABLE
  });
  throw e;
}
async function signIn(_options = {}) {
  return throwNotImplementedError();
}
async function hasPlayServices(_options = {
  showPlayServicesUpdateDialog: true
}) {
  logNotImplementedError();
  return false;
}
function configure(_options) {
  logNotImplementedError();
}
async function addScopes(_options) {
  logNotImplementedError();
  return null;
}
async function signInSilently() {
  return throwNotImplementedError();
}
async function signOut() {
  logNotImplementedError();
  return null;
}
async function revokeAccess() {
  logNotImplementedError();
  return null;
}
function hasPreviousSignIn() {
  logNotImplementedError();
  return false;
}
function getCurrentUser() {
  logNotImplementedError();
  return null;
}
async function clearCachedAccessToken(_tokenString) {
  logNotImplementedError();
  return null;
}
async function getTokens() {
  return throwNotImplementedError();
}
const enableAppCheck = () => Promise.resolve(null);
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
//# sourceMappingURL=GoogleSignin.web.js.map