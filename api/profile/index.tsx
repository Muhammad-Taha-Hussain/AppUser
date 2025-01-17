import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define a type for customer update data
// interface CustomerUpdateData {
//   id: string;  // Assuming id is a string
//   name: string;
//   image: string;
// }


export const updateCustomerDetail = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (data: any) => {
        const { error, data: updatedCustomer } = await supabase
          .from('customers')
          .update({
            name: data.fullName,
            image: data.image,
          })
          .eq('customerid', data.id)
          .select()
          .single();
          
        if (error) {
          throw new Error(error.message);
        }

          console.log("Updated Customer kahan hai",updatedCustomer);
        
        return updatedCustomer;
      },
    //   async onSuccess(_, { id }) {
    //     await queryClient.invalidateQueries(['products']);
    //     await queryClient.invalidateQueries(['products', id]);
    //   },
    });
  };