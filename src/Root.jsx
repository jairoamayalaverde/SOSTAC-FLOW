import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import App from './App';
import ImportProject from './ImportProject';

const SUPABASE_URL = 'https://hompawsonronlgrvujjb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbXBhd3NvbnJvbmxncnZ1ampiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODI0MTMsImV4cCI6MjA4MzU1ODQxM30.UicwlthUkU9Ey5KltrZwdK7ZkTxHcYr4hr5foDUCW0A';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function Root() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f59e0b',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/importar" element={<ImportProject supabase={supabase} session={session} />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}
