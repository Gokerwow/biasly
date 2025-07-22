// app/login/page.tsx
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* NEON LOGIN CARD */}
        <form action={login} className="relative rounded-2xl border border-pink-500/50 bg-gradient-to-b from-[#111] to-[#000] p-8 shadow-[0_0_25px_-5px_theme(colors.pink.500)]">
          <h1 className="text-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            Welcome Back, K-Star!
          </h1>

          {/* Email */}
          <label className="mt-6 block text-sm text-pink-300">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-purple-500/40 bg-transparent px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-pink-400"
            placeholder="your@email.com"
          />

          {/* Password */}
          <label className="mt-4 block text-sm text-pink-300">Password</label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-purple-500/40 bg-transparent px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-pink-400"
            placeholder="••••••••"
          />

          {/* Options */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" name="remember" className="h-3.5 w-3.5 accent-pink-500" />
              Remember me
            </label>
            <a href="/forgot-password" className="text-gray-300 hover:text-pink-400 transition">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-bold text-white shadow-[0_0_15px_theme(colors.pink.500)] hover:shadow-[0_0_20px_theme(colors.pink.500)] transition-all"
          >
            Log In
          </button>

          {/* Google */}
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-600 bg-transparent py-2.5 text-sm text-gray-300 hover:border-pink-500 hover:text-white transition"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              {/* google icon paths */}
            </svg>
            Continue with Google
          </button>
        </form>

        {/* SLIM SIGN-UP BAR */}
        <form action={signup} className="w-full">
          <button
            type="submit"
            className="w-full rounded-lg border border-purple-500/50 bg-[#111] py-3 text-sm font-semibold text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 transition"
          >
            Not a member yet? <span className="text-pink-400">Sign up</span>
          </button>
        </form>
      </div>
    </main>
  )
}