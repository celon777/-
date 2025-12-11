import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The name of the dish." },
    description: { type: Type.STRING, description: "A brief, appetizing description of the dish." },
    prepTime: { type: Type.STRING, description: "Preparation time (e.g., '15分钟')." },
    cookTime: { type: Type.STRING, description: "Cooking time (e.g., '10分钟')." },
    servings: { type: Type.STRING, description: "Number of servings (e.g., '2-3人份')." },
    calories: { type: Type.STRING, description: "Estimated calories per serving." },
    difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"], description: "Difficulty level." },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING, description: "Name of the ingredient." },
          amount: { type: Type.STRING, description: "Quantity needed." },
          category: { type: Type.STRING, description: "Category (e.g., 'Vegetables', 'Seasoning', 'Protein')." },
        },
        required: ["item", "amount", "category"],
      },
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          instruction: { type: Type.STRING, description: "Detailed instruction for this step." },
        },
        required: ["stepNumber", "instruction"],
      },
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Chef's tips for best results.",
    },
  },
  required: ["title", "description", "prepTime", "cookTime", "ingredients", "steps", "servings", "difficulty"],
};

export const generateRecipe = async (dishName: string): Promise<Recipe> => {
  try {
    const prompt = `Create a detailed recipe for: "${dishName}". 
    If the input is in Chinese, the output MUST be in Chinese (Simplified). 
    Ensure the ingredients list is comprehensive for a shopping list.
    Classify ingredients into logical categories (e.g., 蔬菜类, 调料类, 肉类).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        systemInstruction: "You are a Michelin-star chef assisting a home cook. You provide precise, delicious, and easy-to-follow recipes.",
        temperature: 0.3, // Lower temperature for more consistent formatting
      },
    });

    if (!response.text) {
      throw new Error("No content generated");
    }

    const recipeData = JSON.parse(response.text) as Recipe;
    return recipeData;

  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
};
