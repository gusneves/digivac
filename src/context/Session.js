import React, { createContext, useState } from 'react';

import api from '../services/api';

export const SessionContext = createContext();

export default function SessionProvider({ children }) {
  const [isLoggedIn, setSession] = useState();

  async function signIn(email, password) {
    const response = await api.post('session', {
      email, 
      senha: password
    });

    const { _id } = response.data;

    setSession(_id);
  }

  return (
    <SessionContext.Provider value={{ isLoggedIn, signIn }}>
      {children}
    </SessionContext.Provider>
  );
}
