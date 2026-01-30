import Link from "next/link";

export default function VerifyEmailPage({
    searchParams,
}: {
    searchParams: { email?: string };
}) {
    return (
        <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
            <h1 className="text-3xl font-bold">Check your inbox! 📧</h1>

            <p className="mt-4 text-gray-600 max-w-md">
                We sent a confirmation link to{" "}
                <span className="font-semibold text-black">
                    {searchParams.email || "your email"}
                </span>
                .
            </p>

            <p className="mt-2 text-sm text-gray-500">
                Click the link in the email to sign in automatically.
            </p>

            <Link
                href="/login"
                className="mt-8 text-blue-500 hover:underline text-sm"
            >
                ← Back to Login
            </Link>
        </div>
    );
}