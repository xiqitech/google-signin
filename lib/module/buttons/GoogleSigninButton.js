"use strict";

/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import React, { useCallback } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { NativeModule } from "../spec/NativeGoogleSignin.js";
import { Color } from "./statics.js";
import { BaseButton } from './BaseButton';
import { jsx as _jsx } from "react/jsx-runtime";
const {
  BUTTON_SIZE_WIDE,
  BUTTON_SIZE_ICON,
  BUTTON_SIZE_STANDARD
} = NativeModule.getConstants();

/**
 * Native Google Sign-In button component. Prefer using the [`GoogleLogoButton`](#googlelogobutton) for a more customizable button.
 * @group React Components
 * */
export const GoogleSigninButton = props => {
  const {
    onPress,
    style,
    color,
    size = BUTTON_SIZE_STANDARD,
    ...rest
  } = props;
  const activeColorScheme = useColorScheme();
  const usedColor = color ?? activeColorScheme ?? 'light';
  const recommendedSize = getSizeStyle(size);
  const stripOnPressParams = useCallback(() => {
    // this is to make sure that the onPress callback prop is called with no params
    // as the RNGoogleSigninButton onPress does pass some in here
    onPress?.();
  }, [onPress]);
  return /*#__PURE__*/_jsx(BaseButton, {
    ...rest,
    size: size,
    onPress: stripOnPressParams,
    color: usedColor,
    style: StyleSheet.compose(recommendedSize, style)
  });
};
const nativeSizes = {
  Icon: BUTTON_SIZE_ICON,
  Standard: BUTTON_SIZE_STANDARD,
  Wide: BUTTON_SIZE_WIDE
};
GoogleSigninButton.Size = nativeSizes;
GoogleSigninButton.Color = Color;
function getSizeStyle(size) {
  switch (size) {
    case BUTTON_SIZE_ICON:
      return styles.iconSize;
    case BUTTON_SIZE_WIDE:
      return styles.wideSize;
    default:
      return styles.standardSize;
  }
}

// sizes according to https://developers.google.com/identity/sign-in/ios/reference/Classes/GIDSignInButton
const styles = StyleSheet.create({
  iconSize: {
    width: 48,
    height: 48
  },
  standardSize: {
    width: 230,
    height: 48
  },
  wideSize: {
    width: 312,
    height: 48
  }
});
//# sourceMappingURL=GoogleSigninButton.js.map