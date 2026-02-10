import React from 'react'
import '../styles/index.css'
import '../styles/tailwind.css'
import '../styles/fonts.css'
import '../styles/theme.css'

export const metadata = {
  title: 'Rizwan\'s Desi Ghee',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
