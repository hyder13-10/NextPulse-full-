import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SOSButton from './components/SOSButton';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import MedicineReminders from './pages/MedicineReminders';
import FitnessTips from './pages/FitnessTips';
import SymptomChecker from './pages/SymptomChecker';
import DoctorFinder from './pages/DoctorFinder';
import MentalWellness from './pages/MentalWellness';
import EmergencySettings from './pages/EmergencySettings';
import { isOnboarded } from './utils/storage';

function AppRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="min-h-screen">
      <Routes location={location}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/medicines" element={<MedicineReminders />} />
        <Route path="/fitness" element={<FitnessTips />} />
        <Route path="/symptoms" element={<SymptomChecker />} />
        <Route path="/doctors" element={<DoctorFinder />} />
        <Route path="/wellness" element={<MentalWellness />} />
        <Route path="/emergency" element={<EmergencySettings />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(isOnboarded());

  if (!ready) {
    return <Onboarding onComplete={() => setReady(true)} />;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <SOSButton />
      <footer className="text-center text-xs text-slate-400 py-4 pb-24">
        NextPulse — Your health, one pulse ahead.
      </footer>
    </BrowserRouter>
  );
}
