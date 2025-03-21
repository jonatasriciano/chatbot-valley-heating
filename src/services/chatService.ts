import OpenAI from "openai";
import dotenv from "dotenv";
import Conversation, { IConversation } from "../models/Conversation";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ChatService {
  async translateToEnglish(text: string): Promise<string> {
    try {
      const translationResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Translate the following text to English." },
          { role: "user", content: text },
        ],
        max_tokens: 100,
      });

      return translationResponse.choices[0]?.message?.content?.trim() || text;
    } catch (error: any) {
      console.error("❌ Error translating text:", error.response?.data || error.message);
      return text;
    }
  }

  async getResponse(sessionId: string, message: string): Promise<string> {
    try {
      const translatedMessage = await this.translateToEnglish(message);

      // Retrieve conversation history
      const conversation = await Conversation.findOne({ sessionId });
      const messages = conversation ? conversation.messages : [];

      messages.push({ role: "user", content: translatedMessage, timestamp: new Date() });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a customer support chatbot for Valley Heating. Help the customer with their heating service inquiries. Answer concisely and professionally." },
          ...messages,
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      const assistantReply = response.choices[0]?.message?.content?.trim() || "I'm sorry, I couldn't process that request.";

      // Save updated conversation history
      if (!conversation) {
        await Conversation.create({ sessionId, messages: [{ role: "user", content: translatedMessage, timestamp: new Date() }, { role: "assistant", content: assistantReply, timestamp: new Date() }] });
      } else {
        conversation.messages.push({ role: "assistant", content: assistantReply, timestamp: new Date() });
        await conversation.save();
      }

      return assistantReply;
    } catch (error: any) {
      console.error("❌ Error in getResponse:", error.response?.data || error.message);
      return "I'm sorry, something went wrong.";
    }
  }
}

export default new ChatService();