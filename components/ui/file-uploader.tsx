'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  preview?: string;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
}

export function FileUploader({
  onFileSelect,
  onFileRemove,
  accept = 'image/*',
  maxSize = 10,
  preview,
  disabled = false,
  className,
  compact = false,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setError(null);

    // Validate file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      setError('Invalid file type. Please select an image file.');
      return;
    }

    // Validate file size
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    if (onFileRemove) {
      onFileRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
  };

  return (
    <div className={cn('w-full', className)}>
      {preview ? (
        <Card className="relative">
          <CardContent className={compact ? "p-2" : "p-4"}>
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className={cn(
                  "w-full object-cover rounded-lg",
                  compact ? "h-32" : "h-48"
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className={compact ? "mt-2 text-center" : "mt-3 text-center"}>
              <Button
                type="button"
                variant="outline"
                onClick={handleClick}
                disabled={disabled}
                className="w-full"
                size={compact ? "sm" : "default"}
              >
                <Upload className="w-4 h-4 mr-2" />
                Change Image
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={cn(
            'border-2 border-dashed transition-colors cursor-pointer',
            isDragOver && !disabled
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-red-300 bg-red-50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <CardContent className={compact ? "p-4" : "p-8"}>
            <div className="text-center">
              <div className={cn(
                "mx-auto flex items-center justify-center rounded-full bg-gray-100",
                compact ? "w-8 h-8 mb-2" : "w-12 h-12 mb-4"
              )}>
                {isDragOver ? (
                  <FileImage className={cn(compact ? "w-4 h-4" : "w-6 h-6", "text-primary")} />
                ) : (
                  <ImageIcon className={cn(compact ? "w-4 h-4" : "w-6 h-6", "text-gray-400")} />
                )}
              </div>
              <div className={compact ? "mb-1" : "mb-2"}>
                <p className={cn(compact ? "text-xs" : "text-sm", "font-medium text-gray-900")}>
                  {isDragOver ? 'Drop your image here' : 'Upload an image'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Drag and drop or click to browse
                </p>
              </div>
              <div className="text-xs text-gray-400">
                <p>Supports: JPG, PNG, GIF up to {maxSize}MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
