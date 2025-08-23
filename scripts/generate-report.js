const mochawesome = require('mochawesome-report-generator');

// Gerar relatório HTML final
mochawesome.generate({
  reportDir: 'reports',
  reportFilename: 'test-report',
  reportTitle: 'API Fingerprint - Relatório de Testes',
  reportPageTitle: 'Testes da API Fingerprint',
  embeddedScreenshots: true,
  inlineAssets: true,
  saveHtml: true,
  saveJson: false,
  saveJunit: false,
  useInlineDiffs: false,
  code: false
}).then(() => {
  console.log('✅ Relatório Mochawesome gerado com sucesso!');
  console.log('📊 Acesse: reports/test-report.html');
}).catch((error) => {
  console.error('❌ Erro ao gerar relatório:', error);
}); 