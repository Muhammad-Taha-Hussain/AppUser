import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";

// Create the Auth Context
const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  signUp: async () => {},
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on initial load
  useEffect(() => {
    // const checkSession = async () => {
    //   const {
    //     data: { session },
    //   } = await supabase.auth.getSession();
    //   const currentUser = session?.user || null;
    //   setUser(currentUser);

    //   if (currentUser) {
    //     await ensureUserInCustomersTable(currentUser, '');
    //     fetchUserProfile(currentUser.id);
    //   }

    //   setLoading(false);
    // };

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
  
        const currentUser = session?.user || null;
        setUser(currentUser);
  
        if (currentUser) {
          await ensureUserInCustomersTable(currentUser, '');
          await fetchUserProfile(currentUser.id);
        } else {
          setProfile(null); // Ensure profile is null when no session exists
        }
      } catch (error) {
        console.error("Error during session check:", error);
        setProfile(null);
      } finally {
        setLoading(false); // Ensure loading is set to false in all cases
      }
    };
    checkSession();

    // Listen for changes in auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          await ensureUserInCustomersTable(currentUser, '');
          fetchUserProfile(currentUser.id);
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Ensure user exists in the customers table
  const ensureUserInCustomersTable = async (currentUser, userName) => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("customerid")
        .eq("customerid", currentUser.id)
        .single();
      console.log("current user", currentUser);

      if (!data) {
        // User doesn't exist, insert them
        const { error: insertError } = await supabase.from("customers").insert({
          customerid: currentUser.id,
          email: currentUser.email,
          name: userName,
        });

        if (insertError) {
          console.error("Error inserting user into customers table:", insertError);
        }
      }
    } catch (error) {
      console.error("Error ensuring user in customers table:", error);
    }
  };

  // Fetch user profile data
  // const fetchUserProfile = async (userId) => {
  //   const { data, error } = await supabase
  //     .from("customers")
  //     .select("*")
  //     .eq("customerid", userId)
  //     .single();

  //   if (error) {
  //     console.error("Error fetching profile:", error);
  //   } else {
  //     setProfile(data);
  //   }
  // };
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("customerid", userId)
        .single();
  
      if (error || !data) {
        console.warn("Profile fetch failed or no data found:", error);
        setProfile(null); // Set profile to null if fetch fails
      } else {
        setProfile(data); // Update profile with the fetched data
      }
    } catch (err) {
      console.error("Unexpected error during profile fetch:", err);
      setProfile(null);
    }
  };
  
  

  // Sign Up Function
  const signUp = async (email, password, userName) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      const newUser = authData?.user;
      if (newUser) {
        await ensureUserInCustomersTable(newUser, userName);
        console.log("Sign up successful and user added to customers table!");
      }
    } catch (error) {
      console.error("Sign Up Error:", error);
      throw error;
    }
  };

  // Login Function
  const login = async (email, password) => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const currentUser = authData?.user;
      if (currentUser) {
        await ensureUserInCustomersTable(currentUser);
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      throw error;
    }
  };

  // Logout Function
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.replace("/(auth)");
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signUp, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};



// import React, {
//   createContext,
//   PropsWithChildren,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { supabase } from "../lib/supabase";
// import { router } from "expo-router";

// // Create the Auth Context
// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }: PropsWithChildren) => {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check session on initial load
//   useEffect(() => {
//     const checkSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();
//       const currentUser = session?.user || null;
//       setUser(currentUser);

//       if (currentUser) {
//         await ensureUserInCustomersTable(currentUser, '');
//         fetchUserProfile(currentUser.id);
//       }

//       setLoading(false);
//     };

//     checkSession();

//     // Listen for changes in auth state
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         const currentUser = session?.user || null;
//         setUser(currentUser);

//         if (currentUser) {
//           await ensureUserInCustomersTable(currentUser, '');
//           fetchUserProfile(currentUser.id);
//         }
//       }
//     );

//     return () => authListener.subscription.unsubscribe();
//   }, []);

//   // Ensure user exists in the customers table
//   const ensureUserInCustomersTable = async (currentUser, userName) => {
//     try {
//       const { data, error } = await supabase
//         .from("customers")
//         .select("customerid")
//         .eq("customerid", currentUser.id)
//         .single();
//         console.log("current usr", currentUser);
        

//       if (!data) {
//         // User doesn't exist, insert them
//         const { error: insertError } = await supabase.from("customers").insert({
//           customerid: currentUser.id,
//           email: currentUser.email,
//           // name: currentUser.user_metadata?.name || "New User", // Optional name handling
//           name: userName,
//         });

//         if (insertError) {
//           console.error("Error inserting user into customers table:", insertError);
//         }
//       }
//     } catch (error) {
//       console.error("Error ensuring user in customers table:", error);
//     }
//   };

//   // Fetch user profile data
//   const fetchUserProfile = async (userId) => {
//     const { data, error } = await supabase
//       .from("customers")
//       .select("*")
//       .eq("customerid", userId)
//       .single();

//     if (error) {
//       console.error("Error fetching profile:", error);
//     } else {
//       setProfile(data);
//     }
//   };

//   // Sign Up Function
//   const signUp = async (email, password, userName) => {
//     try {
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email,
//         password,
//       });

//       if (authError) throw authError;

//       const newUser = authData?.user;
//       if (newUser) {
//         await ensureUserInCustomersTable(newUser, userName);
//         console.log("Sign up successful and user added to customers table!");
//       }
//     } catch (error) {
//       console.error("Sign Up Error:", error);
//       throw error;
//     }
//   };

//   // Login Function
//   const login = async (email, password) => {
//     try {
//       const { data: authData, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       const currentUser = authData?.user;
//       if (currentUser) {
//         await ensureUserInCustomersTable(currentUser);
//       }
//     } catch (error) {
//       console.error("Login Error:", error.message);
//       throw error;
//     }
//   };

//   // Logout Function
//   const logout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     setProfile(null);
//     router.replace("/(auth)");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, profile, loading, signUp, login, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };
