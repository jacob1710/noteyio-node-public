const express = require('express');
const userController = require('./../controllers/userController');
const noteController = require('./../controllers/noteController');
const testController = require('./../controllers/testController');
const photoController = require('./../controllers/photoController');


const router = express.Router();


// Alive
router
    .route('/alive')
    .get(testController.alive);

// Users
// router
//     .route('/users/all')
//     .get(userController.getUsers);

router
    .route('/users/create')
    .post(userController.createUser);

router
    .route('/users/get')
    .get(userController.getUser);
router
    .route('/users/delete')
    .delete(userController.deleteUser);

// Notes
router
    .route('/notes/create')
    .post(noteController.createNote);
router
    .route('/notes/addPhotoToNote')
    .post(noteController.addPhotoToNote);
router
    .route('/notes/delete')
    .delete(noteController.deleteNote);
// router
//     .route('/notes/getAll')
//     .get(noteController.getAllNotes);
router
    .route('/notes/getAllForUser/')
    .get(noteController.getAllNotesFromUser);
router
    .route('/notes/search')
    .post(noteController.noteSearch);

router
    .route('/notes/getNoteWithId/')
    .get(noteController.getNoteWithId);


// Photos
router
    .route('/photo/get/:photoID')
    .get(photoController.getPhoto);
router
    .route('/photo/add')
    .post(photoController.postPhoto);
router
    .route('/photo/delete')
    .delete(photoController.deletePhoto);
// router
//     .route('/photo/getAll')
//     .get(photoController.getAllPhotoInfo);

module.exports = router;