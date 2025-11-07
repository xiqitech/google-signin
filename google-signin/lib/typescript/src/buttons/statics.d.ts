import type { TextStyle, ViewProps, StyleProp } from 'react-native';
export declare const Color: {
    readonly Dark: "dark";
    readonly Light: "light";
};
/**
 * @group React Components
 * */
export type GoogleSigninButtonProps = ViewProps & {
    size?: number;
    color?: 'dark' | 'light';
    disabled?: boolean;
    onPress?: () => void;
};
/**
 * @group React Components
 * */
export type GoogleLogoButtonProps = {
    theme?: 'light' | 'dark' | 'neutral';
    variant?: 'standard' | 'icon';
    shape?: 'rectangular' | 'circular';
    /**
     * Style for the button text. Provide the Roboto font family with a weight of 500.
     * */
    textStyle?: StyleProp<TextStyle> | undefined;
    label?: string | undefined;
};
//# sourceMappingURL=statics.d.ts.map