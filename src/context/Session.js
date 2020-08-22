import React, { createContext, useState, useEffect } from 'react';
// import { AsyncStorage } from 'react-native';

import api from '../services/api';

export const SessionContext = createContext();

export default function SessionProvider({ children }) {
  const [isLoggedIn, setSession] = useState();

  // useEffect(() => {
  //   AsyncStorage.getItem('usuario').then(usuario => {
  //     setSession(usuario);
  //   });
  // }, []); -> Verifica se a sessão foi iniciada

  async function signIn(email, password) {
    const response = await api.post('session', {
        email, 
        senha: password
    });

    const { _id } = response.data;

    // AsyncStorage.setItem('usuario', _id);

    setSession(_id);
    console.log(response.data);
  }

  return (
    <SessionContext.Provider value={{ isLoggedIn, signIn }}>
      {children}
    </SessionContext.Provider>
  );
}
