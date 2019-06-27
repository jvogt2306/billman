let mongoose = require('mongoose');

let documentSchema = new mongoose.Schema({
    "company": String,
    "procurement_date": String,
    "receipt_id": Number,
    "category": String,
    "sum": String,
    "note": String,
    "attachment": []
},
    { collection: 'document' }
);
module.exports = documentSchema;