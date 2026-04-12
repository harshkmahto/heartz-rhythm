import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/ShowCaseSection/Navbar';
import Footer from './components/ShowCaseSection/Footer';
import GoToTop from './components/ShowCaseSection/GoToTop';
import UserStatusNav from './components/ShowCaseSection/UserStatusNav';

const App = () => {
  return (
      <div className="min-h-screen flex flex-col pt-14">
        <Navbar />
         <UserStatusNav />
        <main className="flex-1 w-full flex flex-col relative z-0">
          <Outlet />
        </main>
        <Footer />

        <GoToTop/>
      </div>

  );
};

export default App;