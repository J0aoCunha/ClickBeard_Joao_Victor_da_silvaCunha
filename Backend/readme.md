# Backend - ClickBeard API

API RESTful desenvolvida em Node.js com Fastify para gerenciamento de agendamentos de barbearia.

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Rodar](#-como-rodar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Endpoints da API](#-endpoints-da-api)
- [Autenticação](#-autenticação)
- [Validações](#-validações)
- [Tratamento de Erros](#-tratamento-de-erros)

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Fastify** - Framework web rápido e eficiente
- **Prisma** - ORM para gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **Zod** - Validação de esquemas
- **bcryptjs** - Hash de senhas
- **pnpm** - Gerenciador de pacotes

## 📦 Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm instalado globalmente (`npm install -g pnpm`)
- PostgreSQL (versão 12 ou superior)
- Git

## 🔧 Instalação

1. **Clone o repositório e entre na pasta do backend:**

```bash
cd Backend
```

2. **Instale as dependências:**

```bash
pnpm install
```

3. **Configure as variáveis de ambiente** (veja seção [Configuração](#-configuração))

4. **Execute as migrações do Prisma:**

```bash
npx prisma migrate dev
```

5. **Gere o Prisma Client:**

```bash
npx prisma generate
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz da pasta `Backend` com as seguintes variáveis:

```env
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"

# JWT
JWT_SECRET="sua_chave_secreta_super_segura_aqui"

# Servidor
PORT=3333
NODE_ENV=dev
```

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória | Padrão |
|----------|-----------|-------------|--------|
| `DATABASE_URL` | URL de conexão do PostgreSQL | ✅ Sim | - |
| `JWT_SECRET` | Chave secreta para assinatura de tokens JWT | ✅ Sim | - |
| `PORT` | Porta em que o servidor irá rodar | ❌ Não | `3333` |
| `NODE_ENV` | Ambiente de execução (`dev`, `test`, `production`) | ❌ Não | `dev` |

## 🏃 Como Rodar

### Desenvolvimento

```bash
pnpm start:dev
```

O servidor estará rodando em `http://localhost:3333` (ou na porta especificada no `.env`).

### Verificar Banco de Dados

Para visualizar o banco de dados com Prisma Studio:

```bash
npx prisma studio
```

## 📁 Estrutura do Projeto

```
Backend/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/             # Migrações do banco
├── src/
│   ├── app.ts                 # Configuração do Fastify
│   ├── server.ts              # Inicialização do servidor
│   ├── env/
│   │   └── index.ts           # Validação de variáveis de ambiente
│   ├── http/
│   │   ├── controllers/       # Controllers das rotas
│   │   │   ├── admin/         # Rotas de administrador
│   │   │   ├── client/        # Rotas de cliente
│   │   │   ├── barber/        # Rotas de barbeiro
│   │   │   ├── specialty/     # Rotas de especialidade
│   │   │   └── appointment/   # Rotas de agendamento
│   │   ├── middlewares/       # Middlewares de autenticação
│   │   └── @types/            # Tipos TypeScript customizados
│   ├── repositories/          # Interfaces e implementações dos repositórios
│   ├── use-cases/             # Casos de uso (lógica de negócio)
│   ├── utils/                 # Utilitários (validações, etc)
│   └── lib/
│       └── prisma.ts          # Instância do Prisma Client
└── package.json
```

## 🌐 Endpoints da API

### Autenticação de Cliente

#### `POST /client/authenticate`
Autentica um cliente e retorna um token JWT.

**Body:**
```json
{
  "email": "cliente@email.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookie:** Um refresh token será definido automaticamente em um cookie HttpOnly.

#### `POST /client`
Registra um novo cliente.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta (201):**
```json
{
  "client": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "criado_em": "2024-01-15T10:30:00.000Z"
  }
}
```

#### `POST /client/refresh-token`
Renova o access token usando o refresh token do cookie.

**Headers:**
```
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `GET /me`
Obtém o perfil do cliente autenticado com seus agendamentos.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta (200):**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "agendamentos": [
    {
      "id": 1,
      "data_horario_formatada": "15/01/2024 às 14:30",
      "status": "ativo",
      "especialidade": "Corte de Cabelo",
      "barbeiro": "Pedro Santos"
    }
  ]
}
```

### Autenticação de Administrador

#### `POST /admin/authenticate`
Autentica um administrador.

**Body:**
```json
{
  "email": "admin@email.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /admin`
Registra um novo administrador (requer autenticação de admin).

**Body:**
```json
{
  "name": "Admin User",
  "email": "admin@email.com",
  "password": "senha123"
}
```

**Resposta (201):**
```json
{
  "admin": {
    "id": 1,
    "nome": "Admin User",
    "email": "admin@email.com",
    "criado_em": "2024-01-15T10:30:00.000Z"
  }
}
```

### Barbeiros

#### `POST /barber`
Cria um novo barbeiro (requer autenticação de admin).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "name": "Pedro Santos",
  "idade": 28
}
```

**Resposta (201):**
```json
{
  "barber": {
    "id": 1,
    "nome": "Pedro Santos",
    "idade": 28,
    "data_contratacao": "2024-01-15",
    "criado_em": "2024-01-15T10:30:00.000Z"
  }
}
```

#### `GET /barber/search?query=pedro`
Busca barbeiros por nome.

**Resposta (200):**
```json
{
  "barbers": [
    {
      "id": 1,
      "nome": "Pedro Santos",
      "idade": 28
    }
  ]
}
```

#### `GET /barber/:barberId/specialties`
Lista especialidades de um barbeiro.

**Resposta (200):**
```json
{
  "specialties": [
    {
      "id": 1,
      "nome": "Corte de Cabelo",
      "valor": 3000,
      "duracao_minutos": 30
    }
  ]
}
```

### Especialidades

#### `POST /specialty`
Cria uma nova especialidade (requer autenticação de admin).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "name": "Corte de Cabelo",
  "valor": 3000,
  "duracao_minutos": 30
}
```

**Resposta (201):**
```json
{
  "specialty": {
    "id": 1,
    "nome": "Corte de Cabelo",
    "valor": 3000,
    "duracao_minutos": 30
  }
}
```

#### `PATCH /specialty/:specialtyId`
Atualiza o valor de uma especialidade (requer autenticação de admin).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "valor": 3500
}
```

**Resposta (200):**
```json
{
  "specialty": {
    "id": 1,
    "nome": "Corte de Cabelo",
    "valor": 3500,
    "duracao_minutos": 30
  }
}
```

### Agendamentos

#### `POST /appointment`
Cria um novo agendamento (requer autenticação de cliente).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "barbeiro_especialidade_id": 1,
  "data": "2024-01-20",
  "hora": "14:30"
}
```

**Resposta (201):**
```json
{
  "appointment": {
    "id": 1,
    "cliente_id": 1,
    "barbeiro_especialidade_id": 1,
    "data_horario": "2024-01-20T14:30:00.000Z",
    "status": "ativo",
    "criado_em": "2024-01-15T10:30:00.000Z"
  }
}
```

#### `GET /appointment`
Lista agendamentos do cliente autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta (200):**
```json
{
  "appointments": [
    {
      "id": 1,
      "cliente_id": 1,
      "barbeiro_especialidade_id": 1,
      "data_horario": "2024-01-20T14:30:00.000Z",
      "status": "ativo",
      "criado_em": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### `PATCH /appointment/:appointment_id/cancel`
Cancela um agendamento (requer autenticação - cliente dono ou admin).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta (200):**
```json
{
  "appointment": {
    "id": 1,
    "status": "cancelado",
    "data_horario": "2024-01-20T14:30:00.000Z"
  }
}
```

#### `POST /appointment/connect-barber-specialty`
Conecta um barbeiro a uma especialidade (requer autenticação de admin).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "barberId": 1,
  "specialtyId": 1
}
```

**Resposta (201):**
```json
{
  "message": "Barbeiro conectado à especialidade com sucesso"
}
```

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Existem dois tipos de tokens:

### Access Token
- Duração: 10 minutos
- Enviado no header: `Authorization: Bearer <token>`
- Necessário para acessar endpoints protegidos

### Refresh Token
- Duração: 7 dias
- Armazenado em cookie HttpOnly
- Usado para renovar o access token
- Endpoint: `POST /client/refresh-token`

### Middlewares de Autenticação

- `verifyJWT`: Verifica se o usuário está autenticado (cliente ou admin)
- `verifyAdmin`: Verifica se o usuário é um administrador
- `verifyJWTOrAdmin`: Permite acesso tanto para cliente quanto para admin
- `verifyRefreshToken`: Verifica o refresh token no cookie

### Exemplo de Uso

```javascript
// Fazer login
const response = await fetch('/client/authenticate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@email.com', password: 'senha123' }),
  credentials: 'include' // Importante para receber cookies
});

const { token } = await response.json();

// Usar token em requisições protegidas
const protectedResponse = await fetch('/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  credentials: 'include'
});
```

## ✅ Validações

Todas as requisições são validadas usando **Zod**. Exemplos de validações:

### Cliente
- **Nome**: Mínimo 3 caracteres, máximo 100
- **Email**: Formato válido de email, máximo 100 caracteres
- **Senha**: Mínimo 6 caracteres, máximo 255

### Barbeiro
- **Nome**: Mínimo 3 caracteres, máximo 100
- **Idade**: Número inteiro, mínimo 18, máximo 100

### Agendamento
- **Data**: Formato `YYYY-MM-DD` (ex: `2024-01-20`)
- **Hora**: Formato `HH:MM` (ex: `14:30`)
- **Horário de funcionamento**: 8h às 18h
- **Data futura**: Não permite agendamentos no passado
- **Conflito**: Não permite dois agendamentos no mesmo horário para o mesmo barbeiro

### Especialidade
- **Nome**: Máximo 100 caracteres, único
- **Valor**: Número inteiro positivo
- **Duração**: Número inteiro positivo (em minutos)

## ⚠️ Tratamento de Erros

A API retorna erros padronizados:

### Erro de Validação (400)
```json
{
  "message": "Validation error",
  "issues": {
    "email": {
      "_errors": ["Email inválido"]
    },
    "password": {
      "_errors": ["Senha deve ter no mínimo 6 caracteres"]
    }
  }
}
```

### Erro de Autenticação (401)
```json
{
  "message": "Unauthorized"
}
```

### Erro de Autorização (403)
```json
{
  "message": "Você não tem permissão para cancelar este agendamento"
}
```

### Erro de Conflito (409)
```json
{
  "message": "Já existe um agendamento neste horário para este barbeiro"
}
```

### Erro Interno (500)
```json
{
  "message": "Internal server error",
  "error": "Mensagem detalhada (apenas em desenvolvimento)"
}
```

## 📊 Modelo de Dados

### Entidades Principais

- **administradores**: Administradores do sistema
- **clientes**: Clientes que fazem agendamentos
- **barbeiros**: Barbeiros da barbearia
- **especialidades**: Tipos de serviços oferecidos
- **barbeiro_especialidade**: Relação muitos-para-muitos entre barbeiros e especialidades
- **agendamentos**: Agendamentos realizados pelos clientes

### Relacionamentos

- Um **cliente** pode ter vários **agendamentos**
- Um **barbeiro** pode ter várias **especialidades**
- Uma **especialidade** pode ser oferecida por vários **barbeiros**
- Um **agendamento** está associado a um **barbeiro_especialidade** específico

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento (watch mode)
pnpm start:dev

# Gerar Prisma Client
npx prisma generate

# Rodar migrações
npx prisma migrate dev

# Abrir Prisma Studio
npx prisma studio

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 📝 Notas Importantes

1. **Cookies**: O refresh token é armazenado em cookie HttpOnly para segurança
2. **CORS**: Configurado para aceitar todas as origens em desenvolvimento
3. **Senhas**: São hasheadas usando bcrypt antes de serem salvas no banco
4. **Tokens**: Access tokens expiram em 10 minutos, refresh tokens em 7 dias
5. **Autorização**: Apenas o dono do agendamento ou um admin pode cancelá-lo
6. **Filtragem**: Agendamentos são filtrados automaticamente pelo cliente logado

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

