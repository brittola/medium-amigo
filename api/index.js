const express = require('express');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const app = express();

app.use(express.json());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

sequelize.authenticate()
    .then(() => console.log('Conexão com o banco de dados estabelecida.'))
    .catch(err => console.error('Não foi possível conectar ao banco de dados: ', err));

app.listen(process.env.SERVER_PORT, err => {
    if (err) {
        console.log('Erro ao rodar o servidor: ', err);
        return;
    }

    console.log(`Servidor rodando na porta ${process.env.SERVER_PORT}`);
});