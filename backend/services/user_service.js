const User = require('./../models/userModel');
const authService = require('./../services/auth_service');

// exports.getUsers = async(req, res) => {
//     try {
//         const users = await User.find();
//         res.status(200).json({
//             users: users,
//         });
//     } catch (e) {
//         res.status(500).json({
//             status: 'Error',
//             error: e,
//         });
//     }
// };

exports.getUser = async(firebaseId) => {
    try {
        const user = await User.findOne({ firebaseId: firebaseId });
        return user;
    } catch (e) {
        res.status(500).json({
            status: 'Error',
            error: e,
        });
    }
};

exports.createUser = async(req, res, firebaseId) => {
    const body = req.body;
    const userName = req.body.userName;
    const email = req.body.email;
    // Create new user
    const user = new User({
        userName: userName,
        email: email,
        firebaseId: firebaseId,
    });

    // Save user to DB
    user.save().then((finalDoc) => {
        res.status(200).json({
            user,
        });
    }).catch((err) => {
        res.status(500).json({
            status: 'error',
            message: 'db error',
        });
    });
};

exports.deleteUser = async(req, res) => {
    const id = req.body.id;
    try {
        const result = await User.deleteOne({ _id: id });
        res.status(200).json({ result });
    } catch (e) {
        res.status(500).json({ e });
    }
};