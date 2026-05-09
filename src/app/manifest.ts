import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Monéa',
    short_name: 'Monéa',
    description: 'Your money — but elevated',
    start_url: '/',
    display: 'standalone',
    scope: '/',
    background_color: '#faf9f6',
    theme_color: '#271310',
    orientation: 'portrait',
    categories: ['finance', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
