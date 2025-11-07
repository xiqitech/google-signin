import type { AddScopesParams, ConfigureParams, GetTokensResponse, HasPlayServicesParams, SignInParams, SignInResponse, SignInSilentlyResponse, User } from '../types';
import type { EnableAppCheckParams } from '../oneTap/types';
export declare const getOriginalConfigPromise: () => Promise<void> | undefined;
export declare function configureInternal(options: ConfigureParams | undefined, requireWebClientId: boolean): Promise<void>;
declare function configure(options?: ConfigureParams): void;
declare function signIn(options?: SignInParams): Promise<SignInResponse>;
declare function hasPlayServices(options?: HasPlayServicesParams): Promise<boolean>;
declare function addScopes(options: AddScopesParams): Promise<SignInResponse | null>;
declare function signInSilently(): Promise<SignInSilentlyResponse>;
declare function signOut(): Promise<null>;
declare function revokeAccess(): Promise<null>;
declare function hasPreviousSignIn(): boolean;
declare function getCurrentUser(): User | null;
declare function enableAppCheck(params?: EnableAppCheckParams): Promise<null>;
declare function clearCachedAccessToken(tokenString: string): Promise<null>;
declare function getTokens(): Promise<GetTokensResponse>;
/**
 * The entry point of the Google Sign In API, exposed as `GoogleSignin`.
 * @group Original Google sign in
 * */
export declare const GoogleSignin: {
    hasPlayServices: typeof hasPlayServices;
    configure: typeof configure;
    signIn: typeof signIn;
    addScopes: typeof addScopes;
    signInSilently: typeof signInSilently;
    signOut: typeof signOut;
    revokeAccess: typeof revokeAccess;
    hasPreviousSignIn: typeof hasPreviousSignIn;
    getCurrentUser: typeof getCurrentUser;
    clearCachedAccessToken: typeof clearCachedAccessToken;
    getTokens: typeof getTokens;
    enableAppCheck: typeof enableAppCheck;
};
export {};
//# sourceMappingURL=GoogleSignin.d.ts.map