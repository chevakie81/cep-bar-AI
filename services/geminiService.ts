
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const describeImage = async (base64Data: string, mimeType: string): Promise<string> => {
  const ai = getAIClient();
  const systemInstruction = `Anda adalah ahli deskripsi gambar. Deskripsikan gambar dengan detail tinggi.
ATURAN KETAT:
1. JANGAN menyebutkan atau mendeskripsikan: Etnis, Rambut (warna, gaya, panjang), Gaya Rambut, Kumis, Janggut, Jenggot.
2. JANGAN mendeskripsikan bagian wajah hingga kepala sama sekali, KECUALI ekspresi wajah (misal: senang, sedih, serius).
3. Setelah subjek utama disebutkan, WAJIB tambahkan kalimat "(gambar referensi)".
4. Deskripsi harus dimulai LANGSUNG ke inti tanpa kata pembuka (seperti "Gambar ini menunjukkan..." atau "Terlihat...").
5. Gunakan Bahasa Indonesia yang natural dan profesional.

Contoh Format:
"Seorang wanita (gambar referensi) sedang duduk di taman dengan ekspresi tenang..."`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Deskripsikan gambar ini sesuai aturan ketat yang diberikan." }
        ]
      },
      config: {
        systemInstruction,
        temperature: 0.4,
      }
    });

    return response.text || "Gagal menghasilkan deskripsi.";
  } catch (error) {
    console.error("Error describing image:", error);
    throw error;
  }
};

export const generateImageWithRef = async (
  prompt: string, 
  refImageBase64: string, 
  mimeType: string
): Promise<string> => {
  const ai = getAIClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Nano Banana
      contents: {
        parts: [
          { inlineData: { data: refImageBase64, mimeType } },
          { text: prompt }
        ]
      }
    });

    let imageUrl = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) throw new Error("No image data returned from model.");
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
