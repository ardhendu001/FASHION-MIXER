
import React, { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { ResultCard } from './components/ResultCard';
import { generateFashionConcept, generateConceptIllustration, findShoppingSuggestions, generateMoodBoard } from './services/geminiService';
import { readFileAsUrl } from './utils/fileHelpers';
import { FashionConcept, ImageState, PreviewState, UITheme } from './types';

// Default theme used before AI generation
const DEFAULT_THEME: UITheme = {
  theme_name: "Atelier Blank",
  primary_hex: "#3b82f6",
  secondary_hex: "#60a5fa",
  css_gradient: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
  text_color: "#1f2937"
};

// Neon Stylish Theme (Default)
const NEON_THEME: UITheme = {
  theme_name: "Neon Vogue",
  primary_hex: "#FF0080", // Neon Pink
  secondary_hex: "#00FFFF", // Cyan
  css_gradient: "linear-gradient(135deg, #050505 0%, #1a0b2e 50%, #000000 100%)", // Dark cinematic background
  text_color: "#ffffff"
};

const App: React.FC = () => {
  const [images, setImages] = useState<ImageState>({ texture: null, silhouette: null, color: null });
  const [previews, setPreviews] = useState<PreviewState>({ texture: null, silhouette: null, color: null });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FashionConcept | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<UITheme>(NEON_THEME);

  const handleFileSelect = async (type: keyof ImageState, file: File) => {
    setImages(prev => ({ ...prev, [type]: file }));
    try {
      const url = await readFileAsUrl(file);
      setPreviews(prev => ({ ...prev, [type]: url }));
    } catch (e) {
      console.error("Error reading file preview", e);
    }
  };

  const handleMix = async () => {
    setError(null);
    if (!images.texture || !images.silhouette || !images.color) {
      setError("Please upload all three reference images (Texture, Silhouette, Color) to begin.");
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      // 1. Generate the textual concept (The Brain)
      const concept = await generateFashionConcept(images.texture, images.silhouette, images.color);
      
      // Update UI immediately with the text concept and theme
      setCurrentTheme(concept.ui_theme);
      setResult(concept);
      setLoading(false); // Stop main loading spinner, but we continue loading assets in background

      // 2. Generate the Illustration (The Visuals) - Parallel
      generateConceptIllustration(concept.visual_prompt).then(base64Img => {
        if (base64Img) {
          setResult(prev => prev ? { ...prev, generated_image: base64Img } : null);
        }
      });

      // 3. Find Shopping Links (The Reality) - Parallel
      findShoppingSuggestions(concept.concept_name, concept.design_dna_tags).then(links => {
        if (links.length > 0) {
          setResult(prev => prev ? { ...prev, shopping_items: links } : null);
        }
      });

      // 4. Generate Mood Board (The Vibe) - Parallel
      generateMoodBoard(concept.ui_theme.theme_name).then(images => {
        if (images.length > 0) {
          setResult(prev => prev ? { ...prev, mood_board_images: images } : null);
        }
      });

    } catch (err: any) {
      console.error(err);
      setError("Failed to generate concept. Please ensure your API key is valid and try again.");
      setLoading(false);
    }
  };

  const activeTheme = result ? result.ui_theme : currentTheme;

  const buttonTextColor = activeTheme.primary_hex.toLowerCase() === '#ffffff' 
    ? '#000000' 
    : activeTheme.text_color;

  return (
    <div 
      className="min-h-screen transition-all duration-1000 ease-in-out flex flex-col"
      style={{
        background: activeTheme.css_gradient,
        color: activeTheme.text_color
      }}
    >
      {/* Navbar / Header */}
      <header className="p-4 md:p-8 flex justify-between items-center backdrop-blur-sm bg-white/5 sticky top-0 z-50 border-b border-white/10 transition-all">
        <div className="flex items-center gap-3">
          <span className="text-2xl md:text-3xl">🧵</span>
          <div>
            <h1 className="font-bold text-lg md:text-xl leading-none">Fashion Mixer</h1>
            <p className="text-[10px] md:text-xs opacity-70 font-mono mt-1">v3.0 // MULTIMODAL STUDIO</p>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 md:py-12 max-w-6xl">
        
        {/* Intro */}
        <div className="text-center mb-8 md:mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
             Mix. Mutate. Create.
          </h2>
          <p className="text-base md:text-xl opacity-80 max-w-2xl mx-auto font-light leading-relaxed">
            Upload three reference images. Our AI will fuse texture, form, and color to birth a new avant-garde concept, visualize it, and find real-world matches.
          </p>
        </div>

        {/* Upload Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <UploadZone 
            label="1. Texture / Material" 
            imagePreview={previews.texture} 
            onFileSelect={(f) => handleFileSelect('texture', f)}
            accentColor={activeTheme.primary_hex}
            textColor={activeTheme.text_color}
          />
          <UploadZone 
            label="2. Silhouette / Shape" 
            imagePreview={previews.silhouette} 
            onFileSelect={(f) => handleFileSelect('silhouette', f)}
            accentColor={activeTheme.primary_hex}
            textColor={activeTheme.text_color}
          />
          <UploadZone 
            label="3. Color / Mood" 
            imagePreview={previews.color} 
            onFileSelect={(f) => handleFileSelect('color', f)}
            accentColor={activeTheme.primary_hex}
            textColor={activeTheme.text_color}
          />
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-center gap-4 text-center">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-3 rounded-lg text-sm font-medium animate-pulse">
              {error}
            </div>
          )}
          
          <button
            onClick={handleMix}
            disabled={loading}
            className="group relative px-8 py-4 md:px-12 md:py-5 rounded-full font-bold text-lg md:text-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            style={{
              backgroundColor: activeTheme.primary_hex,
              color: buttonTextColor,
              boxShadow: `0 0 40px -10px ${activeTheme.primary_hex}`
            }}
          >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
            
            {/* Gradient Shimmer Background */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(45deg, ${activeTheme.primary_hex}, ${activeTheme.secondary_hex}, ${activeTheme.primary_hex})`,
                backgroundSize: '200% 200%',
                animation: 'shimmer 3s ease infinite'
              }}
            ></div>

            {/* Gleam/Reflection Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-gleam"></div>

            {/* Hover Slide Up Effect */}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
            
            <span className="relative z-10 flex items-center gap-3">
              {loading ? (
                 <>
                   <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Weaving Digital Threads...
                 </>
              ) : (
                <>✨ Mix My Design ✨</>
              )}
            </span>
          </button>
        </div>

        {/* Results */}
        {result && <ResultCard data={result} />}
        
      </main>

      {/* Footer */}
      <footer className="p-8 text-center opacity-50 text-xs font-mono flex flex-col items-center gap-2">
        <p>POWERED BY GEMINI 2.5 FLASH • EXPERIMENTAL DESIGN INTERFACE</p>
        <p className="font-bold tracking-widest uppercase">Created by Ardhendu Ghosh</p>
      </footer>
    </div>
  );
};

export default App;
