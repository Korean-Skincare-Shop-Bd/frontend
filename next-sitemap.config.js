/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.koreanskincareshopbd.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/admin/*', 
    '/api/*',
    '/checkout', // Private checkout page
    '/_not-found',
    '/404',
    '/500',
  ],
  
  // Generate index sitemap
  generateIndexSitemap: true,
  
  // Explicitly include important static paths
  additionalPaths: async (config) => {
    const result = []
    
    // Add static pages with custom priorities
    const staticPages = [
      { path: '/', priority: 1.0, changefreq: 'daily' },
      { path: '/products', priority: 1.0, changefreq: 'daily' },
      { path: '/about', priority: 0.9, changefreq: 'weekly' },
      { path: '/contact', priority: 0.9, changefreq: 'weekly' },
      { path: '/cart', priority: 0.8, changefreq: 'daily' },
      { path: '/shipping', priority: 0.7, changefreq: 'weekly' },
      { path: '/privacy', priority: 0.6, changefreq: 'monthly' },
      { path: '/terms', priority: 0.6, changefreq: 'monthly' },
      { path: '/support', priority: 0.7, changefreq: 'weekly' },
    ]
    
    staticPages.forEach(page => {
      result.push({
        loc: page.path,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: new Date().toISOString(),
      })
    })
    
    try {
      // Fetch all products from the correct API endpoint
      console.log('Fetching all products with CUID IDs from API...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for large dataset
      
      const apiEndpoint = 'https://api.koreanskincareshopbd.com/api/v1/products';
      console.log(`Fetching from: ${apiEndpoint}`);
      
      const response = await fetch(apiEndpoint, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'next-sitemap/1.0',
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        let products = [];
        
        // Handle different API response formats
        if (Array.isArray(data)) {
          products = data;
        } else if (data.products && Array.isArray(data.products)) {
          products = data.products;
        } else if (data.data && Array.isArray(data.data)) {
          products = data.data;
        } else if (data.result && Array.isArray(data.result)) {
          products = data.result;
        }
        
        if (products.length > 0) {
          console.log(`✅ Successfully fetched ${products.length} products with CUID IDs`);
          
          products.forEach((product) => {
            // Use CUID from database as the URL parameter
            if (product.id) {
              result.push({
                loc: `/products/${product.id}`,
                changefreq: 'weekly',
                priority: 0.9,
                lastmod: product.updatedAt || product.updated_at || product.createdAt || product.created_at || new Date().toISOString(),
              });
            }
          });
          
          console.log(`📄 Added ${products.length} product pages to sitemap`);
        } else {
          console.warn('⚠️ API returned data but no products array found');
          console.log('Response structure:', Object.keys(data));
        }
      } else {
        console.warn(`⚠️ API responded with status ${response.status}: ${response.statusText}`);
        
        // Add some sample CUID-like IDs as fallback
        const sampleCUIDs = [
          'clh1a2b3c4d5e6f7g8h9',
          'clh2b3c4d5e6f7g8h9i0',
          'clh3c4d5e6f7g8h9i0j1',
          'clh4d5e6f7g8h9i0j1k2',
          'clh5e6f7g8h9i0j1k2l3'
        ];
        
        console.log(`📝 Adding ${sampleCUIDs.length} sample CUID product URLs as fallback`);
        sampleCUIDs.forEach(cuid => {
          result.push({
            loc: `/products/${cuid}`,
            changefreq: 'weekly',
            priority: 0.9,
            lastmod: new Date().toISOString(),
          });
        });
      }
      
    } catch (error) {
      console.warn('⚠️ Error fetching products for sitemap:', error.message);
      
      // Fallback with sample CUIDs
      const sampleCUIDs = [
        'clh1a2b3c4d5e6f7g8h9',
        'clh2b3c4d5e6f7g8h9i0', 
        'clh3c4d5e6f7g8h9i0j1',
        'clh4d5e6f7g8h9i0j1k2',
        'clh5e6f7g8h9i0j1k2l3'
      ];
      
      console.log(`📝 Using ${sampleCUIDs.length} sample CUID product URLs as fallback`);
      sampleCUIDs.forEach(cuid => {
        result.push({
          loc: `/products/${cuid}`,
          changefreq: 'weekly',
          priority: 0.9,
          lastmod: new Date().toISOString(),
        });
      });
    }
    
    return result
  },
  
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/checkout', '/_next/', '/static/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/api', '/checkout'],
      }
    ],
    additionalSitemaps: [
      'https://www.koreanskincareshopbd.com/sitemap.xml',
    ],
  },
}
