import '../styles/admin.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
  title: "Admin Panel - Rizwan's Desi Ghee",
  description: 'Admin dashboard for managing e-commerce platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
