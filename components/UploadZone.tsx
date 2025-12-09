import React, { useRef } from 'react';

interface UploadZoneProps {
  label: string;
  imagePreview: string | null;
  onFileSelect: (file: File) => void;
  accentColor: string;
  textColor: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ 
  label, 
  imagePreview, 
  onFileSelect, 
  accentColor,
  textColor
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <h3 className="font-bold text-sm uppercase tracking-wider opacity-80" style={{ color: textColor }}>{label}</h3>
      <div 
        onClick={handleClick}
        className="relative flex-1 min-h-[200px] rounded-xl border-2 border-dashed cursor-pointer overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
        style={{ 
          borderColor: accentColor, 
          backgroundColor: 'rgba(255,255,255,0.05)'
        }}
      >
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleChange}
        />
        
        {imagePreview ? (
          <img 
            src={imagePreview} 
            alt={label} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-60 group-hover:opacity-100 transition-opacity">
            <svg 
              className="w-8 h-8 mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: textColor }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium" style={{ color: textColor }}>Upload Image</span>
          </div>
        )}
      </div>
    </div>
  );
};