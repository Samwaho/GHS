import { UploadcareSimpleAuthSchema } from '@uploadcare/rest-client';

// Uploadcare configuration
export const uploadcareConfig = {
  publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
  secretKey: process.env.UPLOADCARE_SECRET_KEY!,
};

// Initialize Uploadcare client for server-side operations
export const uploadcareAuth = new UploadcareSimpleAuthSchema({
  publicKey: uploadcareConfig.publicKey,
  secretKey: uploadcareConfig.secretKey,
});

// Uploadcare widget configuration for React components
export const uploaderConfig = {
  pubkey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
  multiple: false,
  imgOnly: true,
  preview: true,
  crop: 'free',
  tabs: 'file camera url',
  effects: 'crop,rotate,mirror,flip,enhance,grayscale,blur,sharp,invert',
  imageShrink: '2048x2048',
  imageCompress: 'auto',
  locale: 'en',
  theme: 'light',
};

// Helper function to extract UUID from Uploadcare URL
export function extractUuidFromUrl(url: string): string | null {
  const match = url.match(/\/([a-f0-9-]{36})\//);
  return match ? match[1] : null;
}

export async function uploadToUploadcare(file: File): Promise<{ cdnUrl: string; uuid: string }> {
  const formData = new FormData();
  formData.append('UPLOADCARE_PUB_KEY', process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!);
  formData.append('file', file);

  const response = await fetch('https://upload.uploadcare.com/base/', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();

  if (!data.file) {
    throw new Error('No file returned from upload');
  }

  const uuid = data.file;
  const cdnUrl = `https://ucarecdn.com/${uuid}/`;

  return { cdnUrl, uuid };
}

// Helper function to build Uploadcare URL with transformations
export function buildUploadcareUrl(uuid: string, transformations?: string): string {
  const baseUrl = `https://ucarecdn.com/${uuid}/`;
  return transformations ? `${baseUrl}-/${transformations}/` : baseUrl;
}

// Common image transformations
export const imageTransformations = {
  thumbnail: 'scale_crop/300x200/center/',
  medium: 'scale_crop/600x400/center/',
  large: 'scale_crop/1200x800/center/',
  gallery: 'scale_crop/400x300/center/',
  hero: 'scale_crop/1920x1080/center/',
};
