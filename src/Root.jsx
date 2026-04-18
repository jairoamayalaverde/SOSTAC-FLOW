import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import App from './App';
import ImportProject from './ImportProject';

const SUPABASE_URL = 'https://hompawsonronlgrvujjb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbXBhd3NvbnJvbmxncnZ1ampiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODI0MTMsImV4cCI6MjA4MzU1ODQxM30.UicwlthUkU9Ey5KltrZwdK7ZkTxHcYr4hr5foDUCW0A';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/importar" element={<ImportProject supabase={supabase} session={null} />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}
