#!/usr/bin/env node

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };
  
  const runnerResult = await lighthouse('http://localhost:3001', options);
  
  // Extract key metrics
  const lhr = runnerResult.lhr;
  const performanceScore = Math.round(lhr.categories.performance.score * 100);
  const fcp = lhr.audits['first-contentful-paint'].numericValue;
  const lcp = lhr.audits['largest-contentful-paint'].numericValue;
  const si = lhr.audits['speed-index'].numericValue;
  
  console.log('\n🚀 PERFORMANCE RESULTS');
  console.log('======================');
  console.log(`📊 Performance Score: ${performanceScore}/100`);
  console.log(`⚡ First Contentful Paint: ${Math.round(fcp)}ms`);
  console.log(`🎯 Largest Contentful Paint: ${Math.round(lcp)}ms`);
  console.log(`📈 Speed Index: ${Math.round(si)}ms`);
  
  if (performanceScore >= 90) {
    console.log('✅ EXCELLENT performance!');
  } else if (performanceScore >= 70) {
    console.log('✅ GOOD performance!');
  } else if (performanceScore >= 50) {
    console.log('⚠️  NEEDS IMPROVEMENT');
  } else {
    console.log('❌ POOR performance - needs optimization');
  }
  
  await chrome.kill();
}

runLighthouse().catch(err => {
  console.error('Error running Lighthouse:', err);
  process.exit(1);
});
