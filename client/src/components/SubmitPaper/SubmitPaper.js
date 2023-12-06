import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubmitPaper.css';

const SubmitPaperInterface = () => {
  const [conferences, setConferences] = useState([]);
  const [selectedConference, setSelectedConference] = useState(null);
  const userId = localStorage.getItem('userId');
  const [user, setUser] = useState(null);
  const [coAuthors, setCoAuthors] = useState([]);
  const [selectedCoAuthors, setSelectedCoAuthors] = useState([]);

  useEffect(() => {
    // Fetch conferences with submission deadlines not exceeding today
    axios.get('http://localhost:5000/api/submission-deadline')
      .then(response => {
        setConferences(response.data);
      })
      .catch(error => {
        console.error('Error fetching conferences:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch user information based on the userId from the Redux store
    if (userId) {
      axios.get(`http://localhost:5000/api/users/${userId}`)
        .then(response => {
            setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user information:', error);
        });
    }
  }, [userId]);

  useEffect(() => {
    // Fetch co-authors from the server when the component mounts
    axios.get('http://localhost:5000/api/users')
      .then(response => {
        const filteredCoAuthors = response.data.filter(coAuthor => coAuthor._id !== userId && coAuthor._id !== selectedConference.programChairId);
        setCoAuthors(filteredCoAuthors);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [userId, selectedConference]);

  const handleConferenceClick = (conference) => {
    setSelectedConference(conference);
  };

  const handleCoAuthorSelect = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedCoAuthors(selectedOptions.slice(0, 3)); // Limit to at most 3 co-authors
  };

  const handleSubmitPaper = async () => {
    // Get the values from the form
    const paperTitle = document.getElementById('paperTitle').value;
    const paperContent = document.getElementById('paperContent').value;

    // Construct the paper object to be submitted
    const paper = {
      title: paperTitle,
      paperFile: paperContent,
      mainAuthorId: user._id, // Assuming the main author is the logged-in user
      coAuthorIds: selectedCoAuthors,
      conferenceId: selectedConference._id,
      reviews: [
        { reviewerId: selectedConference.programChairId.toString(), recommendation: 'Pending' },
        { reviewerId: selectedConference.programChairId.toString(), recommendation: 'Pending' },
        { reviewerId: selectedConference.programChairId.toString(), recommendation: 'Pending' },
      ]
      // Add other fields as needed
    };

    // Post the paper to the server
    try {
      const response = await axios.post(`http://localhost:5000/api/papers/${selectedConference._id}`, paper);
      console.log(response.data);
      alert('Paper submitted successfully!');
      setSelectedCoAuthors([]);
      setSelectedConference(null);
    } catch (error) {
      console.error('Error submitting paper:', error);
      alert('Failed to submit paper. Please try again.');
    }
  };

  return (
    <div className="submit-paper-container">
      <div className="submit-paper-box">
        <h3>Submit Paper</h3>
        <p>Select a conference to submit your paper:</p>
        <table className="submit-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Submission Deadline</th>
              {/* Add additional headers as needed */}
            </tr>
          </thead>
          { conferences.length > 0 ? (
              <tbody>
              {conferences.map(conference => (
                <tr key={conference._id} onClick={() => handleConferenceClick(conference)}>
                  <td>{conference.name}</td>
                  <td>{`${conference.city}, ${conference.state}, ${conference.country}`}</td>
                  <td>{new Date(conference.startDate).toLocaleDateString()}</td>
                  <td>{new Date(conference.endDate).toLocaleDateString()}</td>
                  <td>{new Date(conference.submissionDeadline).toLocaleDateString()}</td>
                  {/* Add additional conference information as needed */}
                </tr>
              ))}
            </tbody>
          ) : (
            <p>No conference is published currently.</p>
          )}
        </table>
      </div>

      {/* Display the selected conference details and paper submission form */}
      {selectedConference && (
        <div className="submit-paper-box">
          <h3>Selected Conference: {selectedConference.name}</h3>
          <p>Submission Deadline: {new Date(selectedConference.submissionDeadline).toLocaleDateString()}</p>

          {/* Add your paper submission form here */}
          {/* Include input fields for paper title, content, and co-author selection */}

          <form >
            {/* Add your form fields here */}
            <label htmlFor="mainAuthor">Main Author:</label>
            <input type="text" id="mainAuthor" name="mainAuthor" value={user.username} readOnly />

            <label htmlFor="paperTitle">Paper Title:</label>
            <input type="text" id="paperTitle" name="paperTitle" />

            <label htmlFor="paperContent">Paper Content:</label>
            <textarea id="paperContent" name="paperContent"></textarea>

            <label htmlFor="coAuthors">Co-Authors:</label>
            <select multiple onChange={handleCoAuthorSelect}>
                {coAuthors.map(coAuthor => (
                    <option key={coAuthor._id} value={coAuthor._id}>
                    {coAuthor.username}
                    </option>
                ))}
            </select>
          </form>

          {/* Add a submit button to submit the paper */}
          <button onClick={handleSubmitPaper}>Submit Paper</button>
        </div>
      )}
    </div>
  );
};

export default SubmitPaperInterface;
