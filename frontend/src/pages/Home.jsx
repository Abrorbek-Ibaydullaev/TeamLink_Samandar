import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Users, Zap, Shield, Sparkles, MessageSquare, Calendar, BarChart } from 'lucide-react'

export default function Home({ darkMode = true }) {
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50'
  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'

  const features = [
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team in real-time',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built for speed and efficiency with modern technology',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security to keep your data safe',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Instant messaging and collaboration tools',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Calendar,
      title: 'Task Management',
      description: 'Organize and track your projects effortlessly',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: BarChart,
      title: 'Analytics',
      description: 'Powerful insights and reporting for your team',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  const benefits = [
    'Unlimited projects and tasks',
    'Real-time collaboration',
    'Secure cloud storage',
    '24/7 customer support',
    'Mobile apps for iOS & Android',
    'Advanced analytics and reporting'
  ]

  return (
    <div className={`${bgClass} min-h-screen`}>
      {/* Navigation */}
      <nav className={`${cardBg} backdrop-blur-xl border-b ${borderColor} sticky top-0 z-50`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  TeamLink
                </h1>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a 
                href="#features" 
                className={`${textSecondary} hover:${textPrimary} transition cursor-pointer`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className={`${textSecondary} hover:${textPrimary} transition cursor-pointer`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Pricing
              </a>
              <a 
                href="#about" 
                className={`${textSecondary} hover:${textPrimary} transition cursor-pointer`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                About
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className={`px-6 py-2 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} ${textPrimary} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} transition font-medium`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition font-medium"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'} border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'} mb-8`}>
              <Sparkles size={16} className="text-blue-400" />
              <span className={`text-sm font-medium ${textPrimary}`}>Now with AI-powered insights</span>
            </div>

            {/* Hero Title */}
            <h1 className={`text-5xl md:text-7xl font-bold ${textPrimary} mb-6`}>
              Collaborate Better,
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Achieve More
              </span>
            </h1>

            <p className={`text-xl ${textSecondary} mb-12 max-w-2xl mx-auto`}>
              TeamLink brings your team together with powerful project management, 
              real-time collaboration, and intelligent insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 hover:scale-105 transition-all shadow-xl flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-8 py-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${borderColor} ${textPrimary} hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} transition font-medium cursor-pointer`}
              >
                Learn More
              </button>
            </div>

            {/* Social Proof */}
            <p className={`${textSecondary} text-sm mt-8`}>
              Trusted by over <span className="text-blue-400 font-semibold">10,000+</span> teams worldwide
            </p>
          </div>

          {/* Hero Image/Preview */}
          <div className="max-w-5xl mx-auto mt-20">
            <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-4 shadow-2xl`}>
              <div className={`rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} overflow-hidden`}>
                {/* Mock Dashboard Preview */}
                <div className="w-full p-6">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-2xl font-bold ${textPrimary} mb-1`}>Welcome back, User! 👋</h3>
                      <p className={`text-sm ${textSecondary}`}>Here's what's happening with your projects</p>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Active Tasks', value: '26', color: 'from-blue-500 to-cyan-500' },
                      { label: 'Team Members', value: '12', color: 'from-purple-500 to-pink-500' },
                      { label: 'Projects', value: '8', color: 'from-green-500 to-emerald-500' },
                      { label: 'Hours', value: '342', color: 'from-orange-500 to-red-500' }
                    ].map((stat, idx) => (
                      <div key={idx} className={`${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${borderColor} rounded-xl p-4`}>
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} mb-3 opacity-80`}></div>
                        <p className={`text-2xl font-bold ${textPrimary} mb-1`}>{stat.value}</p>
                        <p className={`text-xs ${textSecondary}`}>{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Projects Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Website Redesign', progress: 75, color: 'from-purple-500 to-pink-500' },
                      { name: 'Mobile App', progress: 45, color: 'from-blue-500 to-cyan-500' }
                    ].map((project, idx) => (
                      <div key={idx} className={`${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${borderColor} rounded-xl p-4`}>
                        <h4 className={`font-semibold ${textPrimary} mb-3 text-sm`}>{project.name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`flex-1 h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                            <div className={`h-full bg-gradient-to-r ${project.color}`} style={{ width: `${project.progress}%` }}></div>
                          </div>
                          <span className={`text-xs font-semibold ${textPrimary}`}>{project.progress}%</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <div className={`w-6 h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} text-xs flex items-center justify-center`}>👨‍💻</div>
                          <div className={`w-6 h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} text-xs flex items-center justify-center`}>👩‍🎨</div>
                          <div className={`w-6 h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} text-xs flex items-center justify-center`}>👨‍💼</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold ${textPrimary} mb-4`}>
              Everything You Need
            </h2>
            <p className={`text-xl ${textSecondary} max-w-2xl mx-auto`}>
              Powerful features to help your team work smarter and faster
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-8 hover:scale-105 hover:border-blue-500/50 transition-all group cursor-pointer`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${textPrimary} mb-3`}>
                    {feature.title}
                  </h3>
                  <p className={`${textSecondary}`}>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-4xl md:text-5xl font-bold ${textPrimary} mb-6`}>
                Why Teams Love TeamLink
              </h2>
              <p className={`text-xl ${textSecondary} mb-8`}>
                Join thousands of successful teams already using TeamLink to boost productivity and collaboration.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-1" />
                    <p className={`text-lg ${textPrimary}`}>{benefit}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 hover:scale-105 transition-all shadow-xl"
              >
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
            </div>

            <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-8`}>
              <div className="space-y-6">
                {[
                  { label: 'Active Projects', value: '10,000+' },
                  { label: 'Team Members', value: '50,000+' },
                  { label: 'Tasks Completed', value: '1M+' },
                  { label: 'Customer Satisfaction', value: '99%' }
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <span className={`${textSecondary}`}>{stat.label}</span>
                    <span className={`text-2xl font-bold ${textPrimary}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold ${textPrimary} mb-4`}>
              Simple, Transparent Pricing
            </h2>
            <p className={`text-xl ${textSecondary} max-w-2xl mx-auto`}>
              Choose the perfect plan for your team. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-8 hover:scale-105 transition-all`}>
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold ${textPrimary} mb-2`}>Free</h3>
                <div className="mb-4">
                  <span className={`text-5xl font-bold ${textPrimary}`}>$0</span>
                  <span className={`${textSecondary}`}>/month</span>
                </div>
                <p className={`${textSecondary}`}>Perfect for small teams</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>Up to 5 team members</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>3 projects</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>Basic features</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>Community support</span>
                </li>
              </ul>
              <Link
                to="/register"
                className={`block w-full py-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} ${textPrimary} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} transition text-center font-medium`}
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className={`${cardBg} backdrop-blur-xl border-2 border-blue-500 rounded-2xl p-8 hover:scale-105 transition-all relative`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold ${textPrimary} mb-2`}>Pro</h3>
                <div className="mb-4">
                  <span className={`text-5xl font-bold ${textPrimary}`}>$29</span>
                  <span className={`${textSecondary}`}>/month</span>
                </div>
                <p className={`${textSecondary}`}>For growing teams</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>Up to 20 team members</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>Unlimited projects</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>Advanced features</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>Analytics & reporting</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition text-center font-medium"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-8 hover:scale-105 transition-all`}>
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold ${textPrimary} mb-2`}>Enterprise</h3>
                <div className="mb-4">
                  <span className={`text-5xl font-bold ${textPrimary}`}>Custom</span>
                </div>
                <p className={`${textSecondary}`}>For large organizations</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>Unlimited team members</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>Unlimited projects</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>Custom integrations</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>Dedicated support</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  <span className={textPrimary}>SLA & custom contract</span>
                </li>
              </ul>
              <button className={`w-full py-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} ${textPrimary} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} transition font-medium`}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`text-4xl md:text-5xl font-bold ${textPrimary} mb-4`}>
                About TeamLink
              </h2>
              <p className={`text-xl ${textSecondary}`}>
                Built by teams, for teams
              </p>
            </div>

            <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-12 mb-12`}>
              <div className="prose prose-lg max-w-none">
                <p className={`text-lg ${textPrimary} mb-6`}>
                  TeamLink was born from a simple idea: collaboration shouldn't be complicated. 
                  We've experienced the frustration of juggling multiple tools, losing track of conversations, 
                  and watching projects fall through the cracks.
                </p>
                <p className={`text-lg ${textPrimary} mb-6`}>
                  That's why we built TeamLink - a unified platform that brings everything your team needs 
                  into one beautiful, intuitive workspace. From project management and real-time chat to 
                  analytics and reporting, we've crafted every feature with one goal in mind: making teamwork 
                  effortless.
                </p>
                <p className={`text-lg ${textPrimary}`}>
                  Today, over 10,000 teams worldwide trust TeamLink to keep their projects on track and 
                  their teams connected. We're constantly evolving, listening to our users, and building 
                  the future of collaborative work.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className={`text-4xl font-bold ${textPrimary} mb-2`}>2020</div>
                <p className={`${textSecondary}`}>Founded</p>
              </div>
              <div>
                <div className={`text-4xl font-bold ${textPrimary} mb-2`}>10,000+</div>
                <p className={`${textSecondary}`}>Active Teams</p>
              </div>
              <div>
                <div className={`text-4xl font-bold ${textPrimary} mb-2`}>50+</div>
                <p className={`${textSecondary}`}>Countries</p>
              </div>
            </div>

            <div className={`mt-12 ${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-8`}>
              <h3 className={`text-2xl font-bold ${textPrimary} mb-6 text-center`}>Our Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'User First', desc: 'Every decision we make starts with our users' },
                  { title: 'Simplicity', desc: 'Powerful features, simple experience' },
                  { title: 'Innovation', desc: 'Constantly pushing boundaries' },
                  { title: 'Transparency', desc: 'Open, honest communication always' }
                ].map((value, idx) => (
                  <div key={idx} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                    <h4 className={`font-semibold ${textPrimary} mb-2`}>{value.title}</h4>
                    <p className={`text-sm ${textSecondary}`}>{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-3xl p-12 md:p-16 text-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
            <div className="relative z-10">
              <h2 className={`text-4xl md:text-5xl font-bold ${textPrimary} mb-6`}>
                Ready to Get Started?
              </h2>
              <p className={`text-xl ${textSecondary} mb-8 max-w-2xl mx-auto`}>
                Join thousands of teams using TeamLink. Start your free trial today, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 hover:scale-105 transition-all shadow-xl"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="/login"
                  className={`px-8 py-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${borderColor} ${textPrimary} hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} transition font-medium`}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${cardBg} backdrop-blur-xl border-t ${borderColor} py-12`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <span className={`font-bold ${textPrimary}`}>TeamLink</span>
              </div>
              <p className={`${textSecondary} text-sm`}>
                The ultimate collaboration platform for modern teams.
              </p>
            </div>

            <div>
              <h3 className={`font-semibold ${textPrimary} mb-4`}>Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`${textSecondary} hover:${textPrimary} transition text-sm`}>Features</a></li>
                <li><a href="#" className={`${textSecondary} hover:${textPrimary} transition text-sm`}>Pricing</a></li>
                <li><a href="#" className={`${textSecondary} hover:${textPrimary} transition text-sm`}>Security</a></li>
              </ul>
            </div>

            <div>
              <h3 className={`font-semibold ${textPrimary} mb-4`}>Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`${textSecondary} hover:${textPrimary} transition text-sm`}>About</a></li>
                <li><a href="#" className={`${textSecondary} hover:${textPrimary} transition text-sm`}>Blog</a></li>
                <li><a href="#" className={`${textSecondary} hover:${textPrimary} transition text-sm`}>Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className={`font-semibold ${textPrimary} mb-4`}>Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`${textSecondary} hover:${textPrimary} transition text-sm`}>Help Center</a></li>
                <li><a href="#" className={`${textSecondary} hover:${textPrimary} transition text-sm`}>Contact</a></li>
                <li><a href="#" className={`${textSecondary} hover:${textPrimary} transition text-sm`}>Status</a></li>
              </ul>
            </div>
          </div>

          <div className={`border-t ${borderColor} pt-8`}>
            <p className={`text-center ${textSecondary} text-sm`}>
              © 2025 TeamLink. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}