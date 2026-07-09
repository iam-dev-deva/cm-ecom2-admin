import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addProductCategory, getNextCategoryCode } from '../../api/productApi'

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
  const [codeLoading, setCodeLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

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

    if (!categoryImage) {
      newErrors.CategoryImage = 'Category Image is required'
    }

    if (!iconImage) {
      newErrors.IconImage = 'Icon Image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    const fetchNextCode = async () => {
      try {
        setCodeLoading(true)
        const response = await getNextCategoryCode(1, 'PCTE')
        const nextCode = response?.data[0]?.ItemValue || '';
        
        setForm(prev => ({
          ...prev,
          CategoryCode: nextCode,
        }))
      } catch (err) {
        console.error('Failed to fetch next code:', err)
        toast.error('Failed to load next category code')
      } finally {
        setCodeLoading(false)
      }
    }

    fetchNextCode()
  }, [])

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
    event.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    const requestData = {
      Flag: "I",
      CategoryId: 0,
      CompId: 1,
      BranchId: 5,
      CategoryName: form.CategoryName,
      CategoryCode: form.CategoryCode,
      CategoryDescription: form.CategoryDescription,
      CategoryImage: categoryImage?.name,
      IconImage: iconImage?.name,
      MetaTitle: form.MetaTitle,
      MetaDescription: form.MetaDescription,
      MenuVisible: form.MenuVisible,
      Active: form.Active,
      CreatedBy: "Admin",
      UpdatedBy: "Manager",
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };

    const payload = new FormData();

    // JSON part
    payload.append("FormData", JSON.stringify(requestData));

    // File part
    payload.append("file", categoryImage);

    try {
      setLoading(true);

      const response = await addProductCategory(payload);

      toast.success("Category added successfully");
      navigate("/categories");
    } catch (err) {
      toast.error(err.message || "Unable to add category");
    } finally {
      setLoading(false);
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
              <label htmlFor="CategoryCode">Category Code <span className="required">*</span></label>
              <input
                id="CategoryCode"
                name="CategoryCode"
                type="text"
                value={form.CategoryCode}
                onChange={handleChange}
                placeholder="Enter category code"
                readOnly
                disabled={codeLoading}
                className={errors.CategoryCode ? 'input-error' : ''}
              />
              {codeLoading && <span className="file-meta">Loading code...</span>}
              {errors.CategoryCode && <span className="error-message">{errors.CategoryCode}</span>}
            </div>
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
              <label htmlFor="CategoryImage">Category Image <span className="required">*</span></label>
              <input id="CategoryImage" name="CategoryImage" type="file" accept="image/*" onChange={handleFileChange} className={errors.CategoryImage ? 'input-error' : ''} />
              {categoryImage && <span className="file-meta">{categoryImage.name}</span>}
              {errors.CategoryImage && <span className="error-message">{errors.CategoryImage}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="IconImage">Icon Image <span className="required">*</span></label>
              <input id="IconImage" name="IconImage" type="file" accept="image/*" onChange={handleFileChange} className={errors.IconImage ? 'input-error' : ''} />
              {iconImage && <span className="file-meta">{iconImage.name}</span>}
              {errors.IconImage && <span className="error-message">{errors.IconImage}</span>}
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
