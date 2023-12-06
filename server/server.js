const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Import the User model
const User = require('./models/User');
const Conference = require('./models/Conference');
const Paper = require('./models/Paper');

const app = express();
const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI || 'mongodb+srv://admin:123@cluster0.yt4hygh.mongodb.net/conference-db?retryWrites=true&w=majority';

app.use(cors());
app.use(bodyParser.json());

// Replace 'your-mongo-db-uri' with your MongoDB connection URI
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Replace it with your actual user authentication logic
    const user = await User.findOne({ username, password });
    console.log(user);

    if (user) {
      res.json({ message: 'Login successful', userId: user._id });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({ roles: { $ne: 'admin' } }, '_id username roles');
    
    // Respond with the list of users
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/:userId', (req, res) => {
  const { userId: _id } = req.params;

  // Assuming you have a User model
  User.findOne({ _id })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send user information as a response
      res.json({
        _id: user._id,
        roles: user.roles,
        username: user.username,
        // Include other user information fields as needed
      });
    })
    .catch(error => {
      console.error('Error fetching user information:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

app.get('/api/conferences', async (req, res) => {
  try {
    // Fetch all conferences from the database
    const conferences = await Conference.find();
    res.json(conferences);
  } catch (error) {
    console.error('Error fetching conferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/conferences/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Find conferences where the user is the program chair
    const conference = await Conference.findOne({ programChairId: userId });
    res.json(conference);
  } catch (error) {
    console.error('Error fetching conferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Assuming you have a route for conferences, you can add a new endpoint for fetching published papers
app.get('/api/conferences/:conferenceId/papers/published', async (req, res) => {
  const { conferenceId } = req.params;

  try {
    // Find the conference by its ID
    const conference = await Conference.findById(conferenceId);

    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }

    // Find published papers for the conference
    const publishedPapers = await Paper.find({
      conferenceId,
      publicationStatus: 'Publish', // Assuming 'Accept' means the paper is published
    })
      .populate('mainAuthorId', 'username') // Populate the authors field with only the username
      .populate('coAuthorIds', 'username'); // Populate the authors field with only the username

    res.json(publishedPapers);
  } catch (error) {
    console.error('Error fetching published papers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/conferences', async (req, res) => {
  const {
    name,
    city,
    state,
    country,
    startDate,
    endDate,
    submissionDeadline,
    reviewDeadline,
    username,
    password,
    email,
    firstName,
    lastName,
    title,
    affiliation,
    roles,
  } = req.body;

  try {
    // Create a new user for the program chair
    const programChair = new User({
      username,
      password,
      email,
      firstName,
      lastName,
      title,
      affiliation,
      roles,
    });

    const savedProgramChair = await programChair.save();

    // Create a new conference
    const conference = new Conference({
      name,
      city,
      state,
      country,
      startDate,
      endDate,
      submissionDeadline,
      reviewDeadline,
      programChairId: savedProgramChair._id, // Assign the program chair's userId to the conference
    });

    const savedConference = await conference.save();

    // Respond with the created conference and user
    res.json({ conference: savedConference, programChair: savedProgramChair });
  } catch (error) {
    console.error('Error creating conference and user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get conferences with submission deadlines not exceeding today
app.get('/api/submission-deadline', async (req, res) => {
  try {
    const conferences = await Conference.find({ submissionDeadline: { $gte: new Date() } });
    res.json(conferences);
  } catch (error) {
    console.error('Error fetching conferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/papers/:conferenceId', async (req, res) => {
  const { conferenceId } = req.params;
  try {
    // Find all papers with the given conferenceId
    const papers = await Paper.find({ conferenceId })
    .populate('mainAuthorId', '_id')
    .populate('coAuthorIds', '_id');
    res.json(papers);
  } catch (error) {
    console.error('Error retrieving papers for conference:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/papers/:conferenceId', async (req, res) => {
  const { conferenceId } = req.params;
  const {
    title,
    paperFile,
    mainAuthorId,
    coAuthorIds,
    reviews,
    // Add other fields as needed
  } = req.body;

  try {
    // Create a new paper instance
    const newPaper = new Paper({
      conferenceId,
      title,
      paperFile,
      mainAuthorId,
      coAuthorIds,
      reviews
      // Add other fields as needed
    });

    // Save the new paper to the database
    const savedPaper = await newPaper.save();

    res.json(savedPaper);
  } catch (error) {
    console.error('Error creating new paper:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/papers/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find papers where the user is the main author
    const userPapers = await Paper.find({ mainAuthorId: userId })
      .populate('conferenceId', 'name')
      .populate('mainAuthorId', 'username')
      .populate('coAuthorIds', 'username');

    // Find papers where the user is one of the co-authors
    const coAuthorPapers = await Paper.find({ coAuthorIds: userId })
      .populate('conferenceId', 'name')
      .populate('mainAuthorId', 'username')
      .populate('coAuthorIds', 'username');

    // Combine the two sets of papers without duplicates
    const uniquePapers = [...new Set([...userPapers, ...coAuthorPapers])];

    res.json(uniquePapers);
  } catch (error) {
    console.error('Error fetching user papers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/papers/:paperId', async (req, res) => {
  const { paperId } = req.params;
  const { selectedReviewers } = req.body;

  try {
    // Find the paper by its ID
    const paper = await Paper.findById(paperId);

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    const reviewer1 = selectedReviewers[0];
    const reviewer2 = selectedReviewers[1];
    const reviewer3 = selectedReviewers[2];

    // Update the paper properties based on the request body
    paper.reviews = [
      {
        reviewerId: reviewer1,
        recommendation: 'Pending',
      },
      {
        reviewerId: reviewer2,
        recommendation: 'Pending',
      },
      {
        reviewerId: reviewer3,
        recommendation: 'Pending',
      },
    ]
    // Save the updated paper
    const updatedPaper = await paper.save();

    await updateUserRole(reviewer1, 'reviewer');
    await updateUserRole(reviewer2, 'reviewer');
    await updateUserRole(reviewer3, 'reviewer');

    res.json(updatedPaper);
  } catch (error) {
    console.error('Error updating paper:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/papers/pending/:conferenceId', async (req, res) => {
  const { conferenceId } = req.params;
  try {
    // Find all pending papers with the given conferenceId
    const papers = await Paper.find({ 
      conferenceId,
      publicationStatus: 'Pending'
    })
    .populate('mainAuthorId', 'username');
    res.json(papers);
  } catch (error) {
    console.error('Error retrieving papers for conference:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/reviewers/:userId/papers', async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch papers assigned to the specified reviewer with "Pending" status
    const assignedPapers = await Paper.find({
      reviews: {
        $elemMatch: {
          reviewerId: userId,
          recommendation: 'Pending',
        },
      },
    })
      .populate('mainAuthorId', 'username') // Populate the mainAuthor field with the username
      .populate({
        path: 'conferenceId',
        select: 'name reviewDeadline', // Specify the fields you want to populate
      })
    res.json(assignedPapers);
  } catch (error) {
    console.error('Error fetching assigned papers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/papers/:paperId/reviews', async (req, res) => {
  const { paperId } = req.params;
  const { reviewerId, recommendation } = req.body;

  try {
    // Find the paper by its ID
    const paper = await Paper.findById(paperId);

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    // Find the review object for the specified reviewer
    const reviewIndex = paper.reviews.findIndex(review => review.reviewerId.toString() === reviewerId);

    if (reviewIndex === -1) {
      return res.status(404).json({ error: 'Review not found for the specified reviewer' });
    }

    // Update the recommendation in the review object
    paper.reviews[reviewIndex].recommendation = recommendation;

    // Save the updated paper
    const updatedPaper = await paper.save();

    res.json(updatedPaper);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/papers/:paperId/publication-status', async (req, res) => {
  const { paperId } = req.params;
  const { publicationStatus: selectedRecommendation } = req.body;

  try {
    // Find the paper by its ID
    const paper = await Paper.findById(paperId);

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    // Update the publication status
    paper.publicationStatus = selectedRecommendation;

    // Save the updated paper
    const updatedPaper = await paper.save();

    res.json(updatedPaper);
  } catch (error) {
    console.error('Error updating publication status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

async function updateUserRole(userId, role) {
  try {
    const user = await User.findById(userId);

    if (user && !user.roles.includes(role)) {
      // Add the "reviewer" role to the user
      user.roles.push(role);
      // Save the updated user
      await user.save();
    }
  } catch (error) {
    console.error('Error updating user role:', error);
  }
}


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
