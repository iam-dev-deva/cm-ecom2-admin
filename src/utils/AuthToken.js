import CryptoJS from "crypto-js";

const SECRET_KEY = "7478374834543456";
const IV = "5533210987434341";
const secretKey = CryptoJS.enc.Utf8.parse(SECRET_KEY);
const iv = CryptoJS.enc.Utf8.parse(IV);

function getCryptoOptions() {
  return {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  };
}

export function encryptToken(plainText) {
  if (!plainText) return "";

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(String(plainText)),
    secretKey,
    getCryptoOptions()
  );

  return encrypted.toString();
}

export function decryptToken(cipherText) {
  const value = String(cipherText || "").trim()
  if (!value) return ""

  // If the value looks like a plain JWT / token with dots, return it as-is.
  if (value.includes('.') || /[^A-Za-z0-9+/=]/.test(value)) {
    console.log("Token appears to be plain text, returning without decryption:", value)
    return value
  }

  try {
    const bytes = CryptoJS.AES.decrypt(
      value,
      secretKey,
      getCryptoOptions()
    )

    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    if (decrypted) {
      console.log("Token decrypted:", decrypted)
      return decrypted
    }

    console.warn("Decryption produced no UTF-8 content, returning original token.")
    return value
  } catch (error) {
    console.error("Token decryption failed, returning original token:", error)
    return value
  }
}
