import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Caddy',
  description: 'The way to take your stuff with you.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js"></script>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

