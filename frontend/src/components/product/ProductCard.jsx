'use client'

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product?.image || '/assets/images/placeholder.jpg'} alt={product?.name} />
      <h3>{product?.name}</h3>
      <p>{product?.price}</p>
      <button>Add to Cart</button>
    </div>
  )
}
