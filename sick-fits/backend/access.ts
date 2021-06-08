// At it's simplest, the access contorl returns a boolean depending on the users session

import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

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

// Rule based functions
// Rules can return a boolean or a filter which limits items.
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // 1. Do they have the permission of canManageProducts
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // 2. If not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    return { status: 'AVAILABLE' };
  },
};
