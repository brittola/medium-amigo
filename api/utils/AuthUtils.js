import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;

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
}