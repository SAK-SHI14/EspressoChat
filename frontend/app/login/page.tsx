import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#1a1210] p-4 relative">
            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#593d3b] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#c3a995] rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>

            <div className="z-10 w-full max-w-md">
                <AuthForm type="login" />
            </div>
        </div>
    );
}
