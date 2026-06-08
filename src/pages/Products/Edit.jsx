import React from 'react'
import { useParams } from 'react-router-dom'

export default function ProductEdit() {
  const { id } = useParams()

  return (
    <div className="product-edit">
      <h1>Edit Product</h1>
      <p>Update details for product ID: {id}</p>
    </div>
  )
}
