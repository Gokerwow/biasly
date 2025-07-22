{/* login/page.tsx - Light Version */}
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4 font-['Inter']">
      <div className="w-full max-w-sm">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            BIASLY
          </h1>
          <p className="text-gray-600">Welcome Back!</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
          <form className="flex flex-col gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex flex-col gap-4 pt-4">
              <button 
                formAction={login}
                className="w-full p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Log In
              </button>
              <button 
                formAction={signup}
                className="w-full p-3 rounded-full bg-purple-100 text-purple-600 font-bold hover:bg-purple-200 transition-colors"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}