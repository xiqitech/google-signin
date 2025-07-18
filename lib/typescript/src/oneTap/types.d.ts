import type { accounts, IdConfiguration } from 'google-one-tap';
import type { CredentialResponse } from 'google-one-tap';
import type { CancelledResponse, ClientIdOrPlistPath, NativeModuleError, NoSavedCredentialFound, WebClientId } from '../types';
type ReducedWebSignInOptions = Omit<IdConfiguration, 'client_id' | 'nonce' | 'auto_select' | 'callback'>;
/**
 * Learn more about additional web-only parameters at [Google's reference documentation](https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration).
 * @group Universal sign in module
 * */
export type OneTapSignInParams = {
    /**
     * A cryptographically random value used to mitigate replay attacks. Supported on all platforms.
     * */
    nonce?: string;
    /**
     * Web only. When calling any of the sign-in methods, a prompt is displayed by default on the top-right of the web page.
     * Set this to true to only allow signing in via the `WebGoogleSigninButton`.
     * @default false
     * */
    skipPrompt?: boolean;
} & ReducedWebSignInOptions;
/**
 * TODO vonovak iosClientId?: string;
 * Optional. If you use Expo config plugin, you never need to specify this.
 * Use if you want to specify the client ID of type iOS.
 * It is taken from the `GoogleService-Info.plist` file, or Info.plist by default.
 */
/**
 * `webClientId` is the most important parameter in the configuration. It is required.
 * @group Universal sign in module
 * */
export type OneTapConfigureParams = ClientIdOrPlistPath & {
    /**
     * iOS only. The Google API scopes to request access to. Use `requestAuthorization` to request additional scopes on Android.
     * @default `["email", "profile"]`
     */
    scopes?: string[];
    /**
     * The web client ID obtained from Google Cloud console. In the Universal module only, pass `autoDetect` to automatically determine the value from Firebase config file.
     */
    webClientId: WebClientId;
    /**
     * iOS only. Specifies a hosted domain restriction. By setting this, authorization will be restricted to accounts of the user in the specified domain.
     */
    hostedDomain?: string;
    /**
     * iOS only. The OpenID2 realm of the home web server. This allows Google to include the user's OpenID
     * Identifier in the OpenID Connect ID token.
     */
    openIdRealm?: string;
    /**
     * iOS only. The desired height and width of the profile image.
     * @default 120px
     */
    profileImageSize?: number;
    /**
     * Web only. Controls debug logging in browser console. This is implemented in Google's web SDK and is not part of their public API so it may change or be removed at any time.
     * */
    logLevel?: 'debug' | 'info' | 'warn';
};
/**
 * @group Universal sign in module
 * */
export type OneTapExplicitSignInParams = OneTapSignInParams & {
    /**
     * iOS only. An account name present on the device that should be used.
     * @example your_email@gmail.com
     * */
    accountName?: string;
};
/**
 * @group Universal sign in module
 * */
export type OneTapCreateAccountParams = OneTapSignInParams & {
    /**
     * iOS only. An account name present on the device that should be used.
     * @example your_email@gmail.com
     * */
    accountName?: string;
    /**
     * Android only. Whether to request for a verified phone number during sign-ups. Requesting it doesn't guarantee that it will be provided in the response.
     * @default false
     * */
    requestVerifiedPhoneNumber?: boolean;
};
/**
 * @group Universal sign in module
 * */
export type OneTapUser = {
    user: {
        /**
         * An immutable identifier for the user. Unique among all Google accounts and never reused (user's email can change, this value cannot).
         * */
        id: string;
        email: string | null;
        name: string | null;
        givenName: string | null;
        familyName: string | null;
        /**
         * Android only, and only for `createAccount`. Requires setting `requestVerifiedPhoneNumber` to `true`.
         * */
        phoneNumber: string | null;
        photo: string | null;
    };
    idToken: string;
    /**
     * The credential origin. This is the method that was used to sign in the user.
     * On native platforms, this is always "user". On the web it's a value from a union type.
     * */
    credentialOrigin: CredentialResponse['select_by'];
    /**
     *
     * iOS only. Not null only if a valid `webClientId` and `offlineAccess: true` was
     * specified in `configure()`.
     *
     * Call `requestAuthorization()` to obtain it on Android.
     */
    serverAuthCode: string | null;
};
/**
 * Learn more in the [guide](/docs/one-tap#requestauthorization).
 *
 * @group Universal sign in module
 * */
export type RequestAuthorizationParams = {
    /**
     * The Google API scopes to request access to. See [scopes docs](/docs/integration-notes#additional-scopes).
     */
    scopes: string[];
    /**
     * Android only. Specifies a hosted domain restriction. By setting this, authorization will be restricted to accounts of the user in the specified domain.
     */
    hostedDomain?: string;
    /**
     * Android only. Specifies an account on the device that should be used.
     * */
    accountName?: string;
    offlineAccess?: {
        /**
         * Whether to enable offline access. If enabled, `serverAuthCode` will be returned in the response.
         * */
        enabled: boolean;
        /**
         * Android only. If true, the granted code can be exchanged for an access token and a refresh token. Only use true if your server has suffered some failure and lost the user's refresh token.
         * */
        forceCodeForRefreshToken?: boolean;
    };
};
/**
 * An object that contains an access token that has access to the `grantedScopes`.
 * It contains also the `serverAuthCode` if `offlineAccess` was requested.
 *
 * On iOS, you can also obtain `serverAuthCode` by calling `createAccount()`.
 *
 * @group Universal sign in module
 * */
export type AuthorizationSuccessResponse = {
    type: 'success';
    data: {
        grantedScopes: string[];
        accessToken: string;
        serverAuthCode: string | null;
    };
};
/**
 * The response object of `requestAuthorization`. Either the user cancelled the flow or they successfully gave authorization.
 * @group Universal sign in module
 * */
export type AuthorizationResponse = CancelledResponse | AuthorizationSuccessResponse;
/**
 * The response object when the user successfully signs in.
 * @group Universal sign in module
 * */
export type OneTapSuccessResponse = {
    type: 'success';
    data: OneTapUser;
};
/**
 * The response object for OneTap's `signIn` and `createAccount`.
 * @group Universal sign in module
 * */
export type OneTapResponse = OneTapSuccessResponse | CancelledResponse | NoSavedCredentialFound;
/**
 * @group Universal sign in module
 * */
export type OneTapExplicitSignInResponse = OneTapSuccessResponse | CancelledResponse;
/**
 * @hidden
 * */
export interface SignInInterface {
    (params: OneTapSignInParams, callbacks: WebOneTapSignInCallbacks): void;
    (params?: OneTapSignInParams, callbacks?: never): Promise<OneTapResponse>;
}
/**
 * @hidden
 * */
export interface CreateAccountInterface {
    (params: OneTapCreateAccountParams, callbacks: WebOneTapSignInCallbacks): void;
    (params?: OneTapCreateAccountParams, callbacks?: never): Promise<OneTapResponse>;
}
/**
 * @hidden
 * */
export interface ExplicitSignInInterface {
    (params: OneTapExplicitSignInParams, callbacks: WebOneTapSignInCallbacks): void;
    (params?: OneTapExplicitSignInParams, callbacks?: never): Promise<OneTapExplicitSignInResponse>;
}
/**
 * The response object for successful `checkPlayServices` call. It denotes that the necessary prerequisites for calling the module in methods are met.
 *
 * @group Universal sign in module
 * */
export type PlayServicesInfo = {
    minRequiredVersion: number;
    installedVersion: number;
};
/**
 * Parameters for enabling [App Check](/docs/security#appcheck). Provide `debugProviderAPIKey` to enable App Check with [debug provider](https://developers.google.com/identity/sign-in/ios/appcheck/debug-provider).
 *
 * @group Universal sign in module
 * */
export type EnableAppCheckParams = {
    debugProviderAPIKey?: string | undefined;
};
/**
 * this is the public interface of the Universal module
 * @hidden
 * */
export type OneTapSignInModule = {
    configure: (params: OneTapConfigureParams) => void;
    signIn: SignInInterface;
    createAccount: CreateAccountInterface;
    presentExplicitSignIn: ExplicitSignInInterface;
    enableAppCheck: (params: EnableAppCheckParams) => Promise<null>;
    requestAuthorization: (options: RequestAuthorizationParams) => Promise<AuthorizationResponse>;
    signOut: () => Promise<null>;
    revokeAccess: (emailOrUniqueId: string) => Promise<null>;
    checkPlayServices: (showErrorResolutionDialog?: boolean) => Promise<PlayServicesInfo>;
};
type MomentListener = Parameters<accounts['id']['prompt']>[0];
/**
 * When using Universal sign in on the web, the sign in result is delivered via a callback, not via a promise.
 * The shape of data delivered to the callback is the same as the shape of the data in the promise, enabling code reuse.
 * Read more in the [guide](/docs/one-tap#web-support).
 *
 * @group Web Universal sign in module
 * */
export type WebOneTapSignInCallbacks = {
    /**
     * Called when the user successfully signs in, or cancels the sign in, either using the web One-tap flow or the button flow.
     * */
    onResponse: (userInfo: OneTapExplicitSignInResponse) => void | Promise<void>;
    /**
     * Called when an error occurs. You can use the `code` property of the error to determine the reason for the error.
     * The reported errors on the web are in the same format as the errors reported on the native platforms, so you can reuse your error handling code.
     * */
    onError: (error: NativeModuleError) => void | Promise<void>;
    /**
     * A callback function that is called when important events take place. See [reference](https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification).
     * */
    momentListener?: MomentListener;
};
import type { GsiButtonConfiguration } from 'google-one-tap';
/**
 * @group React Components
 * */
export type WebGoogleSignInButtonProps = Omit<GsiButtonConfiguration, 'logo_alignment'> & {
    logoAlignment?: GsiButtonConfiguration['logo_alignment'];
    onError?: ((error: Error) => void) | undefined;
};
export {};
//# sourceMappingURL=types.d.ts.map