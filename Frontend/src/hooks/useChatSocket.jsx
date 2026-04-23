import { useEffect } from "react";
import { useChatStore } from "../store/chat.store";

export const useChatSocket = (socket) => {
  const {
    activeConversationId,
    setStatus,
    setAiMessageTitle,
    updateConversationTitle,
    appendMessage,
    updateLastAIMessage,
  } = useChatStore();

  useEffect(() => {
    if (!socket || !activeConversationId) return;

    const handleAIResponse = ({ conversationId, aiMessage, sources }) => {
      if (conversationId !== activeConversationId) return;

      setStatus("");

      const lastMsg = useChatStore.getState().messages.slice(-1)[0];

      if (lastMsg?.type === "ai") {
        updateLastAIMessage(aiMessage, sources);
      } else {
        appendMessage({
          type: "ai",
          text: aiMessage,
          sources: sources || [],
        });
      }
    };

    const handleTitle = ({ conversationId, title }) => {
      if (conversationId !== activeConversationId) return;
      setAiMessageTitle(title);
      updateConversationTitle(conversationId, title);
    };

    const handleStatus = ({ conversationId, status }) => {
      if (conversationId !== activeConversationId) return;
      setStatus(status);
    };

    socket.on("sendAIResponse", handleAIResponse);
    socket.on("sendAIResponseTitle", handleTitle);
    socket.on("aiStatus", handleStatus);

    return () => {
      socket.off("sendAIResponse", handleAIResponse);
      socket.off("sendAIResponseTitle", handleTitle);
      socket.off("aiStatus", handleStatus);
    };
  }, [socket, activeConversationId]);
};