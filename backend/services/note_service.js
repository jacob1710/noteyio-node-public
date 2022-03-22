const Note = require('./../models/noteModel');
const photoService = require('./../services/photo_service');




exports.deleteNote = async(noteId) => {
    try {
        const photoId = await module.exports.getPhotoIdOfNote(noteId);
        //If there is a photo, delete it along with note
        if (photoId != null) {
            //There is a photo to delete
            const photoDeleteResult = await photoService.deletePhoto(photoId);
            if (photoDeleteResult == null) {
                console.log('NULL PHOTO DELETE RESULT');
            }
        }

        const result = await Note.deleteOne({ _id: noteId });
        const message = result.deletedCount > 1 ?
            result.deletedCount + ' notes deleted' : result.deletedCount +
            ' note deleted';

        return true;
    } catch (e) {
        console.log(e);
        return false
    }
};

exports.getPhotoIdOfNote = async(noteId) => {
    try {
        const note = await module.exports.getNoteWithId(noteId);
        photoId = note.imgId;
        return photoId;
    } catch (e) {
        console.log(e);
        return null;
    }
};

exports.getAllNotesFromUser = async(userId) => {
    try {
        const notes = await Note.find({ userId: userId });
        return notes;

    } catch (e) {
        return null;
    }
};

exports.getNoteWithId = async(noteId) => {
    try {
        const note = await Note.findById(noteId);
        return note;
    } catch (e) {
        return null;
    }
};

exports.noteSearch = async(searchQuery, userId) => {
    let noteList;
    await Note.find().or([{ title: { '$regex': searchQuery, '$options': 'i' } }, { text: { '$regex': searchQuery, '$options': 'i' } }, { tags: { '$regex': searchQuery, '$options': 'i' } }])
        .and([{ userId: userId }])
        .then((notes) => {
            //Update notes list with found notes
            noteList = notes;
        })
        .catch((error) => {
            console.log(error);
        });
    return noteList;
};