const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

class Authenticator {
    verifyToken(req, res, next) {
        if (!req.header('Authorization')) {
            res.status(400).send("Você deve enviar um token de autorização")
            return;
        }

        const token = req.header('Authorization').replace('Bearer ', '');

        jwt.verify(token, secret, (err, decodedToken) => {
            
            if (err) {
                res.status(401).send("Token inválido");
                return;
            }

            res.locals.loggedUserId = decodedToken.id;
            next();
        });
    }
}

module.exports = new Authenticator();