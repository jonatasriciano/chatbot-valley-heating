import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Translates the given text to English using OpenAI API.
 * @param text - The text to translate.
 * @returns {Promise<string>} The translated text.
 */
class ChatService {
  /**
   * Translates text to English using OpenAI API.
   * @param text - The text to be translated.
   * @returns {Promise<string>} - The translated text.
   */
  async translateToEnglish(text: string): Promise<string> {
    const translationResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Translate the following text to English:" },
        { role: "user", content: text },
      ],
      max_tokens: 100,
    });

    return translationResponse.choices[0].message?.content || text;
  }

  /**
   * Get the response from the chatbot.
   * @param message - The user message.
   * @returns {Promise<string>} - The chatbot response.
   */
  async getResponse(message: string): Promise<string> {
    const translatedMessage = await this.translateToEnglish(message);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a customer support chatbot for Valley Heating. Help the customer with their heating service inquiries.",
        },
        { role: "user", content: translatedMessage },
      ],
      max_tokens: 100,
    });

    return (
      response.choices[0].message?.content?.trim() ??
      "I'm sorry, I couldn't process that request."
    );
  }
}

export default new ChatService();
