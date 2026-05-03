/**
 * Robust utility for direct browser-to-Cloudinary uploads.
 * Uses unsigned upload presets for high performance and zero backend overhead.
 * 
 * IMPORTANT: You must set the following in your .env file:
 * VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 * VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 * 
 * Ensure the upload preset is configured as 'Unsigned' in your Cloudinary Dashboard
 * (Settings > Upload > Upload presets).
 */

export const uploadImageToCloudinary = async (file) => {
 if (!file) return null;

 const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
 const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

 if (!cloudName || !uploadPreset) {
 const errorMsg = 'Cloudinary configuration missing. Please check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env';
 console.error(errorMsg);
 throw new Error(errorMsg);
 }

 const formData = new FormData();
 formData.append('file', file);
 formData.append('upload_preset', uploadPreset);

 try {
 const response = await fetch(
 `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
 {
 method: 'POST',
 body: formData,
 // No headers needed for unsigned FormData upload to Cloudinary
 }
 );

 if (!response.ok) {
 const errorData = await response.json();
 throw new Error(errorData.error?.message || 'Cloudinary upload failed');
 }

 const data = await response.json();
 return data.secure_url;
 } catch (error) {
 console.error('Cloudinary upload error:', error);
 throw error;
 }
};
