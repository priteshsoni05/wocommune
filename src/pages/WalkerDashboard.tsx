import React from 'react';
import { Header, Sidebar } from './components';

const WalkerDashboard = () => {
  return (
    <div>
      <Header /> {/* The Header remains unchanged, still has Home and Logout icons */}
      <Sidebar>
        {/* Other sidebar content remains unchanged */}
        {/* Removed Home and Logout buttons from the sidebar */}
      </Sidebar>
      {/* Rest of the dashboard content */}
    </div>
  );
};

export default WalkerDashboard;