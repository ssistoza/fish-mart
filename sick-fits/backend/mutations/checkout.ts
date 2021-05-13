/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';

const grapqhl = String.raw;

export default async function checkout(
  root: any,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Make sure they are signed in.
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must be signed in to create an order');
  }

  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: grapqhl`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id 
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `,
  });

  // 2. Calculate the total price for their order.
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(
    (tally: number, cartItem: CartItemCreateInput) =>
      // @ts-ignore
      tally + cartItem.quantity * cartItem.product.price,
    0
  );

  // 3. Create the charge with stripe library.
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });
  // 4. Convert the cartItems to OrderItems.
  // 5. Create the order and return it
}
