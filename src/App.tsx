/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

// CORE PAGES (Immediate)
import Hub from './pages/Hub';

// LAZY PAGES (Heavy or Secondary)
const Vault = lazy(() => import('./pages/Vault'));
const Studio = lazy(() => import('./pages/Studio'));
const Boutique = lazy(() => import('./pages/Boutique'));
const Creations = lazy(() => import('./pages/Creations'));
const Circuit = lazy(() => import('./pages/Circuit'));
const Echoes = lazy(() => import('./pages/Echoes'));
const About = lazy(() => import('./pages/About'));
const OurStory = lazy(() => import('./pages/OurStory'));
const Support = lazy(() => import('./pages/Support'));
const Compliance = lazy(() => import('./pages/Compliance'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Safety = lazy(() => import('./pages/Safety'));
const TrevorProject = lazy(() => import('./pages/TrevorProject'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SplashGate = lazy(() => import('./pages/SplashGate'));
const VaultGate = lazy(() => import('./pages/VaultGate'));

import { ProtectedRoute } from './components/ProtectedRoute';
import TrevorBanner from './components/TrevorBanner';
import TrevorToast from './components/TrevorToast';
import AccessibilityMenu from './components/AccessibilityMenu';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Cinematic delay (2.5 seconds)
    const timer = setTimeout(() => setAppReady(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!appReady) return <LoadingScreen />;

  return (
    <AccessibilityProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <TrevorBanner />
          <TrevorToast />
          <AccessibilityMenu />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Hub />} />
              <Route path="/hub" element={<Hub />} />
              <Route path="/gate" element={<SplashGate />} />
              <Route path="/vault-gate" element={<VaultGate />} />
              <Route path="/vault" element={
                <Suspense fallback={<LoadingScreen />}>
                  <Vault />
                </Suspense>
              } />
              <Route path="/studio" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingScreen />}>
                    <Studio />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/boutique" element={
                <Suspense fallback={<LoadingScreen />}>
                  <Boutique />
                </Suspense>
              } />
              <Route path="/creations" element={<Creations />} />
              <Route path="/circuit" element={<Circuit />} />
              <Route path="/echoes" element={<Echoes />} />
              <Route path="/about" element={<About />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/support" element={<Support />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/trevor-project" element={<TrevorProject />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </AccessibilityProvider>
  );
}
