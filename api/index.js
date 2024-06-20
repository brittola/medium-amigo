const express = require('express');
const sequelize = require('./database/database');
require('dotenv').config();
const UserRoutes = require('./routes/UserRoutes');

const app = express();

app.use(express.json());

sequelize.authenticate()
    .then(() => console.log('Conexão com o banco de dados estabelecida.'))
    .catch(err => console.error('Não foi possível conectar ao banco de dados: ', err));

app.use('/', UserRoutes);

app.listen(process.env.SERVER_PORT, err => {
    if (err) {
        console.log('Erro ao rodar o servidor: ', err);
        return;
    }
    console.log(`Servidor rodando na porta ${process.env.SERVER_PORT}`);
});