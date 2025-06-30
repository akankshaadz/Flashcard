import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Flashcard from '../components/Flashcard';
import EditCardModal from '../components/EditCardModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { Search, Filter, CreditCard, BookOpen, Edit, CheckCircle, AlertCircle } from 'lucide-react';

interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  category: string;
  viewed_by: string[];
}

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<FlashcardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editMode, setEditMode] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<FlashcardData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadFlashcards();
  }, [currentUser]);

  useEffect(() => {
    filterCards();
  }, [flashcards, searchTerm, selectedCategory]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadFlashcards = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFlashcards(data || []);
    } catch (error) {
      console.error('Error loading flashcards:', error);
      showNotification('error', 'Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const filterCards = () => {
    let filtered = flashcards;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(card => card.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCards(filtered);
  };

  const handleCardView = async (cardId: string) => {
    if (!currentUser) return;

    try {
      // Get current card data
      const { data: currentCard, error: fetchError } = await supabase
        .from('flashcards')
        .select('viewed_by')
        .eq('id', cardId)
        .single();

      if (fetchError) throw fetchError;

      const currentViewedBy = currentCard.viewed_by || [];
      
      // Only update if user hasn't viewed this card yet
      if (!currentViewedBy.includes(currentUser.id)) {
        const { error } = await supabase
          .from('flashcards')
          .update({ 
            viewed_by: [...currentViewedBy, currentUser.id] 
          })
          .eq('id', cardId);

        if (error) throw error;

        // Update local state
        setFlashcards(prev =>
          prev.map(card =>
            card.id === cardId
              ? { ...card, viewed_by: [...currentViewedBy, currentUser.id] }
              : card
          )
        );
      }
    } catch (error) {
      console.error('Error updating card view:', error);
    }
  };

  const handleEditCard = (cardId: string) => {
    const card = flashcards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      setEditModalOpen(true);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    const card = flashcards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      setDeleteModalOpen(true);
    }
  };

  const handleSaveEdit = async (data: { question: string; answer: string; category: string }) => {
    if (!selectedCard || !currentUser) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('flashcards')
        .update({
          question: data.question,
          answer: data.answer,
          category: data.category
        })
        .eq('id', selectedCard.id)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      // Update local state
      setFlashcards(prev =>
        prev.map(card =>
          card.id === selectedCard.id
            ? { ...card, ...data }
            : card
        )
      );

      setEditModalOpen(false);
      setSelectedCard(null);
      showNotification('success', 'Flashcard updated successfully!');
    } catch (error) {
      console.error('Error updating flashcard:', error);
      showNotification('error', 'Failed to update flashcard');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCard || !currentUser) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', selectedCard.id)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      // Update local state
      setFlashcards(prev => prev.filter(card => card.id !== selectedCard.id));

      setDeleteModalOpen(false);
      setSelectedCard(null);
      showNotification('success', 'Flashcard deleted successfully!');
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      showNotification('error', 'Failed to delete flashcard');
    } finally {
      setActionLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(flashcards.map(card => card.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border flex items-center space-x-3 animate-fade-in ${
            notification.type === 'success' 
              ? 'bg-green-900/50 border-green-800' 
              : 'bg-red-900/50 border-red-800'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400" />
            )}
            <span className={`text-sm font-medium ${
              notification.type === 'success' 
                ? 'text-green-300' 
                : 'text-red-300'
            }`}>
              {notification.message}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3 mb-4 animate-scale-in animate-delay-100">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <CreditCard className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Your Flashcards
            </h1>
          </div>
          <p className="text-lg text-gray-300 animate-fade-in-up animate-delay-200">
            Study your collection of {flashcards.length} flashcards
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 mb-8 animate-fade-in-up animate-delay-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md animate-fade-in-left animate-delay-400">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search flashcards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white placeholder-gray-400 transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-3 animate-fade-in animate-delay-500">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Category:</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white transition-all duration-200"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Edit Mode Toggle */}
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 animate-fade-in-right animate-delay-600 ${
                editMode
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Edit className="h-4 w-4" />
              <span>{editMode ? 'Exit Edit' : 'Edit Mode'}</span>
            </button>
          </div>

          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-gray-800 animate-fade-in animate-delay-700">
            <p className="text-sm text-gray-400">
              Showing {filteredCards.length} of {flashcards.length} flashcards
              {searchTerm && (
                <span className="ml-1">matching "{searchTerm}"</span>
              )}
              {selectedCategory !== 'All' && (
                <span className="ml-1">in {selectedCategory}</span>
              )}
            </p>
          </div>
        </div>

        {/* Flashcards Grid */}
        {filteredCards.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card, index) => (
              <div 
                key={card.id} 
                className={`animate-fade-in-up animate-delay-${Math.min((index + 1) * 100, 600)}`}
              >
                <Flashcard
                  id={card.id}
                  question={card.question}
                  answer={card.answer}
                  category={card.category}
                  onView={handleCardView}
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                  isViewed={card.viewed_by?.includes(currentUser?.id || '')}
                  showActions={editMode}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="flex justify-center mb-6 animate-scale-in">
              <div className="p-4 bg-gray-800 rounded-2xl">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 animate-fade-in-up animate-delay-100">
              {flashcards.length === 0 ? 'No flashcards yet' : 'No matching flashcards'}
            </h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto animate-fade-in-up animate-delay-200">
              {flashcards.length === 0
                ? 'Create your first flashcard to start learning!'
                : 'Try adjusting your search terms or category filter.'}
            </p>
            {flashcards.length === 0 && (
              <a
                href="/add-card"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 animate-fade-in-up animate-delay-300"
              >
                <span>Create Your First Flashcard</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditCardModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCard(null);
        }}
        onSave={handleSaveEdit}
        card={selectedCard}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedCard(null);
        }}
        onConfirm={handleConfirmDelete}
        cardQuestion={selectedCard?.question || ''}
        loading={actionLoading}
      />
    </div>
  );
}