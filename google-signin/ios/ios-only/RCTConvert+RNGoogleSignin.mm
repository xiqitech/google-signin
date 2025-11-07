/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

#import "RCTConvert+RNGoogleSignin.h"

@implementation RCTConvert(RNGoogleSignin)

RCT_ENUM_CONVERTER(GIDSignInButtonStyle, (@{
                                            @"standard": @(kGIDSignInButtonStyleStandard),
                                            @"wide": @(kGIDSignInButtonStyleWide),
                                            @"icon": @(kGIDSignInButtonStyleIconOnly),
                                            }), kGIDSignInButtonStyleStandard, integerValue)

RCT_ENUM_CONVERTER(GIDSignInButtonColorScheme, (@{
                                                  @"dark": @(kGIDSignInButtonColorSchemeDark),
                                                  @"light": @(kGIDSignInButtonColorSchemeLight),
                                                  }), kGIDSignInButtonColorSchemeLight, integerValue)

@end
