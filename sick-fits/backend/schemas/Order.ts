import { integer, relationship, text, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { schema } from '@keystone-next/types';
import { isSignedIn, rules } from '../access';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder.bind(this),
    update: () => false,
    delete: () => false,
  },
  fields: {
    label: virtual({
      field: schema.field({
        type: schema.String,
        resolve: (item) => `Cool ${formatMoney(item.total)}`,
      }),
    }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
});
