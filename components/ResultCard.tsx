import React from 'react';
import { FashionConcept } from '../types';

interface ResultCardProps {
  data: FashionConcept;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const { ui_theme, generated_image, shopping_items, concept_details, mood_board_images } = data;

  return (
    <div 
      className="mt-6 md:mt-12 rounded-xl md:rounded-3xl p-4 md:p-10 backdrop-blur-xl border shadow-2xl transition-all duration-1000 transform animate-fade-in-up"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4)`,
        color: ui_theme.text_color
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
        {/* Header Content */}
        <div className="flex flex-col justify-start order-2 lg:order-1">
          <div className="mb-4 md:mb-6">
            <h2 className="text-xl md:text-5xl font-black tracking-tighter mb-3 md:mb-4 leading-tight break-words">
              {data.concept_name}
            </h2>
            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
              {data.design_dna_tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-1.5 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-full text-[7px] md:text-xs font-bold uppercase tracking-wider border border-white/10"
                  style={{
                    backgroundColor: `${ui_theme.secondary_hex}20`,
                    color: ui_theme.text_color,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <p className="text-sm md:text-xl leading-relaxed font-light italic opacity-90 mb-4 md:mb-8 border-l-2 border-white/10 pl-3 md:pl-6">
              "{data.rationale}"
            </p>

            {/* Technical Detail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 p-4 md:p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="space-y-0.5 md:space-y-1">
                <h5 className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest opacity-50">Fabrication</h5>
                <p className="text-[10px] md:text-sm font-medium leading-snug">{concept_details.fabrication}</p>
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <h5 className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest opacity-50">Structure</h5>
                <p className="text-[10px] md:text-sm font-medium leading-snug">{concept_details.silhouette_structure}</p>
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <h5 className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest opacity-50">Chromatic</h5>
                <p className="text-[10px] md:text-sm font-medium leading-snug">{concept_details.color_theory}</p>
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <h5 className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest opacity-50">Archetype</h5>
                <p className="text-[10px] md:text-sm font-medium leading-snug">{concept_details.muse_character}</p>
              </div>
            </div>
          </div>

          <div className="p-3 md:p-6 rounded-lg bg-black/20 border border-white/10 opacity-70">
            <h4 className="text-[7px] md:text-[9px] font-bold uppercase tracking-widest mb-1 opacity-50">PROMPT_SIG</h4>
            <p className="font-mono text-[7px] md:text-xs opacity-80 break-words leading-relaxed">
              {data.visual_prompt}
            </p>
          </div>
        </div>

        {/* Visualization Column */}
        <div className="relative group min-h-[220px] md:min-h-[400px] bg-black/40 rounded-xl md:rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center order-1 lg:order-2">
          {generated_image ? (
            <img 
              src={`data:image/jpeg;base64,${generated_image}`} 
              alt="Generated Fashion" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center p-4 text-center opacity-40 animate-pulse">
              <svg className="w-6 h-6 md:w-10 md:h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[8px] md:text-xs font-bold uppercase tracking-widest">Rendering Neural Vision...</span>
            </div>
          )}
        </div>
      </div>

      {/* Shopping Grounding */}
      {shopping_items && shopping_items.length > 0 && (
        <div className="mt-8 md:mt-12 pt-6 md:pt-10 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4 md:mb-6 opacity-60">
            <h3 className="text-[8px] md:text-xs font-bold uppercase tracking-widest">Digital Catalog References</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {shopping_items.map((item, i) => (
              <a 
                key={i} 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className="group p-2 md:p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-3 md:gap-4"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 flex-shrink-0 bg-white/5 rounded-md flex items-center justify-center text-lg">🛍️</div>
                <div className="min-w-0">
                    <h4 className="font-medium text-[10px] md:text-sm leading-snug truncate group-hover:text-cyan-400">
                      {item.title}
                    </h4>
                    <span className="text-[7px] md:text-[10px] opacity-40 font-mono truncate block">
                      {new URL(item.url).hostname}
                    </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Aesthetic Archive / Mood Gallery */}
      {mood_board_images && mood_board_images.length > 0 && (
        <div className="mt-12 md:mt-16 pt-10 md:pt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-2">Aesthetic Archive</h3>
              <h4 className="text-xl md:text-3xl font-black uppercase tracking-tighter" style={{ color: ui_theme.primary_hex }}>
                {ui_theme.theme_name}
              </h4>
            </div>
            <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-white/10 to-transparent mx-8 mb-4"></div>
            <div className="text-[8px] font-mono opacity-20 uppercase tracking-widest mb-1">
              Visual_Nodes: {mood_board_images.length}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {mood_board_images.map((img, i) => (
              <div 
                key={i} 
                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-black/40 border border-white/5 shadow-lg transition-all duration-700 hover:scale-[1.02] hover:border-white/20"
              >
                <img 
                  src={`data:image/jpeg;base64,${img}`} 
                  alt={`${ui_theme.theme_name} reference ${i}`} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                  <span className="text-[7px] font-mono uppercase tracking-widest opacity-50">Frame_{i.toString().padStart(2, '0')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};