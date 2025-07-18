/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

type User = Object;

export interface Spec extends TurboModule {
  // using Object to be compatible with paper
  signIn(params: Object): Promise<User>;
  configure(params: Object): Promise<void>;
  addScopes(params: Object): Promise<User | null>;
  playServicesAvailable(
    showPlayServicesUpdateDialog: boolean,
  ): Promise<boolean>;
  signInSilently(): Promise<User>;
  signOut(): Promise<null>;
  revokeAccess(): Promise<null>;
  enableAppCheck(debugProviderAPIKey: string | undefined): Promise<null>;
  clearCachedAccessToken(tokenString: string): Promise<null>;
  hasPreviousSignIn(): boolean;
  getCurrentUser(): User | null;
  getTokens(): Promise<{
    // TODO this should be import type { GetTokensResponse } from '../types';
    idToken: string;
    accessToken: string;
  }>;
  getConstants(): {
    SIGN_IN_CANCELLED: string;
    IN_PROGRESS: string;
    PLAY_SERVICES_NOT_AVAILABLE: string;
    SIGN_IN_REQUIRED: string;
    SCOPES_ALREADY_GRANTED: string;
    BUTTON_SIZE_ICON: number;
    BUTTON_SIZE_WIDE: number;
    BUTTON_SIZE_STANDARD: number;
    // Universal sign-in specific constants
    ONE_TAP_START_FAILED: string;
  };
}

export const NativeModule =
  TurboModuleRegistry.getEnforcing<Spec>('RNGoogleSignin');
