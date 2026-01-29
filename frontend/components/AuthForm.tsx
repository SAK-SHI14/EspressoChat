"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function AuthForm({ type }: { type: "login" | "register" }) {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const endpoint = type === "login" ? "/login" : "/register";
            // For login, FastAPI expects form-data usually, but we adapted to JSON or form-data
            // Let's assume JSON for simplicity or check backend again. 
            // Backend uses OAuth2PasswordRequestForm which is form-data for login!

            let response;
            if (type === "login") {
                const formData = new FormData();
                formData.append("username", username);
                formData.append("password", password);
                response = await api.post(endpoint, formData, {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                });
            } else {
                response = await api.post(endpoint, { username, password });
            }

            if (type === "login") {
                sessionStorage.setItem("token", response.data.access_token);
                sessionStorage.setItem("username", username);
                router.push("/chat");
            } else {
                // Auto login after register? Or redirect to login
                router.push("/login?registered=true");
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-[#2d1b19] p-8 rounded-2xl border border-[#3e2b29] shadow-2xl relative overflow-hidden">
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#593d3b] via-[#c3a995] to-[#593d3b]"></div>

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-serif text-[#eaddcf] mb-2">{type === "login" ? "Welcome Back" : "Join the Lounge"}</h1>
                <p className="text-[#8a7968] text-sm">
                    {type === "login" ? "Enter your credentials to access your chats." : "Create your account to start brewing conversations."}
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-[#593d3b]/20 border border-[#593d3b] text-[#c3a995] text-sm rounded-lg text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-[#8a7968] uppercase tracking-wider mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#1a1210] border border-[#3e2b29] text-[#eaddcf] p-3 rounded-xl focus:outline-none focus:border-[#c3a995] transition-colors"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#8a7968] uppercase tracking-wider mb-2">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#1a1210] border border-[#3e2b29] text-[#eaddcf] p-3 rounded-xl focus:outline-none focus:border-[#c3a995] transition-colors"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-[#6f5e53] hover:text-[#c3a995]"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#c3a995] hover:bg-[#d4bda8] text-[#1a1210] py-3 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center mt-6"
                >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : (type === "login" ? "Sign In" : "Create Account")}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-[#8a7968]">
                {type === "login" ? (
                    <>Don't have an account? <a href="/register" className="text-[#c3a995] hover:underline font-bold">Register</a></>
                ) : (
                    <>Already have an account? <a href="/login" className="text-[#c3a995] hover:underline font-bold">Login</a></>
                )}
            </div>
        </div>
    );
}
