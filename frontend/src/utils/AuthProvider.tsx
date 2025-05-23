import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { DUser } from "../models/user";
import * as userService from "../services/userService";
import * as authService from "../services/authService";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DUser>();

  useEffect(() => {
    const token = authService.getAccessToken();
    if (token) {
      userService.findMe().then(res => setUser(res.data)).catch(() => {
        setUser(undefined);
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
