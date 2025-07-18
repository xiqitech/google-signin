/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import type { TextStyle, ViewProps, StyleProp } from 'react-native';

export const Color = {
  Dark: 'dark',
  Light: 'light',
} as const;

/**
 * @group React Components
 * */
export type GoogleSigninButtonProps = ViewProps & {
  size?: number;
  color?: 'dark' | 'light';
  disabled?: boolean;
  onPress?: () => void;
};

/**
 * @group React Components
 * */
export type GoogleLogoButtonProps = {
  theme?: 'light' | 'dark' | 'neutral';
  variant?: 'standard' | 'icon';
  shape?: 'rectangular' | 'circular';
  /**
   * Style for the button text. Provide the Roboto font family with a weight of 500.
   * */
  textStyle?: StyleProp<TextStyle> | undefined;
  label?: string | undefined;
};
