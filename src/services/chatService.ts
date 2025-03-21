import OpenAI from "openai";
import dotenv from "dotenv";
import Conversation, { IConversation } from "../models/Conversation";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

/**
 * Chat Service to handle interactions with OpenAI Assistant API.
 */
class ChatService {
  private assistantId: string | undefined;

  constructor() {
    this.assistantId = (process.env.OPENAI_ASSISTANT_ID) as string;
  }

  /**
   * Retrieves or creates a thread for the conversation.
   * @param sessionId - The unique session identifier for the conversation.
   * @returns The thread ID associated with the conversation.
   */
  private async getOrCreateThread(sessionId: string): Promise<string> {
    // Tentar encontrar conversa existente no MongoDB
    let conversation = await Conversation.findOne({ sessionId });
  
    // Retornar threadId existente se encontrado
    if (conversation && conversation.threadId) {
      return conversation.threadId;
    }
  
    // Se não encontrado, criar nova thread na OpenAI
    try {
      const thread = await openai.beta.threads.create();
  
      if (!thread || !thread.id) {
        throw new Error('OpenAI returned undefined thread ID.');
      }
  
      // Salvar nova conversa no MongoDB
      conversation = await Conversation.create({
        sessionId,
        threadId: thread.id,
        messages: [],
      });
  
      console.log('✅ Successfully created and stored new thread:', thread.id);
      return thread.id;
    } catch (error) {
      console.error('❌ Error creating or storing new thread:', error);
      throw error;  // propague o erro para tratar no nível superior
    }
  }

  /**
   * Sends a message to the OpenAI Assistant and retrieves a response.
   * @param sessionId - The session identifier.
   * @param message - The user message.
   * @returns The assistant's response message.
   */
  async getResponse(sessionId: string, message: string): Promise<string> {
    try {
      const threadId = await this.getOrCreateThread(sessionId);
      if (typeof this.assistantId !== "string") {
        console.error("❌ assistantId is not valid.");
        return "Assistant configuration error.";
      }

      // Add user message to thread
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message,
      });

      // Create a run with the assistant
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: this.assistantId,
      });

      // Wait for the run to complete
      let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      while (runStatus.status !== "completed") {
        if (runStatus.status === "failed" || runStatus.status === "cancelled") {
          console.error("❌ Run failed:", runStatus.last_error);
          return "I'm sorry, something went wrong while processing your request.";
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      }

      // Retrieve the assistant's latest response
      const messages = await openai.beta.threads.messages.list(threadId);
      const assistantMessage = messages.data.find((msg) => msg.role === "assistant");

      let responseText = "I'm sorry, I couldn't process your request.";
      if (assistantMessage && "text" in assistantMessage.content[0]) {
        responseText = assistantMessage.content[0].text.value;
      }

      return responseText;
    } catch (error: any) {
      console.error("❌ Error in getResponse:", error.response?.data || error.message);
      return "I'm sorry, something went wrong.";
    }
  }
}

export default new ChatService();