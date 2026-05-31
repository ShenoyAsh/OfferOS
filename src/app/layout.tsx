import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OfferOS — The Operating System for Job Offers',
  description: 'AI-powered hackathon prep platform with Desktop OS experience. Practice DSA, mock interviews, ATS resume scanning, and company intel — all in one futuristic workspace.',
  keywords: ['DSA practice', 'mock interview', 'ATS resume', 'job preparation', 'FAANG prep', 'coding interview'],
  authors: [{ name: 'OfferOS Team' }],
  openGraph: {
    title: 'OfferOS — The Operating System for Job Offers',
    description: 'Your AI-powered placement preparation command center',
    type: 'website',
    url: 'https://offeros.vercel.app',
  },
  robots: 'index, follow',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
