import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './ImageUpload.css';

// Compresses a canvas's content into a JPEG blob under `maxSizeKB`.
// Strategy: first try lowering quality; if that's not enough at low quality,
// scale down the canvas dimensions and try again. Stops as soon as the
// target size is hit, so it won't over-compress small images.
async function compressCanvasToBlob(sourceCanvas, maxSizeKB = 100) {
  const canvasToBlob = (canvas, quality) =>
    new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));

  let width = sourceCanvas.width;
  let height = sourceCanvas.height;
  let workingCanvas = sourceCanvas;

  const maxSizeBytes = maxSizeKB * 1024;
  const minQuality = 0.3;
  const minDimension = 200; // don't shrink below this on the longer side

  for (let attempt = 0; attempt < 8; attempt++) {
    let quality = 0.9;
    let blob = await canvasToBlob(workingCanvas, quality);

    // Step quality down in increments until under the limit or floor reached
    while (blob.size > maxSizeBytes && quality > minQuality) {
      quality -= 0.1;
      blob = await canvasToBlob(workingCanvas, quality);
    }

    if (blob.size <= maxSizeBytes) {
      return blob;
    }

    // Still too big even at min quality -> shrink dimensions and retry
    if (Math.max(width, height) <= minDimension) {
      // Can't shrink further, return best effort (lowest quality achieved)
      return blob;
    }

    width = Math.round(width * 0.85);
    height = Math.round(height * 0.85);

    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = width;
    resizedCanvas.height = height;
    const ctx = resizedCanvas.getContext('2d');
    ctx.drawImage(workingCanvas, 0, 0, width, height);
    workingCanvas = resizedCanvas;
  }

  // Fallback: return whatever the last attempt produced
  return canvasToBlob(workingCanvas, minQuality);
}

export default function ImageUpload({ label, onImageSelect, initialImage = null }) {
  const [preview, setPreview] = useState(initialImage || null);
  const [showCrop, setShowCrop] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  // Keep preview in sync if initialImage arrives/changes after mount
  // (e.g. category/product data loads asynchronously on an edit screen).
  useEffect(() => {
    setPreview(initialImage || null);
  }, [initialImage]);

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

    setIsCompressing(true);
    try {
      const blob = await compressCanvasToBlob(canvas, 100); // target: under 100KB

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
    } finally {
      setIsCompressing(false);
    }
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
                disabled={isCompressing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCropConfirm}
                disabled={isCompressing}
              >
                {isCompressing ? 'Compressing...' : 'Confirm Crop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}