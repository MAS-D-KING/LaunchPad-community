
import { GoogleGenAI, Type } from "@google/genai";
import { Opportunity, UserProfile, Language, ApplicationMaterials } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for structured output from Gemini
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
          regionScope: { type: Type.STRING },
          location: { type: Type.STRING },
          isOnline: { type: Type.BOOLEAN },
          deadline: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          postedAt: { type: Type.STRING },
          cost: { type: Type.STRING },
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

const applicationMaterialsSchema = {
    type: Type.OBJECT,
    properties: {
        cv: { type: Type.STRING },
        coverLetter: { type: Type.STRING },
        emailDraft: { type: Type.STRING }
    },
    required: ['cv', 'coverLetter', 'emailDraft']
};

export const generateSmartOpportunities = async (
  query: string, 
  userProfile: UserProfile,
  language: Language
): Promise<Opportunity[]> => {
  try {
    if (!apiKey) return [];

    let langInstruction = "Generate content in English.";
    switch(language) {
        case 'fr': langInstruction = "IMPORTANT: Generate all content in FRENCH (Français)."; break;
        case 'pidgin': langInstruction = "IMPORTANT: Generate content in CAMEROONIAN PIDGIN ENGLISH (CPE)."; break;
        case 'de': langInstruction = "IMPORTANT: Generate all content in GERMAN (Deutsch)."; break;
        case 'zh': langInstruction = "IMPORTANT: Generate all content in SIMPLIFIED CHINESE."; break;
        case 'es': langInstruction = "IMPORTANT: Generate all content in SPANISH (Español)."; break;
    }

    const prompt = `
      Act as "LaunchPad Engine", a low-data opportunity finder for Africa.
      
      User Context:
      - Age: ${userProfile.age}
      - Education Level: ${userProfile.education}
      - Interests: ${userProfile.interests.join(', ')}
      - Target Categories: ${userProfile.targetCategories?.join(', ') || 'Any'}
      
      Search Query: "${query}"
      
      STRICT RULES:
      1. ${langInstruction}
      2. BANDWIDTH OPTIMIZATION: Generate exactly 2 high-quality, RELEVANT opportunities. Do not generate generic filler.
      3. ELIGIBILITY LOCK:
         - If user is "High School": DO NOT generate PhD, Graduate, or Senior roles. Only generate opportunities eligible for 16-19 year olds.
         - If user is "Undergraduate": DO NOT generate PhD roles.
      4. Use real-world examples (Google, MTN, Orange, Universities) relevant to Cameroon/Africa.
      5. Return JSON only.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: opportunitySchema,
        temperature: 0.3, // Low temp for strict adherence
      }
    });

    let jsonText = response.text || "{}";
    if (jsonText.startsWith('```')) jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const data = JSON.parse(jsonText);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.opportunities.map((item: any) => ({
      ...item,
      status: 'approved',
      authorRole: 'Admin',
      costAmount: item.cost === 'Paid' ? 'Variable' : undefined
    })) as Opportunity[];

  } catch (error) {
    console.error("Error generating opportunities:", error);
    return [];
  }
};

export const parseWhatsAppOpportunity = async (rawText: string): Promise<Partial<Opportunity>> => {
    try {
        const prompt = `
            Extract opportunity details from this raw text.
            Raw Text: "${rawText}"
            Return JSON matching Opportunity interface.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        let jsonText = response.text || "{}";
        if (jsonText.startsWith('```')) jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        return JSON.parse(jsonText);
    } catch (e) {
        console.error(e);
        return {};
    }
};

export const generateApplicationMaterials = async (
    user: UserProfile, 
    opportunity: Opportunity
): Promise<ApplicationMaterials> => {
    try {
        const prompt = `
            Help ${user.name} apply for "${opportunity.title}".
            User: ${user.education}, ${user.bio}.
            Opp: ${opportunity.description}.
            Generate CV structure, Cover Letter, Email Draft.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                responseSchema: applicationMaterialsSchema
            }
        });

        let jsonText = response.text || "{}";
        if (jsonText.startsWith('```')) jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        return JSON.parse(jsonText);
    } catch (e) {
        console.error(e);
        return { cv: '', coverLetter: '', emailDraft: '' };
    }
};

export const analyzeProblem = async (problemDescription: string) => {
    const prompt = `Analyze problem: "${problemDescription}". Return Subject, LaTeX if math, and 2 hints.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};
