/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

package com.reactnativegooglesignin;

import com.facebook.react.bridge.WritableMap;

public class PendingAuthRecovery {
    private final WritableMap userProperties;

    public PendingAuthRecovery(WritableMap userProperties) {
        this.userProperties = userProperties;
    }

    public WritableMap getUserProperties() {
        return userProperties;
    }
}
