#!/usr/bin/env node

/**
 * Simple sitemap validation script
 * This script can be run to check if all URLs in the sitemap are accessible
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function validateUrl(url) {
  return new Promise((resolve) => {
    const options = {
      method: 'HEAD',
      timeout: 5000
    };

    const req = https.request(url, options, (res) => {
      resolve({
        url,
        status: res.statusCode,
        valid: res.statusCode >= 200 && res.statusCode < 400
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        valid: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        valid: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function validateSitemap() {
  try {
    const sitemapPath = path.join(__dirname, '../public/sitemap-0.xml');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // Extract URLs from sitemap
    const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
    if (!urlMatches) {
      console.log('No URLs found in sitemap');
      return;
    }

    const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
    
    console.log(`Found ${urls.length} URLs in sitemap. Validating...`);
    console.log('');

    const results = await Promise.all(urls.map(validateUrl));
    
    const validUrls = results.filter(r => r.valid);
    const invalidUrls = results.filter(r => !r.valid);

    console.log('✅ Valid URLs:');
    validUrls.forEach(r => console.log(`  ${r.url} - ${r.status}`));
    
    if (invalidUrls.length > 0) {
      console.log('\n❌ Invalid URLs:');
      invalidUrls.forEach(r => console.log(`  ${r.url} - ${r.status} ${r.error || ''}`));
    }

    console.log(`\nSummary: ${validUrls.length}/${urls.length} URLs are valid`);
    
  } catch (error) {
    console.error('Error validating sitemap:', error.message);
  }
}

if (require.main === module) {
  validateSitemap();
}

module.exports = { validateSitemap };
