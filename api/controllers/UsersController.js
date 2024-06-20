const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { hasEmptyField } = require('../utils/Validator');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

class UsersController {

    async create(req, res) {
        const { name, email, password } = req.body;

        if (hasEmptyField(name, email, password)) {
            res.status(400).json({
                error: "Um ou mais campos faltando"
            });
            return;
        }

        try {
            const user = await User.findOne({ where: { email } });

            if (user) {
                res.status(400).json({
                    error: "Já existe um usuário cadastrado com este e-mail"
                });
                return;
            }

            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);

            await User.create({ name, email, password: hash });
            res.status(201).send("Usuário criado com sucesso");
        } catch (err) {
            console.log(err);
            res.status(500).send("Erro ao criar usuário");
        }
    }

    async auth(req, res) {
        const { email, password } = req.body;

        if (hasEmptyField(email, password)) {
            res.status(400).send("Um ou mais campos faltando");
            return;
        }

        try {
            const user = await User.findOne({ where: { email } });

            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    const MONTH = 30 * 24 * 60 * 60;

                    jwt.sign({ id: user.id, email }, secret, { expiresIn: MONTH }, (err, token) => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            res.json({ token });
                        }
                    });

                } else {
                    res.status(401).send("E-mail ou senha incorreta");
                }

                return;
            }

            res.status(400).status("Não existe usuário cadastrado com este e-mail");
        } catch (err) {
            console.log(err);
            res.status(500).send("Erro ao autenticar usuário");
        }
    }
}

module.exports = new UsersController();