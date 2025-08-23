module.exports = {
  // Padrão de arquivos de teste
  spec: 'tests/**/*.test.js',
  
  // Timeout para testes assíncronos
  timeout: 10000,
  
  // Repetir testes em caso de falha
  retries: 1,
  
  // Requerer chai para assertions
  // require: ['chai/register-expect', 'chai/register-should'],
  
  // Repórter padrão
  reporter: 'spec',
  
  // Cores no output
  colors: true,
  
  // Mostrar diferenças em assertions
  diff: true,
  
  // Ambiente de teste
  env: 'node',
  
  // Definir variáveis de ambiente para testes
  env: {
    NODE_ENV: 'test'
  },
  
  // Arquivos de teste a serem ignorados
  ignore: ['node_modules/**/*'],
  
  // Ordem de execução dos testes
  sort: true,
  
  // Mostrar stack trace completo
  'full-trace': true
}; 