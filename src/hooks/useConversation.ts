import { useState } from "react";
import * as webllm from "@mlc-ai/web-llm";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ConversationState {
  explanation: string;
  isLoading: boolean;
  hasExplanation: boolean;
  conversationHistory: ChatMessage[];
  sendToLLM: (text: string) => Promise<void>;
  resetConversation: () => void;
}

export function useConversation(
  engine: webllm.MLCEngine | null
): ConversationState {
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasExplanation, setHasExplanation] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(
    [
      {
        role: "system",
        content: `You are a legal text interpreter. Your job is to explain legal text in plain, simple English that anyone can understand. 
      Break down complex legal concepts and highlight the key points that would be most important to a layperson.
      Be concise in your response. Focus on the most critical points that the user needs to know.
      Focus on being accurate but accessible - imagine explaining to someone with no legal background.`,
      },
    ]
  );

  // Send text to LLM
  const sendToLLM = async (text: string) => {
    if (!text.trim() || !engine) return;

    setIsLoading(true);

    try {
      console.log("Sending legal text to LLM for explanation");

      // Create the user message
      const userMessage: ChatMessage = {
        role: "user",
        content: `Please explain this legal text in plain English: "${text.trim()}"`,
      };

      // Add the user message to conversation history
      const updatedHistory = [...conversationHistory, userMessage];
      setConversationHistory(updatedHistory);

      // Use streaming for better user experience
      const chunks = await engine.chat.completions.create({
        messages: updatedHistory,
        temperature: 0.7, // Slightly higher temperature for more natural language
        stream: true,
      });

      let fullResponse = "";
      let firstChunkReceived = false;

      for await (const chunk of chunks) {
        const content = chunk.choices[0]?.delta.content || "";
        fullResponse += content;

        // Set hasExplanation to true as soon as we get the first chunk
        if (!firstChunkReceived && content.trim()) {
          firstChunkReceived = true;
          setHasExplanation(true);
        }

        setExplanation(fullResponse);
      }

      // Add the assistant's response to the conversation history
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: fullResponse },
      ]);

      console.log("Legal text explanation complete");
    } catch (error) {
      console.error("Error generating explanation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the conversation and explanation
  const resetConversation = () => {
    setExplanation("");
    setHasExplanation(false);
    setConversationHistory([
      {
        role: "system",
        content: `You are a legal text interpreter. Your job is to explain legal text in plain, simple English that anyone can understand. 
        Break down complex legal concepts, define legal jargon, and highlight the key points that would be most important to a layperson.
        Format your response in a clear, organized way with paragraphs and bullet points where appropriate.
        Focus on being accurate but accessible - imagine explaining to someone with no legal background.`,
      },
    ]);
  };

  return {
    explanation,
    isLoading,
    hasExplanation,
    conversationHistory,
    sendToLLM,
    resetConversation,
  };
}
