/// <reference types="vite/client" />
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { DailyHabits, EcoSuggestion, FootprintData, GroundedResponse, Habit, AgeGroup } from '../types';
import { INDIA_GRID_EMISSION_FACTOR } from '../constants';

// -------------------- API KEY SECTION (safe init) --------------------
// Avoid throwing at module import time so the app can run in dev without
// an API key. Initialize the client only when needed and surface a clear
// error when an AI call is attempted without an API key.
const apiKey = import.meta.env.VITE_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

function ensureAi(): GoogleGenAI {
  if (!ai) {
    throw new Error('Gemini API key not configured. Set VITE_API_KEY to enable AI features.');
  }
  return ai;
}
// --------------------------------------------------------------------


function formatHabitsForPrompt(habits: DailyHabits): string {
  const travelSummary = habits.travel.map(t => `${t.mode}: ${t.distance}km`).join(', ') || 'No travel logged.';
  const shoppingSummary = habits.shopping.map(s => `${s.item} (${s.material})`).join(', ') || 'No clothing shopping logged.';
  const electronicsSummary = habits.electronics.map(e => e.item).join(', ') || 'No electronics purchased.';
  return `The user's recent habits include: Travel -> ${travelSummary}. Clothing -> ${shoppingSummary}. Electronics -> ${electronicsSummary}.`;
}

function cleanGeneratedText(text: string): string {
    let cleaned = text.trim();

    cleaned = cleaned.replace(/#\w+/g, '');
    cleaned = cleaned.replace(/^> /gm, '');
    cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2');
    cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2');
    cleaned = cleaned.trim();

    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
        (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
        cleaned = cleaned.substring(1, cleaned.length - 1);
    }

    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    return cleaned.trim();
}


export async function getEcoSuggestions(habits: DailyHabits): Promise<EcoSuggestion[]> {
  const model = "gemini-2.5-flash";

  const prompt = `You are an expert sustainability coach for a user in India. Your mission is to generate 3 actionable and creative eco-friendly suggestions.

**User Context:**
- Location: India
- Recent Habits: ${formatHabitsForPrompt(habits)}

**--- TASK: GENERATE EXACTLY 3 SUGGESTIONS ---**

1.  **One India-Specific Environmental/Cultural Suggestion:**
    -   Explain its environmental and cultural relevance.

2.  **Two Habit-Based Suggestions:**
    -   Based on the user's logged habits (travel, shopping, electronics).

**Output Rules:**
- Provide a catchy title.
- Keep descriptions concise.
- No generic advice.`;

  try {
    const response = await ensureAi().models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              }
            }
          },
          required: ["suggestions"]
        },
      },
    });

    const jsonString = response.text.trim();
    try {
        const parsed = JSON.parse(jsonString);
        return parsed.suggestions || [];
    } catch (parseError) {
        console.error("Gemini API returned non-JSON response:", jsonString, parseError);
        return [];
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw new Error("Failed to generate eco suggestions.");
  }
}


export async function getCarbonSavingsPrediction(footprint: FootprintData, swap: EcoSuggestion, monthlyGoal?: number): Promise<string> {
    const model = "gemini-2.5-flash";
    
    const goalContext = monthlyGoal ? `* The user has a monthly goal of ${monthlyGoal} kg CO2e.` : '';

    const prompt = `You are an encouraging AI assistant. Predict monthly CO₂ savings for the proposed swap.

Footprint: ${footprint.total} kg CO2e.
Swap: "${swap.title}: ${swap.description}".
${goalContext}

Rules:
- Respond in ONE sentence.
- If goal exists: "You could save X kg CO2e, getting you Y% closer to your monthly goal!"
- If no goal: "That's a potential saving of X kg CO2e per month!"
- No markdown formatting.`;

    try {
    const response = await ensureAi().models.generateContent({ model, contents: prompt });
    return cleanGeneratedText(response.text);
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to generate prediction.");
    }
}


export async function getTravelCo2e(from: string, to: string): Promise<{ co2e: number }> {
    const model = "gemini-2.5-flash";

    const prompt = `Calculate round-trip gasoline car CO₂e emissions between ${from} and ${to}. Use Google Search for distance. Output JSON { "co2e": number }.`;

    try {
    const response = await ensureAi().models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        co2e: { type: Type.NUMBER }
                    },
                    required: ["co2e"]
                }
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);
        return parsed;

    } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to generate travel CO₂e.");
    }
}


export async function getLatestSustainabilityNews(): Promise<GroundedResponse> {
    const model = "gemini-2.5-flash";

    const prompt = `Summarize 4 recent sustainability-related news articles in India.`;

    try {
    const response = await ensureAi().models.generateContent({
            model,
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] },
        });
        
        const summary = cleanGeneratedText(response.text);
        const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        const sources = rawSources
            .map((chunk: any) => ({
                title: chunk.web.title,
                uri: chunk.web.uri,
            }))
            .filter((s: any) => s.uri);

        return { summary, sources };

    } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to fetch news.");
    }
}


export async function getStateCarbonReports(state: string): Promise<GroundedResponse> {
    const model = "gemini-2.5-flash";

    const prompt = `Summarize relevant sustainability reports and articles for the state ${state} in India.`;

    try {
    const response = await ensureAi().models.generateContent({
            model,
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] },
        });
        
        const summary = cleanGeneratedText(response.text);
        const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        const sources = rawSources
            .map((chunk: any) => ({
                title: chunk.web.title,
                uri: chunk.web.uri,
            }))
            .filter((s: any) => s.uri);

        return { summary, sources };

    } catch (error) {
        console.error("Error:", error);
        throw new Error(`Failed to fetch carbon reports for ${state}.`);
    }
}

export async function getGridEmissionFactor(): Promise<number> {
  return Promise.resolve(INDIA_GRID_EMISSION_FACTOR);
}


export interface PlantBasedSwap {
  title: string;
  description: string;
  reductionPercentage: number;
}

export async function getPlantBasedSwapSuggestion(servings: number): Promise<{ swap: PlantBasedSwap }> {
  const model = "gemini-2.5-flash";

  const prompt = `Suggest a plant-based swap for ${servings} weekly servings of red meat. Include % CO₂ reduction. Return JSON.`;

  try {
    const response = await ensureAi().models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            swap: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                reductionPercentage: { type: Type.NUMBER }
              },
              required: ["title", "description", "reductionPercentage"]
            }
          },
          required: ["swap"]
        }
      }
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to generate food swap suggestion.");
  }
}


export async function getHabitDiscoverySuggestions(interests: string, ageGroup: AgeGroup | undefined, dailyRoutine: string): Promise<Habit[]> {
    const model = "gemini-2.5-flash";

    const prompt = `Suggest 5 eco-friendly habits based on interests: ${interests}, age group: ${ageGroup || 'any'}, routine: ${dailyRoutine}. Return JSON.`;

    try {
      const response = await ensureAi().models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        habits: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    description: { type: Type.STRING },
                                    co2Reduction: { type: Type.STRING },
                                    commitment: { 
                                        type: Type.STRING,
                                        enum: ['Low', 'Medium', 'High']
                                    }
                                },
                                required: ["description", "co2Reduction", "commitment"]
                            }
                        }
                    },
                    required: ["habits"]
                }
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString).habits;

    } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to generate habits.");
    }
}


export function startChatSession(): Chat {
    const systemInstruction = `You are CarboLoom AI, a friendly eco-assistant in India. Keep answers concise, helpful, and actionable.`;
  return ensureAi().chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction }
  });
}
