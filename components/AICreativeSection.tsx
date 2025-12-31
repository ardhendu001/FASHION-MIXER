import React, { useState } from 'react';
import { UploadZone } from './UploadZone';
import { readFileAsUrl } from '../utils/fileHelpers';

interface AICreativeSectionProps {
  accentColor: string;
  onGenerate: (prompt: string, images: File[]) => Promise<string | null>;
}

export const AICreativeSection: React.FC<AICreativeSectionProps> = ({ accentColor, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [refImages, setRefImages] = useState<(File | null)[]>([null, null, null]);
  const [refPreviews, setRefPreviews] = useState<(string | null)[]>([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);

  const handleFileSelect = async (index: number, file: File) => {
    const newImages = [...refImages];
    newImages[index] = file;
    setRefImages(newImages);

    const url = await readFileAsUrl(file);
    const newPreviews = [...refPreviews];
    newPreviews[index] = url;
    setRefPreviews(newPreviews);
  };

  const isMandatoryImageMissing = !refImages[0];
  const isPromptMissing = !prompt.trim();
  const canGenerate = !isMandatoryImageMissing && !isPromptMissing;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setGeneratedImg(null);
    try {
      const validImages = refImages.filter((img): img is File => img !== null);
      const result = await onGenerate(prompt, validImages);
      setGeneratedImg(result);
    } catch (e) {
      console.error("Generation failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
      {/* Configuration Column */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-40">1. Creative Directive</label>
          </div>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your avant-garde vision... (e.g. 'liquid chrome armor with holographic feathers')"
            className="w-full h-32 md:h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm md:text-base focus:outline-none focus:border-white/30 transition-all placeholder:opacity-20 resize-none backdrop-blur-sm"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-40">2. Neural References</label>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="relative h-full">
              <UploadZone 
                label="REF_01*" 
                imagePreview={refPreviews[0]} 
                onFileSelect={(f) => handleFileSelect(0, f)} 
                accentColor={accentColor} 
                textColor="#ffffff" 
              />
              {!refPreviews[0] && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[6px] font-mono text-pink-500 uppercase animate-pulse pointer-events-none">Mandatory</div>
              )}
            </div>
            <UploadZone 
              label="REF_02" 
              imagePreview={refPreviews[1]} 
              onFileSelect={(f) => handleFileSelect(1, f)} 
              accentColor={accentColor} 
              textColor="#ffffff" 
            />
            <UploadZone 
              label="REF_03" 
              imagePreview={refPreviews[2]} 
              onFileSelect={(f) => handleFileSelect(2, f)} 
              accentColor={accentColor} 
              textColor="#ffffff" 
            />
          </div>
          <p className="text-[7px] md:text-[9px] font-mono opacity-20 uppercase tracking-wider text-center">Reference Image 01 is required for neural signal lock.</p>
        </div>

        {/* HIGH FIDELITY ACTION BUTTON */}
        <div className="relative group/btn mt-4">
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 opacity-40 transition-all duration-500 group-hover/btn:opacity-100" style={{ borderColor: accentColor }}></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 opacity-40 transition-all duration-500 group-hover/btn:opacity-100" style={{ borderColor: accentColor }}></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 opacity-40 transition-all duration-500 group-hover/btn:opacity-100" style={{ borderColor: accentColor }}></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 opacity-40 transition-all duration-500 group-hover/btn:opacity-100" style={{ borderColor: accentColor }}></div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !canGenerate}
            className="group relative w-full h-20 md:h-24 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-2xl uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-2xl transition-all duration-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-10 disabled:grayscale overflow-hidden border border-white/20 backdrop-blur-sm"
            style={{ 
              backgroundColor: accentColor, 
              color: '#000',
              boxShadow: canGenerate ? `0 0 40px -10px ${accentColor}80` : 'none'
            }}
          >
            <div className="absolute inset-0 bg-white/30 skew-x-12 translate-x-[-150%] group-hover/btn:translate-x-[150%] transition-transform duration-[1200ms] ease-in-out"></div>
            
            <span className="relative z-10 flex items-center justify-center gap-4">
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  <span className="text-sm md:text-xl">MATERIALIZING...</span>
                </div>
              ) : (
                <>MATERIALIZE VISION</>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Result Column */}
      <div className="lg:col-span-7 flex flex-col h-full">
        <div className="relative flex-grow min-h-[300px] md:min-h-full aspect-square md:aspect-auto rounded-3xl md:rounded-[3rem] bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center group shadow-2xl">
          {generatedImg ? (
            <img 
              src={`data:image/png;base64,${generatedImg}`} 
              alt="Generated Fashion" 
              className="w-full h-full object-cover animate-fade-in"
            />
          ) : (
            <div className="text-center space-y-6 md:space-y-8 opacity-20 px-8">
              <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto flex items-center justify-center">
                 <div className="absolute inset-0 rounded-full border border-dashed border-white/40 animate-spin-slow"></div>
                 <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
              </div>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] font-bold">Neural Output Pending</p>
            </div>
          )}

          {loading && (
             <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-20">
                <div className="flex flex-col items-center gap-8 px-6 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-white/5 border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-8 h-8 md:w-12 md:h-12 border border-white/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="block text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.8em] font-black animate-pulse text-white">Synthesizing Vision</span>
                    <span className="block text-[7px] md:text-[8px] font-mono opacity-50 uppercase tracking-[0.2em]">Resolving complex geometries...</span>
                  </div>
                </div>
             </div>
          )}
          
          <div className="absolute top-6 left-6 md:top-10 md:left-10 w-4 h-4 md:w-8 md:h-8 border-t border-l border-white/10 group-hover:border-white/30 transition-colors"></div>
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 w-4 h-4 md:w-8 md:h-8 border-b border-r border-white/10 group-hover:border-white/30 transition-colors"></div>
        </div>
      </div>
    </div>
  );
};
