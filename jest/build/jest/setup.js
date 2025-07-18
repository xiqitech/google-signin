"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockOneTapResponse = exports.mockOneTapUser = exports.mockGoogleSignInResponse = exports.mockUserInfo = void 0;
exports.mockUserInfo = Object.freeze({
    idToken: 'mockIdToken',
    serverAuthCode: 'mockServerAuthCode',
    scopes: [],
    user: {
        email: 'mockEmail@gmail.com',
        id: 'mockId',
        givenName: 'mockGivenName',
        familyName: 'mockFamilyName',
        photo: null,
        name: 'mockFullName',
    },
});
exports.mockGoogleSignInResponse = Object.freeze({
    type: 'success',
    data: exports.mockUserInfo,
});
function mockFactory() {
    const mockNativeModule = Object.freeze({
        configure: jest.fn(),
        playServicesAvailable: jest.fn().mockReturnValue(true),
        getTokens: jest
            .fn()
            .mockResolvedValue({
            accessToken: 'mockAccessToken',
            idToken: 'mockIdToken',
        }),
        signIn: jest.fn().mockResolvedValue(exports.mockUserInfo),
        signInSilently: jest
            .fn()
            .mockResolvedValue(exports.mockUserInfo),
        revokeAccess: jest.fn().mockResolvedValue(null),
        signOut: jest.fn().mockResolvedValue(null),
        enableAppCheck: jest.fn().mockResolvedValue(null),
        hasPreviousSignIn: jest.fn().mockReturnValue(true),
        addScopes: jest
            .fn()
            .mockImplementation(({ scopes }) => {
            const userWithScopes = {
                ...exports.mockUserInfo,
                scopes,
            };
            return Promise.resolve(userWithScopes);
        }),
        getCurrentUser: jest
            .fn()
            .mockReturnValue(exports.mockUserInfo),
        clearCachedAccessToken: jest.fn().mockResolvedValue(null),
        getConstants: jest
            .fn()
            .mockReturnValue({
            SIGN_IN_CANCELLED: 'mock_SIGN_IN_CANCELLED',
            IN_PROGRESS: 'mock_IN_PROGRESS',
            PLAY_SERVICES_NOT_AVAILABLE: 'mock_PLAY_SERVICES_NOT_AVAILABLE',
            SIGN_IN_REQUIRED: 'mock_SIGN_IN_REQUIRED',
            SCOPES_ALREADY_GRANTED: 'mock_SCOPES_ALREADY_GRANTED',
            BUTTON_SIZE_ICON: 2,
            BUTTON_SIZE_WIDE: 1,
            BUTTON_SIZE_STANDARD: 0,
            // one-tap specific constants
            ONE_TAP_START_FAILED: 'mock_ONE_TAP_START_FAILED',
        }),
    });
    return {
        NativeModule: mockNativeModule,
    };
}
// mock very close to native module to be able to test JS logic too
jest.mock('../src/spec/NativeGoogleSignin', () => mockFactory());
// the following are for jest testing outside of the library, where the paths are different
// alternative is to use moduleNameMapper in user space
const mockModulePaths = ['../../../lib/module/spec/NativeGoogleSignin'];
mockModulePaths.forEach((path) => {
    try {
        require.resolve(path);
        jest.mock(path, () => mockFactory());
    }
    catch (error) {
        if ('code' in error && error.code === 'MODULE_NOT_FOUND') {
            if (!process.env.SILENCE_MOCK_NOT_FOUND) {
                console.warn(`Unable to resolve ${path}`);
            }
        }
        else {
            throw error;
        }
    }
});
// one-tap
exports.mockOneTapUser = Object.freeze({
    user: {
        email: 'mockEmail@gmail.com',
        id: 'mockId',
        givenName: 'mockGivenName',
        familyName: 'mockFamilyName',
        photo: null,
        phoneNumber: null,
        name: 'mockFullName',
    },
    idToken: 'mockIdToken',
    credentialOrigin: 'user',
    serverAuthCode: 'mockServerAuthCode',
});
exports.mockOneTapResponse = Object.freeze({
    type: 'success',
    data: exports.mockOneTapUser,
});
// when forcing import of the android module, we need to mock the android spec
jest.mock('../src/spec/NativeOneTapSignIn.android', () => {
    const mockNativeModule = Object.freeze({
        configure: jest.fn(),
        signOut: jest.fn().mockResolvedValue(null),
        revokeAccess: jest.fn().mockResolvedValue(null),
        signIn: jest
            .fn()
            .mockResolvedValue(exports.mockOneTapResponse),
        explicitSignIn: jest
            .fn()
            .mockResolvedValue(exports.mockOneTapResponse),
        createAccount: jest
            .fn()
            .mockResolvedValue(exports.mockOneTapResponse),
        enableAppCheck: jest.fn().mockResolvedValue(null),
        checkPlayServices: jest
            .fn()
            .mockResolvedValue({
            minRequiredVersion: -1,
            installedVersion: -1,
        }),
        requestAuthorization: jest
            .fn()
            .mockImplementation(({ scopes }) => {
            const resp = {
                type: 'success',
                data: {
                    grantedScopes: scopes,
                    accessToken: 'mockAccessToken',
                    serverAuthCode: null,
                },
            };
            return Promise.resolve(resp);
        }),
    });
    return {
        OneTapNativeModule: mockNativeModule,
    };
});
