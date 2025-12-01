import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthApi } from '../services/api'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await AuthApi.login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 p-4">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-950 tracking-tight">Welcome Back</h1>
          <p className="text-brand-600/80 mt-2">Sign in to manage your broiler operations</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 flex items-center animate-pulse">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-brand-900 mb-1.5">Username</label>
            <input
              className="w-full border border-brand-200 rounded-lg px-4 py-2.5 bg-white/50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-200 outline-none"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-900 mb-1.5">Password</label>
            <input
              type="password"
              className="w-full border border-brand-200 rounded-lg px-4 py-2.5 bg-white/50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-200 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg py-2.5 shadow-lg shadow-brand-500/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
