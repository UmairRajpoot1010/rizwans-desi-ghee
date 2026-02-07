'use client'

export default function Navbar() {
  return (
    <nav>
      <div className="container">
        <a href="/">Rizwan's Desi Ghee</a>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/shop">Shop</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/cart">Cart</a></li>
        </ul>
      </div>
    </nav>
  )
}
