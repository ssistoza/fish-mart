import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, StripeError } from '@stripe/stripe-js';
import { useState } from 'react';
import nProgress from 'nprogress';
import styled from 'styled-components';
import SickButton from './styles/SickButton';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export function ChecktoutForm() {
  const [error, setError] = useState<StripeError>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, { error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (evt) => {
    // 1. Stopd the form from submitting and turn loader on.
    evt.preventDefault();
    setLoading(true);
    // 2. Start the page transition.
    nProgress.start();
    // 3. Create the payment method via stripe. (Toke comes back here if successful)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    // 4. Handle any errors from stripe
    if (error) {
      setError(error);
      nProgress.done();
      return;
    }
    // 5. Send the token from step to our keystone server, through a custom mutation.
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });

    // 6. Change the page to view the order.
    router.push({
      pathname: '/order/[id]',
      query: { id: order.data.checkout.id },
    });

    // 7. Close the cart
    closeCart();
    // 8. Turn loader off.
    setLoading(false);
    nProgress.done();
  };

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>error.message</p>}
      {graphQLError && <p style={{ fontSize: 12 }}>graphQLError.message</p>}
      <CardElement />
      <SickButton>Checkout Now</SickButton>
    </CheckoutFormStyles>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <ChecktoutForm />
    </Elements>
  );
}
