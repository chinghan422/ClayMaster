
import React from 'react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  title?: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, title, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-amber-950/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full bg-white rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex justify-between items-center border-b border-amber-50">
          <h3 className="text-xl font-black text-amber-900">{title || '圖片預覽'}</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-50 text-amber-900 font-black hover:bg-amber-100 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-4 bg-amber-50/30">
          <img 
            src={imageUrl} 
            className="w-full max-h-[70vh] object-contain rounded-2xl shadow-inner" 
            alt="Preview" 
          />
        </div>
        <div className="p-4 text-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-amber-900 text-white rounded-2xl font-black hover:bg-black transition-all active:scale-95"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
