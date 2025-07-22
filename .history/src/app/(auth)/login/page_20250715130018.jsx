// app/login/page.tsx
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-fuchsia-50 to-indigo-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm space-y-6">
        {/* LOGIN CARD */}
        <form action={login} className="bg-white rounded-3xl shadow-xl p-8 space-y-5">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Log in to keep your playlist grooving 🎧
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="your@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="••••••••"
            />
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                name="remember"
                className="mr-2 h-4 w-4 rounded text-rose-500 focus:ring-rose-400"
              />
              Remember me
            </label>
            <a
              href="/forgot-password"
              className="text-rose-500 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Login */}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 py-3 font-bold text-white shadow-md hover:shadow-lg transition-shadow"
          >
            Log In
          </button>

          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </form>

        {/* SIGN-UP STRIP */}
        <form action={signup} className="w-full">
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-400 to-indigo-400 py-3 text-sm font-bold text-white shadow hover:shadow-md transition"
          >
            Create new account
          </button>
        </form>
      </div>
    </main>
  )
}