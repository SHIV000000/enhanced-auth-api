// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');

// POST /auth/register - User registration route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      isProfilePublic: req.body.isProfilePublic || true 
    });
    await newUser.save();
    res.status(201).redirect('/'); // Redirect to login page after registration
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /auth/login - User login route
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/auth/profile'); // Redirect to profile page after successful login
});

// GET /auth/logout - User logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Logout successful' });
});

// GET /auth/profile - User profile details route
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login'); // Redirect to login page if not authenticated
  }

  res.sendFile(path.join(__dirname, '../frontend', 'profile.html')); // Serve profile.html
});

module.exports = router;
