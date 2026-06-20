import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addProductCategory } from '../../api/productApi'

const initialForm = {
  CategoryName: '',
  CategoryCode: '',
  CategoryDescription: '',
  MetaTitle: '',
  MetaDescription: '',
  MenuVisible: true,
  Active: true,
}

export default function AddCategory() {
  const [form, setForm] = useState(initialForm)
  const [categoryImage, setCategoryImage] = useState(null)
  const [iconImage, setIconImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleFileChange(event) {
    const { name, files } = event.target
    if (!files || files.length === 0) return

    if (name === 'CategoryImage') {
      setCategoryImage(files[0])
    } else if (name === 'IconImage') {
      setIconImage(files[0])
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!categoryImage || !iconImage) {
      toast.error('Please select both category and icon images.')
      return
    }

    if (!form.CategoryName.trim() || !form.CategoryCode.trim()) {
      toast.error('Category name and code are required.')
      return
    }

    const payload = new FormData()
    payload.append('Flag', 'I')
    payload.append('CategoryId', '0')
    payload.append('CompId', '1')
    payload.append('BranchId', '5')
    payload.append('CategoryName', form.CategoryName)
    payload.append('CategoryCode', form.CategoryCode)
    payload.append('CategoryDescription', form.CategoryDescription)
    payload.append('MetaTitle', form.MetaTitle)
    payload.append('MetaDescription', form.MetaDescription)
    payload.append('MenuVisible', form.MenuVisible ? 'true' : 'false')
    payload.append('Active', form.Active ? 'true' : 'false')
    payload.append('CreatedBy', 'Admin')
    payload.append('UpdatedBy', 'Manager')
    payload.append('CreatedAt', new Date().toISOString())
    payload.append('UpdatedAt', new Date().toISOString())
    payload.append('CategoryImage', categoryImage)
    payload.append('IconImage', iconImage)

    try {
      setLoading(true)
      await addProductCategory(payload)
      toast.success('Category added successfully')
      navigate('/categories')
    } catch (err) {
      toast.error(err.message || 'Unable to add category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="category-page">
      <div className="page-header">
        <div>
          <h1>Add Category</h1>
          <p>Upload category details and images to create a new category.</p>
        </div>
      </div>

      <div className="category-form-card">
        <form className="category-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="CategoryName">Category Name</label>
              <input
                id="CategoryName"
                name="CategoryName"
                type="text"
                value={form.CategoryName}
                onChange={handleChange}
                placeholder="Enter category name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="CategoryCode">Category Code</label>
              <input
                id="CategoryCode"
                name="CategoryCode"
                type="text"
                value={form.CategoryCode}
                onChange={handleChange}
                placeholder="Enter category code"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="CategoryDescription">Category Description</label>
              <textarea
                id="CategoryDescription"
                name="CategoryDescription"
                rows="4"
                value={form.CategoryDescription}
                onChange={handleChange}
                placeholder="Describe this category"
              />
            </div>

            <div className="form-group">
              <label htmlFor="MetaTitle">Meta Title</label>
              <input
                id="MetaTitle"
                name="MetaTitle"
                type="text"
                value={form.MetaTitle}
                onChange={handleChange}
                placeholder="SEO meta title"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="MetaDescription">Meta Description</label>
              <textarea
                id="MetaDescription"
                name="MetaDescription"
                rows="3"
                value={form.MetaDescription}
                onChange={handleChange}
                placeholder="SEO meta description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="CategoryImage">Category Image</label>
              <input id="CategoryImage" name="CategoryImage" type="file" accept="image/*" onChange={handleFileChange} />
              {categoryImage && <span className="file-meta">{categoryImage.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="IconImage">Icon Image</label>
              <input id="IconImage" name="IconImage" type="file" accept="image/*" onChange={handleFileChange} />
              {iconImage && <span className="file-meta">{iconImage.name}</span>}
            </div>

            <div className="switch-group">
              <label>
                <input type="checkbox" name="MenuVisible" checked={form.MenuVisible} onChange={handleChange} />
                Menu Visible
              </label>
            </div>

            <div className="switch-group">
              <label>
                <input type="checkbox" name="Active" checked={form.Active} onChange={handleChange} />
                Active
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/categories')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
