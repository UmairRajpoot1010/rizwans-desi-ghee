import '../styles/admin.css'

export const metadata = {
  title: "Admin Panel - Rizwan's Desi Ghee",
  description: 'Admin dashboard for managing e-commerce platform',
}

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
