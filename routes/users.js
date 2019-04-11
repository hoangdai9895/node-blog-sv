const express = require('express');
const router = express.Router();

const bycrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const key = require('../config/key');

// model
const User = require('../models/User');

// test
router.get('', (req, res) => res.json({ msg: "USer router !!!!" }))

// register
router.post('/register', (req, res) => {
    // create user
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: "Email already exists !!!!" })
            } else {
                const newUSer = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                bycrypt.genSalt(10, (err, salt) => {
                    bycrypt.hash(newUSer.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUSer.password = hash;
                        newUSer.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }

        })
});

// login
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    User.findOne({ email }).then(user => {
        if (!user) {
            res.status(400).json({ email: "User not found !!!" })
        }
        bycrypt.compare(password, user.password)
            .then(match => {
                if (match) {
                    const payload = {
                            id: user.id,
                            name: user.name
                        }
                        // sign token
                    jwt.sign(payload, key.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                        if (err) throw err;
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        })
                    })
                } else {
                    return res.status(400).json({ password: 'Password does not match !!' })
                }
            })
    })
})

module.exports = router;