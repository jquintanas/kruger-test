import { UserData } from "../interfaces/users.interface";

export type UserContextType = {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  isAuthenticated: boolean;
}