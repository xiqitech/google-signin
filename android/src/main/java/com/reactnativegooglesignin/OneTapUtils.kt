/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

package com.reactnativegooglesignin

import android.accounts.Account
import androidx.core.content.pm.PackageInfoCompat
import com.auth0.android.jwt.JWT
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.google.android.gms.auth.api.identity.AuthorizationRequest
import com.google.android.gms.auth.api.identity.AuthorizationResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential

class OneTapUtils {

  class OneTapUtils(private val context: ReactApplicationContext) {
    private val detectedWebClientId: String? by lazy {
      // we could probably use some gradle magic to find if this value is present in the resources
      // but for now we'll do a runtime check
      val id: Int = context.resources
        .getIdentifier("default_web_client_id", "string", context.packageName)
      if (id != 0) {
        context.resources.getString(id)
      } else {
        null
      }
    }

    fun installedGooglePlayServicesVersion(): Long? {
      return runCatching {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
          PackageInfoCompat.getLongVersionCode(
            context.packageManager.getPackageInfo(
              GoogleApiAvailability.GOOGLE_PLAY_SERVICES_PACKAGE, 0
            )
          )
        } else {
          context.packageManager.getPackageInfo(
            GoogleApiAvailability.GOOGLE_PLAY_SERVICES_PACKAGE,
            0
          ).versionCode.toLong()
        }
      }.getOrNull()
    }

    private fun getWebClientId(params: ReadableMap): String {
      val webClientId = if (!params.hasKey("webClientId") || "autoDetect" == params.getString("webClientId")) {
        this.detectedWebClientId
      } else {
        params.getString("webClientId")
      }
      return webClientId ?: throw IllegalArgumentException("`webClientId` is required but was not provided, " +
        "and not found in the Android resources. " +
        "To fix this, provide it in the params, or make sure you have set up Firebase correctly. " +
        "Read the Android guide / Expo guide to learn more.")
    }

    fun buildOneTapSignInRequest(
      params: ReadableMap,
    ): GetGoogleIdOption {
      val nonce = params.getString("nonce")
      val autoSignIn = params.getBoolean("autoSignIn")
      val filterByAuthorizedAccounts = params.getBoolean("filterByAuthorizedAccounts")
      val requestVerifiedPhoneNumber = params.hasKey("requestVerifiedPhoneNumber") && params.getBoolean("requestVerifiedPhoneNumber")

      return GetGoogleIdOption.Builder()
        .setServerClientId(getWebClientId(params))
        .setFilterByAuthorizedAccounts(filterByAuthorizedAccounts)
        .setNonce(nonce)
        .setAutoSelectEnabled(autoSignIn)
        // NOTE - only for sign-ups
        // https://developers.google.com/identity/android-credential-manager/android/reference/com/google/android/libraries/identity/googleid/GetGoogleIdOption.Builder#setRequestVerifiedPhoneNumber(kotlin.Boolean)
        .setRequestVerifiedPhoneNumber(requestVerifiedPhoneNumber)
        .build()
    }

    fun buildExplicitOneTapSignInRequest(
      params: ReadableMap
    ): GetSignInWithGoogleOption {
      val nonce = params.getString("nonce")
      val hostedDomain = params.getString("hostedDomain")

      return GetSignInWithGoogleOption.Builder(getWebClientId(params)).apply {
          hostedDomain?.let { setHostedDomainFilter(it) }
          nonce?.let { setNonce(it) }
      }.build()
    }

    fun buildAuthorizationRequest(params: ReadableMap): AuthorizationRequest {
      val requestOfflineAccess = params.getBoolean("offlineAccessEnabled")
      val hostedDomain = params.getString("hostedDomain")
      val accountName = params.getString("accountName")

      return AuthorizationRequest.builder().apply {
        setRequestedScopes(Utils.createScopesArray(params.getArray("scopes")).asList())
        if (requestOfflineAccess) {
          val serverClientId = getWebClientId(params)
          requestOfflineAccess(
            serverClientId,
            params.getBoolean("forceCodeForRefreshToken")
          )
        }

        hostedDomain?.let { filterByHostedDomain(it) }
        accountName?.let {
          val account = Account(it, "com.google")
          setAccount(account)
        }
      }.build()
    }

    fun getUserProperties(acct: GoogleIdTokenCredential): ReadableMap {
      val email = acct.id

      val user = Arguments.createMap().apply {
        putString("id", getSubjectId(acct))
        putString("email", email)
        putString("name", acct.displayName)
        putString("givenName", acct.givenName)
        putString("familyName", acct.familyName)
        putString("phoneNumber", acct.phoneNumber)
        putString("photo", acct.profilePictureUri?.toString())
      }

      val params = Arguments.createMap().apply {
        putMap("user", user)
        putString("idToken", acct.idToken)
        // credentialOrigin is not available on the Android side and is added for compatibility with web
        putString("credentialOrigin", "user")
      }

      return getSuccessResult(params)
    }

    fun getCanceledResult(): ReadableMap {
      return Arguments.createMap().apply {
        putString("type", "cancelled")
        putNull("data")
      }
    }

    fun getNoSavedCredentialsResult(): ReadableMap {
      return Arguments.createMap().apply {
        putString("type", "noSavedCredentialFound")
        putNull("credential")
      }
    }

    private fun getSuccessResult(data: ReadableMap): ReadableMap {
      return Arguments.createMap().apply {
        putString("type", "success")
        putMap("data", data)
      }
    }

    fun authorizationResultToJsMap(authorizationResult: AuthorizationResult): ReadableMap {
      val accessToken = authorizationResult.accessToken
      val serverAuthCode = authorizationResult.serverAuthCode
      val grantedScopes = authorizationResult.grantedScopes

      val data = Arguments.createMap().apply {
        putString("accessToken", accessToken)
        putString("serverAuthCode", serverAuthCode)
        putArray("grantedScopes", Arguments.fromList(grantedScopes))
      }

      return getSuccessResult(data)
    }

    private fun getSubjectId(acct: GoogleIdTokenCredential): String {
      val token = acct.idToken
      val jwt = JWT(token)
      return jwt.subject ?: throw IllegalArgumentException("Subject ID is not available in the provided GoogleIdTokenCredential.")
    }
  }

}
