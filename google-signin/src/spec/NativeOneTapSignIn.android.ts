/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type {
  OneTapExplicitSignInResponse,
  OneTapResponse,
} from '../oneTap/types';

export interface Spec extends TurboModule {
  signIn(params: {
    webClientId: string;
    nonce?: string;
    requestVerifiedPhoneNumber?: boolean;
    autoSignIn: boolean;
    filterByAuthorizedAccounts: boolean;
  }): Promise<OneTapResponse>;
  signOut(): Promise<null>;
  revokeAccess(): Promise<null>;
  explicitSignIn(params: {
    nonce?: string;
    hostedDomain?: string;
    webClientId: string;
  }): Promise<OneTapExplicitSignInResponse>;
  checkPlayServices(showErrorResolutionDialog: boolean): Promise<{
    minRequiredVersion: number;
    installedVersion: number;
  }>;
  clearCachedAccessToken(tokenString: string): Promise<null>;
  requestAuthorization(params: {
    scopes: string[];
    accountName?: string;
    hostedDomain?: string;
    webClientId?: string;
    offlineAccessEnabled: boolean;
    forceCodeForRefreshToken: boolean;
  }): Promise<
    | {
        type: 'success';
        data: {
          grantedScopes: string[];
          accessToken: string;
          serverAuthCode: string | null;
        };
      }
    | {
        type: 'cancelled';
        data: null;
      }
  >;
}

export const OneTapNativeModule =
  TurboModuleRegistry.getEnforcing<Spec>('RNOneTapSignIn');
