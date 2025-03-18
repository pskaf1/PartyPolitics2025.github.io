const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiate Facebook login
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

// Facebook callback
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || '/'); // Redirect to the client
  }
);

module.exports = router;
