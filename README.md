# 🎯 ClickBeard - Sistema de Agendamento de Barbearia

Sistema completo de gerenciamento de agendamentos para barbearia, desenvolvido com **React + TypeScript** no frontend e **Node.js + Fastify** no backend.

## 📋 Sobre o Projeto

O ClickBeard é uma aplicação moderna e responsiva para gerenciamento de agendamentos em barbearias. O sistema permite que clientes agendem serviços com barbeiros específicos, enquanto administradores gerenciam barbeiros, especialidades e visualizam todos os agendamentos.

## 🚀 Tecnologias

### Frontend
- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápido
- **React Router** - Roteamento SPA
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações modernas

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Fastify** - Framework web rápido
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **Zod** - Validação de esquemas
- **bcryptjs** - Hash de senhas

## 📁 Estrutura do Projeto

```
ClickBeard_Joao_Victor_da_silvaCunha/
├── Backend/              # API RESTful
│   ├── src/
│   │   ├── http/         # Controllers e middlewares
│   │   ├── use-cases/    # Lógica de negócio
│   │   ├── repositories/ # Camada de dados
│   │   └── utils/        # Utilitários
│   ├── prisma/           # Schema e migrações
│   └── readme.md         # Documentação do backend
│
├── Frontend/              # Aplicação React
│   ├── src/
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── contexts/     # Contextos React
│   │   └── services/     # Serviços de API
│   └── README.md         # Documentação do frontend
│
├── script.sql            # Script SQL
└── README.md            # Este arquivo
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 18 ou superior)
- pnpm instalado globalmente (`npm install -g pnpm`)
- PostgreSQL (versão 12 ou superior)

### Backend

1. **Entre na pasta do backend:**
```bash
cd Backend
```

2. **Instale as dependências:**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente:**
   - Copie `.env.example` para `.env` (ou crie manualmente)
   - Configure `DATABASE_URL`, `JWT_SECRET`, `PORT` e `NODE_ENV`.

4. **Execute as migrações:**
```bash
npx prisma migrate db pull
npx prisma generate
```

5. **Inicie o servidor:**
```bash
pnpm start:dev
```

O backend estará rodando em `http://localhost:3333`

### Frontend

1. **Entre na pasta do frontend:**
```bash
cd Frontend
```

2. **Instale as dependências:**
```bash
pnpm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
pnpm dev
```

O frontend estará rodando em `http://localhost:5173`

## 🎯 Funcionalidades

### Para Clientes
- ✅ Login e registro
- ✅ Visualizar agendamentos próprios
- ✅ Criar novos agendamentos
- ✅ Ver horários disponíveis em tempo real
- ✅ Cancelar agendamentos futuros
- ✅ Ver status dos agendamentos (ativo, cancelado, concluído)

### Para Administradores
- ✅ Login administrativo
- ✅ Dashboard com estatísticas
- ✅ Gerenciar barbeiros (criar)
- ✅ Gerenciar especialidades (criar)
- ✅ Conectar barbeiros a especialidades
- ✅ Visualizar todos os agendamentos
- ✅ Cancelar qualquer agendamento
- ✅ Cadastrar novos administradores

### Validações e Regras de Negócio
- ✅ Horário de funcionamento: 9h às 18h (segunda a sexta)
- ✅ Agendamentos apenas para datas futuras
- ✅ Prevenção de conflitos de horário por barbeiro
- ✅ Consideração da duração do serviço
- ✅ Marcação automática de agendamentos passados como "concluído"
- ✅ Horários disponíveis de 30 em 30 minutos

## 📚 Documentação

- **Backend**: Veja `Backend/readme.md` para documentação completa da API
- **Frontend**: Veja `Frontend/README.md` para documentação do frontend
- **Checklist**: Veja `CHECKLIST_PROJETO.md` para lista completa de funcionalidades

## 🛠️ Scripts Disponíveis

### Backend
```bash
pnpm start:dev    # Desenvolvimento
pnpm build        # Build para produção
pnpm start        # Produção
```

### Frontend
```bash
pnpm dev          # Desenvolvimento
pnpm build        # Build para produção
pnpm preview      # Preview da build
```

## 🔐 Segurança

- Tokens JWT com expiração de 10 minutos (access token)
- Refresh tokens em cookies HttpOnly (7 dias)
- Senhas hasheadas com bcryptjs
- Middlewares de autenticação e autorização
- Validação de dados com Zod
- CORS configurado

## 📝 Notas Importantes

1. **Primeiro Admin**: É necessário criar o primeiro administrador manualmente no banco de dados ou via seed
2. **CORS**: O backend está configurado para aceitar requisições do frontend em desenvolvimento
3. **Cookies**: O refresh token é gerenciado automaticamente via cookies HttpOnly
4. **Timezone**: As datas são tratadas no horário local do servidor

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Desenvolvedor

João Victor da Silva Cunha

---
