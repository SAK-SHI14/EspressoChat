import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#1a1210] p-4 relative">
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#593d3b] rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
            <div className="z-10 w-full max-w-md">
                <AuthForm type="register" />
            </div>
        </div>
    );
}
