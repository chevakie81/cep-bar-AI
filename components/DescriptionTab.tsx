
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { describeImage } from '../services/geminiService';
import { ImageData } from '../types';
import { CopyIcon, CheckIcon, TrashIcon } from './Icons';

const DescriptionTab: React.FC = () => {
  const [image, setImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleDescribe = async () => {
    if (!image) return;
    setLoading(true);
    setOutput(null);
    try {
      const result = await describeImage(image.base64, image.mimeType);
      setOutput(result);
    } catch (error) {
      alert("Gagal mendeskripsikan gambar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsResetting(true);
    setImage(null);
    setOutput(null);
    setCopied(false);
    setTimeout(() => setIsResetting(false), 500);
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-sm relative">
        {(image || output) && (
          <button
            onClick={handleReset}
            className={`absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-slate-800/50 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all duration-300 active:scale-90 ${isResetting ? 'animate-pulse scale-90 text-red-400' : ''}`}
            title="Reset/Mulai Ulang"
          >
            <TrashIcon />
          </button>
        )}
        
        <ImageUploader 
          selectedImage={image?.base64 || null} 
          onImageSelect={setImage} 
          label="Input Gambar"
        />
        
        <button
          onClick={handleDescribe}
          disabled={!image || loading}
          className={`mt-6 w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2
            ${!image || loading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 active:scale-[0.98]'}`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Menganalisis...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13l2 2 4-4"/></svg>
              <span>Deskripsikan Sekarang</span>
            </>
          )}
        </button>
      </div>

      {output && (
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-emerald-900/20 animate-fade-in relative group">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Hasil Deskripsi</h3>
            <button 
              onClick={handleCopy}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-emerald-400"
              title="Salin deskripsi"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
            {output}
          </p>
        </div>
      )}
    </div>
  );
};

export default DescriptionTab;
