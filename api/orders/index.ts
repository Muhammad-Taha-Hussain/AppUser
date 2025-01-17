import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProviders";
// import { InsertTables, Tables, UpdateTables } from '@/types';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

// export const useadminOrderList = ({ archieved = false }) => {
//   const statuses = archieved ? ['Delivered'] : ['New', 'Cooking', 'Delivering'];

//   return useQuery({
//     queryKey: ['orders', { archieved }],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('orders')
//         .select('*')
//         .in('status', statuses)
//         .order('created_at', { ascending: false });
//       if (error) {
//         throw new Error(error.message);
//       }
//       return data;
//     },
//   });
// };

export const useMyOrderList = () => {
  const { profile } = useAuth();
  const id = profile?.customerid;
  console.log("Customerid hai", id);

  return useQuery({
    queryKey: ["orders", { customerid: id }],
    queryFn: async () => {
      console.log("Customerid abhi bhi hai", id);

      if (!id) return null;
      // const { data, error } = await supabase
      //   .from('orders')
      //   .select('*')
      //   .eq('customerid', id)
      //   .order('created_at', { ascending: false });
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customerid", id);

      if (error) {
        throw new Error(error.message);
      }

      console.log("Data hai", data);

      return data;
    },
  });
};

export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      // const { data, error } = await supabase
      //   .from('orders')
      //   .select(`
      //     *,
      //     CartId (
      //       CartItems (
      //         *,
      //         ItemId (*),
      //         DealId (*)
      //       )
      //     )
      //   `)
      //   .eq('OrderId', orderId)
      //   .single();

      const { data, error } = await supabase
        .from("orders")
        .select(
          `*,
          cartid (
            *,
            cartitems (
                *
            )
          )`
        )
        .eq("orderid", orderId);

      if (error) {
        throw new Error(error.message);
      }

      console.log("cart Data hai", data);

      const cartItems = data[0]?.cartid[0]?.cart_items[0] || [];
      console.log('cart items hain ye ',cartItems);
      

      return data;
    },
  });
};

// export const useInsertOrder = () => {
//   const queryClient = useQueryClient();
//   const { profile } = useAuth();
//   const id = profile?.customerid;

//   return useMutation({
//     async mutationFn(data: any) {
//       const { error, data: newProduct } = await supabase
//         .from('orders')
//         .insert({ ...data, user_id: userId })
//         .select()
//         .single();

//       if (error) {
//         throw new Error(error.message);
//       }
//       return newProduct;
//     },
//     // async onSuccess() {
//     //   await queryClient.invalidateQueries(['orders']);
//     // },
//   });
// };

// export const useUpdateOrder = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     async mutationFn({
//       id,
//       updatedFields,
//     }: {
//       id: number;
//       updatedFields: any;
//     }) {
//       const { error, data: updatedOrder } = await supabase
//         .from('orders')
//         .update(updatedFields)
//         .eq('id', id)
//         .select()
//         .single();

//       if (error) {
//         throw new Error(error.message);
//       }
//       return updatedOrder;
//     },
//     // async onSuccess(_, { id }) {
//     //   await queryClient.invalidateQueries(['orders']);
//     //   await queryClient.invalidateQueries(['orders', id]);
//     // },
//   });
// };
