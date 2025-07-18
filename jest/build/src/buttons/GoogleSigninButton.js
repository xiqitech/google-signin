"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSigninButton = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const NativeGoogleSignin_1 = require("../spec/NativeGoogleSignin");
const statics_1 = require("./statics");
const BaseButton_1 = require("./BaseButton");
const { BUTTON_SIZE_WIDE, BUTTON_SIZE_ICON, BUTTON_SIZE_STANDARD } = NativeGoogleSignin_1.NativeModule.getConstants();
/**
 * Native Google Sign-In button component. Prefer using the [`GoogleLogoButton`](#googlelogobutton) for a more customizable button.
 * @group React Components
 * */
const GoogleSigninButton = (props) => {
    const { onPress, style, color, size = BUTTON_SIZE_STANDARD, ...rest } = props;
    const activeColorScheme = (0, react_native_1.useColorScheme)();
    const usedColor = color ?? activeColorScheme ?? 'light';
    const recommendedSize = getSizeStyle(size);
    const stripOnPressParams = (0, react_1.useCallback)(() => {
        // this is to make sure that the onPress callback prop is called with no params
        // as the RNGoogleSigninButton onPress does pass some in here
        onPress?.();
    }, [onPress]);
    return (react_1.default.createElement(BaseButton_1.BaseButton, { ...rest, size: size, onPress: stripOnPressParams, color: usedColor, style: react_native_1.StyleSheet.compose(recommendedSize, style) }));
};
exports.GoogleSigninButton = GoogleSigninButton;
const nativeSizes = {
    Icon: BUTTON_SIZE_ICON,
    Standard: BUTTON_SIZE_STANDARD,
    Wide: BUTTON_SIZE_WIDE,
};
exports.GoogleSigninButton.Size = nativeSizes;
exports.GoogleSigninButton.Color = statics_1.Color;
function getSizeStyle(size) {
    switch (size) {
        case BUTTON_SIZE_ICON:
            return styles.iconSize;
        case BUTTON_SIZE_WIDE:
            return styles.wideSize;
        default:
            return styles.standardSize;
    }
}
// sizes according to https://developers.google.com/identity/sign-in/ios/reference/Classes/GIDSignInButton
const styles = react_native_1.StyleSheet.create({
    iconSize: {
        width: 48,
        height: 48,
    },
    standardSize: { width: 230, height: 48 },
    wideSize: { width: 312, height: 48 },
});
