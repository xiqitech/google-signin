import type { SignInResponse } from '../src';
export declare const mockUserInfo: Readonly<{
    idToken: "mockIdToken";
    serverAuthCode: "mockServerAuthCode";
    scopes: never[];
    user: {
        email: string;
        id: string;
        givenName: string;
        familyName: string;
        photo: null;
        name: string;
    };
}>;
export declare const mockGoogleSignInResponse: SignInResponse;
export declare const mockOneTapUser: Readonly<{
    user: {
        email: string;
        id: string;
        givenName: string;
        familyName: string;
        photo: null;
        phoneNumber: null;
        name: string;
    };
    idToken: "mockIdToken";
    credentialOrigin: "user";
    serverAuthCode: "mockServerAuthCode";
}>;
export declare const mockOneTapResponse: Readonly<{
    type: "success";
    data: Readonly<{
        user: {
            email: string;
            id: string;
            givenName: string;
            familyName: string;
            photo: null;
            phoneNumber: null;
            name: string;
        };
        idToken: "mockIdToken";
        credentialOrigin: "user";
        serverAuthCode: "mockServerAuthCode";
    }>;
}>;
//# sourceMappingURL=setup.d.ts.map