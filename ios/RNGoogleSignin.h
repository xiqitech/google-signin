/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

#import <React/RCTComponent.h>

#ifdef RCT_NEW_ARCH_ENABLED
  #import <RNGoogleSignInCGen/RNGoogleSignInCGen.h>
#else
  #import <React/RCTBridgeModule.h>
#endif

@interface RNGoogleSignin : NSObject <
#ifdef RCT_NEW_ARCH_ENABLED
NativeGoogleSigninSpec
#else
RCTBridgeModule
#endif
>

@end
