import { getDecryptedStoredToken } from "../utils/auth.js";
import axios from "../utils/axiosProduct.js";

export async function addProductCategory(formData) {
  try {
    const response = await axios.post("/Products/IUProductsCatergory", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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
    const response = await axios.post("/Products/IUProductsCatergory", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

    const response = await axios.post("/Products/IUProductsCatergory", formData);
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
            getDecryptedStoredToken();
    const response = await axios.get("/Products/GetAllProductsCatergory?compId=1");
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(` ${message}` || 'get Product Category failed.');
    }
    throw err;
  }
}

export async function getNextCategoryCode(compId = 1, codeTableId = 'PCTE') {
  try {
    const COMMON_API_URL = 'https://rudra.circlemark.in'
    const response = await axios.get(
      `${COMMON_API_URL}/Common/Getcommoncodemaster?compId=${compId}&codeTableId=${codeTableId}&flag=NextCode`
    );
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(`${message}` || 'Failed to fetch next category code.');
    }
    throw err;
  }
}

export async function getProducts() {
  try {
    const response = await axios.get("/Products/GetAllProductDetails?compId=1");
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(` ${message}` || 'Failed to fetch products.');
    }
    throw err;
  }
}

export async function addProduct(formData) {
  try {
    const response = await axios.post("/Products/SaveProductDetails", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(` ${message}` || 'Add Product failed.');
    }
    throw err;
  }
}

export async function updateProduct(formData) {
  try {
    const response = await axios.post("/Products/IUProducts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(` ${message}` || 'Update Product failed.');
    }
    throw err;
  }
}

export async function deleteProduct(productCode) {
  try {
    const formData = new FormData();
    formData.append('Flag', 'D');
    formData.append('productCode', productCode);
    formData.append('CompId', '1');
    formData.append('BranchId', '5');

    const response = await axios.post("/Products/IUProducts", formData);
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(` ${message}` || 'Delete Product failed.');
    }
    throw err;
  }
}

export async function getProductByCode(productCode) {
  try {
    const response = await getProducts();
    const products = response?.Data || response || [];
    return products.find(item => String(item.ProductCode) === String(productCode) || String(item.ProductID) === String(productCode)) || null;
  } catch (err) {
    throw err;
  }
}

export async function getNextProductCode(compId = 1, codeTableId = 'PRDE') {
  try {
    const COMMON_API_URL = 'https://rudra.circlemark.in'
    const response = await axios.get(
      `${COMMON_API_URL}/Common/Getcommoncodemaster?compId=${compId}&codeTableId=${codeTableId}&flag=NextCode`
    );
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(`${message}` || 'Failed to fetch next product code.');
    }
    throw err;
  }
}

