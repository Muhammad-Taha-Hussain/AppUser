import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";

export const usePaginatedRestaurants = () => {
  return useInfiniteQuery({
    queryKey: ["restaurants"],
    queryFn: async ({ pageParam = 0 }) => {
      const ITEMS_PER_PAGE = 5;
      const start = pageParam * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;
      const { data, error } = await supabase.from("restaurants").select("*").range(start, end);;
      if (error) {
        throw new Error(error.message);
      }
      return {
        data,
        nextPage: data.length === ITEMS_PER_PAGE ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const usePaginatedProducts = (restaurantId: string) => {
  return useInfiniteQuery({
    queryKey: ['products', restaurantId],
    queryFn: async ({ pageParam = 0 }) => {
      const ITEMS_PER_PAGE = 5;
      const start = pageParam * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('restaurantitems')
        .select('itemid, itemdescription, baseprice, discount, availablestatus, rating')
        .eq('restaurantid', restaurantId)
        .range(start, end);

      if (error) throw new Error(`Supabase Query Error: ${error.message}`);

      return {
        data,
        nextPage: data.length === ITEMS_PER_PAGE ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};

export const usePaginatedDeals = (restaurantId) => {
  return useInfiniteQuery({
    queryKey: ['deals', restaurantId],
    queryFn: async ({ pageParam = 0 }) => {
      const ITEMS_PER_PAGE = 5;
      const start = pageParam * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('restaurantdeals')
        .select('dealid, dealname, dealdescription, baseprice, discountpercentage, startdate, enddate, rating')
        .eq('restaurantid', restaurantId)
        .range(start, end);

      if (error) throw new Error(`Supabase Query Error: ${error.message}`);

      return {
        data: data || [], // Ensure data is an array
        nextPage: data.length === ITEMS_PER_PAGE ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};

export const useShowDealItems = (dealId: string) => {
  return useQuery({
    queryKey: ['dealList', dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('RestaurantDeals')
        .select(`
          DealId,
          DealName,
          DealDescription,
          BasePrice,
          DiscountPercentage,
          StartDate,
          EndDate,
          Rating,
          CreatedAt,
          UpdatedAt,
          DealItems (
            DealItemId,
            ItemId,
            RestaurantItems (
              ItemName,
              ItemDescription,
              Price,
              CreatedAt,
              UpdatedAt
            )
          )
        `)
        .eq('DealId', dealId); // Filter by deal ID

      if (error) {
        console.error('Supabase Query Error:', error.message);
        throw new Error(`Supabase Query Error: ${error.message}`);
      }

      console.log('Fetched Data:', data);
      return data || []; // Ensure data is an array
    },
    enabled: !!dealId, // Only run the query if dealId exists
  });
};

export const useShowItems = (itemId: string) => {
  return useQuery({
    queryKey: ['itemList', itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurantitems')
        .select('itemid, restaurantid, itemname, itemdescription, baseprice, discount, availablestatus, rating')
        .eq('itemid', itemId)
        .single(); // Filter by deal ID

      if (error) {
        console.error('Supabase Query Error:', error.message);
        throw new Error(`Supabase Query Error: ${error.message}`);
      }

      console.log('Fetched Data:', data);
      return data || []; // Ensure data is an array
    },
    enabled: !!itemId, // Only run the query if dealId exists
  });
};




// export const useInsertProduct = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     async mutationFn(data: any) {
//       const { error, data: newProduct } = await supabase
//         .from('products')
//         .insert({
//           name: data.name,
//           image: data.image,
//           price: data.price,
//         })
//         .single();

//       if (error) {
//         throw new Error(error.message);
//       }
//       return newProduct;
//     },
//     async onSuccess() {
//       await queryClient.invalidateQueries(['products']);
//     },
//   });
// };

// export const useUpdateProduct = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     async mutationFn(data: any) {
//       const { error, data: updatedProduct } = await supabase
//         .from('products')
//         .update({
//           name: data.name,
//           image: data.image,
//           price: data.price,
//         })
//         .eq('id', data.id)
//         .select()
//         .single();

//       if (error) {
//         throw new Error(error.message);
//       }
//       return updatedProduct;
//     },
//     async onSuccess(_, { id }) {
//       await queryClient.invalidateQueries(['products']);
//       await queryClient.invalidateQueries(['products', id]);
//     },
//   });
// };

// export const useDeleteProduct = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     async mutationFn(id: number) {
//       const { error } = await supabase.from('products').delete().eq('id', id);
//       if (error) {
//         throw new Error(error.message);
//       }
//     },
//     async onSuccess() {
//       await queryClient.invalidateQueries(['products']);
//     },
//   });
// };
