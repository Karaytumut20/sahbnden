
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'sahibinden.com Klon',
    short_name: 'Sahibinden',
    description: 'Türkiye\'nin ilan ve alışveriş platformu klonu',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f7f9',
    theme_color: '#2d405a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
