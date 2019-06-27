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

const uriMongo = 'mongodb://mongojv:5021/local';
//const uriMongo = 'mongodb://informatik.hs-ruhrwest.de:5021/billman';
mongoose.connect(uriMongo, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
gridfs.mongo = mongoose.mongo;

let connection = mongoose.connection;

let documentSchema = new mongoose.Schema({
    "company": String,
    "procurement_date": String,
    "receipt_id": Number,
    "category": String,
    "sum": String,
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
    { collection: 'user' });

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

    // Upload Attachment and get AttachmentProperties
    app.post('/Attachment', upload.single('image'), (req, res) => {
        res.json({ file: req.file })
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
        var message = "";
        console.log('Update Document');
        Document.updateOne({ "_id": req.params.id }, req.body, { upsert: true }, function (err, doc) {
            if (err) { return res.send(500, { error: err }) };
            return res.send(doc);
        })
    });

    // Get Document by DocumentID
    app.get('/Document/:id', function (req, res) {
        Document.find({ "_id": req.params.id }, function (err, Document) {
            if (err) res.send('Document Not Found');
            res.send(Document);
        });
    });

    app.get('/Document', function (req, res) {
        Document.find({}).then(function (users) {
            res.send(users);
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

    // Find Documents (from / to) get Array of DocumentsID
    app.get('/getDocumentsRange/:from/:to', function (req, res) {
        Document.find({ "_id": req.params.id }, function (err, Document) {
            if (err) res.send('Document Not Found');
            res.send(Document);
        })
    });
})