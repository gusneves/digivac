import React, { createContext, useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';

import api from '../services/api';

export const SessionContext = createContext();

export default function SessionProvider({ children }) {
  const [isLoggedIn, setSession] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      const storagedUser = await AsyncStorage.getItem('usuario'); 
      const storagedToken = await AsyncStorage.getItem('token');

      if (storagedUser && storagedToken) {
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;

        setSession(storagedUser);
      }

      setLoading(false);
    }

    loadStoragedData();
  }, []);

  async function signIn(email, password) {
    const response = await api.post('session', {
      email, 
      senha: password
    });

    const { _id } = response.data.usuario;
    const { token } = response.data;

    const tokenVerify = await api.get('/session/authentication', {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!tokenVerify.data.ok) {
      return console.log('Token recusado');
    }

    setSession(_id);

    api.defaults.headers.Authorization = `Bearer ${token}`;

    await AsyncStorage.setItem('usuario', _id);
    await AsyncStorage.setItem('token', token);
  }

  function signOut() {
    AsyncStorage.clear().then(() => {
      setSession(null);
    })
  }

  return (
    <SessionContext.Provider value={{ isLoggedIn, loading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}
