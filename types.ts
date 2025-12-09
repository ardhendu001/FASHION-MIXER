
export interface UITheme {
  theme_name: string;
  primary_hex: string;
  secondary_hex: string;
  css_gradient: string;
  text_color: string;
}

export interface SearchResult {
  title: string;
  url: string;
}

export interface ConceptDetails {
  fabrication: string;
  silhouette_structure: string;
  color_theory: string;
  muse_character: string;
}

export interface FashionConcept {
  concept_name: string;
  rationale: string;
  visual_prompt: string;
  design_dna_tags: string[];
  concept_details: ConceptDetails;
  ui_theme: UITheme;
  // New fields for the enhanced features
  generated_image?: string; 
  shopping_items?: SearchResult[];
  mood_board_images?: string[];
}

export interface ImageState {
  texture: File | null;
  silhouette: File | null;
  color: File | null;
}

export interface PreviewState {
  texture: string | null;
  silhouette: string | null;
  color: string | null;
}
