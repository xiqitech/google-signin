import type { ConfigureParams } from './types';
import type { OneTapConfigureParams } from './oneTap/types';
export declare const setConfiguration: (configuration: OneTapConfigureParams | ConfigureParams, requireWebClientId: boolean) => void;
export declare const unsetConfigurationTestsOnly: () => void;
export declare function throwMissingWebClientId(): never;
export declare function getConfigOrThrow(): OneTapConfigureParams | ConfigureParams;
//# sourceMappingURL=configuration.d.ts.map