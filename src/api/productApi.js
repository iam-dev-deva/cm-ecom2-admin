import axios from "axios";

const STORAGE_KEY = 'cmAdminUser'
const LOGIN_URL = 'https://rudra.circlemark.in/ProductServices/api'

export async function addProductCategory(formData) {
  try {
    const response = await axios.post(LOGIN_URL + "/Products/IUProducts", formData);
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(` ${message}` || 'Add Product Category failed.');
    }
    throw err;
  }
}

export async function updateProductCategory(formData) {
  try {
    const response = await axios.post(LOGIN_URL + "/Products/IUProducts", formData);
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(` ${message}` || 'Update Product Category failed.');
    }
    throw err;
  }
}

export async function deleteProductCategory(categoryId) {
  try {
    const formData = new FormData();
    formData.append('Flag', 'D');
    formData.append('CategoryId', categoryId);
    formData.append('CompId', '1');
    formData.append('BranchId', '5');

    const response = await axios.post(LOGIN_URL + "/Products/IUProducts", formData);
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(` ${message}` || 'Delete Product Category failed.');
    }
    throw err;
  }
}

export async function getProductCategory() {
  try {
    const response = await axios.get(LOGIN_URL + "/Products/GetAllProducts?compId=1");
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(` ${message}` || 'get Product Category failed.');
    }
    throw err;
  }
}

