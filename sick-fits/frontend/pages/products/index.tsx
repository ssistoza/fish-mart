import Products from '../../components/Products';
import Pagination from '../../components/Pagination';
import { useRouter } from 'next/router';

export default function ProductPage() {
  const {
    query: { page },
  } = useRouter();

  return (
    <>
      <Pagination page={page ? parseInt(page as string) : 1} />
      <Products />
      <Pagination page={page ? parseInt(page as string) : 1} />
    </>
  );
}
