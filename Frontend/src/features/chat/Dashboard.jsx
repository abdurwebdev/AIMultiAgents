import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

import {
  RiUserSettingsLine,
  RiAddLine,
  RiSendPlaneFill,
  RiLogoutBoxLine,
  RiRobot2Line,
  RiMenu3Line,
  RiFlashlightLine,
  RiCloseLine,
} from "@remixicon/react";

// NEW HOOK SPLITS
import { useChatConversations } from "../../hooks/useChatConversations";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useChatSocket } from "../../hooks/useChatSocket";
import { useChatStore } from "../../store/chat.store";
import { useSocket } from "../../app/hooks/AppSocket";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  // ───── STORE STATE ─────
  const {
    conversations,
    messages,
    activeConversationId,
    status,
    aiMessageTitle,
    humanMessage,
    mobileOpen,
    setHumanMessage,
    setMobileOpen,
  } = useChatStore();

  // ───── HOOKS ─────
  const { startNewConversation, selectConversation } =
    useChatConversations();

  const { sendMessage, loadMessages } = useChatMessages(socket);

  useChatSocket(socket);

  // ───── ACTIONS ─────
  const handleSelectChat = async (id) => {
    await selectConversation(id, loadMessages);
  };

  const handleSend = () => {
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // ───── UI ─────
  return (
    <div className="h-screen flex bg-[#050505] text-white font-['Gilroy']">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 border-b border-white/10 bg-[#0b0b0b] z-50">
        <RiMenu3Line onClick={() => setMobileOpen(true)} />
        <span className="font-semibold">Luminous AI</span>
        <RiFlashlightLine />
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-[280px]
        bg-[#0b0b0b] border-r border-white/10 flex flex-col
        transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="md:hidden p-4 flex justify-end">
          <RiCloseLine onClick={() => setMobileOpen(false)} />
        </div>

        <div className="p-5 flex-1 overflow-y-auto custom-scroll">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
              <RiFlashlightLine />
            </div>
            <h1 className="text-lg font-semibold">Luminous AI</h1>
          </div>

          <button
            onClick={startNewConversation}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold"
          >
            <RiAddLine className="inline mr-2" />
            New Chat
          </button>

          {/* CONVERSATIONS */}
          <div className="mt-6 space-y-2">
            {conversations.map((c) => (
              <div
                key={c._id}
                onClick={() => handleSelectChat(c._id)}
                className={`p-2 rounded cursor-pointer hover:bg-white/10 ${
                  activeConversationId === c._id
                    ? "bg-white/10 border-l-2 border-orange-500"
                    : ""
                }`}
              >
                {c.title || "New Chat"}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-4">
            {aiMessageTitle || "New Chat"}
          </p>
        </div>

        {/* PROFILE + LOGOUT */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-2">
          <button
            onClick={() => navigate("/profile")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10"
          >
            <RiUserSettingsLine />
            Profile
          </button>

          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30">
            <RiLogoutBoxLine />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CHAT */}
      <main className="flex-1 flex flex-col pt-14 md:pt-0">

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-10 custom-scroll">
          <div className="max-w-4xl mx-auto space-y-8">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.type === "human"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.type === "human"
                      ? "bg-[#1a1a1a]"
                      : "bg-transparent"
                  }`}
                >
                  {msg.type === "ai" ? (
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </Markdown>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </div>
            ))}

            {/* TYPING STATUS */}
            {status && (
              <p className="text-sm text-orange-400 animate-pulse">
                {status}...
              </p>
            )}
          </div>
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-white/10">
          <div className="max-w-3xl mx-auto flex gap-2 bg-white/5 rounded-full px-5 py-3">

            <input
              value={humanMessage}
              onChange={(e) => setHumanMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none"
              placeholder="Type message..."
            />

            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center"
            >
              <RiSendPlaneFill />
            </button>

          </div>
        </div>

      </main>

      {/* BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 md:hidden"
        />
      )}
    </div>
  );
};

export default Dashboard;