import { auth } from "@/firebase/config";
import { getUserProfile, setUserStatus } from "@/services/userService";
import { UserProfile } from "@/utils/types";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);

          if (profile) {
            setUser(profile);
            await setUserStatus(firebaseUser.uid, "online");
          } else {
            setUser({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "",
              email: firebaseUser.email || "",
              role: "user",
              status: "online",
            });
          }
        } catch {
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            role: "user",
            status: "online",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextState: AppStateStatus) => {
      if (!user?.uid) return;

      if (nextState === "active") {
        await setUserStatus(user.uid, "online");
      }

      if (nextState === "background" || nextState === "inactive") {
        await setUserStatus(user.uid, "offline");
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscription.remove();
      if (user?.uid) {
        setUserStatus(user.uid, "offline").catch(() => null);
      }
    };
  }, [user]);

  return <AuthContext.Provider value={{ user, loading, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
