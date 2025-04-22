import React, { createContext, useContext, useState } from 'react';
import { TypeUser } from '../../general/structure/Constant';
import { UserI } from '../../general/structure/Utils';


const UserContext = createContext<{
  user: UserI;
  setUser: (user: UserI) => void;
}>({
  user: {
    _id: undefined,
    email: '',
    emailFamily: '',
    type: TypeUser.STANDARD,
    emailUserCurrent: ''
  },
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserI>({
    _id: undefined,
    email: '',
    emailFamily: '',
    type: TypeUser.STANDARD,
    emailUserCurrent: ''
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
