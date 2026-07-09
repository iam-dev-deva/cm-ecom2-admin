import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteProduct, getProducts } from '../../api/productApi'
import Pagination from '../../components/common/Pagination'

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

  const pageCount = Math.max(1, Math.ceil(products.length / pageSize))
  const currentProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handlePageChange = page => {
    if (page < 1 || page > pageCount) return
    setCurrentPage(page)
  }

  const handlePageSizeChange = event => {
    setPageSize(Number(event.target.value))
    setCurrentPage(1)
  }

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount)
    }
  }, [currentPage, pageCount])

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

      <div className="table-card">
        <div className="table-status">
          {loading ? 'Loading products...' : `${products.length} products found`}
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Sale Price</th>
                <th>SKU</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    No products available.
                  </td>
                </tr>
              ) : (
                currentProducts.map((product, index) => (
                  <tr key={`${product.ProductID || product.ProductCode || index}`}>
                    <td>{product.ProductCode != null ? product.ProductCode : '-'}</td>
                    <td>{product.ItemName || '-'}</td>
                    <td>{product.ProductCategory || '-'}</td>
                    <td>{product.BrandName || '-'}</td>
                    <td>{product.YourPrice != null ? `₹${product.YourPrice}` : '-'}</td>
                    <td>{product.OfferingSalePrice != null ? `₹${product.OfferingSalePrice}` : '-'}</td>
                    <td>{product.SKUNo || '-'}</td>
                    <td>{product.ProductID != null ? product.ProductID : '-'}</td>
                    <td>
                      <div className="action-group">
                        <Link to={`/products/edit/${product.ProductCode || product.ProductID || index}`} className="btn btn-secondary btn-small">
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger btn-small"
                          onClick={() => handleDelete(product.ProductCode || product.ProductID)}
                          disabled={deleting === product.ProductCode || deleting === product.ProductID}
                        >
                          {deleting === product.productCode ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          totalItems={products.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  )
}
