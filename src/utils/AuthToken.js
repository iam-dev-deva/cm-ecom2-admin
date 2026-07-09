import CryptoJS from "crypto-js";

const secretKey = CryptoJS.enc.Utf8.parse("7478374834543456"); // 16 bytes for AES-128
const iv = CryptoJS.enc.Utf8.parse("5533210987434341"); // 16 bytes for CBC

const AuthToken = {
  encryptToken(plainText) {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(plainText),
      secretKey,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString(); // Base64-encoded ciphertext
  }
};

export default AuthToken;
