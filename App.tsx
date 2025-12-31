import React, { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { ResultCard } from './components/ResultCard';
import { AICreativeSection } from './components/AICreativeSection';
import { 
  generateFashionConcept, 
  generateConceptIllustration, 
  findShoppingSuggestions, 
  generateMoodBoard,
  aiCreativeGeneration 
} from './services/geminiService';
import { readFileAsUrl } from './utils/fileHelpers';
import { FashionConcept, ImageState, PreviewState, UITheme } from './types';

const INITIAL_THEME: UITheme = {
  theme_name: "Cyber Metropolis",
  primary_hex: "#FF00FF", // Neon Magenta
  secondary_hex: "#00FFFF", // Electric Cyan
  css_gradient: "linear-gradient(to bottom, #05050a 0%, #120422 100%)", 
  text_color: "#ffffff"
};

type ViewMode = 'mixer' | 'lab';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>('mixer');
  const [images, setImages] = useState<ImageState>({ texture: null, silhouette: null, color: null });
  const [previews, setPreviews] = useState<PreviewState>({ texture: null, silhouette: null, color: null });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FashionConcept | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<UITheme>(INITIAL_THEME);

  // Mixer handlers
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
      setError("Incomplete signals. Please provide Texture, Silhouette, and Color samples.");
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const concept = await generateFashionConcept(images.texture, images.silhouette, images.color);
      setCurrentTheme(concept.ui_theme);
      setResult(concept);
      setLoading(false);

      generateConceptIllustration(concept.visual_prompt).then(base64Img => {
        if (base64Img) {
          setResult(prev => prev ? { ...prev, generated_image: base64Img } : null);
        }
      });

      findShoppingSuggestions(concept.concept_name, concept.design_dna_tags).then(links => {
        if (links.length > 0) {
          setResult(prev => prev ? { ...prev, shopping_items: links } : null);
        }
      });

      generateMoodBoard(concept.ui_theme.theme_name).then(images => {
        if (images.length > 0) {
          setResult(prev => prev ? { ...prev, mood_board_images: images } : null);
        }
      });

    } catch (err: any) {
      console.error(err);
      setError("Neural link error. Synthesis could not resolve fashion concept.");
      setLoading(false);
    }
  };

  const activeTheme = result ? result.ui_theme : currentTheme;

  return (
    <div 
      className="min-h-screen transition-all duration-1000 ease-in-out flex flex-col relative"
      style={{
        background: activeTheme.css_gradient,
        color: activeTheme.text_color
      }}
    >
      {/* CYBERPUNK BACKGROUND LAYERS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="holographic-shard w-64 h-96 top-[10%] left-[5%] opacity-10 md:opacity-20 animate-float-shard" />
        <div className="holographic-shard w-48 h-64 bottom-[15%] right-[10%] opacity-10 md:opacity-15 animate-float-shard" style={{ animationDelay: '-5s', transform: 'rotate(45deg)' }} />
        
        <div 
          className="absolute -top-[10%] -left-[5%] w-[60%] h-[60%] rounded-full blur-[80px] md:blur-[160px] opacity-[0.22] animate-float-slow"
          style={{ backgroundColor: activeTheme.primary_hex }}
        />
        <div 
          className="absolute top-[35%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[70px] md:blur-[140px] opacity-[0.18] animate-float-delayed"
          style={{ backgroundColor: activeTheme.secondary_hex }}
        />

        <div className="absolute inset-0 blueprint-grid opacity-15 md:opacity-25"></div>
        <div className="absolute inset-0 blueprint-subgrid opacity-5 md:opacity-10"></div>
      </div>

      {/* HEADER SECTION */}
      <header className="relative z-50 px-4 py-4 md:px-12 md:py-8 flex justify-between items-center border-b border-white/10 backdrop-blur-xl bg-black/40">
        <div className="flex items-center gap-3 md:gap-6 group">
          <div className="relative w-8 h-8 md:w-12 md:h-12 transition-transform duration-500 group-hover:rotate-90">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-cyan-400/20 rounded-lg md:rounded-xl border border-white/20"></div>
              <div className="absolute inset-0 flex items-center justify-center text-lg md:text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">🧬</div>
          </div>
          <div>
            <h1 className="font-black text-lg md:text-2xl tracking-tighter leading-none text-white">
              FASHION <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">MIXER</span>
            </h1>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <nav className="flex items-center bg-white/5 p-1 rounded-xl md:rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveView('mixer')}
            className={`px-3 py-1.5 md:px-6 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-xs font-bold uppercase tracking-widest transition-all duration-500 ${activeView === 'mixer' ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'opacity-40 hover:opacity-100'}`}
          >
            Synthesizer
          </button>
          <button 
            onClick={() => setActiveView('lab')}
            className={`px-3 py-1.5 md:px-6 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-xs font-bold uppercase tracking-widest transition-all duration-500 ${activeView === 'lab' ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'opacity-40 hover:opacity-100'}`}
          >
            Neural Lab
          </button>
        </nav>

        <div className="hidden lg:flex items-center gap-6 font-mono text-[9px] uppercase tracking-[0.2em] opacity-30">
            <div className="flex flex-col items-end">
                <span className="text-cyan-400">Status: Immersive</span>
                <span>Neural: Online</span>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="flex flex-col">
                <span className="text-pink-500">{activeTheme.theme_name}</span>
            </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8 md:px-6 md:py-16 max-w-6xl">
        
        {/* HERO */}
        <div className="text-center mb-12 md:mb-20 max-w-5xl mx-auto space-y-4 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-5 md:py-2 rounded-full bg-white/5 border border-white/10 text-[7px] md:text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-lg">
             <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: activeTheme.primary_hex }}></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2" style={{ backgroundColor: activeTheme.primary_hex }}></span>
             </span>
             {activeView === 'mixer' ? 'Neural Synthesis' : 'Neural Directive'}
          </div>
          
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.85] md:leading-[0.8] text-white">
            {activeView === 'mixer' ? (
              <>MIX. MUTATE.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r animate-pulse" style={{ backgroundImage: `linear-gradient(to right, ${activeTheme.primary_hex}, ${activeTheme.secondary_hex}, ${activeTheme.primary_hex})`, backgroundSize: '200% auto' }}>CREATE.</span></>
            ) : (
              <>DREAM. DESIGN.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r animate-pulse" style={{ backgroundImage: `linear-gradient(to right, ${activeTheme.secondary_hex}, ${activeTheme.primary_hex}, ${activeTheme.secondary_hex})`, backgroundSize: '200% auto' }}>EVOLVE.</span></>
            )}
          </h2>
          
          <p className="text-sm md:text-xl lg:text-2xl font-extralight opacity-60 leading-tight max-w-2xl mx-auto tracking-tight px-2 md:px-0">
            {activeView === 'mixer' 
              ? 'Synthesize material texture, architecture, and chromatic mood into your next vision.'
              : 'Direct the neural engine with specific creative prompts and image-based inspirations.'}
          </p>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="animate-fade-in transition-opacity duration-700">
          {activeView === 'mixer' ? (
            <section>
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <h3 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-40">Synthesizer</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>

              <div className="relative group mb-12 md:mb-16">
                <div className="absolute -inset-2 md:-inset-4 border-2 border-dashed border-cyan-500/10 rounded-[24px] md:rounded-[40px] pointer-events-none group-hover:border-pink-500/20 transition-colors duration-700"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 p-4 md:p-8 rounded-[24px] md:rounded-[40px] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl luminous-container">
                  <UploadZone 
                    label="1. MATERIAL DNA" 
                    imagePreview={previews.texture} 
                    onFileSelect={(f) => handleFileSelect('texture', f)}
                    accentColor={activeTheme.primary_hex}
                    textColor={activeTheme.text_color}
                  />
                  <UploadZone 
                    label="2. ARCHITECTURE" 
                    imagePreview={previews.silhouette} 
                    onFileSelect={(f) => handleFileSelect('silhouette', f)}
                    accentColor={activeTheme.secondary_hex}
                    textColor={activeTheme.text_color}
                  />
                  <UploadZone 
                    label="3. CHROMATIC" 
                    imagePreview={previews.color} 
                    onFileSelect={(f) => handleFileSelect('color', f)}
                    accentColor={activeTheme.primary_hex}
                    textColor={activeTheme.text_color}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-8 md:gap-12 py-4 relative">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-2 md:px-8 md:py-4 rounded-xl text-[9px] md:text-xs font-mono uppercase tracking-widest backdrop-blur-md animate-bounce">
                    [FAILURE]: {error}
                  </div>
                )}
                
                <div className="relative group/btn w-full max-w-4xl">
                  {/* Outer Technical Brackets */}
                  <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-6 h-6 md:w-8 md:h-8 border-t-2 border-l-2 opacity-40 transition-all duration-500 group-hover/btn:opacity-100" style={{ borderColor: activeTheme.primary_hex }}></div>
                  <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 opacity-40 transition-all duration-500 group-hover/btn:opacity-100" style={{ borderColor: activeTheme.primary_hex }}></div>
                  <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 opacity-40 transition-all duration-500 group-hover/btn:opacity-100" style={{ borderColor: activeTheme.primary_hex }}></div>
                  <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-6 h-6 md:w-8 md:h-8 border-b-2 border-r-2 opacity-40 transition-all duration-500 group-hover/btn:opacity-100" style={{ borderColor: activeTheme.primary_hex }}></div>

                  <button
                    onClick={handleMix}
                    disabled={loading}
                    className="group relative w-full h-20 md:h-32 rounded-xl md:rounded-[2.5rem] font-black text-xl md:text-4xl uppercase tracking-[0.2em] md:tracking-[0.5em] shadow-2xl transition-all duration-700 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 overflow-hidden border border-white/20 backdrop-blur-sm"
                    style={{
                      backgroundColor: activeTheme.primary_hex,
                      color: activeTheme.text_color === '#ffffff' ? '#000000' : activeTheme.text_color,
                      boxShadow: `0 0 40px -10px ${activeTheme.primary_hex}80`
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 skew-x-12 translate-x-[-150%] group-hover/btn:translate-x-[150%] transition-transform duration-[1200ms]"></div>
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {loading ? (
                         <div className="flex items-center gap-3">
                           <div className="w-5 h-5 md:w-8 md:h-8 border-2 md:border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
                           <span className="text-sm md:text-2xl">SYNTHESIZING...</span>
                         </div>
                      ) : (
                        <span>INITIATE FUSION</span>
                      )}
                    </span>
                  </button>
                </div>
              </div>
              
              {result && <div className="mt-8 md:mt-12 animate-fade-in"><ResultCard data={result} /></div>}
            </section>
          ) : (
            <section className="animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <h3 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-40">Neural Lab</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>
              <AICreativeSection 
                 accentColor={activeTheme.secondary_hex} 
                 onGenerate={aiCreativeGeneration} 
              />
            </section>
          )}
        </div>
        
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 px-4 py-8 md:p-12 border-t border-white/10 text-center bg-black/60 backdrop-blur-3xl mt-auto">
        <div className="flex flex-col items-center gap-4 md:gap-6">
          <div className="flex flex-wrap justify-center gap-4 md:gap-12 font-mono text-[7px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-20">
              <span>Engine v3.2.0</span>
              <span>Metropolis 0.9</span>
              <span>© 2025 Neural Atelier</span>
          </div>
          <div className="w-12 md:w-24 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
          <p className="text-[7px] md:text-[8px] font-mono uppercase tracking-[0.2em] text-white/40 italic">Signature by Ardhendu Ghosh</p>
        </div>
      </footer>
    </div>
  );
};

export default App;