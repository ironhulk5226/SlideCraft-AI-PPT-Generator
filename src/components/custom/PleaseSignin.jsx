import React from 'react'
import { SignInButton } from '@clerk/clerk-react'
import { Button } from '../ui/button'
import { LogIn, Sparkles, Shield, Zap } from 'lucide-react'

const PleaseSignin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Logo/Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome to SlideCraft</h1>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Sign in to access your dashboard
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Create stunning presentations with AI-powered tools. Join thousands of users who trust SlideCraft for their presentation needs.
          </p>
        </div>

        {/* Features */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Zap className="w-4 h-4 text-blue-500 mr-3" />
            <span>AI-powered presentation generation</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-500 mr-3" />
            <span>Secure and private workspace</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-purple-500 mr-3" />
            <span>Professional templates library</span>
          </div>
        </div>

        {/* Sign In Button */}
        <SignInButton mode="modal">
          <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3">
            <LogIn className="w-5 h-5 mr-2" />
            Sign In to Continue
          </Button>
        </SignInButton>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default PleaseSignin