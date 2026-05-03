import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 flex flex-col antialiased">
      <Navbar />
      {/* pt-28 = 7rem = 112px. Navbar is h-16 (64px). This guarantees a safe gap. */}
      <main className="flex-grow pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
