import type { NativeModuleError } from '../types';
export declare const SIGN_IN_CANCELLED_CODE = "cancel_called";
export declare const statusCodes: Readonly<{
    ONE_TAP_START_FAILED: string;
    IN_PROGRESS: string;
    PLAY_SERVICES_NOT_AVAILABLE: string;
}>;
export declare const createGoogleSdkNotFoundError: () => NativeModuleError;
export declare const createRevokeAccessFailedError: (error?: string) => NativeModuleError;
//# sourceMappingURL=errorCodes.web.d.ts.map