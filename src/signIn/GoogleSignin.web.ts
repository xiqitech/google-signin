/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import type {
  AddScopesParams,
  ConfigureParams,
  GetTokensResponse,
  HasPlayServicesParams,
  SignInParams,
  User,
} from '../types';
import { statusCodes } from '../errors/errorCodes.web';
type ImplementedModuleShape = typeof import('./GoogleSignin').GoogleSignin;

const errorMessage = 'RNGoogleSignIn: you are calling a not-implemented method';
const logNotImplementedError = () => {
  console.warn(errorMessage);
};

function throwNotImplementedError(): never {
  const e = new Error(errorMessage);
  // the docs say that the errors produced by the module should have a code property
  Object.assign(e, { code: statusCodes.PLAY_SERVICES_NOT_AVAILABLE });
  throw e;
}

async function signIn(_options: SignInParams = {}) {
  return throwNotImplementedError();
}

async function hasPlayServices(
  _options: HasPlayServicesParams = { showPlayServicesUpdateDialog: true },
): Promise<boolean> {
  logNotImplementedError();
  return false;
}

function configure(_options?: ConfigureParams): void {
  logNotImplementedError();
}

async function addScopes(_options: AddScopesParams) {
  logNotImplementedError();
  return null;
}

async function signInSilently() {
  return throwNotImplementedError();
}

async function signOut(): Promise<null> {
  logNotImplementedError();
  return null;
}

async function revokeAccess(): Promise<null> {
  logNotImplementedError();
  return null;
}

function hasPreviousSignIn(): boolean {
  logNotImplementedError();
  return false;
}

function getCurrentUser(): User | null {
  logNotImplementedError();
  return null;
}

async function clearCachedAccessToken(_tokenString: string): Promise<null> {
  logNotImplementedError();
  return null;
}

async function getTokens(): Promise<GetTokensResponse> {
  return throwNotImplementedError();
}

const enableAppCheck = () => Promise.resolve(null);

export const GoogleSignin: ImplementedModuleShape = {
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
