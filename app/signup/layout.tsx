import '../globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://' + process.env.NEXT_PUBLIC_AUTH_DOMAIN),
  title: 'Solun • Sign Up',
  locale: 'en_US',
  type: 'website',
  description: 'Sign up for a Solun account.',
  openGraph: {
    title: 'Solun • Sign Up',
    description: 'Sign up for a Solun account.',
    siteName: 'Solun',
    images: [
      {
        url: 'https://cdn.solun.pm/images/logo/solun-logo.png',
        width: 512,
        height: 512,
        alt: 'Solun Logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          {children}
      </body>
    </html>
  )
}