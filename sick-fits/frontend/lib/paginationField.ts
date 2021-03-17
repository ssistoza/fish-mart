import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read: (existing = [], { args, cache }) => {
      const { skip, first } = args;

      // Read the number of items on the page from caches
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      if (items.length && items.length !== first && page === pages) {
        // If there are items and not enough items to satisfy how many were requested
        // and we are on the last page.
        return items;
      }
      if (items.length !== first) {
        // We don't have any items and must go to the network.
        return false;
      }

      if (items.length) {
        console.log(
          `There are ${items.length} item in the cache! Gonna send them to apollo`
        );
        return items;
      }
    },
    merge: (existing, incoming, { args }) => {
      const { skip, first } = args;
      // This runs when Apollo client comes back from the network with our products
      console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }

      return merged;
    },
  };
}
