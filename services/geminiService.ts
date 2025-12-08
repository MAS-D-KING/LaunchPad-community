
import { GoogleGenAI, Type } from "@google/genai";
import { Opportunity, UserProfile, Language } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for structured output from Gemini
// Note: We avoid strict enum constraints in Schema object to prevent compatibility issues
const opportunitySchema = {
  type: Type.OBJECT,
  properties: {
    opportunities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          organization: { type: Type.STRING },
          category: { type: Type.STRING },
          regionScope: { type: Type.STRING }, // Enum validation handled by prompt
          location: { type: Type.STRING },
          isOnline: { type: Type.BOOLEAN },
          deadline: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          postedAt: { type: Type.STRING },
          cost: { type: Type.STRING }, // Enum validation handled by prompt
          eligibility: { type: Type.STRING },
          requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
          benefits: { type: Type.STRING },
          applicationLink: { type: Type.STRING },
          targetEducationLevels: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['title', 'organization', 'category', 'description', 'location']
      }
    }
  }
};

export const generateSmartOpportunities = async (
  query: string, 
  userProfile: UserProfile,
  language: Language
): Promise<Opportunity[]> => {
  try {
    if (!apiKey) {
      console.warn("No API Key found for Gemini");
      return [];
    }

    const langInstruction = language === 'fr' 
      ? "IMPORTANT: Generate all content (title, description, eligibility, etc.) in FRENCH." 
      : "Generate content in English.";

    const prompt = `
      Act as the LaunchPad Community engine. 
      Generate 2 distinct, realistic opportunities for African youth based on:
      
      User Profile: 
      - Age: ${userProfile.age}
      - City: ${userProfile.city}
      - Country: ${userProfile.country}
      - Interests: ${userProfile.interests.join(', ')}
      - Education: ${userProfile.education}

      Search Query: "${query}"
      Language Preference: ${language}

      Rules:
      1. ${langInstruction}
      2. If the query implies local events, prioritize specific city locations in Cameroon.
      3. Ensure realistic details for "eligibility" and "requirements".
      4. status should be 'approved'.
      5. authorRole should be 'Admin'.
      6. regionScope MUST be one of: 'Global', 'Africa', 'Cameroon', 'Specific City'.
      7. cost MUST be one of: 'Free', 'Paid'.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: opportunitySchema,
        temperature: 0.6,
      }
    });

    let jsonText = response.text;
    if (!jsonText) return [];

    // Sanitize JSON if it comes wrapped in markdown
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }

    const data = JSON.parse(jsonText);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const opportunities = data.opportunities.map((item: any) => ({
      ...item,
      status: 'approved',
      authorRole: 'Admin',
      costAmount: item.cost === 'Paid' ? 'Variable' : undefined
    })) as Opportunity[];

    return opportunities;

  } catch (error) {
    console.error("Error generating opportunities:", error);
    return [];
  }
};
