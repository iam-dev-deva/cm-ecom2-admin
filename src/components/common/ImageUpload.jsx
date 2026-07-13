import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './ImageUpload.css';

export default function ImageUpload({ label, onImageSelect, initialImage = null }) {
  const [preview, setPreview] = useState(initialImage || null);
  const [showCrop, setShowCrop] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = event.target?.result;
      setCropImage(img);
      setShowCrop(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const image = imgRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      const croppedFile = new File(
        [blob],
        `cropped_${Date.now()}.jpg`,
        { type: 'image/jpeg' }
      );

      const url = URL.createObjectURL(blob);
      setPreview(url);
      onImageSelect(croppedFile);
      setShowCrop(false);
      setCropImage(null);
      fileInputRef.current.value = '';
    }, 'image/jpeg');
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <div className="image-upload-container">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div
          className="image-upload-box"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="image-preview-container">
              <img src={preview} alt={label} className="preview-image" />
              <div className="image-overlay">
                <div className="overlay-content">
                  <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span className="overlay-text">Edit Image</span>
                </div>
                <button
                  className="remove-btn"
                  onClick={handleRemoveImage}
                  type="button"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-upload-box">
              <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span className="upload-text">Upload Image</span>
            </div>
          )}
        </div>

        {label && <label className="image-label">{label}</label>}
      </div>

      {showCrop && (
        <div className="crop-modal-overlay">
          <div className="crop-modal-container">
            <div className="crop-modal-header">
              <h3>Crop Image (1:1 Ratio)</h3>
              <button
                className="crop-close-btn"
                onClick={() => setShowCrop(false)}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="crop-modal-body">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
              >
                <img
                  ref={imgRef}
                  src={cropImage}
                  alt="Crop preview"
                  className="crop-image"
                />
              </ReactCrop>
            </div>

            <div className="crop-modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowCrop(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCropConfirm}
              >
                Confirm Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
