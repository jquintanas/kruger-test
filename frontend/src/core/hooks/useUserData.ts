// /context/useUser.ts
import { useContext } from 'react';
import { UserContext } from '../context/userData/context';


export const useUserData = () => useContext(UserContext);
