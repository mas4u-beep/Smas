import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const geminiService = {
  /**
   * Extracts financial data from an image using Gemini Flash.
   */
  async extractDocumentData(base64Data: string, mimeType: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType
                }
              },
              {
                text: "Analyze this financial document (invoice or receipt) and extract the vendor name, date, total amount, currency, tax amount, and invoice number. Return the data in valid JSON format. All textual values should be in Hebrew if clearly present, otherwise English is fine."
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              vendorName: { type: Type.STRING },
              date: { type: Type.STRING },
              totalAmount: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              taxAmount: { type: Type.NUMBER },
              invoiceNumber: { type: Type.STRING },
              category: { type: Type.STRING, description: "Accounting category in Hebrew like ציוד משרדי, נסיעות, ארוחות, וכו'." }
            }
          }
        }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Extraction Error:", error);
      throw new Error("Failed to extract data from document.");
    }
  },

  /**
   * AI Business Consultant chat logic.
   */
  async getAIBusinessAdvice(history: { role: 'user' | 'model', parts: { text: string }[] }[], prompt: string) {
    try {
      const chat = ai.chats.create({
        model: "gemini-3.1-pro-preview",
        config: {
          systemInstruction: "You are mas4u's AI Business Consultant. You provide expert financial advice, explain tax regulations in Israel, and help users understand their business data. ALWAYS respond in Hebrew. Be professional, concise, and helpful. If asked about specific amounts, rely on the context provided by the user."
        }
      });

      // Simple implementation: send the message and get response
      // In a real app, you'd send the full history
      const result = await chat.sendMessage({
        message: prompt
      });

      return result.text;
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return "I apologize, but I encountered an error. How else can I assist you today?";
    }
  },

  async createOnboardingChat() {
    return ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "אתה בוט הרישום של mas4u. תפקידך לראיין משתמשים חדשים כדי לאסוף את פרטיהם האישיים והעסקיים בצורה נעימה ושיחתית בעברית. שאל על: שם מלא, שם העסק, סוג העסק (עוסק מורשה/חברה בע\"מ). שאל שאלה אחת בכל פעם. כשתסיים, שלח הודעה שמתחילה ב-DONE ואחריה סיכום קצר."
      }
    });
  }
};
