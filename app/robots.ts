
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/bana-ozel/', '/admin/'],
    },
    sitemap: 'https://ornek-sahibinden-klon.com/sitemap.xml',
  }
}
