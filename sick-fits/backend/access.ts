// At it's simplest, the access contorl returns a boolean depending on the users session

import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}
