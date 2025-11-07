"use strict";
/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLogoButton = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const useColorSchemeCompat_1 = require("./useColorSchemeCompat");
const BUTTON_HEIGHT = react_native_1.Platform.OS === 'ios' ? 44 : 40;
const BUTTON_ICON_SIZE = 20;
/**
 * Sign in button that follows the [Google branding guidelines](https://developers.google.com/identity/branding-guidelines).
 *
 * @group React Components
 * */
const GoogleLogoButton = ({ variant = 'standard', shape = 'rectangular', label = 'Sign in', theme, style, textStyle, ...otherProps }) => {
    const colorScheme = (0, useColorSchemeCompat_1.useColorSchemeCompat)();
    const usedTheme = theme || colorScheme || 'light';
    const googleStyles = GOOGLE_COLORS[usedTheme];
    const showText = variant === 'standard';
    return (react_1.default.createElement(react_native_1.Pressable, { accessibilityRole: "button", accessibilityLabel: label, style: (param) => {
            const { pressed } = param;
            const providedStyle = typeof style === 'function' ? style(param) : style;
            const backgroundColor = pressed
                ? googleStyles.pressed
                : googleStyles.background;
            const borderRadius = shape === 'circular' ? styles.circularRadius : styles.regularRadius;
            return [
                styles.button,
                backgroundColor,
                googleStyles.border,
                styles.height,
                borderRadius,
                {
                    borderWidth: theme === 'neutral' ? 0 : 1,
                    width: variant === 'icon' ? BUTTON_HEIGHT : undefined,
                },
                providedStyle,
            ];
        }, ...otherProps },
        react_1.default.createElement(react_native_1.View, { style: styles.innerRow },
            react_1.default.createElement(react_native_1.Image, { source: require('./assets/logo.png'), style: styles.image, accessibilityIgnoresInvertColors: true, accessible: false }),
            showText && (react_1.default.createElement(react_native_1.Text, { style: [styles.text, googleStyles.text, textStyle], numberOfLines: 1, ellipsizeMode: "tail" }, label)))));
};
exports.GoogleLogoButton = GoogleLogoButton;
const GOOGLE_COLORS = {
    light: {
        background: { backgroundColor: '#FFFFFF' },
        border: { borderColor: '#747775' },
        text: { color: '#1F1F1F' },
        pressed: { backgroundColor: '#F6F9FE' },
    },
    dark: {
        background: { backgroundColor: '#131314' },
        border: { borderColor: '#8E918F' },
        text: { color: '#E3E3E3' },
        pressed: { backgroundColor: '#222427' },
    },
    neutral: {
        background: { backgroundColor: '#F2F2F2' },
        border: { borderColor: 'transparent' },
        text: { color: '#1F1F1F' },
        pressed: { backgroundColor: '#E8EAED' },
    },
};
const styles = react_native_1.StyleSheet.create({
    regularRadius: { borderRadius: 4 },
    circularRadius: { borderRadius: BUTTON_HEIGHT / 2 },
    image: { width: BUTTON_ICON_SIZE, height: BUTTON_ICON_SIZE },
    height: { height: BUTTON_HEIGHT },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 0,
        paddingHorizontal: react_native_1.Platform.OS === 'ios' ? 16 : 12,
        alignSelf: 'flex-start',
    },
    innerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.1,
        marginLeft: react_native_1.Platform.OS === 'ios' ? 12 : 10,
    },
});
