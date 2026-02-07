'use client'

export default function CartItem({ item }) {
  return (
    <div className="cart-item">
      <img src={item?.product?.image} alt={item?.product?.name} />
      <div>
        <h4>{item?.product?.name}</h4>
        <p>Quantity: {item?.quantity}</p>
        <p>Price: {item?.price}</p>
      </div>
      <button>Remove</button>
    </div>
  )
}
