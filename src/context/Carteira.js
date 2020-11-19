import React, { createContext, useState } from 'react';

export const CarteiraContext = createContext();

export default function CarteiraProvider({ children }) {
  const [carteiraInfo, setCarteiraInfo] =  useState([]);

  return (
    <CarteiraContext.Provider
      value={{
        carteiraInfo,
        setCarteiraInfo,
      }}
    >
      {children}
    </CarteiraContext.Provider>
  );
}