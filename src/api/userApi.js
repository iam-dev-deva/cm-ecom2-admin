import axios from "axios";

const STORAGE_KEY = 'cmAdminUser'
const LOGIN_URL = 'https://rudra.circlemark.in/AdminServices/api'

export async function changePassword(formData) {
  try {
    const response = await axios.post(LOGIN_URL + "/Auth/ChangePassword", formData);
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(` ${message}` || 'Please verify your credentials.');
    }
    throw err;
  }
}
