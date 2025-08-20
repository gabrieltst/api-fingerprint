const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { BiometriaService } = require('../services/biometriaService');

const router = express.Router();

/**
 * @swagger
 * /biometria/fingerprint:
 *   post:
 *     summary: Cadastrar decisão de compartilhamento de fingerprint
 *     description: Endpoint para cadastrar se um usuário aceitou ou recusou compartilhar sua biometria
 *     tags: [Biometria]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - compartilhou_fingerprint
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID único do usuário
 *                 example: "abc123"
 *               compartilhou_fingerprint:
 *                 type: boolean
 *                 description: Indica se o usuário aceitou compartilhar a biometria
 *                 example: true
 *     responses:
 *       201:
 *         description: Decisão cadastrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *                   example: "Decisão de compartilhamento cadastrada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       description: ID do usuário
 *                       example: "abc123"
 *                     compartilhou_fingerprint:
 *                       type: boolean
 *                       description: Decisão do usuário
 *                       example: true
 *                     data_cadastro:
 *                       type: string
 *                       format: date-time
 *                       description: Data e hora do cadastro
 *                       example: "2024-01-15T10:30:00.000Z"
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
 *                   example: "user_id e compartilhou_fingerprint são obrigatórios"
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Tipo do erro
 *                   example: "Não autorizado"
 *                 message:
 *                   type: string
 *                   description: Descrição do erro
 *                   example: "Token de autenticação inválido ou expirado"
 */
router.post('/fingerprint', authenticateToken, async (req, res) => {
  try {
    const { user_id, compartilhou_fingerprint } = req.body;

    // Validação dos campos obrigatórios
    if (!user_id || compartilhou_fingerprint === undefined) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'user_id e compartilhou_fingerprint são obrigatórios'
      });
    }

    // Validação do formato do user_id
    if (typeof user_id !== 'string' || user_id.trim() === '') {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'user_id deve ser uma string não vazia'
      });
    }

    // Validação do campo compartilhou_fingerprint
    if (typeof compartilhou_fingerprint !== 'boolean') {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'compartilhou_fingerprint deve ser um valor booleano (true ou false)'
      });
    }

    // Verificar se o user_id do token corresponde ao user_id da requisição
    if (req.user.user_id !== user_id) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Você só pode cadastrar biometria para seu próprio usuário'
      });
    }

    // Cadastrar a decisão do usuário
    const biometria = await BiometriaService.cadastrarFingerprint(user_id, compartilhou_fingerprint);

    res.status(201).json({
      message: 'Decisão de compartilhamento cadastrada com sucesso',
      data: biometria
    });

  } catch (error) {
    console.error('Erro ao cadastrar fingerprint:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível cadastrar a decisão de compartilhamento'
    });
  }
});

/**
 * @swagger
 * /biometria/fingerprint/{user_id}:
 *   get:
 *     summary: Consultar decisão de compartilhamento de fingerprint
 *     description: Endpoint para consultar se um usuário aceitou ou recusou compartilhar sua biometria
 *     tags: [Biometria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do usuário
 *         example: "abc123"
 *     responses:
 *       200:
 *         description: Decisão consultada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *                   example: "Decisão consultada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       description: ID do usuário
 *                       example: "abc123"
 *                     compartilhou_fingerprint:
 *                       type: boolean
 *                       description: Decisão do usuário
 *                       example: true
 *                     data_cadastro:
 *                       type: string
 *                       format: date-time
 *                       description: Data e hora do cadastro
 *                       example: "2024-01-15T10:30:00.000Z"
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Tipo do erro
 *                   example: "Não autorizado"
 *                 message:
 *                   type: string
 *                   description: Descrição do erro
 *                   example: "Token de autenticação inválido ou expirado"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Tipo do erro
 *                   example: "Usuário não encontrado"
 *                 message:
 *                   type: string
 *                   description: Descrição do erro
 *                   example: "Não foi encontrada decisão de compartilhamento para este usuário"
 */
router.get('/fingerprint/:user_id', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;

    // Verificar se o user_id do token corresponde ao user_id da consulta
    if (req.user.user_id !== user_id) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Você só pode consultar biometria do seu próprio usuário'
      });
    }

    // Consultar a decisão do usuário
    const biometria = await BiometriaService.consultarFingerprint(user_id);

    if (!biometria) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Não foi encontrada decisão de compartilhamento para este usuário'
      });
    }

    res.status(200).json({
      message: 'Decisão consultada com sucesso',
      data: biometria
    });

  } catch (error) {
    console.error('Erro ao consultar fingerprint:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível consultar a decisão de compartilhamento'
    });
  }
});

module.exports = router; 