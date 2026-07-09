import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getProductByCode, getProductCategory, updateProduct } from '../../api/productApi'

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
  flag: 'U',
}

export default function ProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [categories, setCategories] = useState([])
  const [frontImage, setFrontImage] = useState(null)
  const [backImage, setBackImage] = useState(null)
  const [rightImage, setRightImage] = useState(null)
  const [leftImage, setLeftImage] = useState(null)
  const [previewUrls, setPreviewUrls] = useState({ front: '', back: '', right: '', left: '' })
  const [activeTab, setActiveTab] = useState('details')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    async function loadData() {
      try {
        const categoryResponse = await getProductCategory()
        const categoryList = Array.isArray(categoryResponse?.Data || categoryResponse) ? (categoryResponse.Data || categoryResponse) : []
        setCategories(categoryList)

        const productRecord = await getProductByCode(id)
        if (!productRecord) {
          toast.error('Product not found')
          navigate('/products')
          return
        }

        setForm({
          categoryId: productRecord.CategoryId || productRecord.CategoryId || 0,
          productCode: productRecord.ProductCode || '',
          CompId: productRecord.CompId || 1,
          productCategory: productRecord.ProductCategory || '',
          itemName: productRecord.ItemName || '',
          brandName: productRecord.BrandName || '',
          modelName: productRecord.ModelName || '',
          modelNo: productRecord.ModelNo || '',
          skuNo: productRecord.SKUNo || '',
          manufacturer: productRecord.Manufacturer || '',
          productDescription: productRecord.ProductDescription || '',
          bulletPoint: productRecord.BulletPoint || '',
          material: productRecord.Material || '',
          color: productRecord.Color || '',
          size: productRecord.Size || '',
          hsnCode: productRecord.HSNCode || '',
          productTaxCode: productRecord.ProductTaxCode || '',
          countryOfOrigin: productRecord.CountryOfOrigin || '',
          yourPrice: productRecord.YourPrice || '',
          maximumRetailPrice: productRecord.MaximumRetailPrice || '',
          offeringSalePrice: productRecord.OfferingSalePrice || '',
          offeringSaleStartDate: productRecord.OfferingSaleStartDate ? productRecord.OfferingSaleStartDate.slice(0, 16) : '',
          offeringSaleEndDate: productRecord.OfferingSaleEndDate ? productRecord.OfferingSaleEndDate.slice(0, 16) : '',
          itemLength: productRecord.ItemLength || '',
          itemWidth: productRecord.ItemWidth || '',
          itemHeight: productRecord.ItemHeight || '',
          itemSizeUnit: productRecord.ItemSizeUnit || 'cm',
          itemWeight: productRecord.ItemWeight || '',
          itemWeightUnit: productRecord.ItemWeightUnit || 'kg',
          packageLength: productRecord.PackageLength || '',
          packageWidth: productRecord.PackageWidth || '',
          packageHeight: productRecord.PackageHeight || '',
          packageUnit: productRecord.PackageUnit || 'cm',
          packageWeight: productRecord.PackageWeight || '',
          packageWeightUnit: productRecord.PackageWeightUnit || 'kg',
          flag: 'U',
        })
      } catch (err) {
        toast.error(err.message || 'Unable to load product')
        navigate('/products')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, navigate])

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

  const handleFileChange = event => {
    const { name, files } = event.target
    if (!files || files.length === 0) return
    const file = files[0]
    if (name === 'frontImage') setFrontImage(file)
    if (name === 'backImage') setBackImage(file)
    if (name === 'rightImage') setRightImage(file)
    if (name === 'leftImage') setLeftImage(file)
  }

  useEffect(() => {
    const urls = {
      front: frontImage ? URL.createObjectURL(frontImage) : '',
      back: backImage ? URL.createObjectURL(backImage) : '',
      right: rightImage ? URL.createObjectURL(rightImage) : '',
      left: leftImage ? URL.createObjectURL(leftImage) : '',
    }
    setPreviewUrls(urls)

    return () => {
      Object.values(urls).forEach(url => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [frontImage, backImage, rightImage, leftImage])

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
      CompId: form.CompId,
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
      Flag: 'U',
      FrontImage: frontImage?.name || '',
      BackImage: backImage?.name || '',
      RightImage: rightImage?.name || '',
      LeftImage: leftImage?.name || '',
      BranchId: 5,
      ModifiedOn: new Date().toISOString(),
    }

    const payload = new FormData()
    payload.append('FormData', JSON.stringify(requestData))
    if (frontImage) payload.append('frontImage', frontImage)
    if (backImage) payload.append('backImage', backImage)
    if (rightImage) payload.append('rightImage', rightImage)
    if (leftImage) payload.append('leftImage', leftImage)

    try {
      setSaving(true)
      await updateProduct(payload)
      toast.success('Product updated successfully')
      navigate('/products')
    } catch (err) {
      toast.error(err.message || 'Unable to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="product-page">
        <div className="page-header">
          <h1>Edit Product</h1>
        </div>
        <div className="table-card">Loading product...</div>
      </div>
    )
  }

  return (
    <div className="product-page">
      {/* <div className="page-header">
        <div>
          <h1>Edit Product</h1>
          <p>Update existing product details.</p>
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
                <input id="productCode" name="productCode" type="text" value={form.productCode} readOnly />
              </div>

              <div className="form-group">
                <label htmlFor="productCategory">Product Category</label>
                <select
                  id="productCategory"
                  name="productCategory"
                  value={form.productCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.CategoryId} value={category.CategoryCode}>
                      {category.CategoryName} ({category.CategoryCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="itemName">Item Name</label>
                <input id="itemName" name="itemName" type="text" value={form.itemName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="brandName">Brand Name</label>
                <input id="brandName" name="brandName" type="text" value={form.brandName} onChange={handleChange} />
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
                <input id="yourPrice" name="yourPrice" type="number" step="0.01" value={form.yourPrice} onChange={handleChange} />
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
              
              <div className="form-group">
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
            <>
              <div className="form-grid">
                <div className="form-group image-upload-group">
                  <label htmlFor="frontImage">Front Image</label>
                  <input id="frontImage" name="frontImage" type="file" accept="image/*" onChange={handleFileChange} />
                  {previewUrls.front && (
                    <div className="image-preview-card">
                      <img src={previewUrls.front} alt="Front preview" />
                      <span className="preview-label">Front image selected</span>
                    </div>
                  )}
                </div>

                <div className="form-group image-upload-group">
                  <label htmlFor="backImage">Back Image</label>
                  <input id="backImage" name="backImage" type="file" accept="image/*" onChange={handleFileChange} />
                  {previewUrls.back && (
                    <div className="image-preview-card">
                      <img src={previewUrls.back} alt="Back preview" />
                      <span className="preview-label">Back image selected</span>
                    </div>
                  )}
                </div>

                <div className="form-group image-upload-group">
                  <label htmlFor="rightImage">Right Image</label>
                  <input id="rightImage" name="rightImage" type="file" accept="image/*" onChange={handleFileChange} />
                  {previewUrls.right && (
                    <div className="image-preview-card">
                      <img src={previewUrls.right} alt="Right preview" />
                      <span className="preview-label">Right image selected</span>
                    </div>
                  )}
                </div>

                <div className="form-group image-upload-group">
                  <label htmlFor="leftImage">Left Image</label>
                  <input id="leftImage" name="leftImage" type="file" accept="image/*" onChange={handleFileChange} />
                  {previewUrls.left && (
                    <div className="image-preview-card">
                      <img src={previewUrls.left} alt="Left preview" />
                      <span className="preview-label">Left image selected</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Update Product'}
                </button>
              </div>
            </>
          )
          }
        </form>
      </div>
    </div>
  )
}
