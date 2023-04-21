# CRUD de Usuário + Permissão de Administrador

# Endpoints

| Método | Endpoint          | Responsabilidade                                    |
| ------ | ----------------- | --------------------------------------------------- |
| POST   | /users            | Cadastrar um novo usuário                           |
| POST   | /login            | Logar com um usuário na aplicação gerando um token. |
| GET    | /users            | Listar todos os usuários da aplicação               |
| GET    | /users/profile    | Listar um usuário que está logado na aplicação      |
| PATCH  | /users/:id        | Atualizar os dados de um usuário                    |
| DELETE | /users/:id        | Fazer um soft delete de um usuário                  |
| PUT    | users/:id/recover | Reativar um usuário                                 |

<br>

### **POST /users** e **PATCH /users**

- **O email deve ser único:**

  - Caso seja enviado um email já registrado o retorno deve ser exatamente o abaixo:

    | Resposta do servidor:       |
    | --------------------------- |
    | Body: Formato Json          |
    | Status code: _409 CONFLICT_ |

    ```json
    {
      "message": "E-mail already registered"
    }
    ```

### Todas as rotas de **POST** e **PATCH**

- **Deve haver serialização de dados:**

  - A serialização dos dados de entrada deve ser feita utilizando o zod.
  - Em caso de erro a mensagem retornada deve seguir o padrão a seguir:

    | Resposta do servidor:          |
    | ------------------------------ |
    | Body: Formato Json             |
    | Status code: _400 BAD REQUEST_ |

    ```json
    {
      "name": ["Required"],
      "email": ["Invalid email"],
      "password": ["Expected string, received number"]
    }
    ```

### **GET /users**, **PATCH /users**, **DELETE /users** e **PUT /users**

- **Devem conter validação por token:**

  - Caso o token não seja enviado, deve se obter o seguinte retorno:
    | Resposta do servidor: |
    | ------------------------------ |
    | Body: Formato Json |
    | Status code: _401 UNAUTHORIZED_ |

    ```json
    {
      "message": "Missing Bearer Token"
    }
    ```

  - Caso haja um erro na decodificação do token JWT, deve-se retornar a mensagem de erro padrão da biblioteca, nos parâmetros abaixo:
    | Resposta do servidor: |
    | ------------------------------ |
    | Body: Formato Json |
    | Status code: _401 UNAUTHORIZED_ |

    ```json
    {
      "message": // mensagem padrão da biblioteca
    }
    ```

### **GET /users** e **PUT /users/:id/recover**

- **Apenas administradores podem acessar:**

  - Caso um usuário não administrador faça requisição, deve-se obter o seguinte retorno:
    | Resposta do servidor: |
    | ------------------------------ |
    | Body: Formato Json |
    | Status code: _403 FORBIDDEN_ |

    ```json
    {
      "message": "Insufficient Permission"
    }
    ```

### **PATCH /users/:id** e **DELETE /users/:id**

- **Tanto usuários _administradores_ quanto _não administradores_ podem fazer requisições:**

  - Um usuário **_não administrador_** só pode atualizar ou deletar a sí mesmo;
  - Um usuário **_administrador_** pode atualizar ou deletar qualquer usuário;

  - Caso um usuário **_não administrador_** tente deletar ou atualizar outro usuário que **não** seja o dele, deve-se obter o seguinte retorno:
    | Resposta do servidor: |
    | ------------------------------ |
    | Body: Formato Json |
    | Status code: _403 FORBIDDEN_ |

    ```json
    {
      "message": "Insufficient Permission"
    }
    ```

### **POST /login**

- **Deve validar se o usuário:**

  - Existe (email valido);
  - Está ativo;
  - Se a senha está correta.

  - Caso não passe em alguma das validações anteriores deve-se obter o seguinte retorno:
    | Resposta do servidor: |
    | ------------------------------ |
    | Body: Formato Json |
    | Status code: _401 UNAUTHORIZED_ |

    ```json
    {
      "message": "Wrong email/password"
    }
    ```

### **PUT /users/:id/recover**

- **Deve reativar um usuário que está inativo:**

  - O valor de **_active_** deve ser alterado para **_true_**;
  - Caso o **_active_** do usuário com o **_id_** enviado na rota já seja **_true_**, deve-se retornar o seguinte:

    | Resposta do servidor:          |
    | ------------------------------ |
    | Body: Formato Json             |
    | Status code: _400 BAD REQUEST_ |

    ```json
    {
      "message": "User already active"
    }
    ```

### **Todas as rotas que recebem _id_ por parâmetro**

- Deve verificar se o id passado existe:
- Caso o usuário do _id_ passado não exista deverá retornar o seguinte:
  | Resposta do servidor: |
  | ------------------------------ |
  | Body: Formato Json |
  | Status code: _404 NOT FOUND_ |

  ```json
  {
    "message": "User not found"
  }
  ```

#

## **Exemplos de Requisição**

### **Rotas não autenticadas**

Essas rotas não precisam de um token válido para serem acessadas.

- **POST /users**

  - Rota de criação de usuário. A chave admin é opcional, caso não enviada deve ser definida como false.

    | Dados de Envio:    |
    | ------------------ |
    | Body: Formato Json |

    ```json
    {
      "name": "Fabio",
      "email": "fabio@kenzie.com.br",
      "password": "naomaisjunior",
      "admin": true,
      "active": false
    }
    ```

    | Resposta do servidor:      |
    | -------------------------- |
    | Body: Formato Json         |
    | Status code: _201 CREATED_ |

    ```json
    // atente-se ao valor de active recebido e retornado;
    {
      "id": 1,
      "name": "Fabio",
      "email": "fabio@kenzie.com.br",
      "admin": true,
      "active": true
    }
    ```

- **POST - /login**

  - Deve ser capaz de gerar um token jwt válido.

    | Dados de Envio:    |
    | ------------------ |
    | Body: Formato Json |

    ```json
    {
      "email": "fabio@kenzie.com.br",
      "password": "naomaisjunior"
    }
    ```

    | Resposta do servidor: |
    | --------------------- |
    | Body: Formato Json    |
    | Status code: _200 OK_ |

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### **Rotas autenticadas**

_Todas as rotas a seguir devem ser autenticas._

No **_header_**(cabeçalho) da requisição deve ser enviado um **_Bearer &lt;token_**&gt;.

| Header                |
| --------------------- |
| Option: Authorization |
| Type: Bearer          |
| Value: JWT token      |

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

- **GET - /users**

  - Rota de listagem de usuários;
  - Deve retornar todos os usuários da aplicação.

    | Resposta do servidor: |
    | --------------------- |
    | Body: Formato Json    |
    | Status code: _200 OK_ |

    ```json
    [
      {
        "id": 1,
        "name": "Fabio",
        "email": "fabio@kenzie.com.br",
        "admin": true,
        "active": true
      },
      {
        "id": 2,
        "name": "Cauan",
        "email": "cauan@kenzie.com.br",
        "admin": false,
        "active": false
      }
    ]
    ```

- **GET - /users/profile**

  - Rota de perfil. Deve retornar todos os dados dos usuário logado.

    | Resposta do servidor: |
    | --------------------- |
    | Body: Formato Json    |
    | Status code: _200 OK_ |

    ```json
    {
      "id": 1,
      "name": "Fabio",
      "email": "fabio@kenzie.com.br",
      "admin": true,
      "active": true
    }
    ```

- **PATCH - /users/:id**

  - Rota de atualização de usuário. Deve ser capaz de atualizar tanto um quanto todos os dados de um usuário.
  - O exemplo abaixo foi feito na rota **_/users/1_**.

    | Dados de Envio:    |
    | ------------------ |
    | Body: Formato Json |

    ```json
    {
      "name": "Fabio Junior"
    }
    ```

    | Resposta do servidor: |
    | --------------------- |
    | Body: Formato Json    |
    | Status code: _200 OK_ |

    ```json
    {
      "id": 1,
      "name": "Fabio Junior",
      "email": "fabio@kenzie.com.br",
      "admin": true,
      "active": true
    }
    ```

- **DELETE - /users/:id**

  - Deve ser capaz de fazer **soft delete** em um usuário;

        O soft delete é a ação de modificar alguma propriedade de uma tabela que indica que o dado está ativo ou não, nesse caso é a propriedade active da tabela de users, na qual é possível identificar que o mesmo foi "marcado" como deletado, mas suas informações ainda irão permanecer no banco. Sendo uma modificação em vez deleção.

  - O exemplo abaixo foi feito na rota /users/2
    | Resposta do servidor: |
    | --------------------- |
    | Body: Nenhum |
    | Status code: _204 NO CONTENT_ |

    ```json
      // nenhum dado deve ser retorando
    ```

- **PUT - /users/:id/recover**

  - Deve ser capaz de **_recuperar_** o usuário que foi **_desativado_**.
  - O **_active_** deve ser alterado para **_true_**.
  - O exemplo abaixo foi feito na rota **_/users/2/recover_**.

    | Resposta do servidor: |
    | --------------------- |
    | Body: Formato Json    |
    | Status code: _200 OK_ |

    ```json
    {
      "id": 2,
      "name": "Cauan",
      "email": "cauan@kenzie.com.br",
      "admin": false,
      "active": true
    }
    ```
