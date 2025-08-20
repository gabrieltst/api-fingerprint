/**
 * Serviço para gerenciar biometria fingerprint
 */
class BiometriaService {
  constructor() {
    // Simulação de banco de dados em memória
    // Em produção, isso seria substituído por um banco real
    this.fingerprints = new Map();
  }

  /**
   * Cadastra a decisão de compartilhamento de fingerprint de um usuário
   * @param {string} user_id - ID do usuário
   * @param {boolean} compartilhou_fingerprint - Se o usuário aceitou compartilhar
   * @returns {Object} - Dados da biometria cadastrada
   */
  async cadastrarFingerprint(user_id, compartilhou_fingerprint) {
    try {
      const biometria = {
        user_id,
        compartilhou_fingerprint,
        data_cadastro: new Date().toISOString()
      };

      // Armazenar no "banco" em memória
      this.fingerprints.set(user_id, biometria);

      console.log(`✅ Biometria cadastrada para usuário ${user_id}: ${compartilhou_fingerprint ? 'Aceitou' : 'Recusou'} compartilhamento`);

      return biometria;
    } catch (error) {
      console.error('Erro ao cadastrar biometria:', error);
      throw error;
    }
  }

  /**
   * Consulta a decisão de compartilhamento de fingerprint de um usuário
   * @param {string} user_id - ID do usuário
   * @returns {Object|null} - Dados da biometria ou null se não encontrado
   */
  async consultarFingerprint(user_id) {
    try {
      const biometria = this.fingerprints.get(user_id);
      
      if (!biometria) {
        return null;
      }

      return biometria;
    } catch (error) {
      console.error('Erro ao consultar biometria:', error);
      throw error;
    }
  }

  /**
   * Atualiza a decisão de compartilhamento de fingerprint de um usuário
   * @param {string} user_id - ID do usuário
   * @param {boolean} compartilhou_fingerprint - Nova decisão do usuário
   * @returns {Object|null} - Dados da biometria atualizada ou null se não encontrado
   */
  async atualizarFingerprint(user_id, compartilhou_fingerprint) {
    try {
      const biometriaExistente = this.fingerprints.get(user_id);
      
      if (!biometriaExistente) {
        return null;
      }

      const biometriaAtualizada = {
        ...biometriaExistente,
        compartilhou_fingerprint,
        data_atualizacao: new Date().toISOString()
      };

      this.fingerprints.set(user_id, biometriaAtualizada);

      console.log(`✅ Biometria atualizada para usuário ${user_id}: ${compartilhou_fingerprint ? 'Aceitou' : 'Recusou'} compartilhamento`);

      return biometriaAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar biometria:', error);
      throw error;
    }
  }

  /**
   * Remove a decisão de compartilhamento de fingerprint de um usuário
   * @param {string} user_id - ID do usuário
   * @returns {boolean} - true se removido com sucesso, false caso contrário
   */
  async removerFingerprint(user_id) {
    try {
      const removido = this.fingerprints.delete(user_id);
      
      if (removido) {
        console.log(`✅ Biometria removida para usuário ${user_id}`);
      }

      return removido;
    } catch (error) {
      console.error('Erro ao remover biometria:', error);
      throw error;
    }
  }

  /**
   * Lista todas as decisões de compartilhamento (apenas para desenvolvimento/teste)
   * @returns {Array} - Lista de todas as biometrias
   */
  getAllFingerprints() {
    const fingerprintsList = [];
    for (const [user_id, biometria] of this.fingerprints) {
      fingerprintsList.push(biometria);
    }
    return fingerprintsList;
  }

  /**
   * Obtém estatísticas de compartilhamento
   * @returns {Object} - Estatísticas de aceitação/recusa
   */
  getEstatisticas() {
    const total = this.fingerprints.size;
    let aceitaram = 0;
    let recusaram = 0;

    for (const biometria of this.fingerprints.values()) {
      if (biometria.compartilhou_fingerprint) {
        aceitaram++;
      } else {
        recusaram++;
      }
    }

    return {
      total,
      aceitaram,
      recusaram,
      percentual_aceitacao: total > 0 ? ((aceitaram / total) * 100).toFixed(2) : 0
    };
  }

  /**
   * Limpa todos os dados (apenas para testes)
   */
  clearAllData() {
    this.fingerprints.clear();
    console.log('🧹 Todos os dados de biometria foram limpos');
  }
}

// Exportar uma instância única do serviço
module.exports = { BiometriaService: new BiometriaService() }; 