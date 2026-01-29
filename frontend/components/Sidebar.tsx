"use client";

import { useState, useEffect } from "react";
import { Plus, Hash, User, X } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface SidebarProps {
    onSelectChat: (chat: { type: "dm" | "group"; id: string }) => void;
    selectedChat: { type: "dm" | "group"; id: string } | null;
}

export default function Sidebar({ onSelectChat, selectedChat }: SidebarProps) {
    const [users, setUsers] = useState<{ username: string }[]>([]);
    const [groups, setGroups] = useState<{ group_name: string }[]>([]);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    useEffect(() => {
        fetchUsers();
        fetchGroups();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchGroups = async () => {
        try {
            const res = await api.get("/users/groups");
            setGroups(res.data);
        } catch (e) { console.error(e); }
    };

    return (
        <div className="h-full flex flex-col p-5 bg-[#1a1210] border-r border-[#3e2b29] relative">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#c3a995] tracking-wide font-serif">Conversations</h2>
                <button
                    onClick={() => setShowNewChatModal(true)}
                    className="bg-[#c3a995] text-[#1a1210] p-2 rounded-full hover:bg-[#d4bda8] transition-colors shadow-none"
                    title="New Chat"
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Create Group Section (Toggleable inside Modal or separate? Keeping simple inline for now if needed, or maybe filter in modal?) 
           Actually, let's keep the user list modal dominant.
       */}

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                <div>
                    <h3 className="text-xs font-bold text-[#8a7968] uppercase tracking-widest mb-3 pl-2 opacity-80">Communities</h3>
                    <div className="space-y-2">
                        {groups.map((group) => (
                            <button
                                key={group.group_name}
                                onClick={() => onSelectChat({ type: "group", id: group.group_name })}
                                className={cn(
                                    "flex w-full items-center p-3 rounded-lg transition-all duration-300 group relative",
                                    selectedChat?.id === group.group_name && selectedChat.type === "group"
                                        ? "bg-[#2d1b19] text-[#c3a995] border border-[#3e2b29]"
                                        : "hover:bg-[#2d1b19]/50 text-[#8a7968]"
                                )}
                            >
                                <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center mr-4 border transition-colors",
                                    selectedChat?.id === group.group_name && selectedChat.type === "group"
                                        ? "border-[#c3a995] bg-[#c3a995]/10 text-[#c3a995]"
                                        : "border-[#3e2b29] bg-[#1a1210] text-[#6f5e53]"
                                )}>
                                    <Hash size={18} />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold font-serif">{group.group_name}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-[#8a7968] uppercase tracking-widest mb-3 pl-2 mt-6 opacity-80">Contacts</h3>
                    <div className="space-y-2">
                        {users.map((user) => (
                            <button
                                key={user.username}
                                onClick={() => onSelectChat({ type: "dm", id: user.username })}
                                className={cn(
                                    "flex w-full items-center p-3 rounded-lg transition-all duration-300 group",
                                    selectedChat?.id === user.username && selectedChat.type === "dm"
                                        ? "bg-[#2d1b19] text-[#c3a995] border border-[#3e2b29]"
                                        : "hover:bg-[#2d1b19]/50 text-[#8a7968]"
                                )}
                            >
                                <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center mr-4 border transition-colors",
                                    selectedChat?.id === user.username && selectedChat.type === "dm"
                                        ? "border-[#c3a995] bg-[#c3a995]/10 text-[#c3a995]"
                                        : "border-[#3e2b29] bg-[#1a1210] text-[#6f5e53]"
                                )}>
                                    <span className="font-bold font-serif text-lg">{user.username.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold font-serif">{user.username}</div>
                                    <div className={cn("text-xs opacity-70", selectedChat?.id === user.username ? "text-[#ab947e]" : "text-[#6f5e53]")}>
                                        See profile
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* New Chat Modal */}
            {showNewChatModal && (
                <div className="absolute inset-0 z-50 bg-[#1a1210]/95 backdrop-blur-sm flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-serif font-bold text-[#eaddcf]">New Chat</h2>
                        <button onClick={() => setShowNewChatModal(false)} className="text-[#8a7968] hover:text-[#c3a995]">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                        <div className="text-xs font-bold text-[#593d3b] bg-[#c3a995] px-2 py-1 inline-block rounded mb-2">Select User</div>
                        {users.map(user => (
                            <button
                                key={user.username}
                                onClick={() => {
                                    onSelectChat({ type: "dm", id: user.username });
                                    setShowNewChatModal(false);
                                }}
                                className="w-full flex items-center p-4 rounded-xl bg-[#2d1b19] border border-[#3e2b29] hover:border-[#c3a995] hover:bg-[#3e2b29] transition-all group"
                            >
                                <div className="h-10 w-10 rounded-full bg-[#1a1210] border border-[#3e2b29] flex items-center justify-center text-[#c3a995] font-serif font-bold text-lg mr-4 group-hover:bg-[#c3a995] group-hover:text-[#1a1210] transition-colors">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[#eaddcf] font-medium">{user.username}</span>
                            </button>
                        ))}
                    </div>

                    {/* Option to create group could be here too */}
                    <div className="mt-4 pt-4 border-t border-[#3e2b29]">
                        <button
                            onClick={() => {
                                setShowCreateGroup(!showCreateGroup);
                                // don't close modal necessarily, or maybe swap view
                            }}
                            className="w-full py-3 bg-[#593d3b] text-[#c3a995] rounded-xl font-bold text-sm tracking-wide"
                        >
                            {showCreateGroup ? "Cancel Group" : "Create New Group"}
                        </button>

                        {showCreateGroup && (
                            <div className="mt-4 space-y-3">
                                <input
                                    value={newGroupName}
                                    onChange={e => setNewGroupName(e.target.value)}
                                    placeholder="Group Name"
                                    className="w-full bg-[#1a1210] border border-[#3e2b29] p-3 rounded-lg text-[#eaddcf] text-sm focus:border-[#c3a995] outline-none"
                                />
                                <input
                                    value={selectedMembers.join(", ")}
                                    onChange={(e) => setSelectedMembers(e.target.value.split(",").map(s => s.trim()))}
                                    placeholder="Members (comma, sep)"
                                    className="w-full bg-[#1a1210] border border-[#3e2b29] p-3 rounded-lg text-[#eaddcf] text-sm focus:border-[#c3a995] outline-none"
                                />
                                <button
                                    onClick={async () => {
                                        try {
                                            await api.post("/group/create", { group_name: newGroupName, members: selectedMembers });
                                            setShowCreateGroup(false);
                                            setShowNewChatModal(false);
                                            fetchGroups();
                                        } catch (e) { console.error(e); }
                                    }}
                                    className="w-full py-2 bg-[#c3a995] text-[#1a1210] font-bold rounded-lg text-xs"
                                >
                                    Confirm Create
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
