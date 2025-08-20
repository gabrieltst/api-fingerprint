const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_2024';

/**
 * Middleware para verificar o token JWT
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função para continuar para o próximo middleware
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Token não fornecido',
      message: 'É necessário fornecer um token de autenticação no cabeçalho Authorization'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'O token fornecido é inválido ou expirou'
      });
    }

    req.user = user;
    next();
  });
};

/**
 * Gera um token JWT para um usuário
 * @param {Object} payload - Dados do usuário para incluir no token
 * @returns {string} Token JWT gerado
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

module.exports = {
  authenticateToken,
  generateToken,
  JWT_SECRET
}; 