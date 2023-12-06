import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Import your custom styles if needed
// import { useSelector } from 'react-redux';

const DashboardInterface = () => {
  // const userId = useSelector(state => state.user.userId);
  const userId = localStorage.getItem('userId');
  const [userRoles, setUserRoles] = useState([]);
  const [userPapers, setUserPapers] = useState([]);

  useEffect(() => {
    // Fetch user information based on the userId from the Redux store
    if (userId) {
      axios.get(`http://localhost:5000/api/users/${userId}`)
        .then(response => {
          setUserRoles(response.data.roles || []);
        })
        .catch(error => {
          console.error('Error fetching user information:', error);
        });
      
      // Fetch papers that belong to the user or where the user is a co-author
      axios.get(`http://localhost:5000/api/papers/user/${userId}`)
        .then(response => {
          setUserPapers(response.data);
        })
        .catch(error => {
          console.error('Error fetching user papers:', error);
        });
    }
  }, [userId]); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div className="dashboard-container">
      <div className="section-box roles-section">
        <h3>Your Roles:</h3>
        <ul>
          <text>You are now logged in as </text>
        {userRoles.join(', ')}
        </ul>
      </div>

      {userRoles.includes('author') && (
        <div className="section-box papers-section">
          <h3>Your Papers:</h3>
          <table className='dashboard-table'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Conference Name</th>
                <th>Main Author</th>
                <th>Co-author(s)</th>
                <th>Publication Status</th>
                {/* Add more columns as needed */}
              </tr>
            </thead>
            { userPapers.length > 0 ? (
              <tbody>
              {userPapers.map(paper => (
                <tr key={paper._id}>
                  <td>{paper.title}</td>
                  <td>{paper.conferenceId.name}</td>
                  <td>{paper.mainAuthorId.username}</td>
                  <td>{paper.coAuthorIds.map(author => author.username).join(', ')}</td>
                  <td>
                    {paper.publicationStatus === 'Publish' ? 'Published' :
                      (paper.publicationStatus === 'Do not publish' ? 'Rejected' : paper.publicationStatus)}
                  </td>
                </tr>
              ))}
            </tbody>
            ) : (
              <p>You have not submitted any paper.</p>
            )}
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardInterface;
