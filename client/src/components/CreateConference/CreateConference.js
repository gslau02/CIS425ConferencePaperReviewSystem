import React, { useState } from 'react';
import axios from 'axios';
import './CreateConference.css';

const CreateConferenceInterface = () => {
  const [conferenceDetails, setConferenceDetails] = useState({
    name: '',
    city: '',
    state: '',
    country: '',
    startDate: '',
    endDate: '',
    submissionDeadline: '',
    reviewDeadline: '',
    username: '',
    password: '',
    programChairEmail: '',
    programChairFirstName: '',
    programChairLastName: '',
    programChairTitle: '',
    programChairAffiliation: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConferenceDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateConference = async (e) => {
    e.preventDefault();

    // Create a user object for the program chair
    const conferenceData = {
      name: conferenceDetails.name,
      city: conferenceDetails.city,
      state: conferenceDetails.state,
      country: conferenceDetails.country,
      startDate: conferenceDetails.startDate,
      endDate: conferenceDetails.endDate,
      submissionDeadline: conferenceDetails.submissionDeadline,
      reviewDeadline: conferenceDetails.reviewDeadline,
      username: conferenceDetails.username,
      password: conferenceDetails.password,
      email: conferenceDetails.programChairEmail,
      firstName: conferenceDetails.programChairFirstName,
      lastName: conferenceDetails.programChairLastName,
      title: conferenceDetails.programChairTitle,
      affiliation: conferenceDetails.programChairAffiliation,
      roles: ['chair'], // Assuming 'chair' is the role for program chairs
    };

    // Make an API call to create the program chair user
    try {

      // Make an API call to create the conference
      const conferenceResponse = await axios.post('http://localhost:5000/api/conferences', conferenceData);
      console.log('Conference created:', conferenceResponse.data);

      // Simulate email sending (you can add a real API call here if needed)
      alert(`Conference "${conferenceDetails.name}" has been created. An email has been sent to the program chair.`);

      // Reset form inputs to initial values
      setConferenceDetails({
        name: '',
        city: '',
        state: '',
        country: '',
        startDate: '',
        endDate: '',
        submissionDeadline: '',
        reviewDeadline: '',
        username: '',
        password: '',
        programChairEmail: '',
        programChairFirstName: '',
        programChairLastName: '',
        programChairTitle: '',
        programChairAffiliation: '',
      });
    } catch (error) {
      console.error('Error creating conference and user:', error);
      alert('Failed to create conference and user. Please try again.');
    }
  };
  

  return (
    <div className="create-conference-container">
      <h3>Create Conference</h3>
      <form onSubmit={handleCreateConference}>
        <div className="create-form-group">
          <label>Conference Name:</label>
          <input type="text" name="name" value={conferenceDetails.name} onChange={handleInputChange} required />
        </div>

        <div className="create-form-group location">
          <label>Location:</label>
          <div className="location-inputs">
            <input type="text" name="city" placeholder="City" value={conferenceDetails.city} onChange={handleInputChange} required />
            <input type="text" name="state" placeholder="State" value={conferenceDetails.state} onChange={handleInputChange} required />
            <input type="text" name="country" placeholder='Country' value={conferenceDetails.country} onChange={handleInputChange} required />
          </div>
        </div>

        <div className='group-container'>
          <div className="single-item">
            <label>Start Date:</label>
            <input type="date" name="startDate" value={conferenceDetails.startDate} onChange={handleInputChange} required />
          </div>

          <div className="single-item">
            <label>End Date:</label>
            <input type="date" name="endDate" value={conferenceDetails.endDate} onChange={handleInputChange} required />
          </div>

          <div className="single-item">
            <label>Submission Deadline:</label>
            <input type="date" name="submissionDeadline" value={conferenceDetails.submissionDeadline} onChange={handleInputChange} required />
          </div>

          <div className="single-item">
            <label>Review Deadline:</label>
            <input type="date" name="reviewDeadline" value={conferenceDetails.reviewDeadline} onChange={handleInputChange} required />
          </div>
        </div>

        <div className='group-container'>
          <div className="single-item">
            <label>Username:</label>
            <input type="text" name="username" value={conferenceDetails.username} onChange={handleInputChange} required />
          </div>

          <div className="single-item">
            <label>Password:</label>
            <input type="password" name="password" value={conferenceDetails.password} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="create-form-group">
          <label>Program Chair Email:</label>
          <input type="email" name="programChairEmail" value={conferenceDetails.programChairEmail} onChange={handleInputChange} required />
        </div>

        <div className='group-container'>
          <div className="single-item">
            <label>Program Chair First Name:</label>
            <input type="text" name="programChairFirstName" value={conferenceDetails.programChairFirstName} onChange={handleInputChange} required />
          </div>

          <div className="single-item">
            <label>Program Chair Last Name:</label>
            <input type="text" name="programChairLastName" value={conferenceDetails.programChairLastName} onChange={handleInputChange} required />
          </div>
        </div>

        <div className='group-container'>
          <div className="single-item">
            <label>Program Chair Title:</label>
            <input type="text" name="programChairTitle" value={conferenceDetails.programChairTitle} onChange={handleInputChange} required />
          </div>

          <div className="single-item">
            <label>Program Chair Affiliation:</label>
            <input type="text" name="programChairAffiliation" value={conferenceDetails.programChairAffiliation} onChange={handleInputChange} required />
          </div>
        </div>

        <button className='create-button' type="submit">Create Conference</button>
      </form>
    </div>
  );
};

export default CreateConferenceInterface;
