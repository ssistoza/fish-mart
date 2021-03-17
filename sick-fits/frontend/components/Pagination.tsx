import { gql, useQuery } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import DisplayError from './ErrorMessage';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export default function Pagination({ page }) {
  const { data, loading, error } = useQuery(PAGINATION_QUERY);
  let count = data?._allProductsMeta?.count ?? 0;
  const pageCount = Math.ceil(count / perPage);

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick Fits - Page {page} of {pageCount}
        </title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        <a aria-disabled={page <= 1}>⬅️ Prev</a>
      </Link>
      <p>
        Page {page} of {pageCount}
      </p>
      <p>{count} Items Total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page >= pageCount}>Next ➡️</a>
      </Link>
    </PaginationStyles>
  );
}
