import React from 'react'

import SessionProvider from './src/context/Session';

import Router from './src/routes'

export default function App() {
  return (
    <SessionProvider>
      <Router />
    </SessionProvider>
  );
}
