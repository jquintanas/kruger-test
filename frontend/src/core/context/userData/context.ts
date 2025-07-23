import { UserContextType } from '@/core/types/userData.type';
import { createContext } from 'react';


export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => { },
  isAuthenticated: false,
});