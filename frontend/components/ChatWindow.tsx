"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
    chat: { type: "dm" | "group"; id: string };
    currentUser: string;
}

interface Message {
    sender: string;
    message: string;
    timestamp: number | string;
}

export default function ChatWindow({ chat, currentUser }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        fetchHistory();
        const token = sessionStorage.getItem("token");
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const wsProtocol = apiBaseUrl.startsWith("https") ? "wss" : "ws";
        const wsHost = apiBaseUrl.replace(/^https?:\/\//, "");
        const ws = new WebSocket(`${wsProtocol}://${wsHost}/ws?token=${token}`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            let isRelevant = false;
            if (chat.type === "dm") {
                if (data.type === "dm" && (data.sender === chat.id || data.sender === currentUser)) isRelevant = true;
            } else if (chat.type === "group") {
                if (data.type === "group" && data.group_name === chat.id) isRelevant = true;
            }
            if (isRelevant) {
                setMessages((prev) => {
                    // Primitive de-duplication: check if same sender and message in last 2 seconds
                    const isDuplicate = prev.some(m =>
                        m.sender === data.sender &&
                        m.message === data.message &&
                        Math.abs(new Date(m.timestamp).getTime() - new Date(data.timestamp).getTime()) < 2000
                    );
                    return isDuplicate ? prev : [...prev, data];
                });
            }
        };

        socketRef.current = ws;
        return () => { ws.close(); };
    }, [chat.id, chat.type, currentUser]);

    const fetchHistory = async () => {
        try {
            const endpoint = chat.type === "dm" ? `/dm/history?user2=${chat.id}` : `/group/history?group_name=${chat.id}`;
            const res = await api.get(endpoint);
            setMessages(chat.type === "dm" ? res.data.chat || [] : res.data.group_chat || []);
        } catch (e) {
            setMessages([]);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            if (chat.type === "dm") await api.post("/dm/send", { receiver: chat.id, message: newMessage });
            else await api.post("/group/send", { group_name: chat.id, message: newMessage });
            setNewMessage("");
        } catch (e) { console.error(e); }
    };

    return (
        <div className="flex h-full flex-col justify-between z-10 relative bg-[#1a1210]">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-[#2d1b19]/80 backdrop-blur border-b border-[#3e2b29] sticky top-0 z-20">
                <div>
                    <h2 className="text-2xl font-bold font-serif text-[#eaddcf]">{chat.id}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-[#c3a995] rounded-full"></span>
                        <span className="text-xs text-[#8a7968] font-medium tracking-wide">ONLINE</span>
                    </div>
                </div>
                {/* Removed Phone, Search, MoreHorizontal icons as requested */}
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {messages.map((msg, i) => {
                    const isMe = msg.sender === currentUser;
                    return (
                        <div key={i} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-2", isMe ? "justify-end" : "justify-start")}>
                            <div className={cn("flex flex-col max-w-[70%]", isMe ? "items-end" : "items-start")}>

                                <div className={cn(
                                    "px-6 py-4 text-sm shadow-md relative",
                                    isMe
                                        ? "bg-[#593d3b] text-[#eaddcf] rounded-2xl rounded-tr-sm"
                                        : "bg-[#2d1b19] text-[#c3a995] rounded-2xl rounded-tl-sm border border-[#3e2b29]"
                                )}>
                                    <p className="leading-relaxed font-medium">{msg.message}</p>
                                </div>
                                <span className="text-[10px] text-[#6f5e53] mt-2 font-bold tracking-widest opacity-60">
                                    {isMe ? "YOU • " : `${msg.sender.toUpperCase()} • `}
                                    {(() => {
                                        const d = new Date(msg.timestamp);
                                        return isNaN(d.getTime()) ? "Just now" : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    })()}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-[#1a1210] border-t border-[#3e2b29]">
                <form onSubmit={handleSend} className="flex gap-4 items-end bg-[#2d1b19] p-2 rounded-2xl border border-[#3e2b29] focus-within:border-[#c3a995] transition-all duration-300">
                    <button type="button" className="p-3 text-[#8a7968] hover:text-[#c3a995] transition-colors rounded-xl hover:bg-[#3e2b29]">
                        <Paperclip size={20} />
                    </button>

                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Write a message..."
                        className="flex-1 bg-transparent px-2 py-3 text-[#eaddcf] placeholder-[#6f5e53] focus:outline-none font-medium"
                    />

                    <button type="submit" className="p-3 bg-[#c3a995] text-[#1a1210] rounded-xl hover:bg-[#d4bda8] transition-colors shadow-sm">
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
