import React from 'react';
import { DataProvider } from './contexts/DataContext';
import { Layout } from './components/layout/Layout';
import './App.css';

function App() {
  return (
    <DataProvider>
      <Layout />
    </DataProvider>
  );
}

export default App;
