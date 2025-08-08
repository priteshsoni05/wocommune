// Import necessary libraries
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from '@material-ui/icons';

const HelpanionDashboard = () => {
    return (
        <div>
            {/* Other dashboard content */}
            <Link to="/home" style={{ position: 'absolute', top: 20, right: 20 }}>
                <Home />
            </Link>
        </div>
    );
};

export default HelpanionDashboard;