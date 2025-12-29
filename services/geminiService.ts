
import { GoogleGenAI, Type } from "@google/genai";
import { AIInsight } from "../types";

export const getZikrInsight = async (zikrName: string): Promise<AIInsight | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide spiritual insights and details for the Zikr: "${zikrName}". Return the data in a clear structured format focusing on its meaning, benefits, and correct pronunciation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            meaning: { type: Type.STRING },
            benefit: { type: Type.STRING },
            transliteration: { type: Type.STRING }
          },
          required: ["title", "meaning", "benefit", "transliteration"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AIInsight;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
};

export const getSpiritualSuggestion = async (): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Suggest one powerful Zikr (in Arabic with transliteration and translation) for today. Keep it short and inspiring.",
    });
    return response.text || "SubhanAllah (Glory be to Allah)";
  } catch {
    return "Alhamdulillah (Praise be to Allah)";
  }
};
