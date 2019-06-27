var express = require('express');
var mongoose = require('mongoose');
var gridfs = require('gridfs-stream');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');

const uriMongo = 'mongodb://informatik.hs-ruhrwest.de:5021/billman';
//const uriMongo = 'mongodb://localhost:5021/billman';
mongoose.connect(uriMongo, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
gridfs.mongo = mongoose.mongo;

let connection = mongoose.connection;

let documentSchema = new mongoose.Schema({
    "company": String,
    "procurement_date": Date,
    "receiptid": String,
    "category": String,
    "sum": Number,
    "favorite": Boolean,
    "note": String,
    "userid": String,
    "attachment": []
},
    { collection: 'document' }
);

let userSchema = new mongoose.Schema({
    "username": String,
    "mail": String,
    "vorname": String,
    "name": String,
    "passwort": String
},
    { collection: 'users' });

let User = mongoose.model('user', userSchema);
let Document = mongoose.model('document', documentSchema);

const storage = new GridFsStorage({
    url: uriMongo,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'fs'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

app.listen(5015, () => console.log('Example app listening on port 5015!'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {

    var gfs = gridfs(connection.db);

    app.get('/', function (req, res) {
        res.send('Hochschule Ruhr West - Jan Vogt, App BILLMAN - API');
    });

    // Get User by username from Database
    app.post('/User/login', function (req, res) {

        User.find(
            { username: req.body.username },
            function (err, dbres) {
                if (err) {
                    res.send("ERROR: At the query an error has appeared.")
                }
                if (dbres.length > 0) {
                    if (req.body.username == dbres[0].username && req.body.passwort == dbres[0].passwort) {
                        res.send(dbres);
                    } else {
                        res.send([])
                    }
                } else {
                    res.send([]);
                }
            })
    })

    // Create a User in Database
    app.post('/User', function (req, res) {
        let userExist = true;
        User.find({ username: req.body.username }, function (err, user) {
            if (err) { res.send('User Not Found') };
            if (user.length != 0) {
                res.send(user[0].username);
            } else {
                let userReq = new User(req.body);
                User.insertMany(userReq, function (err, dbres) {
                    if (!err) {
                        res.send(dbres);
                    } else {
                        res.send('ERROR: Can not insert')
                    }
                })
            }
        })
    })

    //Upload an Attachmet in Database
    app.post('/Attachment', upload.single('fileData'), (req, res, next) => {
        res.send(req.file);
    });

    // Get Attachment by ID
    app.get('/Attachment/:AttachmentID', function (req, res) {
        // Check file exist on MongoDB
        gfs.exist({ _id: req.params.AttachmentID }, function (err, file) {
            if (err || !file) {
                res.send('File Not Found');
            } else {
                var readstream = gfs.createReadStream({ _id: req.params.AttachmentID });
                readstream.pipe(res);
            }
        });
    });

    // Delete Attachment by ID
    app.delete('/Attachment/:AttachmentID', function (req, res) {
        gfs.exist({ _id: req.params.AttachmentID }, function (err, file) {
            if (err || !file) {
                res.send('File Not Found');
            } else {
                gfs.remove({ _id: req.params.AttachmentID }, function (err) {
                    if (err) res.send(err);
                    res.send('File Deleted');
                });
            }
        });
    });

    // Get Attachment (File Meta Data)
    app.get('/Attachment/:AttachmentID/meta', function (req, res) {
        gfs.exist({ _id: req.params.AttachmentID }, function (err, file) {
            if (err || !file) {
                res.send('File Not Found');
            } else {
                gfs.files.find({ _id: req.params.AttachmentID }).toArray(function (err, files) {
                    if (err) res.send(err);
                    res.send(files);
                });
            }
        });
    });

    // Create Document and get DocumentID
    app.post('/Document', function (req, res) {
        console.log("Create Document")
        let doc = new Document(req.body);
        Document.insertMany(doc, function (err, dbres) {
            if (!err) {
                res.send(dbres);
            } else {
                res.send('ERROR: Can not insert')
            }
        })
    });

    // Update Document by DocumentID
    app.post('/Document/:id', function (req, res) {
        Document.update({ "_id": req.params.id },
            { $set: req.body }, function (err, Document) {
                if (err) res.send('Document Not Found');
                res.send(Document);
            });
    });

    // Get Document by DocumentID
    app.get('/Document/:id', function (req, res) {
        Document.find({ "_id": req.params.id }, function (err, Document) {
            if (err) res.send('Document Not Found');
            res.send(Document);
        });
    });

    app.get('/Document', function (req, res) {
        Document.find({}).then(function (docs) {
            res.send(docs);
        });
    });

    app.get('/Document/Favorites/:userid', function (req, res) {
        Document.find({ favorite: true }).then(function (favorites) {
            res.send(favorites);
        });
    });

    // Delete Document by DocumentID
    app.delete('/Document/:id', function (req, res) {
        var message = "";
        Document.remove({ _id: req.params.id }, function (err, myres) {
            if (!err) {
                message = 'Document with id:' + req.params.id + ' removed.'
                res.send(myres);
            } else {
                message = 'Error: Can not remove by this Document ID: ' + req.params.id;
                res.send(message);
            }
        })
    });

    // Generate a Statisik about all costs in acutal year
    app.get('/Statistik/Year/:userid', function (req, res) {
        var CurrentDate = new Date();
        let beginYear = new Date(CurrentDate.getFullYear(), 0, 1);
        let endYear = new Date(CurrentDate.getFullYear(), 11, 31);
        Document.aggregate(
            [{
                $match: {
                    "procurement_date": {
                        $gte: beginYear,
                        $lt: endYear
                    }
                }
            },
            {
                $group: {
                    _id: "$category",
                    sum_category: { $sum: "$sum" }
                }
            },
            { $sort: { sum_category: 1 } }
            ], function (err, statistik) {
                res.send(statistik)
            })
    });

    // Generate a Statisik about all costs in acutal month
    app.get('/Statistik/Month/:userid', function (req, res) {
        var CurrentDate = new Date();
        let beginMonth = new Date(CurrentDate.getFullYear(), CurrentDate.getMonth(), 1);
        let endMonth = new Date(CurrentDate.getFullYear(), CurrentDate.getMonth(), 31);

        Document.aggregate(
            [{
                $match: {
                    "procurement_date": {
                        $gte: beginMonth,
                        $lt: endMonth
                    }
                }
            },
            {
                $group: {
                    _id: "$category",
                    sum_category: { $sum: "$sum" }
                }
            },
            { $sort: { sum_category: 1 } }
            ], function (err, statistik) {
                res.send(statistik)
            })
    });

    // Generate a Statisik about all costs today
    app.get('/Statistik/Day/:userid', function (req, res) {
        Document.aggregate(
            [{
                $match: {
                    "procurement_date": {
                        $gte: new Date(new Date().setHours(00, 00, 00)),
                        $lt: new Date(new Date().setHours(23, 59, 59))
                    }
                }
            },
            {
                $group: {
                    _id: "$category",
                    sum_category: { $sum: "$sum" }
                }
            },
            { $sort: { sum_category: 1 } }
            ], function (err, statistik) {
                res.send(statistik)
            })
    });
})