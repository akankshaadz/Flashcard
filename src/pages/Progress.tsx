import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Eye, Target, BookOpen, BarChart3 } from 'lucide-react';

interface ProgressData {
  category: string;
  total: number;
  viewed: number;
  percentage: number;
}

export default function Progress() {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCards, setTotalCards] = useState(0);
  const [totalViewed, setTotalViewed] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadProgress();
  }, [currentUser]);

  const loadProgress = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', currentUser.id);

      if (error) throw error;

      const categoryStats: { [key: string]: { total: number; viewed: number } } = {};
      let totalCardsCount = 0;
      let totalViewedCount = 0;

      data?.forEach((card) => {
        const category = card.category;
        const isViewed = card.viewed_by?.includes(currentUser.id) || false;

        if (!categoryStats[category]) {
          categoryStats[category] = { total: 0, viewed: 0 };
        }

        categoryStats[category].total++;
        totalCardsCount++;

        if (isViewed) {
          categoryStats[category].viewed++;
          totalViewedCount++;
        }
      });

      const progress: ProgressData[] = Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        total: stats.total,
        viewed: stats.viewed,
        percentage: stats.total > 0 ? Math.round((stats.viewed / stats.total) * 100) : 0
      }));

      progress.sort((a, b) => b.percentage - a.percentage);

      setProgressData(progress);
      setTotalCards(totalCardsCount);
      setTotalViewed(totalViewedCount);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const overallPercentage = totalCards > 0 ? Math.round((totalViewed / totalCards) * 100) : 0;

  const getCategoryColor = (category: string, opacity = '500') => {
    const colors = {
      'HTML': `bg-red-${opacity}`,
      'CSS': `bg-blue-${opacity}`,
      'JavaScript': `bg-yellow-${opacity}`,
      'React': `bg-cyan-${opacity}`,
      'General': `bg-gray-${opacity}`,
    };
    return colors[category as keyof typeof colors] || colors.General;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3 mb-4 animate-scale-in animate-delay-100">
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <TrendingUp className="h-8 w-8 text-teal-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Learning Progress
            </h1>
          </div>
          <p className="text-lg text-gray-300 animate-fade-in-up animate-delay-200">
            Track your learning journey and achievements
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 animate-fade-in-left animate-delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Cards</p>
                <p className="text-3xl font-bold text-white">{totalCards}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 animate-fade-in-up animate-delay-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Cards Viewed</p>
                <p className="text-3xl font-bold text-white">{totalViewed}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Eye className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 animate-fade-in-right animate-delay-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Overall Progress</p>
                <p className="text-3xl font-bold text-white">{overallPercentage}%</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Target className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-teal-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${overallPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Progress */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 animate-fade-in-up animate-delay-600">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Progress by Category</h2>
          </div>

          {progressData.length > 0 ? (
            <div className="space-y-6">
              {progressData.map((item, index) => (
                <div 
                  key={item.category} 
                  className={`border-b border-gray-800 pb-6 last:border-b-0 last:pb-0 animate-fade-in-left animate-delay-${(index + 7) * 100}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${getCategoryColor(item.category)}`}></div>
                      <h3 className="text-lg font-semibold text-white">
                        {item.category}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        {item.percentage}%
                      </p>
                      <p className="text-sm text-gray-400">
                        {item.viewed} / {item.total} cards
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${getCategoryColor(item.category)}`}
                      style={{ 
                        width: `${item.percentage}%`,
                        transitionDelay: `${index * 200}ms`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="flex justify-center mb-4 animate-scale-in">
                <div className="p-4 bg-gray-800 rounded-2xl">
                  <BarChart3 className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 animate-fade-in-up animate-delay-100">
                No progress data yet
              </h3>
              <p className="text-gray-300 mb-6 animate-fade-in-up animate-delay-200">
                Create some flashcards and start studying to see your progress here!
              </p>
              <a
                href="/add-card"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 animate-fade-in-up animate-delay-300"
              >
                <span>Create Your First Flashcard</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}