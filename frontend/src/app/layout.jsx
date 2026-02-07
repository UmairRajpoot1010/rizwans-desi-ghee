import '../styles/globals.css'

export const metadata = {
  title: "Rizwan's Desi Ghee",
  description: 'Premium quality desi ghee products',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
