import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteProductCategory } from '../../api/productApi'
import { fetchCategories } from '../../redux/slices/categorySlice'
import Pagination from '../../components/common/Pagination'
import './Categories.css'

export default function Categories() {
  const dispatch = useDispatch()
  const { categories, loading, error } = useSelector(state => state.category)
  const [deleting, setDeleting] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    // Only fetch if categories are empty (lazy loading with caching)
    if (categories.length === 0 && !loading) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length, loading])

  const handleDelete = async categoryId => {
    const confirmed = window.confirm('Are you sure you want to delete this category?')
    if (!confirmed) return

    try {
      setDeleting(categoryId)
      await deleteProductCategory(categoryId)
      // Refresh categories after delete
      dispatch(fetchCategories())
      toast.success('Category deleted successfully')
    } catch (err) {
      toast.error(err.message || 'Unable to delete category')
    } finally {
      setDeleting(null)
    }
  }

  const pageCount = Math.max(1, Math.ceil(categories.length / pageSize))
  const currentCategories = categories.slice((currentPage - 1) * pageSize, currentPage * pageSize)

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

  const renderImageCell = image => {
    if (!image) return '-'
    if (typeof image === 'string' && image.startsWith('http')) {
      return <img src={image} alt="category" className="table-image" />
    }
    return <span>{image}</span>
  }

  return (
    <div className="category-page">
      <div className="page-header">
        <div>
          {/* <h1>Categories</h1> */}
          {/* <p>View and manage category records created through the product API.</p> */}
        </div>
        <Link to="/categories/add" className="btn btn-primary">
          Add Category
        </Link>
      </div>

      <div className="table-card">
        <div className="table-status">
          {loading ? 'Loading categories...' : `${categories.length} category records found`}
        </div>
        {error && <div style={{ color: '#dc2626', padding: '12px', marginBottom: '12px' }}>Error: {error}</div>}

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                {/* <th>Description</th> */}
                <th>Menu Visible</th>
                <th>Active</th>
                {/* <th>Category Image</th>
                <th>Icon Image</th> */}
                <th>Created At</th>
                <th>Created By</th>
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
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    No categories available.
                  </td>
                </tr>
              ) : (
                currentCategories.map((category, index) => (
                  <tr key={`${category.CategoryId || index}-${category.CategoryCode || index}`}>
                    <td>{category.CategoryCode || '-'}</td>
                    <td>{category.CategoryName || '-'}</td>
                    {/* <td>{category.CategoryDescription || '-'}</td> */}
                    <td>{category.MenuVisible ? 'Yes' : 'No'}</td>
                    <td>{category.Active ? 'Yes' : 'No'}</td>
                    {/* <td>{renderImageCell(category.CategoryImage)}</td>
                    <td>{renderImageCell(category.IconImage)}</td> */}
                    <td>{category.CreatedAt ? new Date(category.CreatedAt).toLocaleString() : '-'}</td>
                    <td>{category.CreatedBy || '-'}</td>
                    <td>
                      <div className="action-group">
                        <Link to={`/categories/edit/${category.CategoryId || index}`} className="btn btn-secondary btn-small">
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger btn-small"
                          onClick={() => handleDelete(category.CategoryId)}
                          disabled={deleting === category.CategoryId}
                        >
                          {deleting === category.CategoryId ? 'Deleting...' : 'Delete'}
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
          totalItems={categories.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  )
}
