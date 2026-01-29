"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import ProfilePanel from "@/components/ProfilePanel";
import { Coffee } from "lucide-react";

export default function ChatPage() {
    const router = useRouter();
    const [selectedChat, setSelectedChat] = useState<{ type: "dm" | "group"; id: string } | null>(null);
    const [currentUser, setCurrentUser] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const username = sessionStorage.getItem("username");

        if (!token || !username) {
            router.push("/login");
            return;
        }

        setCurrentUser(username);
        setLoading(false);
    }, [router]);

    if (loading) return null;

    return (
        <div className="flex h-screen flex-col bg-[#1a1210] overflow-hidden text-[#eaddcf]">
            {/* Top Navigation */}
            <header className="flex h-20 items-center justify-between border-b border-[#3e2b29] px-8 bg-[#1a1210] relative z-20">
                <div className="flex items-center space-x-3">
                    <div className="bg-[#c3a995] p-2 rounded-lg text-[#1a1210] shadow-[4px_4px_0px_0px_#593d3b] transform -rotate-2">
                        <Coffee size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight font-serif text-[#eaddcf]">
                        Espresso<span className="text-[#ab947e] italic">Chat</span> <span className="text-xs font-sans text-[#593d3b] bg-[#c3a995] px-2 py-0.5 rounded ml-2 uppercase tracking-widest font-bold">Dark Roast</span>
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-[#8a7968]">
                        Brewing for <span className="text-[#c3a995] font-bold underline decoration-[#593d3b] decoration-2 underline-offset-4">{currentUser}</span>
                    </div>
                </div>
            </header>

            {/* Main Layout Grid */}
            <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden relative">

                {/* Sidebar (Left) */}
                <aside className="col-span-3 border-r border-[#3e2b29] bg-[#1a1210]">
                    <Sidebar
                        onSelectChat={setSelectedChat}
                        selectedChat={selectedChat}
                    />
                </aside>

                {/* Chat Window (Middle) */}
                <main className="col-span-6 bg-[#1a1210] relative">
                    {/* Subtle noise texture overlay handled in globals, but specific background here */}
                    <div className="absolute inset-0 bg-[#1a1210] pointer-events-none"></div>

                    {selectedChat ? (
                        <ChatWindow chat={selectedChat} currentUser={currentUser} />
                    ) : (
                        <div className="flex flex-col h-full items-center justify-center text-[#6f5e53] space-y-6 z-10 relative">
                            <div className="w-40 h-40 bg-[#2d1b19] rounded-full flex items-center justify-center shadow-inner border border-[#3e2b29]">
                                <Coffee size={64} className="text-[#593d3b]" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-serif font-bold text-[#c3a995] mb-2">Dark Mode Activated</h3>
                                <p className="font-medium opacity-80 text-[#8a7968]">Select a contact to begin.</p>
                            </div>
                        </div>
                    )}
                </main>

                {/* Profile Panel (Right) */}
                <aside className="col-span-3 border-l border-[#3e2b29] bg-[#1a1210]">
                    <ProfilePanel currentUser={currentUser} />
                </aside>

            </div>
        </div>
    );
}
