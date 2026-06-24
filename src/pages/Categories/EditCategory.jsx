import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { updateProductCategory } from '../../api/productApi'
import { fetchCategories } from '../../redux/slices/categorySlice'

const initialForm = {
  CategoryName: '',
  CategoryCode: '',
  CategoryDescription: '',
  MetaTitle: '',
  MetaDescription: '',
  MenuVisible: true,
  Active: true,
}

export default function EditCategory() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { categories, loading: categoriesLoading } = useSelector(state => state.category)
  
  const [category, setCategory] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [categoryImage, setCategoryImage] = useState(null)
  const [iconImage, setIconImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!form.CategoryName || form.CategoryName.trim() === '') {
      newErrors.CategoryName = 'Category Name is required'
    }

    if (!form.CategoryCode || form.CategoryCode.trim() === '') {
      newErrors.CategoryCode = 'Category Code is required'
    }

    if (!form.CategoryDescription || form.CategoryDescription.trim() === '') {
      newErrors.CategoryDescription = 'Category Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    // Load categories if not already loaded
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length, categoriesLoading])

  useEffect(() => {
    // Find category once categories are loaded
    if (categories.length > 0) {
      const found = categories.find(item => String(item.CategoryId) === String(id))
      if (!found) {
        toast.error('Category not found.')
        navigate('/categories')
        return
      }
      setCategory(found)
      setForm({
        CategoryName: found.CategoryName || '',
        CategoryCode: found.CategoryCode || '',
        CategoryDescription: found.CategoryDescription || '',
        MetaTitle: found.MetaTitle || '',
        MetaDescription: found.MetaDescription || '',
        MenuVisible: found.MenuVisible ?? true,
        Active: found.Active ?? true,
      })
      setLoading(false)
    } else if (!categoriesLoading && categories.length === 0) {
      toast.error('No categories available.')
      navigate('/categories')
    }
  }, [categories, id, navigate, categoriesLoading])

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

    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    const payload = new FormData()
    payload.append('Flag', 'U')
    payload.append('CategoryId', String(category?.CategoryId || id))
    payload.append('CompId', '1')
    payload.append('BranchId', '5')
    payload.append('CategoryName', form.CategoryName)
    payload.append('CategoryCode', form.CategoryCode)
    payload.append('CategoryDescription', form.CategoryDescription)
    payload.append('MetaTitle', form.MetaTitle)
    payload.append('MetaDescription', form.MetaDescription)
    payload.append('MenuVisible', form.MenuVisible ? 'true' : 'false')
    payload.append('Active', form.Active ? 'true' : 'false')
    payload.append('CreatedBy', category?.CreatedBy || 'Admin')
    payload.append('UpdatedBy', 'Manager')
    payload.append('CreatedAt', category?.CreatedAt || new Date().toISOString())
    payload.append('UpdatedAt', new Date().toISOString())

    if (categoryImage) {
      payload.append('CategoryImage', categoryImage)
    }
    if (iconImage) {
      payload.append('IconImage', iconImage)
    }

    try {
      setSaving(true)
      await updateProductCategory(payload)
      toast.success('Category updated successfully')
      navigate('/categories')
    } catch (err) {
      toast.error(err.message || 'Unable to update category')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="category-page">
        <div className="page-header">
          <h1>Edit Category</h1>
        </div>
        <div className="table-card">Loading category details...</div>
      </div>
    )
  }

  return (
    <div className="category-page">
      <div className="page-header">
        <div>
          <h1>Edit Category</h1>
          <p>Update category information and upload new images if needed.</p>
        </div>
      </div>

      <div className="category-form-card">
        <form className="category-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="CategoryName">Category Name <span className="required">*</span></label>
              <input
                id="CategoryName"
                name="CategoryName"
                type="text"
                value={form.CategoryName}
                onChange={handleChange}
                placeholder="Enter category name"
                className={errors.CategoryName ? 'input-error' : ''}
              />
              {errors.CategoryName && <span className="error-message">{errors.CategoryName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="CategoryCode">Category Code <span className="required">*</span></label>
              <input
                id="CategoryCode"
                name="CategoryCode"
                type="text"
                value={form.CategoryCode}
                onChange={handleChange}
                placeholder="Enter category code"
                className={errors.CategoryCode ? 'input-error' : ''}
              />
              {errors.CategoryCode && <span className="error-message">{errors.CategoryCode}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="CategoryDescription">Category Description <span className="required">*</span></label>
              <textarea
                id="CategoryDescription"
                name="CategoryDescription"
                rows="4"
                value={form.CategoryDescription}
                onChange={handleChange}
                placeholder="Describe this category"
                className={errors.CategoryDescription ? 'input-error' : ''}
              />
              {errors.CategoryDescription && <span className="error-message">{errors.CategoryDescription}</span>}
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
              {categoryImage ? <span className="file-meta">{categoryImage.name}</span> : category?.CategoryImage ? <span className="file-meta">Current: {category.CategoryImage}</span> : null}
            </div>

            <div className="form-group">
              <label htmlFor="IconImage">Icon Image</label>
              <input id="IconImage" name="IconImage" type="file" accept="image/*" onChange={handleFileChange} />
              {iconImage ? <span className="file-meta">{iconImage.name}</span> : category?.IconImage ? <span className="file-meta">Current: {category.IconImage}</span> : null}
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
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
