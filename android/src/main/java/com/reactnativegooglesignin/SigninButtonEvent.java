/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

package com.reactnativegooglesignin;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

public class SigninButtonEvent extends Event<SigninButtonEvent> {
    public static final String EVENT_NAME = "topPress";
    public SigninButtonEvent(int surfaceId, int reactTag) {
        super(surfaceId, reactTag);
    }

    @NonNull
    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    protected WritableMap getEventData() {
      return Arguments.createMap();
    }
}
