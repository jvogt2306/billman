let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    "username": String,
    "mail": String,
    "vorname": String,
    "name": String,
    "passwort": String
},
    { collection: 'user' })

module.exports = userSchema;