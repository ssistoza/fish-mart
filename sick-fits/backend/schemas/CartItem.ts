import { integer, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const CartItem = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder.bind(this),
    update: rules.canOrder.bind(this),
    delete: rules.canOrder.bind(this),
  },
  ui: {
    listView: {
      initialColumns: ['product', 'quantity', 'user'],
    },
  },
  fields: {
    // TODO:
    quantity: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    product: relationship({ ref: 'Product' }),
    user: relationship({ ref: 'User.cart' }),
  },
});
