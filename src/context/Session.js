import React, { createContext, useState } from 'react';

import routes from '../../api/routes';

export const SessionContenxt = createContext();

export default function SessionProvider({ children }) {
  const [isLoggedIn, setSession] = useState();

  async function signIn(email, password) {
    const response = await routes.post('session', {
      email, password
    });

    const { _id } = response.data;

    setSession(_id);
  }

  return (
    <SessionContenxt.Provider value={{ isLoggedIn, signIn}}>
      {children}
    </SessionContenxt.Provider>
  );
}
