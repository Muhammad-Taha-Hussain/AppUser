import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";

export const usePaginatedRestaurants = () => {
  return useInfiniteQuery({
    queryKey: ["restaurants"],
    queryFn: async ({ pageParam = 0 }: any) => {
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
// itemid, itemdescription, baseprice, discount, availablestatus, rating

//It is to showing the Restaurnts Items
export const usePaginatedProducts = (restaurantId: string) => {
  return useInfiniteQuery({
    queryKey: ['products', restaurantId],
    queryFn: async ({ pageParam = 0 }: any) => {
      const ITEMS_PER_PAGE = 5;
      const start = pageParam * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('restaurantitems')
        .select('*')
        .eq('restaurantid', restaurantId)
        .range(start, end);

      if (error) throw new Error(`Supabase Query Error: ${error.message}`);

      return {
        data,
        nextPage: data.length === ITEMS_PER_PAGE ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage: any) => lastPage.nextPage,
  });
};

//It is to showing the Restaurnts Items in detail with the Customization
export const useProductsDetail = (itemId: string) => {
  return useQuery({
    queryKey: ['customizationProduct', itemId],
    queryFn: async () => {

      const { data, error } = await supabase
        .from('customizationItems')
        .select('*')
        .eq('itemId', itemId)
        .order('desc')

      if (error) throw new Error(`Supabase Query Error: ${error.message}`);
      return data;
    },
  });
};

//It is to showing the Restaurants Deals
export const usePaginatedDeals = (restaurantId: string) => {
  return useInfiniteQuery({
    queryKey: ['deals', restaurantId],
    queryFn: async ({ pageParam = 0 }: any) => {
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
// itemid, restaurantid, itemname, itemdescription, baseprice, discount, availablestatus, rating, itemsImage
export const useShowItems = (itemId: string) => {
  return useQuery({
    queryKey: ['itemList', itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurantitems')
        .select('*')
        .eq('itemid', itemId)
        .single(); // Filter by deal ID

      if (error) {
        console.error('Supabase Query Error:', error.message);
        throw new Error(`Supabase Query Error: ${error.message}`);
      }

      console.log('Fetched Data:', data);
      return data || []; // Ensure data is an array
    },
    enabled: !!itemId, // Only run the query if itemId exists
  });
};

export const useShowItemWithCustomizations = (itemId: string) => {
  return useQuery({
    queryKey: ['itemDetails', itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurantitems')
        .select(`
          *,
          customizationitems(
            *,
            customizationitemsvalue(*)
          )
        `)
        .eq('itemid', itemId)
        .single();

      if (error) {
        console.error('Supabase Query Error:', error.message);
        throw new Error(`Supabase Query Error: ${error.message}`);
      }

      return data; // Ensure data includes all nested relationships
    },
    enabled: !!itemId, // Query runs only if itemId is provided
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
