'use client';

import { useState } from 'react';
import { FileUploader } from './file-uploader';
import { uploadToUploadcare } from '@/lib/uploadcare';
import { toast } from 'sonner';

interface UploadcareUploaderProps {
  onUpload: (result: { cdnUrl: string; uuid: string }) => void;
  preview?: string;
  disabled?: boolean;
  className?: string;
  maxSize?: number;
  compact?: boolean;
}

export function UploadcareUploader({
  onUpload,
  preview,
  disabled = false,
  className,
  maxSize = 10,
  compact = false,
}: UploadcareUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(preview);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Create a preview URL immediately for better UX
      const previewUrl = URL.createObjectURL(file);
      setCurrentPreview(previewUrl);
      
      // Upload to Uploadcare
      const result = await uploadToUploadcare(file);
      
      // Clean up the preview URL
      URL.revokeObjectURL(previewUrl);
      
      // Set the actual Uploadcare URL as preview
      setCurrentPreview(result.cdnUrl);
      
      // Call the onUpload callback
      onUpload(result);
      
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image. Please try again.');
      
      // Reset preview on error
      setCurrentPreview(preview);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = () => {
    setCurrentPreview(undefined);
    // You might want to call a callback here to notify parent component
  };

  return (
    <FileUploader
      onFileSelect={handleFileSelect}
      onFileRemove={handleFileRemove}
      preview={currentPreview}
      disabled={disabled || isUploading}
      className={className}
      maxSize={maxSize}
      accept="image/*"
      compact={compact}
    />
  );
}
