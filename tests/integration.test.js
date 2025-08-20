const request = require('supertest');
const app = require('../server');

describe('Testes de Integração - Fluxo Completo da API', () => {
  let authToken;
  let testUserId = 'test_integration_user';

  describe('Fluxo Completo de Autenticação e Biometria', () => {
    it('deve executar fluxo completo: autenticar, cadastrar e consultar fingerprint', async () => {
      // 1. Autenticar usuário
      const authResponse = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'abc123',
          senha: 'minhaSenhaSegura'
        });

      expect(authResponse.status).toBe(200);
      expect(authResponse.body).toHaveProperty('token');
      
      authToken = authResponse.body.token;

      // 2. Cadastrar fingerprint
      const cadastroResponse = await request(app)
        .post('/biometria/fingerprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'abc123',
          compartilhou_fingerprint: true
        });

      expect(cadastroResponse.status).toBe(201);
      expect(cadastroResponse.body.data.compartilhou_fingerprint).toBe(true);

      // 3. Consultar fingerprint
      const consultaResponse = await request(app)
        .get('/biometria/fingerprint/abc123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(consultaResponse.status).toBe(200);
      expect(consultaResponse.body.data.compartilhou_fingerprint).toBe(true);
      expect(consultaResponse.body.data.user_id).toBe('abc123');
    });

    it('deve permitir alterar decisão de compartilhamento', async () => {
      // 1. Autenticar usuário
      const authResponse = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'def456',
          senha: 'outraSenha123'
        });

      expect(authResponse.status).toBe(200);
      authToken = authResponse.body.token;

      // 2. Cadastrar fingerprint inicialmente como false
      const cadastroInicial = await request(app)
        .post('/biometria/fingerprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'def456',
          compartilhou_fingerprint: false
        });

      expect(cadastroInicial.status).toBe(201);
      expect(cadastroInicial.body.data.compartilhou_fingerprint).toBe(false);

      // 3. Alterar para true
      const alteracao = await request(app)
        .post('/biometria/fingerprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'def456',
          compartilhou_fingerprint: true
        });

      expect(alteracao.status).toBe(201);
      expect(alteracao.body.data.compartilhou_fingerprint).toBe(true);

      // 4. Verificar se foi alterado
      const consulta = await request(app)
        .get('/biometria/fingerprint/def456')
        .set('Authorization', `Bearer ${authToken}`);

      expect(consulta.status).toBe(200);
      expect(consulta.body.data.compartilhou_fingerprint).toBe(true);
    });
  });

  describe('Validações de Segurança', () => {
    it('deve rejeitar acesso a dados de outro usuário', async () => {
      // 1. Autenticar usuário abc123
      const authResponse = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'abc123',
          senha: 'minhaSenhaSegura'
        });

      expect(authResponse.status).toBe(200);
      authToken = authResponse.body.token;

      // 2. Tentar acessar dados do usuário def456
      const acessoNegado = await request(app)
        .get('/biometria/fingerprint/def456')
        .set('Authorization', `Bearer ${authToken}`);

      expect(acessoNegado.status).toBe(403);
      expect(acessoNegado.body.error).toBe('Acesso negado');
    });

    it('deve rejeitar token expirado ou inválido', async () => {
      const tokenInvalido = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWJjMTIzIiwiaWF0IjoxNzA1MzI0MDAwLCJleHAiOjE3MDUzMjQwMDF9.invalid_signature';

      const response = await request(app)
        .get('/biometria/fingerprint/abc123')
        .set('Authorization', `Bearer ${tokenInvalido}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token inválido');
    });
  });

  describe('Cenários de Erro', () => {
    it('deve retornar erro 400 para dados malformados', async () => {
      // 1. Autenticar usuário
      const authResponse = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'ghi789',
          senha: 'senhaTeste456'
        });

      expect(authResponse.status).toBe(200);
      authToken = authResponse.body.token;

      // 2. Tentar cadastrar com dados inválidos
      const dadosInvalidos = await request(app)
        .post('/biometria/fingerprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'ghi789',
          compartilhou_fingerprint: 'sim' // Deveria ser boolean
        });

      expect(dadosInvalidos.status).toBe(400);
      expect(dadosInvalidos.body.error).toBe('Dados inválidos');
    });

    it('deve retornar erro 404 para usuário inexistente', async () => {
      // 1. Autenticar usuário
      const authResponse = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'abc123',
          senha: 'minhaSenhaSegura'
        });

      expect(authResponse.status).toBe(200);
      authToken = authResponse.body.token;

      // 2. Limpar dados de biometria para garantir que o usuário não tenha fingerprint
      const { BiometriaService } = require('../services/biometriaService');
      BiometriaService.clearAllData();

      // 3. Tentar consultar usuário que não tem fingerprint
      const usuarioInexistente = await request(app)
        .get('/biometria/fingerprint/abc123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(usuarioInexistente.status).toBe(404);
      expect(usuarioInexistente.body.error).toBe('Usuário não encontrado');
    });
  });

  describe('Health Check e Documentação', () => {
    it('deve responder ao health check', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.status).toBe('OK');
    });

    it('deve disponibilizar documentação Swagger', async () => {
      const response = await request(app)
        .get('/api-docs');

      // Swagger pode retornar 301 (redirecionamento) ou 200
      expect([200, 301]).toContain(response.status);
      if (response.status === 200) {
        expect(response.headers['content-type']).toContain('text/html');
      }
    });
  });
}); 