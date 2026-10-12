import React, { useRef, useState, useEffect } from 'react';
import { FiCamera, FiRefreshCw } from 'react-icons/fi';
import { resizeImage, validateImageFile } from '../lib/image';

export default function PhotoUpload({
  onPhotoReady,
  onPhotoCleared,
  disabled = false,
  onError,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFile = async (file) => {
    if (!file) return;

    const validationErr = validateImageFile(file);
    if (validationErr) {
      if (onError) onError(validationErr);
      return;
    }

    setIsProcessing(true);

    try {
      // Clean up previous preview URL if any
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // Resize using canvas to max 1024px, 0.8 quality JPEG
      const { blob } = await resizeImage(file, 1024, 0.8);
      const newPreviewUrl = URL.createObjectURL(blob);

      setPreviewUrl(newPreviewUrl);
      setFileName(file.name || 'photo.jpg');

      if (onPhotoReady) {
        onPhotoReady({
          blob,
          previewUrl: newPreviewUrl,
          fileName: file.name || 'photo.jpg',
        });
      }
    } catch (err) {
      console.error('Image processing error:', err);
      if (onError) onError(err.message || 'Failed to process image.');
    } finally {
      setIsProcessing(false);
      // Reset input value so the same file could be picked again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleChangeClick = () => {
    if (disabled || isProcessing) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName('');
    if (onPhotoCleared) {
      onPhotoCleared();
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        disabled={disabled || isProcessing}
        className="hidden"
        id="photo-upload-input"
        aria-label="Upload mission photo"
      />

      {!previewUrl ? (
        /* Empty State */
        <label
          htmlFor="photo-upload-input"
          className={`flex flex-col items-center justify-center w-full min-h-[200px] sm:min-h-[220px] rounded-2xl border-2 border-dashed border-[#8B6B4A]/40 bg-[#E6DCC8]/30 hover:bg-[#E6DCC8]/50 transition-all cursor-pointer p-6 text-center select-none focus-within:ring-2 focus-within:ring-[#2F5D3A] ${
            disabled || isProcessing ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#E6DCC8] border border-[#8B6B4A]/25 flex items-center justify-center text-[#2F5D3A] mb-3">
            <FiCamera className="w-6 h-6" aria-hidden="true" />
          </div>

          <span className="font-medium text-sm text-[#1F2A22]">
            {isProcessing ? 'Processing image...' : 'Take photo or upload'}
          </span>
          <span className="text-xs text-[#8B6B4A] mt-1 font-mono">
            JPG, PNG up to 1024px
          </span>
        </label>
      ) : (
        /* Photo Selected Preview State */
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#8B6B4A]/30 bg-[#E6DCC8]/40 p-2">
          <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-[#1F2A22]/5">
            <img
              src={previewUrl}
              alt="Mission photo preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between px-2 pt-2.5 pb-1">
            <span className="text-xs text-[#1F2A22]/70 font-mono truncate max-w-[200px]">
              {fileName}
            </span>

            {!disabled && (
              <button
                type="button"
                onClick={handleChangeClick}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B6B4A] hover:text-[#1F2A22] underline underline-offset-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2F5D3A] rounded px-1"
              >
                <FiRefreshCw className="w-3 h-3" aria-hidden="true" />
                <span>Change</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Required note under upload from design */}
      <p className="text-center text-[11px] text-[#8B6B4A] font-normal leading-relaxed pt-0.5">
        Photo check only. Avoid people.
      </p>
    </div>
  );
}
