/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <GoogleSignInCommunity/GoogleSignIn.h>
#import "RNGoogleSignin.h"
#import <AppAuth/OIDError.h>

@interface RNGoogleSignin ()

@property (nonatomic) NSArray *scopes;
@property (nonatomic) NSUInteger profileImageSize;

@end

@implementation RNGoogleSignin

RCT_EXPORT_MODULE();

static NSString *const PLAY_SERVICES_NOT_AVAILABLE = @"PLAY_SERVICES_NOT_AVAILABLE";
static NSString *const ASYNC_OP_IN_PROGRESS = @"ASYNC_OP_IN_PROGRESS";

static NSString *const ONE_TAP_START_FAILED = @"ONE_TAP_START_FAILED";

// The key in `GoogleService-Info.plist` client id.
// For more see https://developers.google.com/identity/sign-in/ios/start
static NSString *const kClientIdKey = @"CLIENT_ID";

typedef struct {
    NSString *clientId;
    NSString *webClientId;
} ClientConfiguration;

- (NSDictionary *)constantsToExport
{
  return @{
#if !TARGET_OS_OSX
           @"BUTTON_SIZE_ICON": @(kGIDSignInButtonStyleIconOnly),
           @"BUTTON_SIZE_STANDARD": @(kGIDSignInButtonStyleStandard),
           @"BUTTON_SIZE_WIDE": @(kGIDSignInButtonStyleWide),
#else
           @"BUTTON_SIZE_STANDARD": @(0),
           @"BUTTON_SIZE_WIDE": @(1),
           @"BUTTON_SIZE_ICON": @(2),
#endif
           @"SIGN_IN_CANCELLED": [@(kGIDSignInErrorCodeCanceled) stringValue],
           @"SIGN_IN_REQUIRED": [@(kGIDSignInErrorCodeHasNoAuthInKeychain) stringValue],
           @"SCOPES_ALREADY_GRANTED": [@(kGIDSignInErrorCodeScopesAlreadyGranted) stringValue],
           @"IN_PROGRESS": ASYNC_OP_IN_PROGRESS,
           // these never happen on iOS
           PLAY_SERVICES_NOT_AVAILABLE: PLAY_SERVICES_NOT_AVAILABLE,
           ONE_TAP_START_FAILED: ONE_TAP_START_FAILED,
           };
}

#ifdef RCT_NEW_ARCH_ENABLED
- (facebook::react::ModuleConstants<JS::NativeGoogleSignin::Constants>)getConstants {
  return facebook::react::typedConstants<JS::NativeGoogleSignin::Constants>(
          {
#if !TARGET_OS_OSX
                  .BUTTON_SIZE_ICON = kGIDSignInButtonStyleIconOnly,
                  .BUTTON_SIZE_STANDARD = kGIDSignInButtonStyleStandard,
                  .BUTTON_SIZE_WIDE = kGIDSignInButtonStyleWide,
#else
                  .BUTTON_SIZE_STANDARD = 0,
                  .BUTTON_SIZE_WIDE = 1,
                  .BUTTON_SIZE_ICON = 2,
#endif
                  .SIGN_IN_CANCELLED = [@(kGIDSignInErrorCodeCanceled) stringValue],
                  .SIGN_IN_REQUIRED = [@(kGIDSignInErrorCodeHasNoAuthInKeychain) stringValue],
                  .IN_PROGRESS = ASYNC_OP_IN_PROGRESS,
                  .SCOPES_ALREADY_GRANTED = [@(kGIDSignInErrorCodeScopesAlreadyGranted) stringValue],

                  // these never happen on iOS
                  .PLAY_SERVICES_NOT_AVAILABLE = PLAY_SERVICES_NOT_AVAILABLE,
                  .ONE_TAP_START_FAILED = ONE_TAP_START_FAILED,
          });
}
#endif

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_METHOD(configure:(NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  NSError *error;
  ClientConfiguration config = [self readConfigurationWithOptions:options error:&error];

  if (error) {
    RCTLogError(@"RNGoogleSignin: %@", error.localizedDescription);
    reject(@"configure", error.localizedDescription, error);
    return;
  }

  GIDConfiguration* googleConfig = [[GIDConfiguration alloc] initWithClientID:config.clientId
                                                               serverClientID:config.webClientId
                                                                 hostedDomain:options[@"hostedDomain"]
                                                                  openIDRealm:options[@"openIDRealm"]];
  GIDSignIn.sharedInstance.configuration = googleConfig;

  _profileImageSize = 120;
  if (options[@"profileImageSize"]) {
    NSNumber* size = options[@"profileImageSize"];
    _profileImageSize = size.unsignedIntegerValue;
  }

  _scopes = options[@"scopes"];

  resolve([NSNull null]);
}

- (ClientConfiguration)readConfigurationWithOptions:(NSDictionary *)options error:(NSError **)error {
  const ClientConfiguration emptyConfig = { nil, nil };

  const BOOL doAutoDetectWebClientId = [@"autoDetect" isEqualToString:options[@"webClientId"]];
  // comes from param or FIR-plist
  NSString *webClientId = doAutoDetectWebClientId ? nil : options[@"webClientId"];
  NSString *mainIosClientID = [self getGidClientIdFromInfoPlist];
  NSString* iosClientIdParam = options[@"iosClientId"];

  // comes from param, FIR-plist, or app plist
  NSString *iosClientId = iosClientIdParam ?: mainIosClientID;

  // for one-tap we need webClientId so we'll attempt reading it.
  BOOL shouldReadFirPlist = !webClientId || !iosClientIdParam;
  if (shouldReadFirPlist) {
    NSString *pathName = options[@"googleServicePlistPath"] ?: @"GoogleService-Info";
    NSURL *plistPath = [NSBundle.mainBundle URLForResource:pathName withExtension:@"plist"];
    BOOL configIsDeemedToFail = !iosClientId && !plistPath;
    if (configIsDeemedToFail) {
      // report the error to callsite
      if (error) {
        NSString *message = @"`configure()` call failed because `iosClientId` could not be determined:\n"
          "If you use Expo, make sure to set up the config plugin and run `npx expo prebuild --clean`.\n"
          "If you use Firebase, make sure that Firebase's GoogleService-Info.plist file is present in the project.\n"
          "Otherwise, specify `iosClientId` (and optionally `offlineAccess: true, webClientId: xyz`) in `configure()`.\n"
          "Read the iOS guide / Expo guide to learn more.";
        *error = [NSError errorWithDomain:@"RNGoogleSignin" code:1001 userInfo:@{NSLocalizedDescriptionKey: message}];
      }
      return emptyConfig;
    }

    if (plistPath) {
      NSDictionary *firPlist = [[NSDictionary alloc] initWithContentsOfURL:plistPath error:error];
      if (*error) {
        return emptyConfig;
      }
      iosClientId = iosClientIdParam ?: firPlist[kClientIdKey] ?: mainIosClientID;
      webClientId = webClientId ?: firPlist[@"WEB_CLIENT_ID"];
    }
  }

  // MARK: validate webClientId config
  BOOL offlineAccessRequested = [options[@"offlineAccess"] boolValue];
  if ((offlineAccessRequested || doAutoDetectWebClientId) && !webClientId) {
    if (error) {
      NSString *message = @"Failed to determine 'webClientId' (needed because `webClientId=autoDetect` or because `offlineAccess=true`).\n"
                           "Add `WEB_CLIENT_ID` entry to the Firebase plist file manually or pass `webClientId` as a parameter to `configure()`.";
      *error = [NSError errorWithDomain:@"RNGoogleSignin" code:1002 userInfo:@{NSLocalizedDescriptionKey: message}];
    }
    return emptyConfig;
  }

  // MARK: validate iosClientId config
  if (mainIosClientID != nil && iosClientId != nil && ![mainIosClientID isEqualToString:iosClientId]) {
    if (error) {
      NSString *message = [NSString stringWithFormat:@"Inconsistency detected: An iOS client ID was specified in Info.plist (%@) and a different one was determined by the `configure()` call (%@).\n"
                           "To fix this, remove `iosClientId` from `configure()`. If you use Firebase, make sure your configuration file is up to date. If you use Expo, ensure the `iosUrlScheme` value provided to the config plugin is the correct one.", mainIosClientID, iosClientId];
      *error = [NSError errorWithDomain:@"RNGoogleSignin" code:1002 userInfo:@{NSLocalizedDescriptionKey: message}];
    }
    return emptyConfig;
  }
  const ClientConfiguration populatedConfig = { iosClientId, webClientId };
  return populatedConfig;
}


RCT_EXPORT_METHOD(signInSilently:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [GIDSignIn.sharedInstance restorePreviousSignInWithCompletion:^(GIDGoogleUser * _Nullable user, NSError * _Nullable error) {
    [self handleCompletion:user serverAuthCode:nil withError:error withResolver:resolve withRejector:reject fromCallsite:@"signInSilently"];
  }];
}

RCT_EXPORT_METHOD(signIn:(NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
      NSString* hint = options[@"loginHint"];
      NSString* nonce = options[@"nonce"];
      NSArray* scopes = self.scopes;
#if DEBUG
      @try {
#endif
      void (^completionHandler)(GIDSignInResult * _Nullable, NSError * _Nullable) = ^(GIDSignInResult * _Nullable signInResult, NSError * _Nullable error) {
          [self handleCompletion:signInResult withError:error withResolver:resolve withRejector:reject fromCallsite:@"signIn"];
      };

#if !TARGET_OS_OSX
      [GIDSignIn.sharedInstance signInWithPresentingViewController:RCTPresentedViewController() hint:hint additionalScopes:scopes nonce:nonce completion:completionHandler];
#else
      [GIDSignIn.sharedInstance signInWithPresentingWindow:NSApplication.sharedApplication.mainWindow hint:hint additionalScopes:scopes nonce:nonce completion:completionHandler];
#endif
#if DEBUG
      }
      @catch (NSException *exception) {
        NSString *errorMessage = [NSString stringWithFormat:@"Encountered an error when signing in (see details below). If the error is 'Your app is missing support for the following URL schemes...', follow the troubleshooting guide at https://react-native-google-signin.github.io/docs/troubleshooting#ios\n\n%@", exception.description];
        reject(@"SIGN_IN_ERROR", errorMessage, nil);
      }
#endif
  });
}

RCT_EXPORT_METHOD(addScopes:(NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  GIDGoogleUser *currentUser = GIDSignIn.sharedInstance.currentUser;
  if (!currentUser) {
    resolve([NSNull null]);
    return;
  }

  dispatch_async(dispatch_get_main_queue(), ^{
      NSArray* scopes = options[@"scopes"];

      void (^completionHandler)(GIDSignInResult * _Nullable, NSError * _Nullable) = ^(GIDSignInResult * _Nullable signInResult, NSError * _Nullable error) {
          [self handleCompletion:signInResult withError:error withResolver:resolve withRejector:reject fromCallsite:@"addScopes"];
      };

#if !TARGET_OS_OSX
      [currentUser addScopes:scopes presentingViewController:RCTPresentedViewController() completion:completionHandler];
#else
      [currentUser addScopes:scopes presentingWindow:NSApplication.sharedApplication.mainWindow completion:completionHandler];
#endif
  });
}

RCT_EXPORT_METHOD(signOut:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [GIDSignIn.sharedInstance signOut];
  resolve([NSNull null]);
}

RCT_EXPORT_METHOD(revokeAccess:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [GIDSignIn.sharedInstance disconnectWithCompletion:^(NSError * _Nullable error) {
    if (error) {
      [RNGoogleSignin rejectWithSigninError:error withRejector:reject];
    } else {
      resolve([NSNull null]);
    }
  }];
}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSNumber *, hasPreviousSignIn)
{
  BOOL hasPreviousSignIn = GIDSignIn.sharedInstance.hasPreviousSignIn;
  return @(hasPreviousSignIn);
}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSDictionary*, getCurrentUser)
{
  GIDGoogleUser *currentUser = GIDSignIn.sharedInstance.currentUser;
  return RCTNullIfNil([self createUserDictionary:currentUser serverAuthCode:nil]);
}

RCT_EXPORT_METHOD(getTokens:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject)
{
  GIDGoogleUser *currentUser = GIDSignIn.sharedInstance.currentUser;
  if (currentUser == nil) {
    reject(@"getTokens", @"getTokens requires a user to be signed in", nil);
    return;
  }
  [currentUser refreshTokensIfNeededWithCompletion:^(GIDGoogleUser * _Nullable user, NSError * _Nullable error) {
    if (error) {
      [RNGoogleSignin rejectWithSigninError:error withRejector:reject];
    } else {
      if (user) {
        resolve(@{
                  @"idToken" : user.idToken.tokenString,
                  @"accessToken" : user.accessToken.tokenString,
                  });
      } else {
        reject(@"getTokens", @"user was null", nil);
      }
    }
  }];
}

RCT_EXPORT_METHOD(enableAppCheck:(NSString *)APIKeyFromJS
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
#if TARGET_OS_OSX
  resolve([NSNull null]);
#else
  NSString* apiKeyFromEnv = [self APIKeyFromEnvironment];
  if (apiKeyFromEnv && APIKeyFromJS) {
    reject(@"enableAppCheck", @"You provided both `APP_CHECK_API_KEY` env variable and `debugProviderAPIKey` from JS. Provide only one of the values.", nil);
    return;
  }
  NSString * debugProviderAPIKey = apiKeyFromEnv ?: APIKeyFromJS;
  BOOL useDebugProvider = debugProviderAPIKey != nil && debugProviderAPIKey.length > 0;
  NSString *mainClientID = [self getGidClientIdFromInfoPlist];
  if (!mainClientID) {
    reject(@"enableAppCheck", @"enabling AppCheck requires the \"GIDClientID\" entry in Info.plist file. Read the security guide to set this up.", nil);
    return;
  }

  void (^completionHandler)(NSError * _Nullable) = ^(NSError * _Nullable error) {
    if (error == nil) {
      resolve([NSNull null]);
    } else {
      NSString* context = useDebugProvider ? @"debug" : @"production";
      NSString* message = [NSString stringWithFormat:@"RNGoogleSignin: enabling AppCheck for environment \"%@\" failed: %@", context, error.description];
      NSString* errorCode = [NSString stringWithFormat:@"%ld", error.code];
      reject(errorCode, message, error);
    }
  };
  if (useDebugProvider) {
    if (@available(iOS 14, *)) {
      [GIDSignIn.sharedInstance configureDebugProviderWithAPIKey:debugProviderAPIKey completion:completionHandler];
    } else {
      reject(@"enableAppCheck", @"enableAppCheck debug provider is available on iOS 14 and newer", nil);
    }
  } else {
    [GIDSignIn.sharedInstance configureWithCompletion:completionHandler];
  }
#endif
}

- (NSString *)APIKeyFromEnvironment {
  NSString* APIKeyName = @"APP_CHECK_API_KEY";
  NSString *APIKey = [[[NSProcessInfo processInfo] environment] objectForKey:APIKeyName];
  if (!APIKey || APIKey.length == 0) {
    return nil;
  }
  return APIKey;
}

- (NSString*)getGidClientIdFromInfoPlist {
  // from GIDAppCheck.m
  NSString *clientID = [NSBundle.mainBundle objectForInfoDictionaryKey:@"GIDClientID"];
  return clientID;
}

- (NSDictionary*)createUserDictionary: (nullable GIDSignInResult *) result {
  return [self createUserDictionary:result.user serverAuthCode:result.serverAuthCode];
}

- (NSDictionary*)createUserDictionary: (nullable GIDGoogleUser *) user serverAuthCode: (nullable NSString*) serverAuthCode {
  if (!user) {
    return nil;
  }
  NSURL *imageURL = user.profile.hasImage ? [user.profile imageURLWithDimension:_profileImageSize] : nil;

  NSDictionary *userInfo = @{
                             @"id": user.userID,
                             @"name": RCTNullIfNil(user.profile.name),
                             @"givenName": RCTNullIfNil(user.profile.givenName),
                             @"familyName": RCTNullIfNil(user.profile.familyName),
                             @"photo": imageURL ? imageURL.absoluteString : [NSNull null],
                             @"email": user.profile.email,
                             };

  NSDictionary *params = @{
                           @"user": userInfo,
                           @"idToken": user.idToken.tokenString,
                           @"serverAuthCode": RCTNullIfNil(serverAuthCode),
                           @"scopes": user.grantedScopes,
                           };
  return params;
}

- (void)handleCompletion: (GIDSignInResult * _Nullable) signInResult withError: (NSError * _Nullable) error withResolver: (RCTPromiseResolveBlock) resolve withRejector: (RCTPromiseRejectBlock) reject fromCallsite: (NSString *) from {
  [self handleCompletion:signInResult.user serverAuthCode:signInResult.serverAuthCode withError:error withResolver:resolve withRejector:reject fromCallsite:from];
}

- (void)handleCompletion: (GIDGoogleUser * _Nullable) user serverAuthCode: (nullable NSString*) serverAuthCode withError: (NSError * _Nullable) error withResolver: (RCTPromiseResolveBlock) resolve withRejector: (RCTPromiseRejectBlock) reject fromCallsite: (NSString *) from {
  if (error) {
    [RNGoogleSignin rejectWithSigninError:error withRejector:reject];
  } else {
    if (user) {
      resolve([self createUserDictionary:user serverAuthCode:serverAuthCode]);
    } else {
      reject(from, @"user was null", nil);
    }
  }
}

+ (void)rejectWithSigninError: (NSError *) error withRejector: (RCTPromiseRejectBlock) reject {
  if ([OIDOAuthTokenErrorDomain isEqualToString:error.domain] &&
      [@"invalid_grant: Token has been expired or revoked." isEqualToString:error.userInfo[NSLocalizedDescriptionKey]]) {
    // https://github.com/react-native-google-signin/google-signin-next/issues/89
    NSString* errorCode = [NSString stringWithFormat:@"%ld", kGIDSignInErrorCodeHasNoAuthInKeychain];
    reject(errorCode, @"The user has never signed in before, or they have since signed out.", error);
    return;
  }
  NSString *errorMessage = @"Unknown error in google sign in.";
  switch (error.code) {
    case kGIDSignInErrorCodeUnknown:
      errorMessage = @"Unknown error in google sign in.";
      break;
    case kGIDSignInErrorCodeKeychain:
      errorMessage = @"A problem reading or writing to the application keychain.";
      break;
    case kGIDSignInErrorCodeHasNoAuthInKeychain:
      errorMessage = @"The user has never signed in before, or they have since signed out.";
      break;
    case kGIDSignInErrorCodeCanceled:
      errorMessage = @"The user canceled the sign in request.";
      break;
    case kGIDSignInErrorCodeEMM:
      errorMessage = @"An Enterprise Mobility Management related error has occurred.";
      break;
    case kGIDSignInErrorCodeScopesAlreadyGranted:
      errorMessage = @"The requested scopes have already been granted to the `currentUser`";
      break;
    case kGIDSignInErrorCodeMismatchWithCurrentUser:
      errorMessage = @"There was an operation on a previous user.";
      break;
  }
  NSString* message = [NSString stringWithFormat:@"RNGoogleSignIn: %@, %@", errorMessage, error.description];
  NSString* errorCode = [NSString stringWithFormat:@"%ld", error.code];
  reject(errorCode, message, error);
}

RCT_EXPORT_METHOD(playServicesAvailable:(BOOL)showPlayServicesUpdateDialog resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  resolve(@(YES));
}

#ifdef RCT_NEW_ARCH_ENABLED

- (void)clearCachedAccessToken:(NSString *)tokenString resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    // never called on ios
    resolve([NSNull null]);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
   (const facebook::react::ObjCTurboModule::InitParams &)params
{
   return std::make_shared<facebook::react::NativeGoogleSigninSpecJSI>(params);
}
#endif

@end
