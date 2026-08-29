// Resolves an image field to a full URL. Handles both a full URL (if you
// ever add a cloud image host later) and the local uploads/ path scheme
// currently used by the backend.
export const resolveImageSrc = (image) => {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${image}`;
};
