import { PricingTable } from '@clerk/clerk-react'
import React from 'react'
import { ArrowLeft, Sparkles, Zap, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-600 hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Simple & Transparent Pricing</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-slate-800 via-primary to-slate-700 bg-clip-text text-transparent mb-4">
            Choose Your Perfect Plan
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Select the plan that best fits your presentation needs. All plans include access to our AI-powered tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">AI-Powered Generation</h3>
            <p className="text-slate-600 text-sm">Create stunning presentations in seconds with our advanced AI technology</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Professional Templates</h3>
            <p className="text-slate-600 text-sm">Access to premium design styles and customizable templates</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Export & Share</h3>
            <p className="text-slate-600 text-sm">Download as PowerPoint and share your presentations anywhere</p>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-12">
          <PricingTable />
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            Need help choosing? Contact our support team for personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Pricing