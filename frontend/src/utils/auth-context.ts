import { createContext } from "react";
import { DUser } from "../models/user";

export type AuthContextType = {
  user: DUser | undefined;
  setUser: (user: DUser | undefined) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setUser: () => {},
});
