/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.koreanskincareshopbd.com', // ✅ your domain
  generateRobotsTxt: true, // ✅ also creates robots.txt
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin/*', '/api/*'], // exclude admin & API routes
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
  },
}
