import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllConferences.css';

const AllConferencesInterface = () => {
  const [conferences, setConferences] = useState([]);
  const [selectedConference, setSelectedConference] = useState(null);
  const [publishedPapers, setPublishedPapers] = useState([]);

  useEffect(() => {
    // Fetch all conferences from the server
    axios.get('http://localhost:5000/api/conferences')
      .then(response => {
        setConferences(response.data);
      })
      .catch(error => {
        console.error('Error fetching conferences:', error);
      });
  }, []);

  const handleConferenceClick = async (conferenceId) => {
    try {
      // Fetch published papers for the selected conference
      const response = await axios.get(`http://localhost:5000/api/conferences/${conferenceId}/papers/published`);
      setPublishedPapers(response.data);
      console.log(response.data);
      setSelectedConference(conferenceId);
    } catch (error) {
      console.error('Error fetching published papers:', error);
    }
  };

  return (
    <div>
      <div className="section-box conference-container">
            <h3>All Conferences</h3>
            <text>Click on a conference to view its published papers:</text>
            
              <table className="conference-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Submission Deadline</th>
                </tr>
              </thead>
              {conferences.length > 0 ? (
              <tbody>
                {conferences.map(conference => (
                  <tr key={conference._id} onClick={() => handleConferenceClick(conference._id)}>
                    <td>{conference.name}</td>
                    <td>{`${conference.city}, ${conference.state}, ${conference.country}`}</td>
                    <td>{new Date(conference.startDate).toLocaleDateString()}</td>
                    <td>{new Date(conference.endDate).toLocaleDateString()}</td>
                    <td>{new Date(conference.submissionDeadline).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <p>No conference is published currently.</p>
            )}
            </table>
          </div>
          <div>
            {selectedConference && (
              <div className="section-box">
                <h4>Published Papers for {conferences.find(conf => conf._id === selectedConference)?.name}</h4>
                {publishedPapers.length > 0 ? (
                  <table className="published-papers-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Main Author</th>
                        <th>Co-Author(s)</th>
                        <th>Paper Content</th>
                        {/* Add additional headers as needed */}
                      </tr>
                    </thead>
                    <tbody>
                      {publishedPapers.map(paper => (
                        <tr key={paper._id}>
                          <td>{paper.title}</td>
                          <td>{paper.mainAuthorId.username}</td>
                          <td>{paper.coAuthorIds.map(author => author.username).join(', ')}</td>
                          <td>{paper.paperFile}</td>
                          {/* Add additional paper information as needed */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No paper is published for this conference.</p>
                )}
              </div>
            )}
          </div>
    </div>
  );
};

export default AllConferencesInterface;
