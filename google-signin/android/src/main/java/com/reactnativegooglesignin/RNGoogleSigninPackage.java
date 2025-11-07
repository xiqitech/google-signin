/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

package com.reactnativegooglesignin;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import com.reactnativegooglesignin.modern.RNOneTapSignInModule;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RNGoogleSigninPackage extends TurboReactPackage {

  @Nullable
  @Override
  public NativeModule getModule(String name, @NonNull ReactApplicationContext reactContext) {
    if (name.equals(RNGoogleSigninModule.NAME)) {
      return new RNGoogleSigninModule(reactContext);
    } else if (name.equals(RNOneTapSignInModule.NAME)) {
      return new RNOneTapSignInModule(reactContext);
    } else {
      return null;
    }
  }

  @NonNull
  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
      final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
      moduleInfos.put(
        RNGoogleSigninModule.NAME,
        new ReactModuleInfo(
          RNGoogleSigninModule.NAME,
          RNGoogleSigninModule.NAME,
//          "RNGoogleSigninModule",
          false, // canOverrideExistingModule
          false, // needsEagerInit
          true, // hasConstants
          false, // isCxxModule
          isTurboModule // isTurboModule
        ));
      moduleInfos.put(
        RNOneTapSignInModule.NAME,
        new ReactModuleInfo(
          RNOneTapSignInModule.NAME,
          RNOneTapSignInModule.NAME,
//          "RNOneTapSignInModule",
          false, // canOverrideExistingModule
          false, // needsEagerInit
          false, // hasConstants
          false, // isCxxModule
          isTurboModule // isTurboModule
        ));
      return moduleInfos;
    };
  }

  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    return Arrays.asList(
      new RNGoogleSigninButtonViewManager()
    );
  }
}
