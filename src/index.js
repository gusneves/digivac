import React from 'react'

import SessionProvider from './context/Session';

import Router from './routes'

export default function App() {
  return (
    <SessionProvider>
      <Router />
    </SessionProvider>
  );
}