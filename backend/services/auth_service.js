const admin = require('firebase-admin');


// TAKEN FROM:
// https://dev.to/emeka/securing-your-express-node-js-api-with-firebase-auth-4b5f


exports.checkIfAuthenticated = async(req, res) => {
    try {
        const userInfo = await admin
            .auth()
            .verifyIdToken((req.get('Authorization')));
        req.authId = userInfo.uid;
        return userInfo.uid;
    } catch (e) {
        console.log(e);
        return null;
    }
};