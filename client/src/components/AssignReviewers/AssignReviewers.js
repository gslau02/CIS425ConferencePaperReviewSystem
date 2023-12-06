import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignReviewers.css';

const AssignReviewersInterface = () => {
  const userId = localStorage.getItem('userId');
  const [conference, setConference] = useState(null);
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [assignedReviewers, setAssignedReviewers] = useState([]);

  useEffect(() => {
    // Fetch conference details and papers for the conference
    if (userId) {
        axios.get(`http://localhost:5000/api/conferences/${userId}`)
            .then(response => {
                setConference(response.data);
                axios.get(`http://localhost:5000/api/papers/${response.data._id}`)
                    .then(response => {
                        setPapers(response.data);
                        console.log(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching papers for conference:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching conference:', error);
            });
    }

    if (selectedPaper) {
      axios.get('http://localhost:5000/api/users') // Update the endpoint
        .then(response => {
          // Exclude authors and co-authors of the selected paper
          const excludedAuthors = [
            selectedPaper.mainAuthorId._id,
            ...selectedPaper.coAuthorIds.map(coAuthor => coAuthor._id),
        ];
        console.log(response.data);
          setReviewers(response.data.filter(reviewer => !excludedAuthors.includes(reviewer._id)));
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    }
  }, [userId, selectedPaper]);

  useEffect(() => {
    // Fetch usernames for assigned reviewers when selectedPaper changes
    if (selectedPaper && selectedPaper.reviews[0].reviewerId !== userId) {
      console.log(selectedPaper.reviews);
      const reviewerIds = selectedPaper.reviews.map((review) => review.reviewerId);
      console.log(reviewerIds);
      Promise.all(
        reviewerIds.map((reviewerId) =>
          axios.get(`http://localhost:5000/api/users/${reviewerId}`).then((response) => response.data.username)
        )
      )
        .then((usernames) => setAssignedReviewers(usernames))
        .catch((error) => console.error('Error fetching usernames:', error));
    }
  }, [selectedPaper, userId]);

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
    setSelectedReviewers([]);
    if (paper._id !== selectedPaper?._id) {
      setAssignedReviewers([]);
    }
  };

  const handleReviewerSelect = (event, index) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    const newSelectedReviewers = [...selectedReviewers];
    newSelectedReviewers[index] = selectedOptions[0];
    setSelectedReviewers(newSelectedReviewers);
  };

  const handleSave = () => {
    if (!selectedPaper || selectedPaper.reviews[0].reviewerId !== userId) {
      alert('This paper already has assigned reviewers. You cannot make changes.');
      return;
    }

    if (!selectedPaper || selectedReviewers.some(r => !r)) {
        alert('Please select a paper and three reviewers.');
        return;
      }
    // Send the request to save assigned reviewers
    axios.put(`http://localhost:5000/api/papers/${selectedPaper._id}`, {
      selectedReviewers,
    })
      .then(response => {
        console.log(response.data);
        alert('Reviewers assigned successfully!');
        setSelectedPaper(null);
        setSelectedReviewers([]);
        setAssignedReviewers([]);
      })
      .catch(error => {
        console.error('Error assigning reviewers:', error);
        alert('Failed to assign reviewers. Please try again.');
      });
  };

  return (
    <div className='section-box'>
      <h3>Assign Reviewers</h3>
      {conference && <p>Conference Name: {conference.name}</p>}

      {/* Display the list of papers */}
      <table className="paper-table">
        <thead>
          <tr>
            <th>Paper Titles</th>
            <th>Actions</th>
          </tr>
        </thead>
        { papers.length > 0 ? (
          <tbody>
          {papers.map(paper => (
            <tr key={paper._id} onClick={() => handlePaperClick(paper)}>
              <td>{paper.title}</td>
              <td>Click to Assign Reviewers</td>
            </tr>
          ))}
        </tbody>
        ) : (
          <p>No paper is needed to be assigned a reviewer.</p>
        )}
      </table>

      {/* Display the selected paper details and reviewer assignment form */}
      {selectedPaper && (
        <div>
          <h3>Selected Paper: {selectedPaper.title}</h3>

          {/* Check if reviewers are already assigned */}
          {selectedPaper.reviews[0].reviewerId !== userId ? (
            <div>
              <ul>
                {assignedReviewers.map((reviewer, index) => (
                  <li key={index}>{`Reviewer ${index + 1}: ${reviewer}`}</li>
                ))}
              </ul>
              <p>This paper already has assigned reviewers. You cannot make changes.</p>
            </div>
          ) : (
            // Reviewer assignment form
            <form className='form'>
              {Array.from({ length: 3 }, (_, index) => (
                <div className='form-group'key={index} >
                  <label>Reviewer {index + 1}:</label>
                  <select defaultValue="" onChange={(event) => handleReviewerSelect(event, index)}>
                    <option value="" disabled selected>
                      Select Reviewer
                    </option>
                    {reviewers
                      .filter((reviewer) => reviewer._id !== userId) // Exclude current user
                      .filter(
                        (reviewer) =>
                          !selectedReviewers.includes(reviewer._id) ||
                          reviewer._id === selectedReviewers[index]
                      ) // Exclude already selected reviewers for other dropdowns but include the one for the current dropdown
                      .map((reviewer) => (
                        <option key={reviewer._id} value={reviewer._id}>
                          {reviewer.username}
                        </option>
                      ))}
                  </select>
                </div>
              ))}
            </form>
          )}

          {/* Save button */}
          {selectedPaper.reviews[0].reviewerId === userId ? (
            <button onClick={handleSave}>Save</button>
          ) : (
            <p></p>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignReviewersInterface;
