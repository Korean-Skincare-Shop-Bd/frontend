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
  ],
  
  // Explicitly include important static paths
  additionalPaths: async (config) => {
    const result = []
    
    // Add static pages with custom priorities
    const staticPages = [
      { path: '/', priority: 1.0, changefreq: 'daily' },
      { path: '/products', priority: 1.0, changefreq: 'daily' },
      { path: '/about', priority: 0.8, changefreq: 'weekly' },
      { path: '/contact', priority: 0.8, changefreq: 'weekly' },
      { path: '/cart', priority: 0.7, changefreq: 'daily' },
      { path: '/shipping', priority: 0.6, changefreq: 'monthly' },
      { path: '/privacy', priority: 0.5, changefreq: 'monthly' },
      { path: '/terms', priority: 0.5, changefreq: 'monthly' },
      { path: '/support', priority: 0.6, changefreq: 'weekly' },
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
      // Fetch products from your API
      const response = await fetch('https://api.koreanskincareshopbd.com/products')
      
      if (response.ok) {
        const products = await response.json()
        
        // Add product pages
        if (Array.isArray(products)) {
          products.forEach((product) => {
            if (product.id || product.slug) {
              result.push({
                loc: `/products/${product.slug || product.id}`,
                changefreq: 'weekly',
                priority: 0.9,
                lastmod: product.updatedAt || new Date().toISOString(),
              })
            }
          })
        }
      }
      
      // Add any category pages if you have them
      // Uncomment and modify if you have category routes
      /*
      const categoriesResponse = await fetch('https://api.koreanskincareshopbd.com/categories')
      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json()
        
        if (Array.isArray(categories)) {
          categories.forEach((category) => {
            result.push({
              loc: `/categories/${category.slug || category.id}`,
              changefreq: 'weekly',
              priority: 0.8,
              lastmod: category.updatedAt || new Date().toISOString(),
            })
          })
        }
      }
      */
      
    } catch (error) {
      console.warn('Failed to fetch dynamic routes for sitemap:', error.message)
    }
    
    return result
  },
  
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/checkout'],
      },
    ],
    additionalSitemaps: [
      'https://www.koreanskincareshopbd.com/sitemap.xml',
    ],
  },
}
