# Medium Amigo
O projeto consiste num blog como o "Medium", permitindo visualização de publicações, criação, edição e exclusão de posts, assim como dar e remover likes.

### O que foi utilizado
- Node
	- Express
	- Sequelize e Sequelize CLI
	- JWT
	- Bcrypt
- PostgreSQL

### Como rodar o projeto?
1. Você precisa ter o Node (preferencialmente 20 ou superior) e o PostgreSQL instalados
2. Clone o projeto na sua máquina;
3. Para rodar a API, acesse o diretório "api" com o comando `cd api`;
4. Se for a primeira vez rodando o projeto siga os seguintes passos:
	1. Execute o comando `npm install`;
	2. Crie o arquivo ".env" e configure suas variáveis de ambiente, seguindo o exemplo do arquivo "example.env";
	3. Rode o comando `npx sequelize-cli db:create` para criar o banco de dados nomeado no arquivo ".env";
	4. Rode o comando `npx sequelize-cli db:migrate` para criar as tabelas usando a migration;
5. Rode o comando `npm start` para rodar o servidor;
6. Pronto! Agora você pode testar a API.

## API - Rotas

#### POST /users
##### O que faz?
Cria um novo usuário no banco de dados.
##### Parâmetros
A rota espera um JSON com os seguintes campos:
```json
{
	"name": "Nome do usuário",
	"email": "nome@exemplo.com",
	"password": "SENHA_do_usuario"
}
```
Em que `name`, `email` e `password` não podem ser vazios.
##### Retornos
- Se um ou mais campos estiverem vazios ou faltando, retorna o status _400 - Bad Request_
- Se já existir um usuário com o e-mail enviado, retorna o status _400 - Bad Request_
- Se criar o usuário, retorna o status _201 - Created_
- Se houver algum erro no processo de criação, retorna o erro _500 - Internal Server Error_

#### POST /users/auth
##### O que faz?
Gera um token JWT para identificar e autenticar o usuário.
##### Parâmetros
A rota espera um JSON com os seguintes campos:
```json
{
	"email": "nome@exemplo.com",
	"password": "SENHA_do_usuario"
}
```
Em que `email` e `password` não podem ser vazios.
##### Retornos
- Se um ou mais campos estiverem vazios ou faltando, retorna o status _400 - Bad Request_
- Se não existir um usuário com o e-mail enviado, retorna o status _400 - Bad Request_
- Se a comparação do hash de senha salvo com a senha recebida for diferente, retorna o status _401 - Unauthorized_
- Se o ocorrer tudo bem, retorna um json com o token assinado:
```json
{
	"token": "exemplodetokenjwt"
}
```
- Se houver algum erro no processo de assinatura do token, retorna o erro _500 - Internal Server Error_
- Se houver algum erro no processo de autenticação, retorna o erro _500 - Internal Server Error_

#### POST /posts
##### O que faz?
Cria um novo post no banco de dados.
##### Parâmetros
A rota espera um JSON com os seguintes campos:
```json
{
	"title": "Título do post",
	"content": "Conteúdo do post",
	"summary": "Breve resumo",
	"available_at": "2024-06-21T10:00:00Z" // opcional
}
```
Em que `name`, `email` e `password` não podem ser vazios.

`available_at` é a data e hora na qual o post deve estar disponível. Adicionando uma data e hora futura, o post só estará disponível para listagem quando aquele momento chegar.
##### Autenticação
É necessário enviar o token JWT, recebido da rota `POST /users/auth`, nos _headers_ da requisição, dentro do campo _"Authorization"_.
##### Retornos
- Se um ou mais campos obrigatórios estiverem vazios ou faltando, retorna o status _400 - Bad Request_
- Se publicar o post, retorna o status _201 - Created_
- Se houver algum erro no processo de criação, retorna o erro _500 - Internal Server Error_

#### GET /posts
##### O que faz?
Retorna uma lista de até 10 posts publicados.
##### Parâmetros
Recebe um _query param_ "page", que deve ser um número inteiro para representar o _offset_ da busca. Exemplo: `GET /posts?page=1` retorna os 10 primeiros posts publicados.
##### Autenticação
Você pode optar por enviar o token JWT, recebido da rota `POST /users/auth`, nos _headers_ da requisição, dentro do campo _"Authorization"_. O token servirá para identificar quais posts pertencem ao seu usuário, definindo os campos `allowEdit` e `allowRemove` do JSON dos seus posts como `true`.
##### Retornos
- Se não receber o parâmetro "page", ou se ele não for inteiro, retorna o status _400 - Bad Request_
- Retorna um JSON com um array dos posts encontrados naquela página
```json
[
    {
        "id": 1,
        "title": "Como aprender JavaScript",
        "summary": "Dicas e truques para dominar JavaScript",
        "content": "JavaScript é uma linguagem de programação essencial para desenvolvimento web...",
        "likes": 12,
        "available_at": "2024-06-19T10:00:00.000Z",
        "created_at": "2024-06-01T08:00:00.000Z",
        "updated_at": "2024-06-15T12:00:00.000Z",
        "deleted_at": null,
        "is_deleted": false,
        "user": {
            "id": 101,
            "name": "Ana Silva"
        },
		// caso seu id de usuário identificado no jwt seja 101
        "allowEdit": true,
        "allowRemove": true
    },
    {
        "id": 2,
        "title": "Introdução ao Machine Learning",
        "summary": "Entendendo os conceitos básicos de Machine Learning",
        "content": "Machine Learning está revolucionando a forma como lidamos com dados...",
        "likes": 8,
        "available_at": "2024-06-20T14:00:00.000Z",
        "created_at": "2024-06-05T09:00:00.000Z",
        "updated_at": "2024-06-18T15:00:00.000Z",
        "deleted_at": null,
        "is_deleted": false,
        "user": {
            "id": 102,
            "name": "Carlos Souza"
        },
        "allowEdit": false,
        "allowRemove": false
    }
]
```

#### PUT /posts/:id
##### O que faz?
Atualiza os campos de um post.
##### Parâmetros
Recebe o parâmetro `id` via url, identificando o id do post a ser editado.

A rota espera um JSON com os seguintes campos:
```json
{
	"title": "Título do post",
	"content": "Conteúdo do post",
	"summary": "Breve resumo"
}
```
Neste caso, todos esses campos são opcionais. A API vai atualizar apenas os campos que não estejam vazios.
##### Autenticação
É necessário enviar o token JWT, recebido da rota `POST /users/auth`, nos _headers_ da requisição, dentro do campo _"Authorization"_.
##### Retornos
- Se o id do post não for informado, retorna o status _400 - Bad Request_
- Se não existir um post com o id informado, retorna o status _404 - Not Found_
- Se o id do criador do post for diferente do id do usuário autenticado, retorna o status _403 - Forbidden_
- Se os campos forem atualizados, retorna o status _200 - OK_
- Se houver algum erro no processo de atualização dos campos, retorna o status _500 - Internal Server Error_

#### DELETE /posts/:id
##### O que faz?
Exclui um post.
##### Parâmetros
Recebe o parâmetro `id` via url, identificando o id do post a ser excluído.
##### Autenticação
É necessário enviar o token JWT, recebido da rota `POST /users/auth`, nos _headers_ da requisição, dentro do campo _"Authorization"_.
##### Retornos
- Se o id do post não for informado, retorna o status _400 - Bad Request_
- Se não existir um post com o id informado, retorna o status _404 - Not Found_
- Se o id do criador do post for diferente do id do usuário autenticado, retorna o status _403 - Forbidden_
- Se o post for excluído, retorna o status _202 - Accepted_
- Se houver algum erro no processo de exclusão do post, retorna o status _500 - Internal Server Error_

#### POST /like/:id
##### O que faz?
Registra um like num post.
##### Parâmetros
Recebe o parâmetro `id` via url, identificando o id do post a receber o like.
##### Autenticação
É necessário enviar o token JWT, recebido da rota `POST /users/auth`, nos _headers_ da requisição, dentro do campo _"Authorization"_.
##### Retornos
- Se já existir um like do usuário autenticado no post informado, retorna o status _400 - Bad Request_
- Se não existir um post com o id informado, retorna o status _404 - Not Found_
- Se o like for registrado, retorna o status _200 - OK_
- Se houver algum erro no processo de registro do like, retorna o status _500 - Internal Server Error_

#### DELETE /like/:id
##### O que faz?
Remove um like de um post.
##### Parâmetros
Recebe o parâmetro `id` via url, identificando o id do post a remover o like.
##### Autenticação
É necessário enviar o token JWT, recebido da rota `POST /users/auth`, nos _headers_ da requisição, dentro do campo _"Authorization"_.
##### Retornos
- Se não existir um post com o id informado, retorna o status _404 - Not Found_
- Se não existir um like do usuário autenticado no post informado, retorna o status _400 - Bad Request_
- Se o like for removido, retorna o status _202 - Accepted_
- Se houver algum erro no processo de remoção do like, retorna o status _500 - Internal Server Error_