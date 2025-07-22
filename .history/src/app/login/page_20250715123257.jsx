// app/login/page.tsx
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-wider">
              Welcome, K-Star!
            </h1>
            <p className="text-pink-200 mt-2">
              Join the fandom and lightstick up!
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-pink-200 mb-2"
              >
                Email
              </label>
              <input
                id="email"
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
                htmlFor="password"
                className="block text-sm font-medium text-pink-200 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-pink-300/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                formAction={login}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-all duration-300"
              >
                Log In
              </button>
              <button
                formAction={signup}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-pink-200 text-sm">
            Ready to stan your bias? 💖
          </p>
        </div>
      </div>
    </div>
  )
}