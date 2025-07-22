// app/login/page.tsx
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
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
              <label
                htmlFor="email-login"
                className="block text-sm font-medium text-pink-200 mb-2"
              >
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
              <label
                htmlFor="password-login"
                className="block text-sm font-medium text-pink-200 mb-2"
              >
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
              <a
                href="/forgot-password"
                className="text-pink-200 hover:text-white underline"
              >
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
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="flex items-center my-8">
          <hr className="flex-grow border-pink-300/30" />
          <span className="mx-4 text-white font-semibold">or</span>
          <hr className="flex-grow border-pink-300/30" />
        </div>

        {/* SIGN-UP CARD */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white tracking-wider">
              New to the Fandom?
            </h2>
            <p className="text-pink-200 mt-2">
              Create an account and join the party 🎉
            </p>
          </div>

          <form action={signup} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email-signup"
                className="block text-sm font-medium text-pink-200 mb-2"
              >
                Email
              </label>
              <input
                id="email-signup"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-pink-300/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password-signup"
                className="block text-sm font-medium text-pink-200 mb-2"
              >
                Password
              </label>
              <input
                id="password-signup"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-pink-300/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {/* Sign-up Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-300"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}