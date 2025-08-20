const request = require('supertest');
const app = require('../server');

describe('Rotas de Autenticação', () => {
  describe('POST /auth/token', () => {
    it('deve gerar token com credenciais válidas', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'abc123',
          senha: 'minhaSenhaSegura'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Token gerado com sucesso');
    });

    it('deve retornar erro 400 quando user_id não for fornecido', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          senha: 'minhaSenhaSegura'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Dados inválidos');
    });

    it('deve retornar erro 400 quando senha não for fornecida', async () => {
      const response = await request(app)
        .post('/auth/token')
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
        .post('/auth/token')
        .send({
          user_id: '',
          senha: 'minhaSenhaSegura'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Dados inválidos');
    });

    it('deve retornar erro 400 quando senha for vazia', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'abc123',
          senha: ''
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Dados inválidos');
    });

    it('deve retornar erro 401 com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'abc123',
          senha: 'senhaIncorreta'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Credenciais inválidas');
    });

    it('deve retornar erro 401 com usuário inexistente', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'usuarioInexistente',
          senha: 'qualquerSenha'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Credenciais inválidas');
    });
  });
}); 