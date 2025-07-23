'use client';

import { UserData } from '@/core/interfaces/users.interface';
import { useMemo, useState } from 'react';
import { UserContext } from './context';


interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserData | null>(null);

  const value = useMemo(() => ({
    user,
    setUser,
    isAuthenticated: !!user,
  }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};