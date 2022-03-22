// TAKEN FROM:
// https://stackoverflow.com/questions/8135718/how-to-use-gridfs-to-store-images-using-node-js-and-mongoose
// https://medium.com/@richard534/uploading-streaming-audio-using-nodejs-express-mongodb-gridfs-b031a0bcb20f
const mongoose = require('mongoose');
const multer = require('multer');
const { Readable } = require('stream');
const Note = require('./../models/noteModel');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 6000000 } });

const ObjectId = require('mongodb').ObjectId;

exports.getPhoto = (req, res) => {
    try {
        var photoID = new ObjectId(req.params.photoID);
    } catch (err) {
        return res.status(400).json({
            message: 'Invalid PhotoID in URL parameter.' +
                'Must be a single String of 12 bytes or a string of 24 hex characters'
        });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'photos',
    });

    const downloadStream = bucket.openDownloadStream(photoID);

    downloadStream.on('data', (chunk) => {
        res.write(chunk);
    });

    downloadStream.on('error', () => {
        res.sendStatus(404);
    });

    downloadStream.on('end', () => {
        res.end();
    });
};


exports.getAllPhotoInfo = async(req, res) => {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'photos',
    });

    bucket;

    const cursor = bucket.find({});
    console.log(await cursor.count());

    cursor.forEach((doc) => console.log(doc));

    const vals = await cursor.toArray();

    return res.status(400).json({ vals });
};

exports.deletePhoto = async(photoId) => {
    console.log('photoID in delete photo service');
    console.log(photoId);
    try {
        var photoID = new ObjectId(photoId);
    } catch (err) {
        console.log(err);
        return null;
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'photos',
    });

    const result = await bucket.delete(photoID);
    console.log(result);

    return result;
};

/**
 * POST photo Route
 */
exports.postPhoto = (req, res) => {
    upload.single('photo')(req, res, (err) => {
        console.log('name=' + req.body.name);
        if (err) {
            return res.status(400).json({ err });
        }
        const name = req.body.name;
        if (!name) {
            return res.status(400).json({ message: 'No Name' });
        }

        const photoName = req.body.name;

        // Covert buffer to Readable Stream
        const readablePhotoStream = new Readable();
        readablePhotoStream.push(req.file.buffer);
        readablePhotoStream.push(null);

        console.log(mongoose.connection.db);

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'photos',
        });

        const uploadStream = bucket.openUploadStream(photoName);
        const id = uploadStream.id;
        readablePhotoStream.pipe(uploadStream);

        uploadStream.on('error', () => {
            return res.status(500).json({ message: 'Error uploading file' });
        });

        uploadStream.on('finish', () => {
            return res.status(201).json({ message: 'File uploaded successfully, stored under Mongo ObjectId: ' + id });
        });
    });
};

exports.updateNoteWithPhoto = async(req, res) => {
    upload.single('photo')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ err });
        }
        let note;
        Note.findById(req.body.noteId).then((value) => {
            console.log(value);
            note = value;
            console.log('done');

            if (!note) {
                console.log('nonote');
                return res.status(400).json({ message: 'No note' });
            }

            const name = req.body.name;
            if (!name) {
                return res.status(400).json({ message: 'No Name' });
            }

            const photoName = req.body.name;

            // Covert buffer to Readable Stream
            const readablePhotoStream = new Readable();
            readablePhotoStream.push(req.file.buffer);
            readablePhotoStream.push(null);

            const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                bucketName: 'photos',
            });

            const uploadStream = bucket.openUploadStream(photoName);
            const id = uploadStream.id;
            readablePhotoStream.pipe(uploadStream);

            uploadStream.on('error', () => {
                // Error
                console.log('ERROR IN PHOTO SAVING');
                return res.status(500).json({ message: 'Error uploading file' });
            });

            uploadStream.on('finish', () => {
                // Finish
                console.log('FINISHED ADDING');

                note.imgId = id;

                note.save().then((note) => {
                    console.log(note);
                    res.status(200).json({
                        status: 'Success',
                        message: 'Note Created',
                        note,
                    });
                }).catch((err) => {
                    console.log('---Error----:', err);
                    res.status(500).json({
                        status: 'error',
                        message: 'db error',
                    });
                });
            });
        });
    });
};