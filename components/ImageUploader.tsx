
import React, { useState, useCallback, useEffect } from 'react';
import { ImageData } from '../types';

interface ImageUploaderProps {
  onImageSelect: (data: ImageData) => void;
  selectedImage: string | null;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, selectedImage, label = "Upload Gambar" }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Hanya file gambar yang didukung.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const data = base64.split(',')[1];
      onImageSelect({ base64: data, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) handleFile(blob);
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFile]);

  return (
    <div className="w-full">
      <p className="text-sm font-medium text-slate-400 mb-2">{label}</p>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative h-64 w-full rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer
          ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}
          ${selectedImage ? 'border-none' : ''}`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        
        {selectedImage ? (
          <img 
            src={`data:image/png;base64,${selectedImage}`} 
            alt="Uploaded" 
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-500">
            <div className="w-12 h-12 mb-3 bg-slate-800 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <p className="text-sm font-medium">Klik, Drag & Drop, atau Paste Gambar</p>
            <p className="text-xs mt-1">PNG, JPG, WEBP (Maks 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
