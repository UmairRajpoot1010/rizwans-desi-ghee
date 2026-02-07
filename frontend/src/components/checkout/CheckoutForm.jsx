'use client'

export default function CheckoutForm() {
  return (
    <form className="checkout-form">
      <h2>Shipping Information</h2>
      <div>
        <label>Full Name</label>
        <input type="text" name="name" required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" required />
      </div>
      <div>
        <label>Address</label>
        <textarea name="address" required></textarea>
      </div>
      <div>
        <label>Phone</label>
        <input type="tel" name="phone" required />
      </div>
      <button type="submit">Place Order</button>
    </form>
  )
}
