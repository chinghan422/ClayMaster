
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSculptingTopic = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "請為一場創意黏土比賽生成一個有趣、具挑戰性且富有想像力的主題。只需返回主題名稱，例如：『失落的海底城市』或『來自未來的奇幻生物』。",
      config: {
        temperature: 0.9,
      },
    });
    return response.text.trim() || "自由創作：夢幻森林";
  } catch (error) {
    console.error("Error generating topic:", error);
    return "神秘的微縮世界";
  }
};

export const getCreativeFeedback = async (score: number, topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `在主題為「${topic}」的黏土比賽中，一個作品得到了 ${score} 分。請提供一句簡短且富有藝術氣息的鼓勵評語。`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text.trim();
  } catch {
    return "非常有潛力的創作！";
  }
};
