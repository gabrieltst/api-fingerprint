# API Fingerprint - Biometria

API REST para cadastro de biometria fingerprint com autenticação JWT, desenvolvida em Node.js com Express.

## 🚀 Funcionalidades

- **Autenticação JWT**: Sistema seguro de autenticação com tokens Bearer
- **Cadastro de Biometria**: Endpoint para registrar decisão de compartilhamento de fingerprint
- **Consulta de Biometria**: Endpoint para verificar decisão de compartilhamento
- **Validação de Dados**: Validação robusta de entrada com mensagens de erro claras
- **Segurança**: Middleware de autenticação, rate limiting e headers de segurança
- **Documentação**: Swagger UI integrado para documentação da API
- **Testes**: Suite completa de testes unitários e de integração

## 📋 Requisitos

- Node.js 16+ 
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd api-fingerprint
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Execute a aplicação**
   ```bash
   # Desenvolvimento
   npm run dev
   
   # Produção
   npm start
   ```

## 🌐 Endpoints da API

### Autenticação

#### `POST /auth/token`
Gera token JWT para autenticação.

**Request Body:**
```json
{
  "user_id": "abc123",
  "senha": "minhaSenhaSegura"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Token gerado com sucesso"
}
```

### Biometria

#### `POST /biometria/fingerprint`
Cadastra decisão de compartilhamento de fingerprint.

**Headers:**
```
Authorization: Bearer <seu_token_aqui>
```

**Request Body:**
```json
{
  "user_id": "abc123",
  "compartilhou_fingerprint": true
}
```

**Response:**
```json
{
  "message": "Decisão de compartilhamento cadastrada com sucesso",
  "data": {
    "user_id": "abc123",
    "compartilhou_fingerprint": true,
    "data_cadastro": "2024-01-15T10:30:00.000Z"
  }
}
```

#### `GET /biometria/fingerprint/:user_id`
Consulta decisão de compartilhamento de fingerprint.

**Headers:**
```
Authorization: Bearer <seu_token_aqui>
```

**Response:**
```json
{
  "message": "Decisão consultada com sucesso",
  "data": {
    "user_id": "abc123",
    "compartilhou_fingerprint": true,
    "data_cadastro": "2024-01-15T10:30:00.000Z"
  }
}
```

### Utilitários

#### `GET /health`
Health check da API.

**Response:**
```json
{
  "status": "OK",
  "message": "API Fingerprint funcionando corretamente",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📚 Documentação

A documentação completa da API está disponível através do Swagger UI:

**URL:** `http://localhost:3000/api-docs`

## 🧪 Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes com coverage
```bash
npm test -- --coverage
```

### Executar testes específicos
```bash
# Testes de autenticação
npm test -- tests/auth.test.js

# Testes de biometria
npm test -- tests/biometria.test.js

# Testes de integração
npm test -- tests/integration.test.js
```

## 🔐 Usuários de Exemplo

Para facilitar os testes, a API inclui usuários pré-cadastrados:

| user_id | senha | nome |
|---------|-------|------|
| abc123 | minhaSenhaSegura | Usuário Teste 1 |
| def456 | outraSenha123 | Usuário Teste 2 |
| ghi789 | senhaTeste456 | Usuário Teste 3 |

## 🏗️ Estrutura do Projeto

```
api-fingerprint/
├── middleware/          # Middlewares da aplicação
│   └── auth.js         # Middleware de autenticação JWT
├── routes/              # Rotas da API
│   ├── auth.js         # Rotas de autenticação
│   └── biometria.js    # Rotas de biometria
├── services/            # Lógica de negócio
│   ├── userService.js  # Serviço de usuários
│   └── biometriaService.js # Serviço de biometria
├── tests/               # Testes automatizados
│   ├── auth.test.js    # Testes de autenticação
│   ├── biometria.test.js # Testes de biometria
│   └── integration.test.js # Testes de integração
├── server.js            # Arquivo principal do servidor
├── package.json         # Dependências e scripts
├── jest.config.js       # Configuração do Jest
├── env.example          # Exemplo de variáveis de ambiente
└── README.md            # Este arquivo
```

## 🔒 Segurança

- **JWT**: Autenticação baseada em tokens com expiração
- **Rate Limiting**: Limite de 100 requisições por IP a cada 15 minutos
- **Helmet**: Headers de segurança HTTP
- **CORS**: Configuração de Cross-Origin Resource Sharing
- **Validação**: Validação robusta de entrada de dados
- **Isolamento**: Usuários só podem acessar seus próprios dados

## 📊 Status Codes

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token ausente ou inválido |
| 403 | Forbidden - Acesso negado |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro interno do servidor |

## 🚀 Deploy

### Variáveis de Ambiente para Produção

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=<chave_secreta_muito_segura>
```

### Docker (opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Mentoria 2.0 Testes de Software**

## 🆘 Suporte

Para suporte ou dúvidas, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

---

**⚠️ Nota:** Esta é uma API de demonstração. Para uso em produção, considere implementar:
- Banco de dados persistente (PostgreSQL, MongoDB, etc.)
- Logs estruturados
- Monitoramento e métricas
- Backup e recuperação de dados
- CI/CD pipeline
- Containerização com Docker
