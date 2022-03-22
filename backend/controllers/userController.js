const User = require('./../models/userModel');
const authService = require('./../services/auth_service');
const userService = require('./../services/user_service');


// exports.getUsers = async(req, res) => {
//     // Check auth token, and get firebaseId from result
//     let firebaseId = await authService.checkIfAuthenticated(req, res);
//     if (firebaseId == null) {
//         return res
//             .status(401)
//             .send({ error: 'You are not authorized to make this request' });
//     } else {
//         userService.getUsers(req, res);
//     }
// };

exports.getUser = async(req, res) => {
    // Check auth token, and get firebaseId from result
    const firebaseId = await authService
        .checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        // Invalid auth token 
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        try {
            const user = await userService.getUser(firebaseId);
            if (user != null) {
                res.status(200).json({
                    user: user,
                });
            } else {
                res.status(500).json({
                    status: 'Error',
                    error: 'Error finding user',
                });
            }

        } catch (e) {
            res.status(500).json({
                status: 'Error',
                error: e,
            });
        }
    }
};

exports.createUser = async(req, res) => {
    const firebaseId = await authService.checkIfAuthenticated(req, res);
    if (firebaseId == null) {
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
    } else {
        userService.createUser(req, res, firebaseId);

    }

};

exports.deleteUser = async(req, res) => {
    userService.deleteUser(req, res);
};