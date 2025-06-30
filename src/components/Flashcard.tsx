import React, { useState } from 'react';
import { Eye, RotateCcw, Edit, Trash2 } from 'lucide-react';

interface FlashcardProps {
  id: string;
  question: string;
  answer: string;
  category: string;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isViewed?: boolean;
  showActions?: boolean;
}

export default function Flashcard({ 
  id, 
  question, 
  answer, 
  category, 
  onView, 
  onEdit,
  onDelete,
  isViewed,
  showActions = false 
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && !isViewed) {
      onView(id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'HTML': 'bg-red-500/20 text-red-400',
      'CSS': 'bg-blue-500/20 text-blue-400',
      'JavaScript': 'bg-yellow-500/20 text-yellow-400',
      'React': 'bg-cyan-500/20 text-cyan-400',
      'General': 'bg-gray-500/20 text-gray-400',
    };
    return colors[category as keyof typeof colors] || colors.General;
  };

  return (
    <div className="flashcard-container h-64 w-full perspective-1000">
      <div
        className={`flashcard-inner relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div className="flashcard-face flashcard-front absolute inset-0 w-full h-full backface-hidden bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
              {category}
            </span>
            <div className="flex items-center space-x-2">
              {isViewed && (
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">Viewed</span>
                </div>
              )}
              {showActions && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleEdit}
                    className="p-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    title="Edit flashcard"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
                    title="Delete flashcard"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <p className="text-lg font-medium text-white text-center leading-relaxed">
              {question}
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <RotateCcw className="h-4 w-4" />
              <span className="font-medium">Click to reveal answer</span>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="flashcard-face flashcard-back absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-purple-500 to-teal-500 rounded-xl shadow-lg p-6 flex flex-col justify-between text-white">
          <div className="flex justify-between items-start">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
              Answer
            </span>
            <RotateCcw className="h-5 w-5 opacity-75" />
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <p className="text-lg font-medium text-center leading-relaxed">
              {answer}
            </p>
          </div>
          
          <div className="text-center">
            <span className="text-sm opacity-75 font-medium">Click to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}