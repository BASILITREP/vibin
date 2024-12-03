const express = require('express');
const bycrypt = require('bcryptjs');
const jwt  = require ('jsonwebtoken');
const User = require ('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

//register user
router.post('/register', async (req, res) =>{
    const { email, password, favoriteGenres } =req.body;
    try{
        const user = new User({ email, password, favoriteGenres});
        await user.save();
        res.status(201).json({ message: 'User resgistered successfully' });
    }catch(error){
        res.status(400).json({ error: 'User resgistration failed' });
    }
});

//login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  module.exports = router;