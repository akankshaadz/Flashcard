import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, 
  Plus, 
  TrendingUp, 
  Zap, 
  BookOpen, 
  Target,
  ArrowRight,
  Brain
} from 'lucide-react';

export default function Home() {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: CreditCard,
      title: 'Smart Flashcards',
      description: 'Create and organize flashcards with beautiful flip animations and category-based filtering.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Target,
      title: 'Progress Tracking',
      description: 'Monitor your learning progress with detailed statistics and completion rates per category.',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Brain,
      title: 'Personalized Learning',
      description: 'Each user gets their own private collection of flashcards with intelligent search capabilities.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const quickActions = [
    { 
      to: '/flashcards', 
      icon: BookOpen, 
      title: 'Study Flashcards', 
      description: 'Review your existing flashcards',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      to: '/add-card', 
      icon: Plus, 
      title: 'Add New Card', 
      description: 'Create a new flashcard',
      color: 'bg-green-500 hover:bg-green-600'
    },
    { 
      to: '/progress', 
      icon: TrendingUp, 
      title: 'View Progress', 
      description: 'Check your learning statistics',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-black transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-teal-600 opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6 animate-scale-in">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-teal-500 rounded-2xl">
                <Zap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up animate-delay-100">
              Master Your Learning with{' '}
              <span className="bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                Smart Flashcards
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
              Create, organize, and study with our intelligent flashcard system. Track your progress, 
              filter by categories, and learn more effectively than ever before.
            </p>
            
            <div className="animate-fade-in-up animate-delay-300">
              {currentUser ? (
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/flashcards"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/add-card"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-gray-800 text-white border-2 border-gray-700 hover:border-purple-500 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Flashcard</span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-gray-800 text-white border-2 border-gray-700 hover:border-purple-500 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                  >
                    <span>Sign In</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to Learn Effectively
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Our comprehensive flashcard system includes all the tools you need to master any subject.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animate-delay-${(index + 1) * 100}`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 transform transition-transform duration-200 hover:scale-110`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Section - Only show for authenticated users */}
      {currentUser && (
        <div className="bg-gray-900 border-t border-gray-800 animate-slide-in-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl font-bold text-white mb-4">
                Quick Actions
              </h2>
              <p className="text-lg text-gray-300">
                Jump right into your learning journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.to}
                  className={`group bg-gray-800 rounded-xl p-6 border border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animate-delay-${(index + 1) * 100}`}
                >
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-300">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}