"use client";

import { Settings, Bell, LogOut } from "lucide-react";

interface ProfilePanelProps {
    currentUser: string;
}

export default function ProfilePanel({ currentUser }: ProfilePanelProps) {
    return (
        <div className="h-full p-8 bg-[#1a1210] flex flex-col relative">
            <div className="text-center mb-10">
                <div className="w-24 h-24 mx-auto border-4 border-[#3e2b29] rounded-full p-1 mb-4 shadow-sm">
                    <div className="w-full h-full bg-[#593d3b] rounded-full flex items-center justify-center text-4xl text-[#c3a995] font-serif shadow-inner">
                        {currentUser.charAt(0).toUpperCase()}
                    </div>
                </div>
                <h2 className="text-2xl font-bold font-serif text-[#eaddcf] mb-1">{currentUser}</h2>
                <p className="text-xs text-[#8a7968] font-bold tracking-widest uppercase">Member since 2026</p>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto">

                <div className="bg-[#2d1b19] p-6 rounded-xl border border-[#3e2b29]">
                    <h3 className="text-xs font-bold text-[#8a7968] uppercase tracking-widest mb-4 border-b border-[#3e2b29] pb-2">Preferences</h3>

                    <div className="space-y-3">
                        <button className="flex w-full items-center space-x-3 text-[#c3a995] hover:text-[#eaddcf] transition-colors group">
                            <Settings size={18} className="text-[#8a7968] group-hover:rotate-45 transition-transform" />
                            <span className="text-sm font-medium">Settings</span>
                        </button>
                        <button className="flex w-full items-center space-x-3 text-[#c3a995] hover:text-[#eaddcf] transition-colors group">
                            <Bell size={18} className="text-[#8a7968] group-hover:swing transition-transform" />
                            <span className="text-sm font-medium">Notifications</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Logout Corner Icon */}
            <div className="absolute bottom-4 right-4">
                <button
                    onClick={() => {
                        sessionStorage.clear();
                        window.location.href = "/login";
                    }}
                    className="p-3 bg-[#3e2b29] hover:bg-[#593d3b] text-[#c3a995] rounded-full shadow-lg border border-[#593d3b] transition-all hover:scale-110"
                    title="Log Out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
}
