
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FashionConcept, SearchResult } from "../types";
import { fileToBase64 } from "../utils/fileHelpers";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    concept_name: { type: Type.STRING, description: "Creative title of the concept" },
    rationale: { type: Type.STRING, description: "A concise, poetic summary of the fusion" },
    concept_details: {
      type: Type.OBJECT,
      properties: {
        fabrication: { type: Type.STRING, description: "Detailed analysis of materials and textures" },
        silhouette_structure: { type: Type.STRING, description: "Breakdown of the cut, shape, and construction" },
        color_theory: { type: Type.STRING, description: "Explanation of the palette and emotional impact" },
        muse_character: { type: Type.STRING, description: "The archetype or character this outfit embodies" }
      },
      required: ["fabrication", "silhouette_structure", "color_theory", "muse_character"]
    },
    visual_prompt: { type: Type.STRING, description: "Detailed image generation prompt for a high fashion lookbook photo" },
    design_dna_tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Keywords describing the design DNA"
    },
    ui_theme: {
      type: Type.OBJECT,
      properties: {
        theme_name: { type: Type.STRING },
        primary_hex: { type: Type.STRING, description: "Dominant bright color hex code" },
        secondary_hex: { type: Type.STRING, description: "Accent color hex code" },
        css_gradient: { type: Type.STRING, description: "CSS linear-gradient string (e.g., 'linear-gradient(135deg, #123, #456)')" },
        text_color: { type: Type.STRING, description: "Hex for readability" }
      },
      required: ["theme_name", "primary_hex", "secondary_hex", "css_gradient", "text_color"]
    }
  },
  required: ["concept_name", "rationale", "concept_details", "visual_prompt", "design_dna_tags", "ui_theme"]
};

export const generateFashionConcept = async (
  texture: File,
  silhouette: File,
  color: File
): Promise<FashionConcept> => {
  
  const [texB64, silB64, colB64] = await Promise.all([
    fileToBase64(texture),
    fileToBase64(silhouette),
    fileToBase64(color)
  ]);

  const SYSTEM_INSTRUCTION = `
    You are an Avant-Garde Fashion Director. Analyze the 3 uploaded images (Texture, Silhouette, Color) to create a new fashion concept.
    Return a strict JSON object.
    Break down the concept into specific details (Fabrication, Silhouette, Color Theory, Muse) in the 'concept_details' section.
    The 'ui_theme' should extract the aesthetic vibe of the generated concept to style the web application displaying the result.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
      contents: {
        parts: [
          { text: "Analyze these three images: 1. Texture, 2. Silhouette, 3. Color. Generate the fashion concept JSON." },
          { inlineData: { mimeType: texture.type, data: texB64 } },
          { inlineData: { mimeType: silhouette.type, data: silB64 } },
          { inlineData: { mimeType: color.type, data: colB64 } },
        ],
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini.");
    }

    return JSON.parse(response.text) as FashionConcept;
  } catch (error) {
    console.error("Gemini API Error (Concept):", error);
    throw error;
  }
};

export const generateConceptIllustration = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `High fashion photography, professional lookbook shot, cinematic lighting. ${prompt}` },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error (Image):", error);
    return null;
  }
};

export const generateMoodBoard = async (themeName: string): Promise<string[]> => {
  const prompts = [
    `Abstract artistic texture pattern representing the ${themeName} aesthetic, high quality wallpaper, 8k resolution`,
    `Futuristic architectural geometry inspired by ${themeName}, cinematic lighting, macro detail`,
    `Fluid color gradient and light leak overlay in the style of ${themeName}, ethereal mood`
  ];

  try {
    const promises = prompts.map(p => generateConceptIllustration(p));
    const results = await Promise.all(promises);
    return results.filter((img): img is string => img !== null);
  } catch (error) {
    console.error("Mood Board Generation Error:", error);
    return [];
  }
};

export const findShoppingSuggestions = async (conceptName: string, tags: string[]): Promise<SearchResult[]> => {
  try {
    // Construct a search query
    const query = `buy avant-garde fashion ${conceptName} ${tags.slice(0, 3).join(" ")} dress or outfit`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 4 real, distinct, purchasable high-fashion items that match this style: "${conceptName}". Return a list of products.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const results: SearchResult[] = [];

    chunks.forEach((chunk) => {
      if (chunk.web) {
        results.push({
          title: chunk.web.title || "Fashion Item",
          url: chunk.web.uri || "#",
        });
      }
    });

    // Deduplicate by URL
    const uniqueResults = Array.from(new Map(results.map(item => [item.url, item])).values());
    return uniqueResults.slice(0, 4);

  } catch (error) {
    console.error("Gemini API Error (Search):", error);
    return [];
  }
};
