import mongoose, { Document, Schema } from "mongoose";

export interface IMessage {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  sessionId: string;
  threadId?: string;
  messages: IMessage[];
  createdAt: Date;
}

const ConversationSchema: Schema = new Schema({
  sessionId: { type: String, required: true, index: true },
  threadId: { type: String, required: false },
  messages: [
    {
      role: { type: String, enum: ["system", "user", "assistant"], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IConversation>("Conversation", ConversationSchema);