# Frontend - ClickBeard

Frontend desenvolvido em React com TypeScript e Vite para o sistema de agendamento de barbearia.

## 🚀 Tecnologias

- **React** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e dev server rápido
- **React Router** - Roteamento para aplicações React
- **Axios** - Cliente HTTP para requisições à API
- **Zod** - Validação de esquemas (compatível com backend)

## 📦 Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm instalado globalmente (`npm install -g pnpm`)

## 🔧 Instalação

1. **Entre na pasta do frontend:**

```bash
cd Frontend
```

2. **Instale as dependências:**

```bash
pnpm install
```

## 🏃 Como Rodar

### Desenvolvimento

```bash
pnpm dev
```

O servidor de desenvolvimento estará rodando em `http://localhost:5173`.

### Build para Produção

```bash
pnpm build
```

Os arquivos otimizados serão gerados na pasta `dist`.

### Preview da Build

```bash
pnpm preview
```

## 🌐 Configuração da API

O frontend está configurado para consumir a API do backend que está rodando em `http://localhost:3333`.

A configuração pode ser ajustada no arquivo `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3333',
  // ...
})
```

## 📁 Estrutura do Projeto

```
Frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   └── ProtectedRoute.tsx
│   ├── contexts/            # Contextos React
│   │   └── AuthContext.tsx
│   ├── pages/               # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Appointments.tsx
│   │   └── CreateAppointment.tsx
│   ├── services/            # Serviços de API
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── appointments.ts
│   │   └── barbers.ts
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Ponto de entrada
│   └── index.css            # Estilos globais
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔐 Autenticação

O frontend utiliza JWT para autenticação:

- **Access Token**: Armazenado no `localStorage` e enviado no header `Authorization`
- **Refresh Token**: Armazenado em cookie HttpOnly pelo backend
- **Renovação Automática**: O interceptor do Axios renova automaticamente o token quando expira

## 🎨 Funcionalidades

### Para Clientes

- ✅ Login e Registro
- ✅ Visualizar perfil com agendamentos
- ✅ Buscar barbeiros
- ✅ Ver especialidades de cada barbeiro
- ✅ Criar agendamentos
- ✅ Cancelar agendamentos

### Fluxo de Agendamento

1. Buscar barbeiro por nome
2. Selecionar barbeiro
3. Escolher especialidade disponível
4. Selecionar data e horário
5. Confirmar agendamento

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview da build
pnpm preview

# Verificar tipos TypeScript
pnpm exec tsc --noEmit
```

## 📝 Notas Importantes

1. **CORS**: O backend precisa estar configurado para aceitar requisições do frontend
2. **Cookies**: O refresh token é gerenciado automaticamente via cookies HttpOnly
3. **Rotas Protegidas**: Páginas protegidas redirecionam para login se não autenticado
4. **Validações**: Os formulários validam os dados antes de enviar para a API

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

