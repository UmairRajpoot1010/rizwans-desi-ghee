import React from 'react'
import '../styles/index.css'
import '../styles/tailwind.css'
import '../styles/fonts.css'
import '../styles/theme.css'
// import './globals.css'
import type { Metadata } from 'next'

// export const metadata = {
//   title: 'Rizwan\'s Desi Ghee',
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
export const metadata = {
  title: "Rizwan’s Desi Ghee | 100% Pure Desi Ghee in Pakistan",
  description:
    "Buy 100% pure desi ghee in Pakistan. Fresh, homemade, natural desi ghee with nationwide delivery. Rizwan’s Desi Ghee – purity you can trust.",
  keywords: [
    "desi ghee",
    "pure desi ghee Pakistan",
    "buy desi ghee online",
    "homemade ghee",
    "buffalo ghee",
    "cow ghee Pakistan"
  ],
  metadataBase: new URL("https://desigheepk.com"),
  openGraph: {
    title: "Rizwan’s Desi Ghee | Pure & Natural",
    description:
      "Order 100% pure desi ghee online in Pakistan. No additives, no preservatives.",
    url: "https://desigheepk.com",
    siteName: "Rizwan’s Desi Ghee",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rizwan’s Desi Ghee"
      }
    ],
    type: "website"
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};
