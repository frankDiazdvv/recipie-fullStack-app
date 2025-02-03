const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router(); //Create Router

//Sign Up
router.post('/signup', async (req, res) => {
    try{
        const { name, username, password } = req.body; //get username and password from the body
        const hashedPassword = await bcrypt.hash(password, 10); // Encrypts the 'password' password

        const newUser = new User({ name, username, password: hashedPassword }); //Creates a new instance of User with hashedPassword instead.
        await newUser.save();

        res.status(201);
        res.json({ message: `Hello ${name}. You are now Registered!` });
    } catch(err){
        res.status(400).json({ message: "Seems like username is already in use", error: err.message })
    }
});


//Log In
router.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username }); // Find the username in the database

        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.json({ token }); //get a response with the token
    }catch(err){
        res.status(400).json({ message: err.message });
    }
    
});

module.exports = router;