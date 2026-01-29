"use client";

import { useState } from "react";

export default function ChatLayout() {
    const [selectedUser, setSelectedUser] = useState("Mehtab");

    return (
        <div className="h-screen flex bg-[#0b141a] text-white">

            {/* Sidebar */}
            <div className="w-[30%] border-r border-gray-700 p-4">
                <h2 className="text-xl font-bold mb-4">💬 Chats</h2>

                <div
                    onClick={() => setSelectedUser("Mehtab")}
                    className="p-3 rounded-lg cursor-pointer hover:bg-[#202c33] bg-[#202c33]"
                >
                    <p className="font-semibold">Mehtab</p>
                    <p className="text-sm text-gray-400">Last message...</p>
                </div>

                <div
                    onClick={() => setSelectedUser("Sakshi")}
                    className="p-3 mt-2 rounded-lg cursor-pointer hover:bg-[#202c33]"
                >
                    <p className="font-semibold">Sakshi</p>
                    <p className="text-sm text-gray-400">Hey 👋</p>
                </div>
            </div>

            {/* Chat Window */}
            <div className="w-[70%] flex flex-col">

                {/* Header */}
                <div className="p-4 border-b border-gray-700 bg-[#202c33]">
                    <h2 className="font-bold text-lg">Chat with {selectedUser}</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">

                    {/* Incoming */}
                    <div className="flex">
                        <div className="bg-[#202c33] px-4 py-2 rounded-xl max-w-[60%]">
                            Hello Sakshi 👋
                        </div>
                    </div>

                    {/* Outgoing */}
                    <div className="flex justify-end">
                        <div className="bg-[#005c4b] px-4 py-2 rounded-xl max-w-[60%]">
                            Hi Mehtab ✅
                        </div>
                    </div>

                </div>

                {/* Input */}
                <div className="p-4 flex gap-2 bg-[#202c33]">
                    <input
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-lg bg-[#0b141a] outline-none"
                    />
                    <button className="bg-[#005c4b] px-5 py-2 rounded-lg font-semibold">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}