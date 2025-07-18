/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

#import <GoogleSignIn/GoogleSignIn.h>
#import <React/RCTComponent.h>

@interface RNGoogleSignInButton :
#if !TARGET_OS_OSX
  GIDSignInButton
#else
  NSObject
#endif // !TARGET_OS_OSX

@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@end
