import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { Broker, Lead, Project } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Mock Database of Brokers
const MOCK_BROKERS: Broker[] = [
  { id: '1', name: 'Sarah Jenkins', specialty: 'Luxury Condos', rating: 4.9, dealsClosed: 142, avatarUrl: 'https://picsum.photos/100/100?random=1' },
  { id: '2', name: 'Michael Ross', specialty: 'Commercial Real Estate', rating: 4.7, dealsClosed: 89, avatarUrl: 'https://picsum.photos/100/100?random=2' },
  { id: '3', name: 'Elena Rodriguez', specialty: 'Suburban Family Homes', rating: 4.8, dealsClosed: 215, avatarUrl: 'https://picsum.photos/100/100?random=3' },
  { id: '4', name: 'David Chen', specialty: 'Urban Lofts', rating: 4.6, dealsClosed: 67, avatarUrl: 'https://picsum.photos/100/100?random=4' },
];

const searchBrokersTool: FunctionDeclaration = {
  name: 'searchBrokers',
  description: 'Search for real estate brokers based on property type or specialty.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      specialty: {
        type: Type.STRING,
        description: 'The type of property or specialty (e.g., luxury, commercial, family homes).',
      },
    },
    required: ['specialty'],
  },
};

export class GeminiService {
  private chatSession: any;
  // Shared State for "Connecting" users
  private leads: Lead[] = [
      { id: '101', name: 'Subject 404', budget: '$1.2M - $1.5M', preferences: 'Penthouse, Downtown, High Security', urgency: 'HIGH', matchScore: 92 },
      { id: '102', name: 'Subject 771', budget: '$800k', preferences: 'Loft, Industrial Zone, Work/Live', urgency: 'MED', matchScore: 78 },
  ];

  constructor() {
    this.initChat();
  }

  private initChat() {
    this.chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are the Webroker AI Concierge. Your goal is to assist Buyers in defining their dream property needs and then recommending the best human Broker for the job. 
        1. Ask questions to understand their budget, location, and preferences.
        2. Once you have enough info, use the 'searchBrokers' tool to find a match.
        3. Be professional, concise, and helpful.`,
        tools: [{ functionDeclarations: [searchBrokersTool] }],
      },
    });
  }

  // --- Buyer / Chat Logic ---

  async sendMessage(message: string): Promise<{ text: string; brokers?: Broker[] }> {
    try {
      const response = await this.chatSession.sendMessage({ message });
      let text = response.text || "";
      let brokers: Broker[] = [];

      // Check for function calls
      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        const parts = [];
        
        for (const call of functionCalls) {
          if (call.name === 'searchBrokers') {
             const specialtyQuery = (call.args as any).specialty?.toLowerCase() || '';
             const matchedBrokers = MOCK_BROKERS.filter(b => 
               b.specialty.toLowerCase().includes(specialtyQuery) || 
               specialtyQuery.includes(b.specialty.toLowerCase().split(' ')[0])
             );
             
             const foundBrokers = matchedBrokers.length > 0 ? matchedBrokers : MOCK_BROKERS.slice(0, 2);
             brokers = [...brokers, ...foundBrokers];

             // AUTO-GENERATE LEAD when brokers are found (Simulating AI connection)
             this.generateLeadFromInteraction(specialtyQuery);

             parts.push({
                functionResponse: {
                  name: 'searchBrokers',
                  id: call.id,
                  response: { result: JSON.stringify(foundBrokers) }
                }
             });
          }
        }

        if (parts.length > 0) {
             const toolResponse = await this.chatSession.sendMessage({
                message: parts
             });
             text = toolResponse.text || "";
        }
      }

      const uniqueBrokers = Array.from(new Map(brokers.map(b => [b.id, b])).values());
      return { text, brokers: uniqueBrokers.length > 0 ? uniqueBrokers : undefined };
    } catch (error) {
      console.error("Gemini Error:", error);
      return { text: "I'm having trouble connecting to the real estate network. Please try again." };
    }
  }

  private generateLeadFromInteraction(interest: string) {
      const newLead: Lead = {
          id: `User-${Math.floor(Math.random() * 1000)}`,
          name: 'GUEST.USER (YOU)',
          budget: 'PENDING ANALYSIS',
          preferences: `Interested in: ${interest.toUpperCase()}`,
          urgency: 'HIGH',
          matchScore: 99
      };
      // Add to beginning of list
      this.leads = [newLead, ...this.leads];
  }

  // --- Broker Logic ---

  getLeads(): Lead[] {
      return this.leads;
  }

  async analyzeLead(lead: Lead): Promise<string> {
    try {
        const prompt = `Analyze this real estate lead for a broker:
        Name: ${lead.name}
        Budget: ${lead.budget}
        Preferences: ${lead.preferences}
        Urgency: ${lead.urgency}

        Provide a concise, tactical strategy (under 50 words) on how to close this deal. Focus on psychological triggers.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "Analysis failed.";
    } catch (e) {
        return "System offline. Cannot analyze lead.";
    }
  }

  // --- Builder Logic ---
  
  async evaluateProject(project: Project): Promise<string> {
    try {
        const prompt = `Act as an AI Architect. Generate a high-level development concept for this plot:
        Location: ${project.location}
        Size: ${project.size}
        Zoning: ${project.zoning}
        
        Suggest a building type, target demographic, and one unique architectural feature. Keep it technical and brief (under 60 words).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "Evaluation failed.";
    } catch (e) {
        return "System offline. Cannot evaluate project.";
    }
  }
}

export const geminiService = new GeminiService();