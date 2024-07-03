import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;
const MONTH = 30 * 24 * 60 * 60;

export default class AuthUtils {
    static getLoggedUser(req) {
        let loggedUserId = 0;

        if (req.header('Authorization')) {
            const token = req.header('Authorization').replace('Bearer ', '');

            jwt.verify(token, secret, (err, decodedToken) => {
                if (!err) {
                    loggedUserId = decodedToken.id;
                }
            });
        }

        return loggedUserId;
    }

    static signToken(data) {
        return new Promise((resolve, reject) => {
            jwt.sign(data, secret, { expiresIn: MONTH }, (err, token) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }
}