const express = require('express');
const UserRoute = express.Router();

UserRoute.route('/create').post(function (req, res) {
    //const user = new User(req.body);
    console.log(req.body);
    res.send(req.body);
});

module.exports = UserRoute;