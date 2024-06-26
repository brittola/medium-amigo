import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import Validator from '../utils/Validator.js';
const { hasEmptyField } = Validator;
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

class UsersController {

    async create(req, res) {
        const { name, email, password } = req.body;

        if (hasEmptyField(name, email, password)) {
            res.status(400).send("Um ou mais campos faltando");
            return;
        }

        try {
            const user = await User.findOne({ where: { email, is_deleted: false } });

            if (user) {
                res.status(400).send("Já existe um usuário cadastrado com este e-mail");
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
            const user = await User.findOne({ where: { email, is_deleted: false } });

            if (!user) {
                res.status(400).send("Não existe usuário cadastrado com este e-mail");
                return;
            }

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

                return;

            }

            res.status(401).send("E-mail ou senha incorreta");

        } catch (err) {
            console.log(err);
            res.status(500).send("Erro ao autenticar usuário");
        }
    }
}

export default new UsersController();
