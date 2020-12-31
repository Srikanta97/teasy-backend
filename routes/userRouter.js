const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {
        let { email, password, passwordCheck, displayName } = req.body;
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ msg: "Account with this email already exists!" });
        }
        if (!email || !password || !passwordCheck) {
            return res.status(400).json({ msg: "Not all fields has been filled!" });
        }
        if (password.length < 5) {
            return res.status(400).json({ msg: "Password must contain at least 5 characters!" });
        }
        if (password !== passwordCheck) {
            return res.status(400).json({ msg: "Enter the same password twice!" });
        }
        if (!displayName) {
            displayName = email;
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        //console.log(passwordHash);
        const newUser = new User({
            email,
            password: passwordHash,
            displayName
        });
        const savedUser = await newUser.save();
        res.json(savedUser);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Not all fields have been filled!" });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.REACT_APP_JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
            }
        })
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/delete', auth, async (req, res) => {
    //console.log(req.user);
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.json(false);
        }
        const verifiedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
        if (!verifiedToken) {
            return res.json(false);
        }
        const user = await User.findById(verifiedToken.id);
        if (!user) {
            return res.json(false);
        }
        return res.json(true);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        displayName: user.displayName,
        id: user._id
    });
});
module.exports = router;