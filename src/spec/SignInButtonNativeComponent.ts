/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

import type { HostComponent, ViewProps } from 'react-native';
// TODO change imports - will break compatibility with RN < 0.80
import { codegenNativeComponent } from 'react-native';
import type {
  BubblingEventHandler,
  WithDefault,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

interface EventParams {}
export interface NativeProps extends ViewProps {
  onPress?: BubblingEventHandler<EventParams>;
  disabled?: WithDefault<boolean, false>;
  color?: WithDefault<'dark' | 'light', 'light'>;
  size: Int32;
}

export default codegenNativeComponent<NativeProps>('RNGoogleSigninButton', {
  // @ts-expect-error we would like to not generate anything on macos but this doesn't work. Maybe it will later
  excludedPlatforms: ['macos'],
}) as HostComponent<NativeProps>;
