/**
 * Robust utility for direct browser-to-Cloudinary uploads.
 * Uses unsigned upload presets for high performance and zero backend overhead.
 * 
 * IMPORTANT: You must set the following in your environment:
 * VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 * VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 */

// Access environment variables using Vite's import.meta.env
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Debug logging for configuration state
if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.error(
    "⚠️ CLOUDINARY CONFIGURATION MISSING: " +
    "Ensure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET are set in your environment variables. " +
    "Image uploads will be disabled until this is fixed."
  );
}

/**
 * Uploads a file to Cloudinary.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string|null>} - The secure URL of the uploaded image.
 */
export const uploadImageToCloudinary = async (file) => {
  if (!file) return null;

  // Prevent API calls if configuration is missing
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    const errorMsg = 'Cloudinary upload failed: Missing VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET.';
    console.error(`[Cloudinary Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('[Cloudinary Upload Exception]', error);
    throw error;
  }
};
