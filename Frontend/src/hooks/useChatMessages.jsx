import { useCallback } from "react";
import { toast } from "sonner";
import { chatService } from "../services/chatService";
import { useChatStore } from "../store/chat.store";

export const useChatMessages = (socket) => {
  const {
    setMessages,
    appendMessage,
    updateLastAIMessage,
    setHumanMessage,
    setIsLoading,
    activeConversationId,
    humanMessage,
  } = useChatStore();

  const loadMessages = useCallback(async (conversationId) => {
    setIsLoading(true);
    try {
      const formatted = await chatService.getMessages(conversationId);
      setMessages(formatted);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(() => {
    if (!activeConversationId || !humanMessage.trim()) return;

    socket.emit("sendHumanMessage", {
      content: humanMessage,
      conversationId: activeConversationId,
    });

    appendMessage({ type: "human", text: humanMessage });
    setHumanMessage("");
  }, [socket, activeConversationId, humanMessage]);

  return {
    loadMessages,
    sendMessage,
  };
};