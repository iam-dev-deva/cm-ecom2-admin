import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { updateProductCategory } from '../../api/productApi'
import { fetchCategories } from '../../redux/slices/categorySlice'
import ImageUpload from '../../components/common/ImageUpload'
import './Categories.css'

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
  const [images, setImages] = useState({
    category: null,
    icon: null
  })
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

  const handleImageSelect = (position, file) => {
    setImages(prev => ({
      ...prev,
      [position]: file
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    const requestData = {
      Flag: 'U',
      CategoryId: category?.CategoryId || id,
      CompId: 1,
      BranchId: 5,
      CategoryName: form.CategoryName,
      CategoryCode: form.CategoryCode,
      CategoryDescription: form.CategoryDescription,
      CategoryImage: images.category?.name || category?.CategoryImage || '',
      IconImage: images.icon?.name || category?.IconImage || '',
      MetaTitle: form.MetaTitle,
      MetaDescription: form.MetaDescription,
      MenuVisible: form.MenuVisible,
      Active: form.Active,
      CreatedBy: category?.CreatedBy || 'Admin',
      UpdatedBy: 'Manager',
      CreatedAt: category?.CreatedAt || new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    }

    const payload = new FormData()
    payload.append('FormData', JSON.stringify(requestData))

    // Only append if new file is selected
    if (images.category) {
      payload.append('file', images.category)
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
      {/* <div className="page-header">
        <div>
          <h1>Edit Category</h1>
          <p>Update category information and upload new images if needed.</p>
        </div>
      </div> */}

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

            <div className="form-group ">
              <label htmlFor="CategoryDescription">Category Description <span className="required">*</span></label>
              <input
                id="CategoryDescription"
                name="CategoryDescription"
                type="text"
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

            <div className="form-group">
              <label htmlFor="MetaDescription">Meta Description</label>
              <input
                id="MetaDescription"
                name="MetaDescription"
                type="text"
                value={form.MetaDescription}
                onChange={handleChange}
                placeholder="SEO meta description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="CategoryImage">Category Image</label>
              <ImageUpload
                label=""
                onImageSelect={(file) => handleImageSelect('category', file)}
              />
            </div>

            {/* <div className="form-group">
              <label htmlFor="IconImage">Icon Image</label>
              <ImageUpload
                label=""
                onImageSelect={(file) => handleImageSelect('icon', file)}
              />
            </div> */}

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
