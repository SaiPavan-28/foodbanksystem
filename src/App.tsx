import React from 'react';
import { FoodBridgeProvider, useFoodBridge } from './context/FoodBridgeContext';
import { Navbar } from './components/Navbar';
import { NotificationBanner } from './components/NotificationBanner';
import { PublicLanding } from './pages/PublicLanding';
import { DonorPortal } from './pages/DonorPortal';
import { VolunteerApp } from './pages/VolunteerApp';
import { AdminCommandCenter } from './pages/AdminCommandCenter';
import { LoginPage } from './pages/LoginPage';

const AuthorizedContent: React.FC = () => {
  const { currentRole, authUser } = useFoodBridge();

  if (currentRole === 'login') {
    return <LoginPage />;
  }

  if (currentRole === 'donor') {
    return <DonorPortal />;
  }

  if (currentRole === 'volunteer') {
    return <VolunteerApp />;
  }

  if (currentRole === 'admin') {
    return <AdminCommandCenter />;
  }

  return <PublicLanding />;
};

export const App: React.FC = () => {
  return (
    <FoodBridgeProvider>
      <div className="min-h-screen flex flex-col font-sans relative bg-[#FAF8F5]">
        <Navbar />
        <NotificationBanner />
        <main className="flex-1">
          <AuthorizedContent />
        </main>
      </div>
    </FoodBridgeProvider>
  );
};

export default App;
