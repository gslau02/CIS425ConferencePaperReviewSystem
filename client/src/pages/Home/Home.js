import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import DashboardInterface from '../.././components/Dashboard/Dashboard';
import AllConferencesInterface from '../.././components/All Conference/AllConferences';
import CreateConferenceInterface from '../.././components/CreateConference/CreateConference';
import SubmitPaperInterface from '../.././components/SubmitPaper/SubmitPaper';
import AssignReviewersInterface from '../.././components/AssignReviewers/AssignReviewers';
import ReviewPaperInterface from '../.././components/ReviewPaper/ReviewPaper';
import FinalReviewInterface from '../.././components/FinalReview/FinalReview';

const Home = () => {
  const [selectedFunction, setSelectedFunction] = useState('Dashboard');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    // Fetch user roles based on the userId
    if (userId) {
      axios.get(`http://localhost:5000/api/users/${userId}`)
        .then(response => {
          setUserRoles(response.data.roles || []);
        })
        .catch(error => {
          console.error('Error fetching user roles:', error);
        });
    }
  }, [userId]);

  const handleMenuItemClick = (functionName) => {
    if (functionName === 'Logout') {
      handleLogout();
    } else {
      setSelectedFunction(functionName);
    }
  };

  const handleLogout = () => {
    navigate('/login');
    alert('You have been logged out.');
  };

  return (
    <div className="home-container">
      <div className="menu-bar">
        <ul>
          <li 
            onClick={() => handleMenuItemClick('Dashboard')}
            className={selectedFunction === 'Dashboard' ? 'active' : ''}>
            Dashboard
          </li>
          <li 
            onClick={() => handleMenuItemClick('All Conferences')}
            className={selectedFunction === 'All Conferences' ? 'active' : ''}>
            All Conferences
          </li>
          {userRoles.includes('admin') && (
            <li 
              onClick={() => handleMenuItemClick('Create Conference')}
              className={selectedFunction === 'Create Conference' ? 'active' : ''}>
              Create Conference
            </li>
          )}
          {userRoles.includes('author') && (
            <li 
            onClick={() => handleMenuItemClick('Submit Paper')}
            className={selectedFunction === 'Submit Paper' ? 'active' : ''}>
              Submit Paper
            </li>
          )}
          {userRoles.includes('chair') && (
            <>
              <li 
              onClick={() => handleMenuItemClick('Assign Reviewers')}
              className={selectedFunction === 'Assign Reviewers' ? 'active' : ''}>
                Assign Reviewers
              </li>
              <li 
              onClick={() => handleMenuItemClick('Final Review')}
              className={selectedFunction === 'Final Review' ? 'active' : ''}>
                Final Review
              </li>
            </>
          )}
          {userRoles.includes('reviewer') && (
            <li 
            onClick={() => handleMenuItemClick('Review Paper')}
            className={selectedFunction === 'Review Paper' ? 'active' : ''}>
              Review Paper
            </li>
          )}
          <li onClick={() => handleMenuItemClick('Logout')}>Logout</li>
        </ul>
      </div>
      <div className='right-container'>
        <h2 className='home-h2'>Conferenc Paper Review System</h2>
        <div className="interface-container">
        {selectedFunction === 'Dashboard' && <DashboardInterface />}
        {selectedFunction === 'All Conferences' && <AllConferencesInterface />}
        {selectedFunction === 'Create Conference' && <CreateConferenceInterface />}
        {selectedFunction === 'Submit Paper' && <SubmitPaperInterface />}
        {selectedFunction === 'Assign Reviewers' && <AssignReviewersInterface />}
        {selectedFunction === 'Review Paper' && <ReviewPaperInterface />}
        {selectedFunction === 'Final Review' && <FinalReviewInterface />}
        {selectedFunction === 'Logout' && <LogoutInterface />}
        </div>
      </div>
    </div>
  );
};

const LogoutInterface = () => {
  return (
    <div>
      <p>Logout Interface</p>
    </div>
  );
};

export default Home;
