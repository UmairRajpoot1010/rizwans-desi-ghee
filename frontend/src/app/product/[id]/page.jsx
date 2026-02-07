export default function ProductPage({ params }) {
  return (
    <main>
      <h1>Product Details</h1>
      <p>Product ID: {params.id}</p>
    </main>
  )
}
