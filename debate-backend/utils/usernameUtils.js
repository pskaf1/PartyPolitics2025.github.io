const User = require('../models/User'); // Import the User model

// Utility function to generate a unique username
const generateUsername = async (email) => {
  const baseUsername = email.split("@")[0]; // Take the part before '@' in the email
  let username = baseUsername;
  let counter = 1;

  // Check for existing username and increment if needed
  while (await User.exists({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }
  return username;
};

module.exports = generateUsername;
