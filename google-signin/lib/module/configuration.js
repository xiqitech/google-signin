"use strict";

/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import { validateWebClientId } from './oneTap/validateWebClientId';
let currentConfiguration;
export const setConfiguration = (configuration, requireWebClientId) => {
  if (requireWebClientId && !('webClientId' in configuration)) {
    throwMissingWebClientId();
  }
  validateWebClientId(configuration);
  currentConfiguration = configuration;
};
export const unsetConfigurationTestsOnly = () => {
  currentConfiguration = undefined;
};
function throwMissingConfig() {
  const err = new Error('You must call `configure()` before attempting authentication, authorization, or related methods.');
  Object.assign(err, {
    code: 'configure'
  });
  throw err;
}
export function throwMissingWebClientId() {
  const err = new Error('`webClientId` is required for OneTap sign-in. Provide it in the `configure` method.');
  Object.assign(err, {
    code: 'configure'
  });
  throw err;
}
export function getConfigOrThrow() {
  if (!currentConfiguration) {
    throwMissingConfig();
  }
  return currentConfiguration;
}
//# sourceMappingURL=configuration.js.map