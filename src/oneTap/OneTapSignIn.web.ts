/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import type {
  OneTapExplicitSignInParams,
  OneTapExplicitSignInResponse,
  OneTapResponse,
  OneTapSignInModule,
  OneTapSignInParams,
  OneTapUser,
  WebOneTapSignInCallbacks,
} from './types';
import {
  createGoogleSdkNotFoundError,
  statusCodes,
  createRevokeAccessFailedError,
} from '../errors/errorCodes.web';
import { extractUser } from './tokenUtils.web';
import { emitter } from './emitter.web';
import { SIGN_IN_CANCELLED_CODE } from '../errors/errorCodes.web';
import { createdValidatedOneTapConfig } from './oneTapConfiguration';
import { cancelledResult } from '../constants';
import { setConfiguration } from '../configuration';

function sdkIsMissing() {
  return typeof window !== 'undefined' && !window.google;
}

const signInImplWeb = (
  params: OneTapSignInParams & { auto_select: boolean },
  callbacks?: WebOneTapSignInCallbacks,
) => {
  const { logLevel, ...otherParams } = createdValidatedOneTapConfig(
    params,
    callbacks,
  );
  if (!callbacks) {
    console.error(
      'RNGoogleSignIn: promise-based implementation is not supported on Web. Pass callbacks instead.',
    );
    return;
  }
  const { onError, onResponse, momentListener } = callbacks;

  if (sdkIsMissing()) {
    onError(createGoogleSdkNotFoundError());
    return;
  }

  const { google } = window;
  const { nonce, skipPrompt } = params;

  google.accounts.id.initialize({
    client_id: otherParams.webClientId,
    auto_select: params.auto_select,
    nonce,
    context: 'signin',
    use_fedcm_for_prompt: true,
    log_level: logLevel,
    ...otherParams,
    callback: ({ credential: idToken, select_by }) => {
      const user = extractUser(idToken);
      const userInfo: OneTapUser = {
        user,
        idToken,
        serverAuthCode: null,
        credentialOrigin: select_by,
      };
      onResponse({ type: 'success', data: userInfo });
    },
  });
  emitter.emit('init');

  if (!skipPrompt) {
    google.accounts.id.prompt((notification) => {
      if (notification.isSkippedMoment()) {
        onResponse(cancelledResult);
      } else if (notification.isDismissedMoment()) {
        const dismissedReason = notification.getDismissedReason();
        if (
          dismissedReason === SIGN_IN_CANCELLED_CODE ||
          dismissedReason === 'flow_restarted'
        ) {
          // `flow_restarted` happens when the one-tap sign in is presented but the user chooses to sign in using the button.
          // We cancel the one-tap flow, but the user credential will be returned from the button flow's Promise
          onResponse(cancelledResult);
        }
        // else: dismissedReason === 'credential_returned' - we don't need to do anything
      }
      momentListener && momentListener(notification);
    });
  }
};

function presentExplicitSignIn(
  params: OneTapExplicitSignInParams,
  callbacks: WebOneTapSignInCallbacks,
): void;
function presentExplicitSignIn(
  params?: OneTapExplicitSignInParams,
): Promise<OneTapExplicitSignInResponse>;
function presentExplicitSignIn(
  params?: OneTapExplicitSignInParams,
  callbacks?: WebOneTapSignInCallbacks,
): Promise<OneTapExplicitSignInResponse> | void {
  signInImplWeb(
    { ...params, auto_select: false, context: 'signup' },
    callbacks,
  );
}

function signIn(
  params: OneTapSignInParams,
  callbacks: WebOneTapSignInCallbacks,
): void;
function signIn(params?: OneTapSignInParams): Promise<OneTapResponse>;
function signIn(
  params?: OneTapSignInParams,
  callbacks?: WebOneTapSignInCallbacks,
): Promise<OneTapResponse> | void {
  signInImplWeb({ ...params, auto_select: true }, callbacks);
}

const signOutWeb = async (): Promise<null> => {
  if (sdkIsMissing()) {
    throw createGoogleSdkNotFoundError();
  }

  const {
    google: { accounts },
  } = window;

  accounts.id.disableAutoSelect();
  return Promise.resolve(null);
};

const throwApiUnavailableError = async () => {
  const err = new Error(
    '`requestAuthorization` is not implemented on the web platform.',
  );
  Object.assign(err, {
    code: statusCodes.PLAY_SERVICES_NOT_AVAILABLE,
  });
  throw err;
};

const configure: OneTapSignInModule['configure'] = (config) => {
  setConfiguration(config, true);
};

const revokeAccess: OneTapSignInModule['revokeAccess'] = async (
  emailOrUniqueId: string,
) => {
  if (sdkIsMissing()) {
    throw createGoogleSdkNotFoundError();
  }

  const {
    google: { accounts },
  } = window;

  return new Promise((resolve, reject) => {
    accounts.id.revoke(emailOrUniqueId, ({ successful, error }) => {
      if (successful) {
        // revoke and also mark the account as logged-out
        // https://developers.google.com/identity/gsi/web/reference/js-reference#google.accounts.id.disableAutoSelect
        accounts.id.disableAutoSelect();
        resolve(null);
      } else {
        reject(createRevokeAccessFailedError(error));
      }
    });
  });
};

const checkPlayServices: OneTapSignInModule['checkPlayServices'] = async () => {
  if (sdkIsMissing()) {
    throw createGoogleSdkNotFoundError();
  }
  return {
    minRequiredVersion: -1,
    installedVersion: -1,
  };
};

const enableAppCheck = () => Promise.resolve(null);

export const GoogleOneTapSignIn: OneTapSignInModule = {
  signIn,
  createAccount: presentExplicitSignIn,
  presentExplicitSignIn,
  requestAuthorization: throwApiUnavailableError,
  signOut: signOutWeb,
  configure,
  checkPlayServices,
  enableAppCheck,
  revokeAccess,
};
