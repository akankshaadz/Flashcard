import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { question: string; answer: string; category: string }) => void;
  card: {
    id: string;
    question: string;
    answer: string;
    category: string;
  } | null;
  loading?: boolean;
}

export default function EditCardModal({ isOpen, onClose, onSave, card, loading }: EditCardModalProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');

  const categories = ['HTML', 'CSS', 'JavaScript', 'React', 'General'];

  useEffect(() => {
    if (card) {
      setQuestion(card.question);
      setAnswer(card.answer);
      setCategory(card.category);
    }
  }, [card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      onSave({ question: question.trim(), answer: answer.trim(), category });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Edit Flashcard</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="animate-fade-in-up animate-delay-100">
            <label htmlFor="edit-category" className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              id="edit-category"
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
            <label htmlFor="edit-question" className="block text-sm font-medium text-gray-300 mb-2">
              Question
            </label>
            <textarea
              id="edit-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white placeholder-gray-400 transition-all duration-200 resize-none"
              required
            />
          </div>

          <div className="animate-fade-in-right animate-delay-300">
            <label htmlFor="edit-answer" className="block text-sm font-medium text-gray-300 mb-2">
              Answer
            </label>
            <textarea
              id="edit-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer here..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white placeholder-gray-400 transition-all duration-200 resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 animate-fade-in-up animate-delay-400">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !question.trim() || !answer.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}