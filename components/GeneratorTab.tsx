
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { generateImageWithRef } from '../services/geminiService';
import { ImageData } from '../types';
import { DownloadIcon, PreviewIcon, CloseIcon, TrashIcon } from './Icons';

const GeneratorTab: React.FC = () => {
  const [refImage, setRefImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleGenerate = async () => {
    if (!refImage || !prompt.trim()) return;
    setLoading(true);
    try {
      const result = await generateImageWithRef(prompt, refImage.base64, refImage.mimeType);
      setOutputImage(result);
    } catch (error) {
      alert("Gagal memproses gambar. Pastikan prompt dan gambar valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsResetting(true);
    setRefImage(null);
    setPrompt('');
    setOutputImage(null);
    setTimeout(() => setIsResetting(false), 500);
  };

  const downloadImage = () => {
    if (!outputImage) return;
    const link = document.createElement('a');
    link.href = outputImage;
    link.download = `cep-bar-generated-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-sm space-y-6 relative">
        {(refImage || prompt || outputImage) && (
          <button
            onClick={handleReset}
            className={`absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-slate-800/50 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all duration-300 active:scale-90 ${isResetting ? 'animate-pulse scale-90 text-red-400' : ''}`}
            title="Reset/Mulai Ulang"
          >
            <TrashIcon />
          </button>
        )}

        <ImageUploader 
          selectedImage={refImage?.base64 || null} 
          onImageSelect={setRefImage} 
          label="Referensi Gambar"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Instruksi Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Contoh: Jadikan karakter ini memakai jas cyberpunk di kota neon..."
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors h-32 resize-none"
          />
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={!refImage || !prompt.trim() || loading}
          className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2
            ${(!refImage || !prompt.trim() || loading) 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 active:scale-[0.98]'}`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Sedang Meracik...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              <span>Generate Gambar</span>
            </>
          )}
        </button>
      </div>

      {outputImage && (
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-emerald-900/20 animate-fade-in relative overflow-hidden group">
          <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-4">Hasil Karya</h3>
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950">
            <img 
              src={outputImage} 
              alt="Generated Result" 
              className="w-full h-full object-contain"
            />
            
            {/* Action Bar Overlay */}
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={() => setIsPreviewOpen(true)}
                className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-md transition-all active:scale-90"
                title="Preview"
              >
                <PreviewIcon />
              </button>
              <button 
                onClick={downloadImage}
                className="p-3 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-xl backdrop-blur-md transition-all active:scale-90"
                title="Download"
              >
                <DownloadIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {isPreviewOpen && outputImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in">
          <button 
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-6 right-6 p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <CloseIcon />
          </button>
          <img 
            src={outputImage} 
            alt="Fullscreen" 
            className="max-w-full max-h-full object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default GeneratorTab;
