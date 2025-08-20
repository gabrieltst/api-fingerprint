const request = require('supertest');
const app = require('../server');

describe('Rotas de Biometria', () => {
  let authToken;

  beforeAll(async () => {
    // Obter token de autenticação para os testes
    const response = await request(app)
      .post('/auth/token')
      .send({
        user_id: 'abc123',
        senha: 'minhaSenhaSegura'
      });
    
    authToken = response.body.token;
  });

  describe('POST /biometria/fingerprint', () => {
    it('deve cadastrar fingerprint com dados válidos e token válido', async () => {
      const response = await request(app)
        .post('/biometria/fingerprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'abc123',
          compartilhou_fingerprint: true
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('user_id');
      expect(response.body.data).toHaveProperty('compartilhou_fingerprint');
      expect(response.body.data).toHaveProperty('data_cadastro');
      expect(response.body.data.user_id).toBe('abc123');
      expect(response.body.data.compartilhou_fingerprint).toBe(true);
    });

    it('deve retornar erro 401 quando token não for fornecido', async () => {
      const response = await request(app)
        .post('/biometria/fingerprint')
        .send({
          user_id: 'abc123',
          compartilhou_fingerprint: true
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });

    it('deve retornar erro 401 quando token for inválido', async () => {
      const response = await request(app)
        .post('/biometria/fingerprint')
        .set('Authorization', 'Bearer token_invalido')
        .send({
          user_id: 'abc123',
          compartilhou_fingerprint: true
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });

    it('deve retornar erro 400 quando user_id não for fornecido', async () => {
      const response = await request(app)
        .post('/biometria/fingerprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          compartilhou_fingerprint: true
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Dados inválidos');
    });

    it('deve retornar erro 400 quando compartilhou_fingerprint não for fornecido', async () => {
      const response = await request(app)
        .post('/biometria/fingerprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'abc123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Dados inválidos');
    });

    it('deve retornar erro 400 quando user_id for vazio', async () => {
      const response = await request(app)
        .post('/biometria/fingerprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: '',
          compartilhou_fingerprint: true
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Dados inválidos');
    });

    it('deve retornar erro 400 quando compartilhou_fingerprint não for booleano', async () => {
      const response = await request(app)
        .post('/biometria/fingerprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'abc123',
          compartilhou_fingerprint: 'true'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Dados inválidos');
    });

    it('deve retornar erro 403 quando user_id do token não corresponder ao user_id da requisição', async () => {
      const response = await request(app)
        .post('/biometria/fingerprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'def456',
          compartilhou_fingerprint: true
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Acesso negado');
    });
  });

  describe('GET /biometria/fingerprint/:user_id', () => {
    beforeEach(async () => {
      // Não cadastrar fingerprint para que o teste de 404 funcione
      // O fingerprint será cadastrado apenas nos testes específicos que precisam
    });

    it('deve consultar fingerprint com token válido e user_id correto', async () => {
      // Primeiro cadastrar um fingerprint
      await request(app)
        .post('/biometria/fingerprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: 'abc123',
          compartilhou_fingerprint: false
        });

      // Agora consultar
      const response = await request(app)
        .get('/biometria/fingerprint/abc123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('user_id');
      expect(response.body.data).toHaveProperty('compartilhou_fingerprint');
      expect(response.body.data).toHaveProperty('data_cadastro');
    });

    it('deve retornar erro 401 quando token não for fornecido', async () => {
      const response = await request(app)
        .get('/biometria/fingerprint/abc123');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });

    it('deve retornar erro 401 quando token for inválido', async () => {
      const response = await request(app)
        .get('/biometria/fingerprint/abc123')
        .set('Authorization', 'Bearer token_invalido');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });

    it('deve retornar erro 403 quando user_id do token não corresponder ao user_id da consulta', async () => {
      const response = await request(app)
        .get('/biometria/fingerprint/def456')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Acesso negado');
    });

    it('deve retornar erro 404 quando usuário não tiver fingerprint cadastrado', async () => {
      const response = await request(app)
        .get('/biometria/fingerprint/abc123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Usuário não encontrado');
    });
  });
}); 