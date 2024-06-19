const express = require('express');
const app = express();

app.listen(3000, err => {
    if (err) {
        console.log("Erro ao rodar o servidor: " + err);
        return;
    }

    console.log("Servidor rodando na porta 3000");
});