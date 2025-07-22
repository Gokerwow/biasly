// app/login/page.tsx
import { login, signup } from './actions'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-sm space-y-6">
                {/* LOGIN CARD */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white tracking-wider">
                            Welcome Back, K-Star!
                        </h1>
                        <p className="text-pink-200 mt-2">Log in to keep the vibe alive ✨</p>
                    </div>

                    <form action={login} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email-login" className="block text-sm font-medium text-pink-200 mb-2">
                                Email
                            </label>
                            <input
                                id="email-login"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-pink-300/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                                placeholder="your@email.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password-login" className="block text-sm font-medium text-pink-200 mb-2">
                                Password
                            </label>
                            <input
                                id="password-login"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-pink-300/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-pink-200">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    className="mr-2 h-4 w-4 rounded border-pink-300 text-pink-500 focus:ring-pink-400"
                                />
                                Remember me
                            </label>
                            <a href="/forgot-password" className="text-pink-200 hover:text-white underline">
                                Forgot password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-all duration-300"
                        >
                            Log In
                        </button>

                        {/* Google Login */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg border border-white/30 transition"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                {/* Google icon paths */}
                            </svg>
                            Continue with Google
                        </button>
                    </form>
                </div>

                {/* SIGN-UP BUTTON ONLY */}
                <form action={signup} className="w-full">
                    <button
                        type="submit"
                        className="w-full bg-transparent border border-pink-300/50 text-pink-200 font-bold py-3 px-4 rounded-lg hover:bg-pink-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-all duration-300"
                    >
                        Sign up for a new account
                    </button>
                </form>
            </div>
        </div>
    )
}