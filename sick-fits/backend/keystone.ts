import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { CartItem } from './schemas/CartItem';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import 'dotenv/config';
import { insertSeedData } from './seed-data';
import { sendPasswordResetemail } from './lib/mail';
import { extendGraphqlSchema } from './mutations/index';

const DEFAULT_DB_URL = 'mongodb://localhost/keystone-sick-fits-tutorial';
const databaseURL = process.env.DATABASE_URL || DEFAULT_DB_URL;

const sessionConfig = {
  maxAge: 60 * 60 * 60 * 24 * 360, // How long they stay signed in?
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO : Add in initial roles
  },
  passwordResetLink: {
    async sendToken(params) {
      await sendPasswordResetemail(params.token, params.identity);
    },
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      onConnect: async (keystone) => {
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
      // TODO: Add data seeding here.
    },
    lists: createSchema({
      // Schema items go in here.
      User,
      Product,
      ProductImage,
      CartItem,
      OrderItem,
      Order,
    }),
    extendGraphqlSchema,
    ui: {
      // TODO: Change this for roles
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      isAccessAllowed: ({ session }) => !!session?.data,
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: 'id name email',
    }),
  })
);
