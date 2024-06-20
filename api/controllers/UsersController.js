const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { hasEmptyField } = require('../utils/UserValidator');

class UsersController {

    async create(req, res) {
        const { name, email, password } = req.body;

        try {
            if (hasEmptyField(name, email, password)) {
                res.status(400).json({
                    error: "Um ou mais campos faltando"
                });
                return;
            }

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
}

module.exports = new UsersController();