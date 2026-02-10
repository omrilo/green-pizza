const fs = require('fs');

try {
  const resultsPath = 'cypress-results.json';
  
  if (!fs.existsSync(resultsPath)) {
    console.log('No Cypress results found');
    process.exit(0);
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  
  // Extract test statistics
  const stats = results.stats || {};
  const summary = {
    totalTests: stats.tests || 0,
    passes: stats.passes || 0,
    failures: stats.failures || 0,
    pending: stats.pending || 0,
    duration: stats.duration || 0,
    timestamp: new Date().toISOString()
  };

  console.log('Cypress Test Summary:');
  console.log(`  Total: ${summary.totalTests}`);
  console.log(`  Passed: ${summary.passes}`);
  console.log(`  Failed: ${summary.failures}`);
  console.log(`  Pending: ${summary.pending}`);
  console.log(`  Duration: ${summary.duration}ms`);

  // Create a summary file
  fs.writeFileSync('cypress-summary.json', JSON.stringify(summary, null, 2));

} catch (error) {
  console.error('Error generating Cypress summary:', error.message);
  process.exit(1);
}
