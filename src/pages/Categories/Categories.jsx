import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteProductCategory } from '../../api/productApi'
import { fetchCategories } from '../../redux/slices/categorySlice'
import DataTable from '../../components/common/DataTable'
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

  const columns = [
    { key: 'CategoryCode', label: 'Code', sortable: true, accessor: category => category.CategoryCode || '-' },
    { key: 'CategoryName', label: 'Name', sortable: true, accessor: category => category.CategoryName || '-' },
    { key: 'MenuVisible', label: 'Menu Visible', sortable: true, accessor: category => (category.MenuVisible ? 'Yes' : 'No') },
    { key: 'Active', label: 'Active', sortable: true, accessor: category => (category.Active ? 'Yes' : 'No') },
    { key: 'CreatedAt', label: 'Created At', sortable: true, accessor: category => (category.CreatedAt ? new Date(category.CreatedAt).toLocaleString() : '-') },
    { key: 'CreatedBy', label: 'Created By', sortable: true, accessor: category => category.CreatedBy || '-' },
  ]

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

      {error && <div style={{ color: '#dc2626', padding: '12px', marginBottom: '12px' }}>Error: {error}</div>}

      <DataTable
        data={categories}
        columns={columns}
        loading={loading}
        emptyMessage="No categories available."
        searchPlaceholder="Search categories..."
        renderActions={category => (
          <div className="action-group">
            <Link to={`/categories/edit/${category.CategoryId || category.CategoryCode}`} className="btn btn-secondary btn-small">
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
        )}
      />
    </div>
  )
}
