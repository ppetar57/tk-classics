import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ARTIFACT } from './env.js';

const Router = ARTIFACT ? MemoryRouter : BrowserRouter;
import './styles.css';
import Layout from './components/Layout.jsx';
import { ToastProvider } from './components/ui.jsx';
import Home from './pages/Home.jsx';
import Reservations from './pages/Reservations.jsx';
import School from './pages/School.jsx';
import League from './pages/League.jsx';
import Tournaments from './pages/Tournaments.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import { Login, Register } from './pages/Auth.jsx';
import Profile from './pages/Profile.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/rezervacije" replace />} />
            <Route path="pocetna" element={<Home />} />
            <Route path="rezervacije" element={<Reservations />} />
            <Route path="skola-tenisa" element={<School />} />
            <Route path="liga" element={<League />} />
            <Route path="turniri" element={<Tournaments />} />
            <Route path="o-klubu" element={<About />} />
            <Route path="kontakt" element={<Contact />} />
            <Route path="prijava" element={<Login />} />
            <Route path="registracija" element={<Register />} />
            <Route path="profil" element={<Profile />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </Router>
  </React.StrictMode>
);
