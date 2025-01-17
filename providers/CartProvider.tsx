import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase"; // Ensure Supabase is properly configured
import { useAuth } from "./AuthProviders";

type CartType = {
  carts: any[];
  items: any[];
  addItem: (
    product: any,
    quantity: number,
    restaurantId: string
  ) => Promise<void>;
  updateQuantity: (itemId: string, amount: -1 | 1) => Promise<void>;
  fetchCarts: () => Promise<void>;
  fetchCartItems: (cartId: string) => Promise<void>;
  total: number;
  loading: boolean;
};

const CartContext = createContext<CartType>({
  carts: [],
  items: [],
  addItem: async () => {},
  updateQuantity: async () => {},
  fetchCarts: async () => {},
  fetchCartItems: async () => {},
  total: 0,
  loading: true,
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [carts, setCarts] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [currentCartId, setCurrentCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { user, profile } = useAuth();
  console.log("\nProfile", profile);

  const router = useRouter();

  // Fetch all carts for the user
  const fetchCarts = async () => {
    try {
      // const { data, error } = await supabase
      //   .from("carts")
      //   .select("*")
      //   .eq("customerid", profile.customerid);

      if(!profile) return;

      const { data, error } = await supabase
        .from("carts")
        .select("*, cartitems(*, restaurantitems(*)), restaurants(*)")
        .eq("customerid", profile.customerid);

      if (error) throw error;

      // Log fetched data for debugging
      console.log("Fetched Cart Data:", data);

      setCarts(data)
    } catch (error) {
      console.error("Error fetching carts:", error);
    } finally {
      // return carts;
      setLoading(false);
    }
  };

  // Fetch all cart items for a specific cart
  const fetchCartItems = async (cartId: string) => {
    try {
      const { data, error } = await supabase
        .from("cartitems")
        .select("*")
        .eq("cartid", cartId);

      if (error) throw error;

      setItems(data || []);
      setCurrentCartId(cartId);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const addItem = async (
    product: any,
    quantity: number,
    restaurantId: string
  ) => {
    try {
      // Check if the cart exists for the current customer and restaurant
      const { data: existingCart, error: cartFetchError } = await supabase
        .from("carts")
        .select()
        .eq("customerid", profile.customerid)
        .eq("restaurantid", restaurantId)
        .single();

      if (cartFetchError && cartFetchError.code !== "PGRST116")
        throw cartFetchError;

      let cartId = existingCart ? existingCart.cartid : null;

      console.log("cart exist or not", existingCart);

      // If no cart exists, create a new cart
      if (!cartId) {
        const { data: newCart, error: cartCreationError } = await supabase
          .from("carts")
          .insert({
            customerid: profile.customerid,
            restaurantid: restaurantId,
          })
          .select()
          .single();

        if (cartCreationError) {
          console.error("Error creating new cart:", cartCreationError);
          throw cartCreationError;
        }

        cartId = newCart.cartid;
        console.log("New cart created with ID:", cartId);

        // Update state with the new cart
        setCarts((prevCarts) => [...prevCarts, newCart]);
        setCurrentCartId(cartId);
      } else {
        // Use the existing cart ID
        cartId = existingCart.cartid;
        console.log("Using existing cart with ID:", cartId);
      }

      console.log("cart Id", cartId);

      // Check if the item already exists in the cart
      const { data: existingItem, error: itemFetchError } = await supabase
        .from("cartitems")
        .select()
        .eq("itemid", product.itemid)
        .eq("cartid", cartId)
        .single();

      if (itemFetchError && itemFetchError.code !== "PGRST116") {
        // 'PGRST116' indicates no rows found
        console.error("Error fetching item in cart:", itemFetchError);
        throw itemFetchError;
      }

      if (existingItem) {
        console.log("existing item in cart ", existingItem);

        // Update the quantity of the existing item
        const { error: updateError } = await supabase
          .from("cartitems")
          .update({
            quantity: existingItem.quantity + quantity,
            subtotal: existingItem.subtotal + quantity * product.baseprice,
          })
          .eq("cartitemid", existingItem.cartitemid);

        if (updateError) {
          console.error("Error updating item quantity:", updateError);
          throw updateError;
        }

        console.log("Item quantity updated successfully.");
        await fetchCartItems(cartId);
      } else {
        // Add a new item to the cart
        const { error: addError } = await supabase.from("cartitems").insert({
          cartid: cartId,
          itemid: product.itemid,
          quantity: quantity,
          subtotal: product.baseprice * quantity,
        });

        if (addError) {
          console.error("Error adding new item to cart:", addError);
          throw addError;
        }

        console.log("New item added to cart successfully.");
        await fetchCartItems(cartId);
      }

      // Update the total amount for the cart
      await updateCartTotal(cartId);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const updateCartTotal = async (cartId: string) => {
    try {
      // Fetch all cart items for the specific cart
      const { data: cartItems, error: fetchError } = await supabase
        .from("cartitems")
        .select("subtotal")
        .eq("cartid", cartId);

      if (fetchError) throw fetchError;

      // Calculate the new total
      const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

      // Update the total amount in the carts table
      const { error: updateError } = await supabase
        .from("carts")
        .update({ totalamount: total })
        .eq("cartid", cartId);

      if (updateError) throw updateError;

      console.log(`Cart total updated to: ${total}`);
    } catch (error) {
      console.error("Error updating cart total amount:", error);
    }
  };

  const updateQuantity = async (itemId: string, amount: -1 | 1) => {
    try {
      const item = items.find((item) => item.CartItemId === itemId);

      if (!item) return;

      const newQuantity = item.Quantity + amount;

      if (newQuantity <= 0) {
        // Remove the item if quantity is zero
        const { error: deleteError } = await supabase
          .from("CartItems")
          .delete()
          .eq("CartItemId", itemId);

        if (deleteError) throw deleteError;
      } else {
        // Update the quantity
        const { error: updateError } = await supabase
          .from("CartItems")
          .update({ Quantity: newQuantity })
          .eq("CartItemId", itemId);

        if (updateError) throw updateError;
      }

      if (currentCartId) await fetchCartItems(currentCartId);
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.SubTotal * item.Quantity,
    0
  );

  // checkout function

  useEffect(() => {
    // fetchCarts();
  }, []);

  return (
    <CartContext.Provider
      value={{
        carts,
        items,
        addItem,
        updateQuantity,
        fetchCarts,
        fetchCartItems,
        total,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export const useCart = () => useContext(CartContext);
