// Unsigned upload straight from the browser to Cloudinary - no backend
// round-trip needed for the image itself, matching the api/ folder's
// pattern of one file per external concern.
//
// Requires two Vite env vars in your .env (see .env.example):
//   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
//   VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset
//
// The upload preset must be created in your Cloudinary dashboard under
// Settings -> Upload -> Upload presets, with "Signing Mode" set to
// "Unsigned". Never put your Cloudinary API secret in frontend code.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || 'Image upload failed. Please try again.');
  }

  const data = await res.json();
  return data.secure_url;
}