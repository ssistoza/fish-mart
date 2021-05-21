// At it's simplest, the access contorl returns a boolean depending on the users session

import { permissionsList } from './schemas/fields';
import { ListAccessArgs, Permission } from './types';

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

export const permissions = {
  ...generatedPermissions,
};
