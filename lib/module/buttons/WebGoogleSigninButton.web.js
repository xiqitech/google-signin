"use strict";
'use client';

/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */
import React, { useCallback, useEffect } from 'react';
import { createGoogleSdkNotFoundError } from "../errors/errorCodes.web.js";
import { emitter } from "../oneTap/emitter.web.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const WebGoogleSigninButton = /*#__PURE__*/React.memo(WebGoogleSigninButtonMemoed);
function WebGoogleSigninButtonMemoed({
  size = 'medium',
  onError,
  ...rest
}) {
  const buttonRef = React.useRef(null);
  const renderButton = useCallback(ref => {
    window.google.accounts.id.renderButton(ref, {
      ...rest,
      logo_alignment: rest.logoAlignment ?? 'left',
      size
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [size, JSON.stringify(rest)]);
  useEffect(() => {
    checkPrerequisite({
      onError
    });
    const ref = buttonRef.current;
    // @ts-expect-error
    const isInitialized = typeof window.__G_ID_CLIENT__ !== 'undefined';
    if (isInitialized && ref) {
      renderButton(ref);
      return;
    } else {
      return emitter.on('init', () => {
        buttonRef.current && renderButton(buttonRef.current);
      });
    }
  }, [onError, renderButton]);
  return /*#__PURE__*/_jsx("span", {
    ref: buttonRef,
    style: containerStyles[size]
  });
}
const containerStyles = {
  small: {
    height: 20
  },
  medium: {
    height: 32
  },
  large: {
    height: 40
  }
};
function checkPrerequisite({
  onError
}) {
  const {
    google
  } = window;
  if (!google) {
    onError && onError(createGoogleSdkNotFoundError());
    console.warn('WebGoogleSigninButton: Google Sign In SDK is not present. Did you forget to load it?');
  }
}
//# sourceMappingURL=WebGoogleSigninButton.web.js.map