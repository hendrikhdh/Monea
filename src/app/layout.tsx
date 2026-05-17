import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { userAgent } from 'next/server'
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

const MOBILE_VIEWPORT =
  'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
const DESKTOP_VIEWPORT =
  'width=device-width, initial-scale=1, viewport-fit=cover'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const h = await headers()
  const ua = userAgent({ headers: h })
  const isMobileLike = ua.device?.type === 'mobile' || ua.device?.type === 'tablet'
  const viewportContent = isMobileLike ? MOBILE_VIEWPORT : DESKTOP_VIEWPORT

  return (
    <html lang="de" suppressHydrationWarning className={`${plusJakarta.variable} ${beVietnam.variable} ${fraunces.variable} h-full antialiased`}>
      <head>
        <meta name="viewport" content={viewportContent} />
        <meta name="theme-color" content="#271310" />
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
