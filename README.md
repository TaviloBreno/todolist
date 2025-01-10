# API de Gerenciamento de Tarefas

Esta aplicação é uma API desenvolvida utilizando **Adonis.js**, com foco em boas práticas de programação, incluindo **Clean Code**, **SOLID**, e **arquitetura modular**. O objetivo principal é gerenciar tarefas, permitindo a criação, leitura, atualização e exclusão (CRUD) de forma eficiente e escalável.

## **Repositório**
O código-fonte está disponível no GitHub:  
[https://github.com/TaviloBreno/todolist.git](https://github.com/TaviloBreno/todolist.git)

---

## Endpoints

A API oferece os seguintes endpoints para gerenciamento de tarefas, usuários e documentação:

### Autenticação
- **POST /register**: Registra um novo usuário.
- **POST /login**: Autentica um usuário e retorna um token JWT.

### Perfil do Usuário
- **GET /profile**: Retorna os detalhes do perfil do usuário autenticado.
- **PUT /profile**: Atualiza as informações do perfil do usuário autenticado.

### Tarefas
- **POST /tasks**: Cria uma nova tarefa.
- **GET /tasks**: Lista todas as tarefas do usuário autenticado.
- **GET /tasks/:id**: Retorna os detalhes de uma tarefa específica.
- **PUT /tasks/:id**: Atualiza uma tarefa existente.
- **DELETE /tasks/:id**: Exclui uma tarefa.

### Compartilhamento de Tarefas
- **POST /tasks/:id/share**: Compartilha uma tarefa com outros usuários.
- **GET /tasks/sharedwithme**: Lista as tarefas compartilhadas com o usuário autenticado.

### Documentação
- **GET /swagger**: Retorna a documentação da API no formato JSON.
- **GET /docs**: Exibe a interface do Swagger UI para explorar a API.

## **Principais Funcionalidades**
- **Criar Tarefa**: Adicionar uma nova tarefa com título e descrição.
- **Estrutura Modular**: Separação em camadas (Controller, Service, Repository).
- **Princípios de Boas Práticas**:
  - **SOLID**: Design orientado à responsabilidade única, abstração e escalabilidade.
  - **Clean Code**: Código limpo, legível e de fácil manutenção.

---

## **Tecnologias Utilizadas**
- **Adonis.js**: Framework Node.js para aplicações modernas.
- **TypeScript**: Linguagem para maior segurança e produtividade.
- **Lucid ORM**: Integração com banco de dados relacional.
- **MySQL**: Banco de dados para persistência das tarefas.

---

## **Configuração do Projeto**

### **1. Pré-requisitos**
- Node.js (v16+)
- NPM ou Yarn
- Banco de Dados MySQL

### **2. Instalação**
Clone o repositório e instale as dependências:
```bash
git clone https://github.com/TaviloBreno/todolist.git
cd todolist
npm install
```
Execute as migrations e seeders para configurar o banco de dados:
```bash
node ace migration:run
node ace db:seed
```
### **3. Executando a Aplicação**
Inicie o servidor de desenvolvimento:
```bash
node ace serve --watch
```
A aplicação estará disponível em `http://localhost:3333`.

### **4. Documentação da API**
A documentação da API pode ser acessada através do Swagger UI:
[http://localhost:3333/docs](http://localhost:3333/docs)
