import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import CardForm from '../components/CardForm';
import { CheckCircle, Plus } from 'lucide-react';

export default function AddCard() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (data: { question: string; answer: string; category: string }) => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('flashcards')
        .insert([
          {
            user_id: currentUser.id,
            question: data.question,
            answer: data.answer,
            category: data.category,
            viewed_by: []
          }
        ]);

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding flashcard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3 mb-4 animate-scale-in animate-delay-100">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Plus className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Add New Flashcard
            </h1>
          </div>
          <p className="text-lg text-gray-300 animate-fade-in-up animate-delay-200">
            Create a new flashcard to expand your knowledge
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-800 rounded-lg flex items-center space-x-3 animate-fade-in">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-sm text-green-300 font-medium">
              Flashcard created successfully!
            </span>
          </div>
        )}

        {/* Form */}
        <div className="animate-fade-in-up animate-delay-300">
          <CardForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 animate-slide-in-up animate-delay-400">
          <h3 className="text-lg font-semibold text-white mb-4">
            Tips for creating effective flashcards:
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start space-x-2 animate-fade-in-left animate-delay-500">
              <span className="block w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Keep questions concise and specific</span>
            </li>
            <li className="flex items-start space-x-2 animate-fade-in-left animate-delay-600">
              <span className="block w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Use clear, memorable answers</span>
            </li>
            <li className="flex items-start space-x-2 animate-fade-in-left animate-delay-700">
              <span className="block w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Organize cards by relevant categories</span>
            </li>
            <li className="flex items-start space-x-2 animate-fade-in-left animate-delay-800">
              <span className="block w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Focus on one concept per flashcard</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}