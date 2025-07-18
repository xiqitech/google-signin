"use strict";

/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import { StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';
import React from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
export const BaseButton = ({
  color,
  style,
  ...rest
}) => {
  const activeColorScheme = useColorScheme();
  const colorScheme = color ?? activeColorScheme ?? 'light';
  return /*#__PURE__*/_jsx(TouchableOpacity, {
    style: [buttonStyles.content, buttonStyles[colorScheme], style],
    ...rest,
    children: /*#__PURE__*/_jsx(Text, {
      style: [textStyles[colorScheme], textStyles.content],
      children: "Sign in"
    })
  });
};
const textStyles = StyleSheet.create({
  light: {
    color: 'grey'
  },
  dark: {
    color: 'white'
  },
  content: {
    fontSize: 17
  }
});
const buttonStyles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    borderRadius: 3
  },
  light: {
    backgroundColor: 'white'
  },
  dark: {
    backgroundColor: '#4286f5'
  }
});
//# sourceMappingURL=BaseButton.macos.js.map