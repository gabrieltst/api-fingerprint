const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const { UserService } = require('../services/userService');

const router = express.Router();

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Gerar token de autenticação
 *     description: Endpoint para autenticar usuário e gerar token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - senha
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID único do usuário
 *                 example: "abc123"
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "minhaSenhaSegura"
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT válido
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *                   example: "Token gerado com sucesso"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Tipo do erro
 *                   example: "Dados inválidos"
 *                 message:
 *                   type: string
 *                   description: Descrição do erro
 *                   example: "user_id e senha são obrigatórios"
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Tipo do erro
 *                   example: "Credenciais inválidas"
 *                 message:
 *                   type: string
 *                   description: Descrição do erro
 *                   example: "Usuário ou senha incorretos"
 */
router.post('/token', async (req, res) => {
  try {
    const { user_id, senha } = req.body;

    // Validação dos campos obrigatórios
    if (!user_id || !senha) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'user_id e senha são obrigatórios'
      });
    }

    // Validação do formato do user_id
    if (typeof user_id !== 'string' || user_id.trim() === '') {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'user_id deve ser uma string não vazia'
      });
    }

    // Validação da senha
    if (typeof senha !== 'string' || senha.trim() === '') {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'senha deve ser uma string não vazia'
      });
    }

    // Verificar se o usuário existe e a senha está correta
    const user = await UserService.authenticateUser(user_id, senha);
    
    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Usuário ou senha incorretos'
      });
    }

    // Gerar token JWT
    const token = generateToken({ user_id: user.user_id });

    res.status(200).json({
      token,
      message: 'Token gerado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao gerar token:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível gerar o token de autenticação'
    });
  }
});

module.exports = router; 