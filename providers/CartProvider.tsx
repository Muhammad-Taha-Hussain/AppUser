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
  addItemToCart: (
    itemId: string,
    restaurantId: string,
    baseprice: number,
    quantity: number,
    customizations: any
  ) => Promise<void>;
  addItem: (
    product: any,
    quantity: number,
    restaurantId: string
  ) => Promise<void>;
  updateQuantity: (itemId: string, amount: -1 | 1) => Promise<void>;
  fetchCarts: () => Promise<void>;
  updateCartItems: (updatedItems: any[], cartId: number) => Promise<void>;
  fetchCartItems: (cartId: string) => Promise<void>;
  total: number;
  loading: boolean;
};

const CartContext = createContext<CartType>({
  carts: [],
  items: [],
  addItemToCart: async () => {},
  addItem: async () => {},
  updateQuantity: async () => {},
  fetchCarts: async () => {},
  updateCartItems: async () => {},
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

      if (!profile) return;

      const { data, error } = await supabase
        .from("carts")
        .select("*, cartitems(*, restaurantitems(*)), restaurants(*)")
        .eq("customerid", profile.customerid)
        .order("updatedat", { ascending: false }); // Order by 'created_at' descending;

      if (error) throw error;

      // Log fetched data for debugging
      console.log("Fetched Cart Data:", data);

      setCarts(data);
    } catch (error) {
      console.error("Error fetching carts:", error);
    } finally {
      // return carts;
      setLoading(false);
    }
  };


  const updateCartItems = async (updatedItems: any[], cartId: number) => {
    try {
      // Batch update all cart items with their new quantities and subtotals
      const { data, error } = await supabase
        .from("cartitems")
        .upsert(updatedItems); // Use upsert for updating multiple items
  
      if (error) {
        console.error("Error updating cart items:", error);
        return;
      }
  
      console.log("Updated cart items:", data);
  
      // Recalculate the total amount for the cart after updating cart items
      await updateCartTotalInCart(cartId);
    } catch (error) {
      console.error("Error in updateCartItems:", error);
    }
  };
  

  const updateCartTotalInCart = async (cartId: number) => {
    try {
      // Fetch updated cart items to recalculate the total amount
      const { data: cartItems, error } = await supabase
        .from("cartitems")
        .select(`
          quantity,
          subtotal,
          cartcustomizations(price)
        `)
        .eq("cartid", cartId);
  
      if (error) {
        console.error("Error fetching cart items for total calculation:", error);
        return;
      }
  
      if (!cartItems || cartItems.length === 0) {
        console.warn("No items found in the cart for total calculation.");
        return;
      }
  
      // Calculate the total amount by summing up all subtotals
      const totalAmount = cartItems.reduce((sum, item) => {
        const customizationPrices = item.customizations || [];
        const customizationTotal = customizationPrices.reduce((cSum, customization) => {
          return cSum + (customization.price || 0);
        }, 0);
  
        // Ensure subtotal includes both base price and customizations
        const calculatedSubtotal = (item.subtotal || 0) + customizationTotal * item.quantity;
        return sum + calculatedSubtotal;
      }, 0);
  
      // Update the total amount in the carts table
      const { data, error: updateError } = await supabase
        .from("carts")
        .update({ totalamount: totalAmount })
        .eq("cartid", cartId);
  
      if (updateError) {
        console.error("Error updating cart total amount:", updateError);
        return;
      }
  
      console.log("Updated cart total amount:", data);
  
      // Refetch the cart to reflect updated data in the UI
      fetchCarts();
    } catch (error) {
      console.error("Error in updateCartTotalInCart:", error);
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

  const addItemToCart = async (
    itemId: string,
    restaurantId: string,
    baseprice: number,
    quantity: number,
    customizations: any
  ) => {
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("cartid")
      .eq("customerid", profile.customerid)
      .eq("checkout", false)
      .eq("restaurantid", restaurantId)
      .single();

    let cartId;

    if (cartError || !cart) {
      // Create a new cart if none exists
      const { data: newCart, error: newCartError } = await supabase
        .from("carts")
        .insert({
          customerid: profile.customerid,
          restaurantid: restaurantId,
          totalamount: 0, // Initialize with 0, will be updated later
        })
        .select()
        .single();

      if (newCartError) {
        throw new Error("Unable to create a new cart.");
      }

      cartId = newCart.cartid;
    } else {
      cartId = cart.cartid;
    }

    // Check if the item with the same customizations already exists in the cart
    const { data: existingCartItem, error: existingCartItemError } =
      await supabase
        .from("cartitems")
        .select("cartitemid, quantity")
        .eq("cartid", cartId)
        .eq("itemid", itemId)
        .single();

    if (existingCartItemError && existingCartItemError.code !== "PGRST116") {
      throw new Error("Error checking existing cart items.");
    }

    if (existingCartItem) {
      // Check if the customizations match
      const { data: existingCustomizations, error: customizationFetchError } =
        await supabase
          .from("cartcustomizations")
          .select("customizationid, customizationvalueid")
          .eq("cartitemid", existingCartItem.cartitemid);

      if (customizationFetchError) {
        throw new Error("Error fetching existing customizations.");
      }

      const isSameCustomization = customizations.every((customization: any) => {
        return existingCustomizations.some(
          (existing) =>
            existing.customizationid === customization.customizationId &&
            existing.customizationvalueid === customization.customizationValueId
        );
      });

      if (isSameCustomization) {
        // Update quantity and subtotal for the existing cart item
        const newQuantity = existingCartItem.quantity + quantity;
        const totalCustomizationPrice = customizations.reduce(
          (sum, customization) => sum + customization.price,
          0
        );
        const newSubTotal = totalCustomizationPrice + newQuantity * baseprice;

        const { error: updateError } = await supabase
          .from("cartitems")
          .update({
            quantity: newQuantity,
            subtotal: newSubTotal,
          })
          .eq("cartitemid", existingCartItem.cartitemid);

        if (updateError) {
          throw new Error("Unable to update existing cart item.");
        }

        await updateCartTotal(cartId); // Update the cart's total amount

        return;
      }
    }

    // Add item to CartItems if it's a new item or has different customizations
    const { data: cartItem, error: cartItemError } = await supabase
      .from("cartitems")
      .insert({
        cartid: cartId,
        itemid: itemId,
        quantity: quantity,
        subtotal: 0, // Will calculate based on customizations
      })
      .select()
      .single();

    if (cartItemError) {
      throw new Error("Unable to add item to cart.");
    }

    const cartItemId = cartItem.cartitemid;

    // Add customizations to CartCustomizations
    const customizationData = customizations.map((customization) => ({
      cartitemid: cartItemId,
      customizationid: customization.customizationId,
      customizationvalueid: customization.customizationValueId,
      price: customization.price,
    }));

    const { error: customizationError } = await supabase
      .from("cartcustomizations")
      .insert(customizationData);

    if (customizationError) {
      throw new Error("Unable to save customizations.");
    }

    // Update SubTotal in CartItems
    const totalCustomizationPrice = customizations.reduce(
      (sum, customization) => sum + customization.price,
      0
    );
    const subTotal = totalCustomizationPrice + quantity * baseprice;

    const { error: subTotalError } = await supabase
      .from("cartitems")
      .update({ subtotal: subTotal })
      .eq("cartitemid", cartItemId);

    if (subTotalError) {
      throw new Error("Unable to update cart item subtotal.");
    }

    await updateCartTotal(cartId); // Update the cart's total amount
  };

  // Helper function to update the total amount in the cart
  const updateCartTotal = async (cartId: string) => {
    const { data: cartItems, error: cartItemsError } = await supabase
      .from("cartitems")
      .select("subtotal")
      .eq("cartid", cartId);

    if (cartItemsError) {
      throw new Error("Unable to fetch cart items.");
    }

    // Calculate the total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    const { error: totalAmountError } = await supabase
      .from("carts")
      .update({ totalamount: totalAmount })
      .eq("cartid", cartId);

    if (totalAmountError) {
      throw new Error("Unable to update cart total amount.");
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

    const CartSubscription = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "carts" },
        (payload) => {
          console.log("Change received!", payload);
        }
      )
      .subscribe();

      
const CartItemSubscription = supabase.channel('custom-all-channel')
.on(
  'postgres_changes',
  { event: '*', schema: 'public', table: 'cartitems' },
  (payload) => {
    console.log('Change received!', payload)
  }
)
.subscribe()

    return () => {
      CartSubscription.unsubscribe();
      CartItemSubscription.unsubscribe();
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        carts,
        items,
        addItem,
        addItemToCart,
        updateQuantity,
        fetchCarts,
        updateCartItems,
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
