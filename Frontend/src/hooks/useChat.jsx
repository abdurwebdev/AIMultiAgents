import { useRef, useEffect, useCallback } from "react";
import { useSocket } from "../app/hooks/AppSocket";
import { useChatConversations } from "./useChatConversations";
import { useChatMessages } from "./useChatMessages";
import { useChatSocket } from "./useChatSocket";
import { useChatStore } from "../store/chat.store";

export const useChat = () => {
  const socket = useSocket();
  const chatRef = useRef(null);

  const {
    conversations,
    messages,
    activeConversationId,
    humanMessage,
    mobileOpen,
    isLoading,
    setHumanMessage,
    setMobileOpen,
  } = useChatStore();

  const {
    loadConversations,
    startNewConversation,
    selectConversation,
  } = useChatConversations();

  const { loadMessages, sendMessage } = useChatMessages(socket);

  useChatSocket(socket);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadConversations();
  }, []);

  return {
    chatRef,
    conversations,
    messages,
    activeConversationId,
    humanMessage,
    mobileOpen,
    isLoading,

    loadMessages,
    startNewConversation,
    selectConversation,
    sendMessage,

    setHumanMessage,
    setMobileOpen,
  };
};