/*
 * Copyright (c) 2025 Xplat-soft s.r.o.
 *
 * This source code is licensed under the terms found in the
 * LICENSE.md file in the root directory of this source tree
 * or at https://universal-sign-in.com/license
 */

/**
 * Only needed for web
 * */
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { OneTapUser } from './types';

type JwtContents = {
  name: string | null;
  given_name: string | null;
  family_name: string | null;
  picture: string | null;
  email: string;
};
export function extractUser(idToken: string): OneTapUser['user'] {
  const parsed = jwtDecode<JwtPayload & JwtContents>(idToken);
  const name = parsed.name;
  const givenName = parsed.given_name;
  const familyName = parsed.family_name;
  const photo = parsed.picture;
  const email = parsed.email;
  const subject = getSubject(parsed, email);
  return {
    id: subject,
    name,
    email,
    givenName,
    familyName,
    photo,
    phoneNumber: null,
  };
}

function getSubject(
  parsed: JwtPayload,
  // userName (not the factual name, but "nickname") may be returned by one tap on android
  emailOrUsername: string,
): string {
  if (parsed.sub) {
    return parsed.sub;
  }
  return emailOrUsername;
}
