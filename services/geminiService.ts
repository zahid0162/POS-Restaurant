
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

export const generateSmartDeal = async (products: Product[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const productList = products.map(p => `${p.name} ($${p.price})`).join(", ");
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on these menu items: ${productList}, create one creative "Deal of the Day" combo. Include a catchy name, the items included, and a special discounted price.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dealName: { type: Type.STRING },
          description: { type: Type.STRING },
          discountedPrice: { type: Type.NUMBER },
          itemsIncluded: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["dealName", "description", "discountedPrice", "itemsIncluded"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const suggestUpsell = async (cartItems: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The customer has: ${cartItems.join(", ")} in their cart. Suggest one item from a standard restaurant menu that would pair perfectly with these. Keep it to 5 words.`,
  });
  return response.text.trim();
};
