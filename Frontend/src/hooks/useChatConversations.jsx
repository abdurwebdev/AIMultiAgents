import { useCallback } from "react";
import { toast } from "sonner";
import { chatService } from "../services/chatService";
import { useChatStore } from "../store/chat.store";

export const useChatConversations = () => {
  const {
    setConversations,
    addConversation,
    setActiveConversationId,
    resetChat,
    setIsLoading,
    setMobileOpen,
  } = useChatStore();

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (err) {
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startNewConversation = useCallback(async () => {
    try {
      const convo = await chatService.startConversation();
      addConversation(convo);
      setActiveConversationId(convo._id);
      resetChat();
      setMobileOpen(false);
    } catch (err) {
      toast.error("Failed to create chat");
    }
  }, []);

  const selectConversation = useCallback(async (id, loadMessagesFn) => {
    setActiveConversationId(id);
    await loadMessagesFn(id);
    setMobileOpen(false);
  }, []);

  return {
    loadConversations,
    startNewConversation,
    selectConversation,
  };
};