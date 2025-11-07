"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Scheme_1 = require("@expo/config-plugins/build/ios/Scheme");
const config_plugins_1 = require("expo/config-plugins");
const utils_1 = require("./utils");
const pkg = (() => {
    try {
        return require('@react-native-google-signin/google-signin/package.json');
    }
    catch (e) {
        // local development: for RNTA config plugin
        return require('../../package.json');
    }
})();
const withGoogleSignInNoFirebase = (config, options) => {
    (0, utils_1.validateUrlScheme)(options?.iosUrlScheme);
    return (0, config_plugins_1.withPlugins)(config, [
        // iOS
        (cfg) => withUrlScheme(cfg, options),
        (cfg) => withGIDClientID(cfg, options),
    ]);
};
const withUrlScheme = (config, options) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        config.modResults = (0, Scheme_1.appendScheme)(options.iosUrlScheme, config.modResults);
        return config;
    });
};
const iOSClientIdEntryName = 'GIDClientID';
const withGIDClientID = (config, options) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        const urlScheme = (() => {
            if (options) {
                return options.iosUrlScheme;
            }
            else {
                return config_plugins_1.IOSConfig.Google.getGoogleSignInReversedClientId(config, config.modRequest);
            }
        })();
        const clientId = (0, utils_1.reverseUrlScheme)(urlScheme);
        const infoPlist = config.modResults;
        if (infoPlist[iOSClientIdEntryName] === clientId) {
            return config;
        }
        else if (infoPlist[iOSClientIdEntryName] &&
            infoPlist[iOSClientIdEntryName] !== clientId) {
            throw new Error(`Cannot set the Google Sign-In client ID because there was already a conflicting value set: ${infoPlist[iOSClientIdEntryName]}`);
        }
        config.modResults = {
            ...infoPlist,
            [iOSClientIdEntryName]: clientId,
        };
        return config;
    });
};
/**
 * Apply google-signin configuration for Expo SDK 47+ projects. This plugin reads information from the Firebase config file.
 */
const withGoogleSignInAndFirebase = (config) => {
    return (0, config_plugins_1.withPlugins)(config, [
        // Android
        config_plugins_1.AndroidConfig.GoogleServices.withClassPath,
        config_plugins_1.AndroidConfig.GoogleServices.withApplyPlugin,
        config_plugins_1.AndroidConfig.GoogleServices.withGoogleServicesFile,
        // iOS
        config_plugins_1.IOSConfig.Google.withGoogle,
        config_plugins_1.IOSConfig.Google.withGoogleServicesFile,
        withGIDClientID,
    ]);
};
const withGoogleSignInRoot = (config, options) => {
    return options?.iosUrlScheme
        ? withGoogleSignInNoFirebase(config, options)
        : withGoogleSignInAndFirebase(config);
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withGoogleSignInRoot, pkg.name, pkg.version);
