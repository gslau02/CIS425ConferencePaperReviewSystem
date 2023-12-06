import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewPaper.css';

const ReviewPaperInterface = () => {
  const userId = localStorage.getItem('userId');
  const [assignedPapers, setAssignedPapers] = useState([]);
  const [recommendation, setRecommendation] = useState('');

  useEffect(() => {
    // Fetch assigned papers for the reviewer
    if (userId) {
      axios.get(`http://localhost:5000/api/reviewers/${userId}/papers`)
        .then(response => {
          setAssignedPapers(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error fetching assigned papers:', error);
        });
    }
  }, [userId]);

  const handleReviewPaper = (paperId, selectedRecommendation) => {
    const paper = assignedPapers.find(p => p._id === paperId);
    if (paper) {
      // Send a request to update the review status
      axios.put(`http://localhost:5000/api/papers/${paperId}/reviews`, {
        reviewerId: userId,
        recommendation: selectedRecommendation,
      })
        .then(response => {
          console.log(response.data);
          // Update the local state to reflect the change in status
          setAssignedPapers(prevPapers => prevPapers.map(p => (p._id === paperId ? { ...p, isReviewSaved: true} : p)));
          alert('Review saved successfully!');
        })
        .catch(error => {
          console.error('Error updating review status:', error);
          alert('Failed to save the review. Please try again.');
        });
    }
  };

  return (
    <div className='review-paper-container'>
      <div className="section-box paper-table-box">
        <h3>Review Assigned Papers</h3>
        <table className="review-paper-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Main Author</th>
              <th>Conference</th>
              <th>Review Deadline</th>
              <th>Paper Content</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          { assignedPapers.length > 0 ? (
            <tbody>
            {assignedPapers.map(paper => (
              <tr key={paper._id} className={paper.isReviewSaved ? 'disable-row': ''}>
                <td>{paper.title}</td>
                <td>{paper.mainAuthorId.username}</td>
                <td>{paper.conferenceId.name}</td>
                <td>{new Date(paper.conferenceId.reviewDeadline).toLocaleDateString()}</td>
                <td>{paper.paperFile}</td>
                <td>
                  <select
                    defaultValue="" 
                    onChange={(event) => setRecommendation(event.target.value)}
                    disabled={paper.isReviewSaved} // Disable the dropdown if review is saved
                  >
                    <option value="" disabled>None</option>
                    <option value="Accept">Accept</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Reject">Reject</option>
                  </select>
                  <button
                    onClick={() => handleReviewPaper(paper._id, recommendation)}
                    disabled={paper.isReviewSaved} // Disable the button if review is saved
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          ) : (
            <p>No paper is needed to be reviewed.</p>
          )}
        </table>
      </div>
    </div>
  );
};

export default ReviewPaperInterface;
