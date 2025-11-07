/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { GoogleSigninButtonProps } from './statics';
import { useColorSchemeCompat } from './useColorSchemeCompat';

export const BaseButton = ({
  color,
  style,
  onBlur,
  onFocus,
  ...rest
}: GoogleSigninButtonProps) => {
  const activeColorScheme = useColorSchemeCompat();
  const colorScheme = color ?? activeColorScheme ?? 'light';

  if (__DEV__) {
    if (onBlur || onFocus) {
      console.warn(
        '[GoogleSigninButton] The `onBlur` and `onFocus` props are not supported on macOS.',
      );
    }
  }

  return (
    <TouchableOpacity
      style={[buttonStyles.content, buttonStyles[colorScheme], style]}
      {...rest}
    >
      <Text style={[textStyles[colorScheme], textStyles.content]}>Sign in</Text>
    </TouchableOpacity>
  );
};

const textStyles = StyleSheet.create({
  light: {
    color: 'grey',
  },
  dark: {
    color: 'white',
  },
  content: {
    fontSize: 17,
  },
});
const buttonStyles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    borderRadius: 3,
  },
  light: {
    backgroundColor: 'white',
  },
  dark: {
    backgroundColor: '#4286f5',
  },
});
