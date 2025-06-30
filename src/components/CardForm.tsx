import React, { useState } from 'react';
import { Plus, Save } from 'lucide-react';

interface CardFormProps {
  onSubmit: (data: { question: string; answer: string; category: string }) => void;
  loading?: boolean;
}

export default function CardForm({ onSubmit, loading }: CardFormProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');

  const categories = ['HTML', 'CSS', 'JavaScript', 'React', 'General'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      onSubmit({ question: question.trim(), answer: answer.trim(), category });
      setQuestion('');
      setAnswer('');
      setCategory('General');
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6">
      <div className="flex items-center space-x-3 mb-6 animate-fade-in-left">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Plus className="h-6 w-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Create New Flashcard</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="animate-fade-in-up animate-delay-100">
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white transition-all duration-200"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="animate-fade-in-left animate-delay-200">
          <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">
            Question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question here..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white placeholder-gray-400 transition-all duration-200 resize-none"
            required
          />
        </div>

        <div className="animate-fade-in-right animate-delay-300">
          <label htmlFor="answer" className="block text-sm font-medium text-gray-300 mb-2">
            Answer
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the answer here..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white placeholder-gray-400 transition-all duration-200 resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !question.trim() || !answer.trim()}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 animate-fade-in-up animate-delay-400"
        >
          <Save className="h-5 w-5" />
          <span>{loading ? 'Creating...' : 'Create Flashcard'}</span>
        </button>
      </form>
    </div>
  );
}