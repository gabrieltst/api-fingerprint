const bcrypt = require('bcryptjs');

/**
 * Serviço para gerenciar usuários e autenticação
 */
class UserService {
  constructor() {
    // Simulação de banco de dados em memória
    // Em produção, isso seria substituído por um banco real
    this.users = new Map();
    
    // Criar alguns usuários de exemplo para teste
    this.initializeUsersSync();
  }

  /**
   * Inicializa usuários de exemplo para teste (versão síncrona)
   */
  initializeUsersSync() {
    const users = [
      {
        user_id: 'abc123',
        senha: 'minhaSenhaSegura',
        nome: 'Usuário Teste 1'
      },
      {
        user_id: 'def456',
        senha: 'outraSenha123',
        nome: 'Usuário Teste 2'
      },
      {
        user_id: 'ghi789',
        senha: 'senhaTeste456',
        nome: 'Usuário Teste 3'
      }
    ];

    for (const user of users) {
      // Usar hash síncrono para inicialização
      const hashedPassword = bcrypt.hashSync(user.senha, 10);
      this.users.set(user.user_id, {
        user_id: user.user_id,
        senha: hashedPassword,
        nome: user.nome
      });
    }

    console.log(`✅ ${users.length} usuários de exemplo criados`);
  }

  /**
   * Inicializa usuários de exemplo para teste (versão assíncrona)
   */
  async initializeUsers() {
    const users = [
      {
        user_id: 'abc123',
        senha: 'minhaSenhaSegura',
        nome: 'Usuário Teste 1'
      },
      {
        user_id: 'def456',
        senha: 'outraSenha123',
        nome: 'Usuário Teste 2'
      },
      {
        user_id: 'ghi789',
        senha: 'senhaTeste456',
        nome: 'Usuário Teste 3'
      }
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.senha, 10);
      this.users.set(user.user_id, {
        user_id: user.user_id,
        senha: hashedPassword,
        nome: user.nome
      });
    }

    console.log(`✅ ${users.length} usuários de exemplo criados`);
  }

  /**
   * Autentica um usuário com base no user_id e senha
   * @param {string} user_id - ID do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Object|null} - Dados do usuário se autenticado, null caso contrário
   */
  async authenticateUser(user_id, senha) {
    try {
      const user = this.users.get(user_id);
      
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      
      if (!isPasswordValid) {
        return null;
      }

      return {
        user_id: user.user_id,
        nome: user.nome
      };
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return null;
    }
  }

  /**
   * Cria um novo usuário
   * @param {string} user_id - ID do usuário
   * @param {string} senha - Senha do usuário
   * @param {string} nome - Nome do usuário
   * @returns {Object|null} - Dados do usuário criado ou null se falhar
   */
  async createUser(user_id, senha, nome) {
    try {
      if (this.users.has(user_id)) {
        return null; // Usuário já existe
      }

      const hashedPassword = await bcrypt.hash(senha, 10);
      
      const newUser = {
        user_id,
        senha: hashedPassword,
        nome
      };

      this.users.set(user_id, newUser);

      return {
        user_id: newUser.user_id,
        nome: newUser.nome
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return null;
    }
  }

  /**
   * Verifica se um usuário existe
   * @param {string} user_id - ID do usuário
   * @returns {boolean} - true se o usuário existe, false caso contrário
   */
  userExists(user_id) {
    return this.users.has(user_id);
  }

  /**
   * Lista todos os usuários (apenas para desenvolvimento/teste)
   * @returns {Array} - Lista de usuários
   */
  getAllUsers() {
    const usersList = [];
    for (const [user_id, user] of this.users) {
      usersList.push({
        user_id: user.user_id,
        nome: user.nome
      });
    }
    return usersList;
  }
}

// Exportar uma instância única do serviço
module.exports = { UserService: new UserService() }; 