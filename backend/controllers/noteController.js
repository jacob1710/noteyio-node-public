const Note = require('./../models/noteModel');
const noteService = require('./../services/note_service');
const photoService = require('./../services/photo_service');
const authService = require('./../services/auth_service');
const userService = require('./../services/user_service');



exports.createNote = async(req, res) => {
    // Check auth token, and get firebaseId from result
    let firebaseId = await authService.checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        // If null returned, not authorised
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        const user = await userService.getUser(firebaseId);
        // Use auth token from firebase auth for user id for security
        const userId = user.id;

        const newNote = new Note({
            userId: userId,
            text: req.body.text,
            imgId: req.body.imgId,
            tags: req.body.tags,
            title: req.body.title,
        });


        // Save note to the DB
        newNote.save().then((note) => {
            res.status(200).json({
                status: 'Success',
                message: 'Note Created',
                note,
            });
        }).catch((err) => {
            res.status(500).json({
                status: 'error',
                message: 'db error',
            });
        });
    }
};

exports.addPhotoToNote = async(req, res) => {
    // Check auth token, and get firebaseId from result
    let firebaseId = await authService.checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        // If null returned, not authorised
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        photoService.updateNoteWithPhoto(req, res);
    }
};


exports.deleteNote = async(req, res) => {
    // Check auth token, and get firebaseId from result
    let firebaseId = await authService.checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        // If null returned, not authorised
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        const noteId = req.query.noteId;
        const didDelete = await noteService.deleteNote(noteId);
        if (didDelete == true) {
            res.status(200).json({
                status: 'Success',
                message: 'Note Deleted',
            });
        } else {
            res.status(500).json({
                status: 'Error',
                error: 'Error, didnt delete note',
            });
        }
    }
};

exports.getAllNotesFromUser = async(req, res) => {
    // Check auth token, and get firebaseId from result
    let firebaseId = await authService.checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        const user = await userService.getUser(firebaseId);
        // Use auth token from firebase auth for user id for security
        const userId = user.id;
        const notes = await noteService.getAllNotesFromUser(userId);
        if (notes != null) {
            res.status(200).json({
                notes,
            });
        } else {
            res.status(500).json({
                status: 'Error',
                error: e,
            });
        }
    }
};

exports.getNoteWithId = async(req, res) => {
    // Check auth token, and get firebaseId from result
    let firebaseId = await authService.checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        const user = await userService.getUser(firebaseId);
        // Use auth token from firebase auth for user id for security
        const userId = user.id;
        const note = await noteService.getNoteWithId(userId);
        if (note != null) {
            res.status(200).json({
                note,
            });
        } else {
            res.status(500).json({
                status: 'Error',
                error: 'Note is null',
            });
        }
    }
};

// exports.getAllNotes = async(req, res) => {
//     //ROUTE USED FOR TESTING AT START - NO LONGER IN USE
//     try {
//         const notes = await Note.find();
//         res.status(200).json({
//             notes,
//         });
//     } catch (e) {
//         res.status(500).json({
//             status: 'Error',
//             error: e,
//         });
//     }
// };

exports.noteSearch = async(req, res) => {
    // Check auth token, and get firebaseId from result
    let firebaseId = await authService.checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        console.log('not valid');
        // Auth controller already denied request
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        // const searchQuery = await check(req.body.searchQuery).exists().unescape();
        const searchQuery = req.body.searchQuery;
        const user = await userService.getUser(firebaseId);
        // Use auth token from firebase auth for user id for security
        const userId = user.id;
        const notes = await noteService.noteSearch(searchQuery, userId);
        if (notes != null) {
            console.log('notes not null');
            res.status(200).json({
                notes,
            });
        } else {
            console.log('notes null');
            res.status(500).json({
                status: 'Error',
                error: 'Error with search',
            });
        }
    }

};