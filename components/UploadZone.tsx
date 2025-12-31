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
    <div className="flex flex-col gap-2 md:gap-4 h-full group/zone">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-black text-[8px] md:text-[11px] uppercase tracking-[0.2em] opacity-40 group-hover/zone:opacity-100 transition-opacity">{label}</h3>
        <div className="flex gap-1 opacity-20">
            <div className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-white"></div>
            <div className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-white"></div>
        </div>
      </div>
      
      <div 
        onClick={handleClick}
        className="relative flex-1 min-h-[140px] md:min-h-[220px] rounded-xl md:rounded-[2rem] border border-white/10 cursor-pointer overflow-hidden group transition-all duration-700 hover:border-white/30 hover:shadow-2xl"
        style={{ 
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        <div className="absolute inset-1.5 md:inset-2 border border-dashed border-white/5 rounded-lg md:rounded-[1.5rem] pointer-events-none group-hover:border-white/20 transition-all duration-700"></div>

        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-1000"
          style={{ backgroundColor: accentColor }}
        ></div>

        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleChange}
        />
        
        {imagePreview ? (
          <div className="w-full h-full relative group-hover:p-1 transition-all duration-700">
            <img 
              src={imagePreview} 
              alt={label} 
              className="w-full h-full object-cover rounded-lg md:rounded-[1.8rem] transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 md:p-6">
                 <span className="text-[7px] md:text-[9px] font-mono uppercase tracking-[0.2em] mb-1">DATA_LOCKED</span>
                 <span className="text-[6px] md:text-[8px] font-mono opacity-50 uppercase tracking-widest">Tap to Mutate</span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-10 text-center">
            <div className="relative w-12 h-12 md:w-20 md:h-20 mb-3 md:mb-6">
               <div className="absolute inset-0 rounded-full border border-dashed border-white/10 group-hover:rotate-180 transition-transform duration-1000"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <svg 
                    className="w-5 h-5 md:w-7 md:h-7 opacity-20 group-hover:opacity-100 transition-all duration-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                  </svg>
               </div>
            </div>
            
            <span className="block text-[7px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-30 group-hover:opacity-100">Select DNA</span>
            
            <div className="absolute top-3 left-3 w-1.5 h-1.5 md:top-6 md:left-6 md:w-3 md:h-3 border-t border-l border-white/20"></div>
            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 md:bottom-6 md:right-6 md:w-3 md:h-3 border-b border-r border-white/20"></div>
          </div>
        )}
      </div>
    </div>
  );
};