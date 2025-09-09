import type { AuthorizationResponse, OneTapConfigureParams, RequestAuthorizationParams } from './types';
declare function configure(options: OneTapConfigureParams): void;
/**
 * The entry point of the Universal Sign In API, exposed as `GoogleOneTapSignIn`.
 *
 * On the web, the signatures of `signIn`, `presentExplicitSignIn`, and `createAccount` are callback-based and on native they are Promise-based. Read more in the [guide](/docs/one-tap#web-support).
 *
 * @group Universal sign in module
 * */
export declare const GoogleOneTapSignIn: {
    signIn: import("./types").SignInInterface;
    createAccount: import("./types").CreateAccountInterface;
    presentExplicitSignIn: import("./types").ExplicitSignInInterface;
    signOut: () => Promise<null>;
    requestAuthorization: (options: RequestAuthorizationParams) => Promise<AuthorizationResponse>;
    checkPlayServices: (showErrorResolutionDialog?: boolean) => Promise<import("./types").PlayServicesInfo>;
    enableAppCheck: (params?: import("./types").EnableAppCheckParams) => Promise<null>;
    configure: typeof configure;
    revokeAccess: (emailOrUniqueId: string) => Promise<null>;
    clearCachedAccessToken: (tokenString: string) => Promise<null>;
};
export {};
//# sourceMappingURL=OneTapSignIn.d.ts.map