const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const UserModel = mongoose.model("UserModel")
var bcrypt = require('bcryptjs');
const JWT_SECRET  = process.env.JWT_SECRET;


router.post("/signup", (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !password || !email) {
        return res.status(400).json({ error: "one or more mendatory fields are empty" })
    }
    UserModel.findOne({ email: email })
        .then((userInDb) => {
            if (userInDb) {
                return res.status(500).json({ error: "User with this email already regitered" })
            }
            bcrypt.hash(password, 16)
                .then((hashedPassword) => {
                    const user = new UserModel({ fullName, email, password: hashedPassword });
                    user.save()
                        .then((newUser) => {
                            res.status(201).json({ result: "User Signed Up Successfully!" });
                        })
                        .catch((err) => {
                            console.log(err);

                        })
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json({ error: "one or more mendatory fields are empty" })
    }
    UserModel.findOne({ email: email })
        .then((userInDb) => {
            if (!userInDb) {
                return res.status(401).json({ error: "Invalid credentials!" })
            }
            bcrypt.compare(password, userInDb.password)
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDb._id }, JWT_SECRET);
                        const userInfo = {_id: userInDb._id, "email": userInDb.email, "fullName": userInDb.fullName };
                        res.status(200).json({ result: { token: jwtToken, user: userInfo } });
                    } else {
                        return res.status(401).json({ error: "Invalid credentials!" })
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});


module.exports = router;