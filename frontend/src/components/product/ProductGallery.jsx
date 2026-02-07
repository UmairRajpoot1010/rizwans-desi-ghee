'use client'

export default function ProductGallery({ images }) {
  return (
    <div className="product-gallery">
      {images?.map((image, index) => (
        <img key={index} src={image} alt={`Product image ${index + 1}`} />
      ))}
    </div>
  )
}
