import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FinalReview.css';

const FinalReviewInterface = () => {
  const userId = localStorage.getItem('userId');
  //const [conference, setConference] = useState(null);
  const [conferencePapers, setConferencePapers] = useState([]);
  const [finalRecommendations, setFinalRecommendations] = useState({});

  useEffect(() => {
    // Fetch papers for the conference based on the conferenceId (userId)
    if (userId) {
        axios.get(`http://localhost:5000/api/conferences/${userId}`)
        .then(response => {
            if (response.data) {
                axios.get(`http://localhost:5000/api/papers/pending/${response.data._id}`)
                .then(response => {
                setConferencePapers(response.data);
                })
                .catch(error => {
                console.error('Error fetching conference papers:', error);
                });
            }
          })
          .catch(error => {
            console.error('Error fetching conference:', error);
          });
    }
  }, [userId]);

  const handleFinalReview = (paperId, selectedRecommendation) => {
    // Send a request to update the final review status
    axios.put(`http://localhost:5000/api/papers/${paperId}/publication-status`, {
      publicationStatus: selectedRecommendation,
    })
      .then(response => {
        console.log(response.data);
        // Update the local state to reflect the change in final review status
        setFinalRecommendations(prevRecommendations => ({
          ...prevRecommendations,
          [paperId]: true,
        }));
        alert('Final review saved successfully!');
      })
      .catch(error => {
        console.error('Error updating final review status:', error);
        alert('Failed to save the final review. Please try again.');
      });
  };

  const isPendingRecommendation = (paper) => {
    return paper.reviews.some(review => review.recommendation === 'Pending');
  };

  return (
    <div className="final-review-container">
      <h3>Final Review for Conference Papers</h3>
      <text> (You can only make final recommendation after all reviewers review the paper)</text>
      {/* Display the table of conference papers */}
      <table className="final-review-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Main Author</th>
            <th>Paper Content</th>
            <th>Reviewer 1</th>
            <th>Reviewer 2</th>
            <th>Reviewer 3</th>
            <th>Final Review</th>
          </tr>
        </thead>
        { conferencePapers.length > 0 ? (
          <tbody>
          {conferencePapers.map(paper => (
            <tr key={paper._id}>
              <td>{paper.title}</td>
              <td>{paper.mainAuthorId.username}</td>
              <td>{paper.paperFile}</td>
              <td>{paper.reviews[0].recommendation}</td>
              <td>{paper.reviews[1].recommendation}</td>
              <td>{paper.reviews[2].recommendation}</td>
              <td>
                <select
                  defaultValue=""
                  onChange={(event) => setFinalRecommendations({
                    ...finalRecommendations,
                    [paper._id]: event.target.value,
                  })}
                  disabled={finalRecommendations[paper._id] === true || isPendingRecommendation(paper)}
                >
                  <option value="" disabled>None</option>
                  <option value="Publish">Publish</option>
                  <option value="Do not publish">Do not publish</option>
                </select>
                <button
                  onClick={() => handleFinalReview(paper._id, finalRecommendations[paper._id])}
                  disabled={finalRecommendations[paper._id] === true || isPendingRecommendation(paper)}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        ) : (
          <p>No paper is needed to be given final review.</p>
        )}
      </table>
    </div>
  );
};

export default FinalReviewInterface;
