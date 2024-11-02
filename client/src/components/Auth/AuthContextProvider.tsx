import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/firebase";

const AuthContext = React.createContext<AuthContextType>({
  currentUser: null,
  userLoggedIn: false,
});

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user: User | null) {
    if (user) {
      const token = await user.getIdToken(true);
      setCurrentUser({ ...user, ID_TOKEN: token });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
  }

  const value = {
    currentUser,
    userLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

type ExtendedUser = User & {
  ID_TOKEN: string;
};

type AuthContextType = {
  currentUser: ExtendedUser | null;
  userLoggedIn: boolean;
};

export const useAuth = () => useContext(AuthContext);
