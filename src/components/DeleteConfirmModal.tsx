import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cardQuestion: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  cardQuestion, 
  loading 
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Delete Flashcard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-300 mb-4 animate-fade-in-up animate-delay-100">
            Are you sure you want to delete this flashcard? This action cannot be undone.
          </p>
          
          <div className="bg-gray-800 rounded-lg p-4 mb-6 animate-fade-in-up animate-delay-200">
            <p className="text-sm text-gray-400 mb-1">Question:</p>
            <p className="text-white font-medium">
              {cardQuestion.length > 100 ? `${cardQuestion.substring(0, 100)}...` : cardQuestion}
            </p>
          </div>

          <div className="flex items-center justify-end space-x-4 animate-fade-in-up animate-delay-300">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 text-gray-300 hover:text-white transition-colors duration-200 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <Trash2 className="h-5 w-5" />
              <span>{loading ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}