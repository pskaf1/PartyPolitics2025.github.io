// backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  linkedIn: { type: String },
  bio: { type: String },
  location: { type: String },
  preferredTopics: [{ type: String }],
  consentForPublic: { type: Boolean, default: false },
  profilePicture: { type: String }, // Path to profile picture if uploaded
});

// Export the model
module.exports = mongoose.model('User', userSchema);
