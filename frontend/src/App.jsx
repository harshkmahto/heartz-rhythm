import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/ShowCaseSection/Navbar';
import Footer from './components/ShowCaseSection/Footer';
import GoToTop from './components/ShowCaseSection/GoToTop';
import UserStatusNav from './components/ShowCaseSection/UserStatusNav';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col pt-14">
      <Navbar />
      <UserStatusNav />
      <main className="flex-1 w-full flex flex-col relative z-0">
        <Outlet />
      </main>
      <Footer />
      <GoToTop />

      {/* Toaster */}
      <Toaster 
        position="top-left"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',  
              secondary: '#fff',
            },
            style: {
              background: '#22c55e',  
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',  
              secondary: '#fff',
            },
            style: {
              background: '#ef4444', 
              color: '#fff',
            },
          },
          loading: {
            style: {
              background: '#3b82f6',  
              color: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default App;