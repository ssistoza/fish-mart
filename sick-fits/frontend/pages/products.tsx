import { gql } from '@apollo/client';
import Products from '../components/Products';
import Pagination from '../components/Pagination';

export default function ProductPage() {
  return (
    <>
      <Pagination page={4} />
      <Products />
      <Pagination page={1} />
    </>
  );
}
