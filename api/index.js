import express from 'express';
import sequelize from './database/database.js';
import dotenv from 'dotenv';
dotenv.config();
import Routes from './routes/routes.js';
import cors from 'cors';

const app = express();
const routes = new Routes();

app.use(cors());

app.use(express.json());

sequelize.authenticate()
    .then(() => console.log('Conexão com o banco de dados estabelecida.'))
    .catch(err => console.error('Não foi possível conectar ao banco de dados: ', err));

app.use(routes.setup());

app.listen(process.env.SERVER_PORT, err => {
    if (err) {
        console.log('Erro ao rodar o servidor: ', err);
        return;
    }
    console.log(`Servidor rodando na porta ${process.env.SERVER_PORT}`);
});