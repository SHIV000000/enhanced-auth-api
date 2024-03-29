// routes/profile.js
const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify the JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'e9e8d7c7c3c4b2a1a0a9a8a7a6a5a4a3a2a1a0a9a8a7a6a5a4a3a2a1a0a9a8a7', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded; // Attach the decoded user data to the request object
    next();
  });
};

// Get public profiles
router.get('/public', async (req, res) => {
  try {
    const publicProfiles = await User.find({ isProfilePublic: true });
    res.json(publicProfiles);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific profile
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the requesting user is an admin or the owner of the profile
    if (req.user.role === 'admin' || req.user._id.toString() === userId) {
      res.json(user);
    } else if (user.isProfilePublic) {
      // Return a filtered response for public profiles
      const publicProfile = {
        name: user.name,
        photo: user.photo,
        bio: user.bio
      };
      res.json(publicProfile);
    } else {
      res.status(403).json({ error: 'Unauthorized access' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile visibility
router.put('/:userId/profile-visibility', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { isProfilePublic } = req.body;

    // Check if the requesting user is an admin or the owner of the profile
    if (req.user.role === 'admin' || req.user._id.toString() === userId) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isProfilePublic },
        { new: true }
      );

      res.json(updatedUser);
    } else {
      res.status(403).json({ error: 'Unauthorized access' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile details
router.put('/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, photo, bio, phone, isProfilePublic } = req.body;

    // Check if the requesting user is an admin or the owner of the profile
    if (req.user.role === 'admin' || req.user._id.toString() === userId) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, photo, bio, phone, isProfilePublic },
        { new: true }
      );

      res.json(updatedUser);
    } else {
      res.status(403).json({ error: 'Unauthorized access' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
