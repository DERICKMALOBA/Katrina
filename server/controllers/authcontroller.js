import userModel from '../models/usermodels.js';
import bcrypt from 'bcryptjs';

// Sign-up function
const signUp = async (req, res) => {
  const { phone, name, email, password } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    userModel.createUser(phone, name, email, hashedPassword, (error, result) => {
      if (error) return res.status(500).json({ message: 'Error creating user' });
      return res.status(201).json({ message: 'User created successfully' });
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error hashing password' });
  }
};

// Sign-in function
const signIn = (req, res) => {
  const { email, password } = req.body;

  userModel.getUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error finding user' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    // Compare passwords
    bcrypt.compare(password, results[0].password, (error, isMatch) => {
      if (error) return res.status(500).json({ message: 'Error comparing passwords' });
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      return res.status(200).json({ message: 'Sign-in successful' });
    });
  });
};

export {
  signUp,
  signIn
};
