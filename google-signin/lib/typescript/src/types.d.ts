/**
 * @group Original Google sign in
 * */
export type SignInParams = {
    /**
     * iOS only. A cryptographically random value used to mitigate replay attacks. Only available in the paid version. For support across all platforms, use the Universal sign in module.
     * */
    nonce?: string;
    /**
     * iOS only. The user's ID, or email address, to be prefilled in the authentication UI if possible.
     * [See docs here](https://developers.google.com/identity/sign-in/ios/reference/Classes/GIDSignIn#-signinwithpresentingviewcontroller:hint:completion:).
     */
    loginHint?: string;
};
/**
 * @group Original Google sign in
 * */
export type ConfigureParams = ClientIdOrPlistPath & {
    /**
     * The Google API scopes to request access to.
     * @default `["email", "profile"]`
     */
    scopes?: string[];
    /**
     * The web client ID obtained from Google Cloud console. Required for offline access.
     */
    webClientId?: WebClientId;
    /**
     * Must be `true` if you wish to access user APIs on behalf of the user from your own server.
     *
     * When offline access is requested, an authorization code is returned so the server can use the authorization code to exchange for access token and refresh token.
     * The access token allows the server to access Google data on behalf of the user.
     */
    offlineAccess?: boolean;
    /**
     * Specifies a hosted domain restriction. By setting this, authorization will be restricted to accounts of the user in the specified domain.
     */
    hostedDomain?: string;
    /**
     * Android only. Only set to `true` if your server has suffered some failure and lost the user's refresh token.
     */
    forceCodeForRefreshToken?: boolean;
    /**
     * Android only. An account name that should be prioritized.
     */
    accountName?: string;
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
};
/**
 * The response object when the user signs in successfully.
 *
 * @group Original Google sign in
 * */
export type SignInSuccessResponse = {
    type: 'success';
    /**
     * The user details.
     * */
    data: User;
};
/**
 * @group Original Google sign in
 * */
export type SignInResponse = SignInSuccessResponse | CancelledResponse;
/**
 * The response object for calling `signInSilently`. Either the user details are available (without user interaction) or there was no saved credential found.
 * @group Original Google sign in
 * */
export type SignInSilentlyResponse = SignInSuccessResponse | NoSavedCredentialFound;
/**
 * iOS only. Configures the iOS client ID. By default, the iOS client ID is taken from the `GoogleService-Info.plist` Firebase config file (if present).
 *
 * You can specify a different bundle path for the config file, e.g. "GoogleService-Info-Staging".
 *
 * Alternatively, set the client ID explicitly by providing `iosClientId`.
 * */
export type ClientIdOrPlistPath = {
    /**
     * If you want to specify the client ID of type iOS.
     * It is taken from the `GoogleService-Info.plist` file by default.
     */
    iosClientId?: string;
} | {
    /**
     * iOS only. Use this to specify a different bundle path name for the `GoogleService-Info` Firebase config file.
     * @example "GoogleService-Info-Staging"
     */
    googleServicePlistPath?: string;
};
/**
 * The response object when the user cancels the flow for any operation that requires user interaction.
 *
 * On the web, this is also returned while [cooldown period](https://developers.google.com/identity/gsi/web/guides/features#exponential_cooldown) is active.
 * Detecting the cooldown period itself is not possible on the web for user privacy reasons.
 * On Android, it can be detected via `ONE_TAP_START_FAILED`
 * */
export type CancelledResponse = {
    type: 'cancelled';
    data: null;
};
/**
 * The response to calling One Tap's `signIn` and Original Google Sign In's `signInSilently` when no user was previously signed in, or they have since signed out or revoked access.
 * */
export type NoSavedCredentialFound = {
    type: 'noSavedCredentialFound';
    data: null;
};
/**
 * @group Original Google sign in
 * */
export type HasPlayServicesParams = {
    /**
     * Whether to show a dialog that prompts the user to install Google Play Services,
     * if they don't have them installed.
     *
     * @default true
     */
    showPlayServicesUpdateDialog?: boolean;
};
/**
 * @group Original Google sign in
 * */
export type AddScopesParams = {
    /**
     * The Google API scopes to request access to.
     * @default `["email", "profile"]`
     */
    scopes: string[];
};
/**
 * @group Original Google sign in
 * */
export type GetTokensResponse = {
    idToken: string;
    accessToken: string;
};
/**
 * @group Original Google sign in
 * */
export type User = {
    user: {
        id: string;
        name: string | null;
        email: string;
        photo: string | null;
        familyName: string | null;
        givenName: string | null;
    };
    /**
     * The Google API scopes that the user granted access to.
     * */
    scopes: string[];
    /**
     * JWT (JSON Web Token) that serves as a secure credential for your user's identity.
     */
    idToken: string | null;
    /**
     * Code that you can securely send to your server to exchange for an access and refresh token.
     * Use the access token to call Google APIs on behalf of the user and, optionally, store the refresh token to acquire a new access token when the access token expires.
     *
     * Not null only if a valid `webClientId` and `offlineAccess` was enabled in `configure()`.
     */
    serverAuthCode: string | null;
};
/**
 * @hidden
 * */
export interface NativeModuleError extends Error {
    code: string;
}
/**
 * @hidden
 * */
export type WebClientId = 'autoDetect' | (string & {});
//# sourceMappingURL=types.d.ts.map