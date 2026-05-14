import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Be_Vietnam_Pro, Fraunces } from 'next/font/google'
import { Toaster } from 'sonner'
import { RegisterServiceWorker } from '@/components/layout/RegisterServiceWorker'
import { AppleSplashScreens } from '@/components/layout/AppleSplashScreens'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-headline',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
})

const beVietnam = Be_Vietnam_Pro({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

const fraunces = Fraunces({
  variable: '--font-display-serif',
  subsets: ['latin'],
  weight: ['400', '600'],
})

export const metadata: Metadata = {
  title: 'Monéa',
  description: 'Your money — but elevated',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Monéa',
  },
  icons: {
    apple: '/icons/icon-180x180.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#271310',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" suppressHydrationWarning className={`${plusJakarta.variable} ${beVietnam.variable} ${fraunces.variable} h-full antialiased`}>
      <head>
        <AppleSplashScreens />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-center" richColors />
        <RegisterServiceWorker />
      </body>
    </html>
  )
}
