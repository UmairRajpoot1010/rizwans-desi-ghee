'use client'

export default function AdminLoginPage() {
  return (
    <main className="login-page">
      <div className="login-container">
        <h1>Admin Login</h1>
        <form>
          <div>
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </main>
  )
}
