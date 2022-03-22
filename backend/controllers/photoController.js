const photoService = require('./../services/photo_service');
const authService = require('./../services/auth_service');

// TAKEN FROM:
// https://stackoverflow.com/questions/8135718/how-to-use-gridfs-to-store-images-using-node-js-and-mongoose
// https://medium.com/@richard534/uploading-streaming-audio-using-nodejs-express-mongodb-gridfs-b031a0bcb20f
exports.getPhoto = async(req, res) => {
    // Check auth token, and get firebaseId from result
    let firebaseId = await authService.checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        photoService.getPhoto(req, res);
    }
};

exports.getAllPhotoInfo = async(req, res) => {
    // Check auth token, and get firebaseId from result
    let firebaseId = await authService.checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        photoService.getAllPhotoInfo(req, res);
    }
};

exports.deletePhoto = async(req, res) => {
    // Check auth token, and get firebaseId from result
    let firebaseId = await authService.checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        const result = await photoService.deletePhoto(req.query.photoID);

        return res.status(400).json({ 'result': result });

    };
}

exports.postPhoto = async(req, res) => {
    let firebaseId = await authService.checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        photoService.postPhoto(req, res);
    }
};

exports.updateNoteWithPhoto = async(req, res) => {
    // Check auth token, and get firebaseId from result
    let firebaseId = await authService.checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        photoService.updateNoteWithPhoto(req, res);
    }
};