# Rules for the Auth0 JWT library
-keep class com.auth0.android.jwt.** { *; }
-keep interface com.auth0.android.jwt.** { *; }
-dontwarn com.auth0.android.jwt.**

# Gson uses generic type information stored in a class file when working with fields. Proguard removes such information by default, so configure it to keep all of it.
-keepattributes Signature
-keepattributes *Annotation*

# Gson specific classes
-keep class com.google.gson.** { *; }
-keep interface com.google.gson.** { *; }
-dontwarn com.google.gson.**