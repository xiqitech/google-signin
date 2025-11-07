import type { TurboModule } from 'react-native';
import type { OneTapExplicitSignInResponse, OneTapResponse } from '../oneTap/types';
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
    }): Promise<{
        type: 'success';
        data: {
            grantedScopes: string[];
            accessToken: string;
            serverAuthCode: string | null;
        };
    } | {
        type: 'cancelled';
        data: null;
    }>;
}
export declare const OneTapNativeModule: Spec;
//# sourceMappingURL=NativeOneTapSignIn.android.d.ts.map