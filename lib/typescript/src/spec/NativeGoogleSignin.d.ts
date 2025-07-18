import type { TurboModule } from 'react-native';
type User = Object;
export interface Spec extends TurboModule {
    signIn(params: Object): Promise<User>;
    configure(params: Object): Promise<void>;
    addScopes(params: Object): Promise<User | null>;
    playServicesAvailable(showPlayServicesUpdateDialog: boolean): Promise<boolean>;
    signInSilently(): Promise<User>;
    signOut(): Promise<null>;
    revokeAccess(): Promise<null>;
    enableAppCheck(debugProviderAPIKey: string | undefined): Promise<null>;
    clearCachedAccessToken(tokenString: string): Promise<null>;
    hasPreviousSignIn(): boolean;
    getCurrentUser(): User | null;
    getTokens(): Promise<{
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
        ONE_TAP_START_FAILED: string;
    };
}
export declare const NativeModule: Spec;
export {};
//# sourceMappingURL=NativeGoogleSignin.d.ts.map