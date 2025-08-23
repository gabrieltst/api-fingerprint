const request = require('supertest');
const { expect } = require('chai');
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

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Token gerado com sucesso');
    });

    it('deve retornar erro 400 quando user_id não for fornecido', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          senha: 'minhaSenhaSegura'
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
      expect(response.body).to.have.property('message');
      expect(response.body.error).to.equal('Dados inválidos');
    });

    it('deve retornar erro 400 quando senha não for fornecida', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'abc123'
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
      expect(response.body).to.have.property('message');
      expect(response.body.error).to.equal('Dados inválidos');
    });

    it('deve retornar erro 400 quando user_id for vazio', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          user_id: '',
          senha: 'minhaSenhaSegura'
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
      expect(response.body).to.have.property('message');
      expect(response.body.error).to.equal('Dados inválidos');
    });

    it('deve retornar erro 400 quando senha for vazia', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'abc123',
          senha: ''
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
      expect(response.body).to.have.property('message');
      expect(response.body.error).to.equal('Dados inválidos');
    });

    it('deve retornar erro 401 com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'abc123',
          senha: 'senhaIncorreta'
        });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
      expect(response.body).to.have.property('message');
      expect(response.body.error).to.equal('Credenciais inválidas');
    });

    it('deve retornar erro 401 com usuário inexistente', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          user_id: 'usuarioInexistente',
          senha: 'qualquerSenha'
        });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
      expect(response.body).to.have.property('message');
      expect(response.body.error).to.equal('Credenciais inválidas');
    });
  });
}); 