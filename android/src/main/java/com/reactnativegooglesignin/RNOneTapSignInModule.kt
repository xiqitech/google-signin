/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

package com.reactnativegooglesignin

import android.app.Activity
import android.app.PendingIntent
import android.content.Intent
import android.content.IntentSender.SendIntentException
import androidx.core.app.ActivityCompat.startIntentSenderForResult
import androidx.credentials.ClearCredentialStateRequest
import androidx.credentials.CredentialManager
import androidx.credentials.CredentialOption
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetCredentialResponse
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import androidx.credentials.exceptions.GetCredentialProviderConfigurationException
import androidx.credentials.exceptions.NoCredentialException
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.util.RNLog
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch


class RNOneTapSignInModule(reactContext: ReactApplicationContext) :
  NativeOneTapSignInSpec(reactContext) {
  private val credentialManager by lazy { CredentialManager.create(reactApplicationContext) }
  private val requestAuthorizationPromiseWrapper = PromiseWrapper(NAME)
  private val oneTapUtils = OneTapUtils.OneTapUtils(reactApplicationContext)
  private var didCheckPlayServicesPresence = false

  private val activityEventListener =
    object : BaseActivityEventListener() {
      override fun onActivityResult(
        activity: Activity,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
      ) {
        if (requestCode != REQUEST_AUTHORIZE) {
          return
        }
        when (resultCode) {
          Activity.RESULT_OK -> {
            try {
              val authorizationResult =
                Identity.getAuthorizationClient(activity).getAuthorizationResultFromIntent(data)
              val result = oneTapUtils.authorizationResultToJsMap(authorizationResult)
              requestAuthorizationPromiseWrapper.resolve(result)
            } catch (e: Exception) {
              requestAuthorizationPromiseWrapper.reject(e)
            }
          }

          Activity.RESULT_CANCELED -> {
            requestAuthorizationPromiseWrapper.resolve(oneTapUtils.getCanceledResult())
          }

          else -> {
            requestAuthorizationPromiseWrapper.reject("Failed to add scopes.")
          }
        }
      }
    }

  init {
    reactContext.addActivityEventListener(activityEventListener)
  }

  override fun invalidate() {
    reactApplicationContext.removeActivityEventListener(activityEventListener)
    super.invalidate()
  }

  val activity: Activity?
    get() = reactApplicationContext.currentActivity

  override fun explicitSignIn(params: ReadableMap, promise: Promise) {
    val explicitRequest = oneTapUtils.buildExplicitOneTapSignInRequest(params)
    signInInternal(explicitRequest, promise)
  }

  override fun signIn(params: ReadableMap, promise: Promise) {
    val googleIdOption = oneTapUtils.buildOneTapSignInRequest(params)
    signInInternal(googleIdOption, promise)
  }

  private fun signInInternal(credentialOption: CredentialOption, promise: Promise) {
    val activity = activity ?: run {
      RNGoogleSigninModule.rejectWithNullActivity(promise)
      return
    }
    warnIfCheckPlayServicesPresenceNotCalled()

    val request: GetCredentialRequest = GetCredentialRequest.Builder()
      .addCredentialOption(credentialOption)
      .build()

    // note that `signInInternal` itself won't run on the main thread
    CoroutineScope(Dispatchers.Main.immediate).launch {
      try {
        val result = credentialManager.getCredential(
          request = request,
          context = activity,
        )
        handleSignInSuccess(result, promise)
      } catch (e: GetCredentialException) {
        handleSignInError(e, promise)
      }
    }
  }

  private fun handleSignInError(e: GetCredentialException, promise: Promise) {
    when (e) {
      is GetCredentialCancellationException -> {
        promise.resolve(oneTapUtils.getCanceledResult())
      }

      is NoCredentialException -> {
        if (e.type == android.credentials.GetCredentialException.TYPE_NO_CREDENTIAL) {
          val lowercasedMessage = e.message?.lowercase()
          if (lowercasedMessage?.contains("too many canceled sign-in prompts") == true) {
            promise.reject(ONE_TAP_START_FAILED, e.message, e)
          } else if (lowercasedMessage?.contains("developer console is not set up correctly") == true) {
            promise.reject(CommonStatusCodes.DEVELOPER_ERROR.toString(), "DEVELOPER_ERROR: Follow troubleshooting instructions at https://react-native-google-signin.github.io/docs/troubleshooting . " + e.message, e)
          } else {
            promise.resolve(oneTapUtils.getNoSavedCredentialsResult())
          }
        } else {
          promise.reject(e.type, e.message, e)
        }
      }

      is GetCredentialProviderConfigurationException -> {
        promise.reject(RNGoogleSigninModule.PLAY_SERVICES_NOT_AVAILABLE, "${e.type}: ${e.message}", e)
      }

      else -> {
        promise.reject(e.type, e.message, e)
      }
    }
  }

  private fun handleSignInSuccess(result: GetCredentialResponse, promise: Promise) {
    val credential = result.credential

    when (credential) {
      is CustomCredential -> {
        if (credential.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
          try {
            val googleIdTokenCredential = GoogleIdTokenCredential
              .createFrom(credential.data)
            val userParams = oneTapUtils.getUserProperties(googleIdTokenCredential)
            promise.resolve(userParams)
          } catch (e: Exception) {
            promise.reject(NAME, e)
          }
        } else {
          promise.reject(NAME, "Unexpected type of custom credential: ${credential.type}")
        }
      }

      else -> {
        promise.reject(NAME, "Unexpected type of credential: ${credential.type}")
      }
    }
  }

  override fun requestAuthorization(params: ReadableMap, promise: Promise) {
    val activity = activity ?: run {
      RNGoogleSigninModule.rejectWithNullActivity(promise)
      return
    }
    warnIfCheckPlayServicesPresenceNotCalled()
    // com.google.android.gms.common.Scopes can be used to get predefined scopes

    val authorizationRequest = oneTapUtils.buildAuthorizationRequest(params)

    Identity.getAuthorizationClient(activity)
      .authorize(authorizationRequest)
      .addOnSuccessListener { authorizationResult ->
        if (authorizationResult.hasResolution()) {
          try {
            // Access needs to be granted by the user
            val pendingIntent: PendingIntent = authorizationResult.pendingIntent!!
            requestAuthorizationPromiseWrapper.setPromiseWithInProgressCheck(promise, "requestAuthorization")
            startIntentSenderForResult(
              activity,
              pendingIntent.intentSender,
              REQUEST_AUTHORIZE, null, 0, 0, 0, null
            )
          } catch (e: SendIntentException) {
            promise.reject("requestAuthorization", "Couldn't start Authorization UI: " + e.localizedMessage, e)
          }
        } else {
          // result is available immediately
          val ret = oneTapUtils.authorizationResultToJsMap(authorizationResult)
          promise.resolve(ret)
        }
      }
      .addOnCanceledListener { promise.resolve(oneTapUtils.getCanceledResult()) }
      .addOnFailureListener { e ->
        promise.reject("requestAuthorization", e)
      }
  }

  override fun checkPlayServices(showErrorResolutionDialog: Boolean, promise: Promise) {
    val activity = activity ?: run {
      RNGoogleSigninModule.rejectWithNullActivity(promise)
      return
    }

    val googleApiAvailability = GoogleApiAvailability.getInstance()
    val status = googleApiAvailability.isGooglePlayServicesAvailable(activity)
    didCheckPlayServicesPresence = true

    val result = Arguments.createMap().apply {
      // Google Play services client library version (declared in library's AndroidManifest.xml android:versionCode).
      putInt("minRequiredVersion", GoogleApiAvailability.GOOGLE_PLAY_SERVICES_VERSION_CODE)
      // putLong doesn't work for some reason
      putDouble(
        "installedVersion",
        (oneTapUtils.installedGooglePlayServicesVersion() ?: -1L).toDouble()
      )
    }
    if (status == ConnectionResult.SUCCESS) {
      promise.resolve(result)
    } else {
      val isUserResolvableError = googleApiAvailability.isUserResolvableError(status)
      if (showErrorResolutionDialog && isUserResolvableError) {
        UiThreadUtil.runOnUiThread {
          googleApiAvailability.getErrorDialog(
            activity,
            status,
            REQUEST_PLAY_SERVICES
          )?.show()
        }
      }
      // SERVICE_MISSING, SERVICE_UPDATING, SERVICE_VERSION_UPDATE_REQUIRED, SERVICE_DISABLED, SERVICE_INVALID
      val errorString = googleApiAvailability.getErrorString(status)
      result.putBoolean("isUserResolvableError", isUserResolvableError)
      result.putString("errorDescription", errorString)
      promise.reject(
        RNGoogleSigninModule.PLAY_SERVICES_NOT_AVAILABLE,
        errorString,
        result
      )
    }
  }

  override fun signOut(promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        credentialManager.clearCredentialState(ClearCredentialStateRequest())
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("signOut", e)
      }
    }
  }

  override fun revokeAccess(promise: Promise) {
    // implemented in JS for now
  }

  private fun warnIfCheckPlayServicesPresenceNotCalled() {
    if (!didCheckPlayServicesPresence) {
      RNLog.w(
        reactApplicationContext,
"""${NAME}: Call `checkPlayServices()` before using Sign-In features.
This verifies that Google Sign-In is supported on the user's device.

Example:
await GoogleOneTapSignIn.checkPlayServices()
"""
      )
    }
  }

  companion object {
    const val ONE_TAP_START_FAILED = "ONE_TAP_START_FAILED"
    const val REQUEST_AUTHORIZE = 9002
    const val REQUEST_PLAY_SERVICES = 9003
  }
}
