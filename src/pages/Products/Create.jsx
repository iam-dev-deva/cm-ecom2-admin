import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addProduct, getNextProductCode, getProductCategory } from '../../api/productApi'
import ImageUpload from '../../components/common/ImageUpload'
import './Products.css'

const initialForm = {
  categoryId: 0,
  productCode: '',
  CompId: 1,
  productCategory: '',
  itemName: '',
  brandName: '',
  modelName: '',
  modelNo: '',
  skuNo: '',
  manufacturer: '',
  productDescription: '',
  bulletPoint: '',
  material: '',
  color: '',
  size: '',
  hsnCode: '',
  productTaxCode: '',
  countryOfOrigin: '',
  yourPrice: '',
  maximumRetailPrice: '',
  offeringSalePrice: '',
  offeringSaleStartDate: '',
  offeringSaleEndDate: '',
  itemLength: '',
  itemWidth: '',
  itemHeight: '',
  itemSizeUnit: 'cm',
  itemWeight: '',
  itemWeightUnit: 'kg',
  packageLength: '',
  packageWidth: '',
  packageHeight: '',
  packageUnit: 'cm',
  packageWeight: '',
  packageWeightUnit: 'kg',
  flag: 'add',
}

export default function ProductCreate() {
  const [form, setForm] = useState(initialForm)
  const [images, setImages] = useState({
    front: null,
    back: null,
    right: null,
    left: null
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [codeLoading, setCodeLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    async function init() {
      setCodeLoading(true)
      try {
        const nextResponse = await getNextProductCode(1, 'PRTE')
        const nextCode = nextResponse?.Data?.[0]?.ItemValue || nextResponse?.data?.[0]?.ItemValue || ''
        setForm(prev => ({ ...prev, productCode: nextCode }))

        const categoryResponse = await getProductCategory()
        const categoryList = Array.isArray(categoryResponse?.Data || categoryResponse) ? (categoryResponse.Data || categoryResponse) : []
        setCategories(categoryList)
      } catch (err) {
        toast.error('Unable to load product metadata')
      } finally {
        setCodeLoading(false)
      }
    }

    init()
  }, [])

  const validateForm = () => {
    const newErrors = {}
    if (!form.productCode) newErrors.productCode = 'Product code is required'
    if (!form.itemName) newErrors.itemName = 'Item name is required'
    if (!form.productCategory) newErrors.productCategory = 'Product category is required'
    if (!form.brandName) newErrors.brandName = 'Brand name is required'
    if (!form.yourPrice) newErrors.yourPrice = 'Price is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = event => {
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

  const handleCategoryChange = event => {
    const selectedCode = event.target.value
    const category = categories.find(item => item.CategoryCode === selectedCode)
    setForm(prev => ({
      ...prev,
      productCategory: selectedCode,
      categoryId: category?.CategoryId || prev.categoryId,
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!validateForm()) {
      toast.error('Please fill in required fields')
      return
    }

    const requestData = {
      CategoryId: form.categoryId,
      ProductCode: form.productCode,
      CompId: 1,
      ProductCategory: form.productCategory,
      ItemName: form.itemName,
      BrandName: form.brandName,
      ModelName: form.modelName,
      ModelNo: form.modelNo,
      SKUNo: form.skuNo,
      Manufacturer: form.manufacturer,
      ProductDescription: form.productDescription,
      BulletPoint: form.bulletPoint,
      Material: form.material,
      Color: form.color,
      Size: form.size,
      HSNCode: form.hsnCode,
      ProductTaxCode: form.productTaxCode,
      CountryOfOrigin: form.countryOfOrigin,
      YourPrice: Number(form.yourPrice),
      MaximumRetailPrice: Number(form.maximumRetailPrice),
      OfferingSalePrice: Number(form.offeringSalePrice),
      OfferingSaleStartDate: form.offeringSaleStartDate,
      OfferingSaleEndDate: form.offeringSaleEndDate,
      DimensionID: 1,
      ItemLength: Number(form.itemLength),
      ItemWidth: Number(form.itemWidth),
      ItemHeight: Number(form.itemHeight),
      ItemSizeUnit: form.itemSizeUnit,
      ItemWeight: Number(form.itemWeight),
      ItemWeightUnit: form.itemWeightUnit,
      PackageLength: Number(form.packageLength),
      PackageWidth: Number(form.packageWidth),
      PackageHeight: Number(form.packageHeight),
      PackageUnit: form.packageUnit,
      PackageWeight: Number(form.packageWeight),
      PackageWeightUnit: form.packageWeightUnit,
      Flag: 'I',
      FrontImage: images.front?.name || '',
      BackImage: images.back?.name || '',
      RightImage: images.right?.name || '',
      LeftImage: images.left?.name || '',
      BranchId: 5,
      CreatedOn: new Date().toISOString(),
      ModifiedOn: null,
    }

    const payload = new FormData()
    payload.append('FormData', JSON.stringify(requestData))
    if (images.front) payload.append('frontImage', images.front)
    if (images.back) payload.append('backImage', images.back)
    if (images.right) payload.append('rightImage', images.right)
    if (images.left) payload.append('leftImage', images.left)

    try {
      setLoading(true)
      await addProduct(payload)
      toast.success('Product added successfully')
      navigate('/products')
    } catch (err) {
      toast.error(err.message || 'Unable to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="product-page">
      {/* <div className="page-header">
        <div>
          <h1>Add Product</h1>
          <p>Create a new product record with all required details.</p>
        </div>
      </div> */}

      <div className="product-form-card">
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-tabs">
            <button type="button" className={`tab-button ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
              Product Details
            </button>
            <button type="button" className={`tab-button ${activeTab === 'images' ? 'active' : ''}`} onClick={() => setActiveTab('images')}>
              Images
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="productCode">Product Code</label>
                <input
                  id="productCode"
                  name="productCode"
                  type="text"
                  value={form.productCode}
                  onChange={handleChange}
                  readOnly
                  disabled={codeLoading}
                />
                {codeLoading && <span className="file-meta">Loading code...</span>}
              </div>

              <div className="form-group">
                <label htmlFor="productCategory">Product Category</label>
                <select
                  id="productCategory"
                  name="productCategory"
                  value={form.productCategory}
                  onChange={handleCategoryChange}
                  className={errors.productCategory ? 'input-error' : ''}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.CategoryId} value={category.CategoryCode}>
                      {category.CategoryName} ({category.CategoryCode})
                    </option>
                  ))}
                </select>
                {errors.productCategory && <span className="error-message">{errors.productCategory}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="itemName">Item Name</label>
                <input
                  id="itemName"
                  name="itemName"
                  type="text"
                  value={form.itemName}
                  onChange={handleChange}
                  className={errors.itemName ? 'input-error' : ''}
                />
                {errors.itemName && <span className="error-message">{errors.itemName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="brandName">Brand Name</label>
                <input
                  id="brandName"
                  name="brandName"
                  type="text"
                  value={form.brandName}
                  onChange={handleChange}
                  className={errors.brandName ? 'input-error' : ''}
                />
                {errors.brandName && <span className="error-message">{errors.brandName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="modelName">Model Name</label>
                <input id="modelName" name="modelName" type="text" value={form.modelName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="modelNo">Model No</label>
                <input id="modelNo" name="modelNo" type="text" value={form.modelNo} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="skuNo">SKU No</label>
                <input id="skuNo" name="skuNo" type="text" value={form.skuNo} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="manufacturer">Manufacturer</label>
                <input id="manufacturer" name="manufacturer" type="text" value={form.manufacturer} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="material">Material</label>
                <input id="material" name="material" type="text" value={form.material} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input id="color" name="color" type="text" value={form.color} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="size">Size</label>
                <input id="size" name="size" type="text" value={form.size} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="hsnCode">HSN Code</label>
                <input id="hsnCode" name="hsnCode" type="text" value={form.hsnCode} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="productTaxCode">Product Tax Code</label>
                <input id="productTaxCode" name="productTaxCode" type="text" value={form.productTaxCode} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="countryOfOrigin">Country of Origin</label>
                <input id="countryOfOrigin" name="countryOfOrigin" type="text" value={form.countryOfOrigin} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="yourPrice">Your Price</label>
                <input id="yourPrice" name="yourPrice" type="number" step="0.01" value={form.yourPrice} onChange={handleChange} className={errors.yourPrice ? 'input-error' : ''} />
                {errors.yourPrice && <span className="error-message">{errors.yourPrice}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="maximumRetailPrice">Maximum Retail Price</label>
                <input id="maximumRetailPrice" name="maximumRetailPrice" type="number" step="0.01" value={form.maximumRetailPrice} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="offeringSalePrice">Offering Sale Price</label>
                <input id="offeringSalePrice" name="offeringSalePrice" type="number" step="0.01" value={form.offeringSalePrice} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="offeringSaleStartDate">Sale Start Date</label>
                <input id="offeringSaleStartDate" name="offeringSaleStartDate" type="datetime-local" value={form.offeringSaleStartDate} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="offeringSaleEndDate">Sale End Date</label>
                <input id="offeringSaleEndDate" name="offeringSaleEndDate" type="datetime-local" value={form.offeringSaleEndDate} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="itemLength">Item Length</label>
                <input id="itemLength" name="itemLength" type="number" step="0.01" value={form.itemLength} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="itemWidth">Item Width</label>
                <input id="itemWidth" name="itemWidth" type="number" step="0.01" value={form.itemWidth} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="itemHeight">Item Height</label>
                <input id="itemHeight" name="itemHeight" type="number" step="0.01" value={form.itemHeight} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="itemSizeUnit">Item Size Unit</label>
                <input id="itemSizeUnit" name="itemSizeUnit" type="text" value={form.itemSizeUnit} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="itemWeight">Item Weight</label>
                <input id="itemWeight" name="itemWeight" type="number" step="0.01" value={form.itemWeight} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="itemWeightUnit">Item Weight Unit</label>
                <input id="itemWeightUnit" name="itemWeightUnit" type="text" value={form.itemWeightUnit} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="packageLength">Package Length</label>
                <input id="packageLength" name="packageLength" type="number" step="0.01" value={form.packageLength} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="packageWidth">Package Width</label>
                <input id="packageWidth" name="packageWidth" type="number" step="0.01" value={form.packageWidth} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="packageHeight">Package Height</label>
                <input id="packageHeight" name="packageHeight" type="number" step="0.01" value={form.packageHeight} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="packageUnit">Package Unit</label>
                <input id="packageUnit" name="packageUnit" type="text" value={form.packageUnit} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="packageWeight">Package Weight</label>
                <input id="packageWeight" name="packageWeight" type="number" step="0.01" value={form.packageWeight} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="packageWeightUnit">Package Weight Unit</label>
                <input id="packageWeightUnit" name="packageWeightUnit" type="text" value={form.packageWeightUnit} onChange={handleChange} />
              </div>
              <div className="form-group ">
                <label htmlFor="productDescription">Product Description</label>
                <textarea id="productDescription" name="productDescription" rows="3" value={form.productDescription} onChange={handleChange} />
              </div>

              <div className="form-group ">
                <label htmlFor="bulletPoint">Bullet Point</label>
                <textarea id="bulletPoint" name="bulletPoint" rows="3" value={form.bulletPoint} onChange={handleChange} />
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="form-grid">
              <ImageUpload
                label="Front Image"
                onImageSelect={(file) => handleImageSelect('front', file)}
              />
              <ImageUpload
                label="Back Image"
                onImageSelect={(file) => handleImageSelect('back', file)}
              />
              <ImageUpload
                label="Right Image"
                onImageSelect={(file) => handleImageSelect('right', file)}
              />
              <ImageUpload
                label="Left Image"
                onImageSelect={(file) => handleImageSelect('left', file)}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
