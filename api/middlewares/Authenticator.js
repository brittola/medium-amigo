import jwt from 'jsonwebtoken';
import 'dotenv/config';

const secret = process.env.JWT_SECRET;

export default class Authenticator {
    static verifyToken(req, res, next) {
        if (!req.header('Authorization')) {
            res.status(400).json({error: "USER MUST BE AUTHENTICATED"});
            return;
        }

        const token = req.header('Authorization').replace('Bearer ', '');

        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                res.status(401).json({error: "INVALID TOKEN"});
                return;
            }

            res.locals.loggedUserId = decodedToken.id;
            next();
        });
    }
}
