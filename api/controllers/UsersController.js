import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import UserSchemas from '../schemas/User.js';
import UsersService from '../services/UsersService.js';

const secret = process.env.JWT_SECRET;

class UsersController {

    async create(req, res) {
        const { name, email, password } = req.body;

        try {
            await UserSchemas.create.validate({ name, email, password });
            const user = await UsersService.findOne(email);

            if (user) {
                res.status(400).json({ error: "Já existe um usuário cadastrado com este e-mail" });
                return;
            }

            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);

            await UsersService.create({ name, email, password: hash });
            res.status(201).json({ message: "Usuário criado com sucesso" });
        } catch (err) {
            console.log(err);

            if (err.name === 'ValidationError') {
                res.status(400).json({ errors: err.errors });
                return;
            }

            res.status(500).json({ error: "Erro ao criar usuário" });
        }
    }

    async auth(req, res) {
        const { email, password } = req.body;

        try {
            await UserSchemas.auth.validate({ email, password });

            const user = await UsersService.findOne(email);

            if (!user) {
                res.status(400).json({ error: "Não existe usuário cadastrado com este e-mail" });
                return;
            }

            if (bcrypt.compareSync(password, user.password)) {
                const MONTH = 30 * 24 * 60 * 60;

                jwt.sign({ id: user.id, email }, secret, { expiresIn: MONTH }, (err, token) => {
                    if (err) {
                        throw err;
                    } else {
                        res.json({ token });
                    }
                });

                return;
            }

            res.status(401).send("E-mail ou senha incorreta");

        } catch (err) {
            console.log(err);

            if (err.name === 'ValidationError') {
                res.status(400).json({ errors: err.errors });
                return;
            }

            res.status(500).send("Erro ao autenticar usuário");
        }
    }
}

export default new UsersController();
