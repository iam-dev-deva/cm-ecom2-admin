import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteProduct, getProducts } from '../../api/productApi'
import DataTable from '../../components/common/DataTable'
import './Products.css'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  async function loadProducts() {
    try {
      setLoading(true)
      const response = await getProducts()
      setProducts(Array.isArray(response?.Data || response) ? (response.Data || response) : [])
    } catch (err) {
      toast.error(err.message || 'Unable to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDelete = async productCode => {
    const confirmed = window.confirm('Are you sure you want to delete this product?')
    if (!confirmed) return

    try {
      setDeleting(productCode)
      await deleteProduct(productCode)
      setProducts(prev => prev.filter(item => String(item.ProductCode) !== String(productCode)))
      toast.success('Product deleted successfully')
    } catch (err) {
      toast.error(err.message || 'Unable to delete product')
    } finally {
      setDeleting(null)
    }
  }

  const columns = [
    { key: 'ProductCode', label: 'Code', sortable: true, accessor: product => (product.ProductCode != null ? product.ProductCode : '-') },
    { key: 'ItemName', label: 'Item Name', sortable: true, accessor: product => product.ItemName || '-' },
    { key: 'ProductCategory', label: 'Category', sortable: true, accessor: product => product.ProductCategory || '-' },
    { key: 'BrandName', label: 'Brand', sortable: true, accessor: product => product.BrandName || '-' },
    { key: 'YourPrice', label: 'Price', sortable: true, accessor: product => (product.YourPrice != null ? `₹${product.YourPrice}` : '-') },
    { key: 'OfferingSalePrice', label: 'Sale Price', sortable: true, accessor: product => (product.OfferingSalePrice != null ? `₹${product.OfferingSalePrice}` : '-') },
    { key: 'SKUNo', label: 'SKU', sortable: true, accessor: product => product.SKUNo || '-' },
    { key: 'ProductID', label: 'Stock', sortable: true, accessor: product => (product.ProductID != null ? product.ProductID : '-') },
  ]

  return (
    <div className="product-page">
      <div className="page-header">
        <div>
          {/* <h1>Products</h1>
          <p>View and manage your product catalog.</p> */}
        </div>
        <Link to="/products/create" className="btn btn-primary">
          Add Product
        </Link>
      </div>

      <DataTable
        data={products}
        columns={columns}
        loading={loading}
        emptyMessage="No products available."
        searchPlaceholder="Search products..."
        renderActions={product => (
          <div className="action-group">
            <Link to={`/products/edit/${product.ProductCode || product.ProductID}`} className="btn btn-secondary btn-small">
              Edit
            </Link>
            <button
              type="button"
              className="btn btn-danger btn-small"
              onClick={() => handleDelete(product.ProductCode || product.ProductID)}
              disabled={deleting === product.ProductCode || deleting === product.ProductID}
            >
              {deleting === product.ProductCode || deleting === product.ProductID ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      />
    </div>
  )
}
