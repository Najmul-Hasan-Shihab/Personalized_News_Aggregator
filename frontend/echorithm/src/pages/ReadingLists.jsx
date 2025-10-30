import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard/NewsCard';
import { 
  fetchReadingLists, 
  createReadingList, 
  deleteReadingList,
  addToReadingList,
  removeFromReadingList 
} from '../services/api';
import './ReadingLists.css';

const ReadingLists = () => {
  const [readingLists, setReadingLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadReadingLists();
  }, []);

  const loadReadingLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchReadingLists();
      setReadingLists(data.reading_lists || []);
      
      // Select the first list by default if available
      if (data.reading_lists && data.reading_lists.length > 0 && !selectedList) {
        setSelectedList(data.reading_lists[0]);
      }
    } catch (err) {
      console.error('Error loading reading lists:', err);
      setError('Failed to load reading lists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    
    if (!newListName.trim()) {
      alert('Please enter a list name');
      return;
    }

    setCreating(true);
    try {
      const newList = await createReadingList(newListName.trim(), newListDescription.trim());
      setReadingLists(prev => [...prev, newList.reading_list]);
      setSelectedList(newList.reading_list);
      setShowCreateModal(false);
      setNewListName('');
      setNewListDescription('');
    } catch (err) {
      console.error('Error creating reading list:', err);
      alert(err.response?.data?.message || 'Failed to create reading list');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteList = async (listName) => {
    if (!window.confirm(`Are you sure you want to delete "${listName}"?`)) {
      return;
    }

    try {
      await deleteReadingList(listName);
      setReadingLists(prev => prev.filter(list => list.list_name !== listName));
      
      // If deleted list was selected, select another one
      if (selectedList?.list_name === listName) {
        const remainingLists = readingLists.filter(list => list.list_name !== listName);
        setSelectedList(remainingLists.length > 0 ? remainingLists[0] : null);
      }
    } catch (err) {
      console.error('Error deleting reading list:', err);
      alert(err.response?.data?.message || 'Failed to delete reading list');
    }
  };

  const handleRemoveFromList = async (articleUrl) => {
    if (!selectedList) return;

    try {
      await removeFromReadingList(selectedList.list_name, articleUrl);
      
      // Update local state
      setSelectedList(prev => ({
        ...prev,
        articles: prev.articles.filter(article => article.article_url !== articleUrl)
      }));
      
      // Update in reading lists array
      setReadingLists(prev => prev.map(list => 
        list.list_name === selectedList.list_name
          ? { ...list, articles: list.articles.filter(a => a.article_url !== articleUrl) }
          : list
      ));
    } catch (err) {
      console.error('Error removing article from list:', err);
      alert(err.response?.data?.message || 'Failed to remove article');
    }
  };

  if (loading) {
    return (
      <div className="reading-lists-page">
        <div className="page-header">
          <h1 className="page-title">📖 Reading Lists</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your reading lists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reading-lists-page">
        <div className="page-header">
          <h1 className="page-title">📖 Reading Lists</h1>
        </div>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={loadReadingLists}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reading-lists-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">📖 Reading Lists</h1>
          <p className="page-subtitle">
            Organize your saved articles into custom collections
          </p>
        </div>
        <button 
          className="create-list-btn"
          onClick={() => setShowCreateModal(true)}
        >
          ➕ Create New List
        </button>
      </div>

      <div className="reading-lists-container">
        {/* Sidebar - List of reading lists */}
        <aside className="lists-sidebar">
          <h2 className="sidebar-title">Your Lists ({readingLists.length})</h2>
          
          {readingLists.length === 0 ? (
            <div className="no-lists">
              <p>No reading lists yet</p>
              <p className="hint">Create your first list to get started!</p>
            </div>
          ) : (
            <ul className="lists-menu">
              {readingLists.map(list => (
                <li 
                  key={list.list_name}
                  className={`list-item ${selectedList?.list_name === list.list_name ? 'active' : ''}`}
                  onClick={() => setSelectedList(list)}
                >
                  <div className="list-info">
                    <h3 className="list-name">{list.list_name}</h3>
                    {list.description && (
                      <p className="list-description">{list.description}</p>
                    )}
                    <p className="list-count">
                      {list.articles?.length || 0} {list.articles?.length === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                  <button 
                    className="delete-list-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list.list_name);
                    }}
                    title="Delete list"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Main content - Articles in selected list */}
        <main className="list-content">
          {!selectedList ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h2>Select a reading list</h2>
              <p>Choose a list from the sidebar to view its articles</p>
            </div>
          ) : (
            <>
              <div className="list-header">
                <div>
                  <h2 className="content-title">{selectedList.list_name}</h2>
                  {selectedList.description && (
                    <p className="content-description">{selectedList.description}</p>
                  )}
                </div>
                <p className="article-count">
                  {selectedList.articles?.length || 0} {selectedList.articles?.length === 1 ? 'article' : 'articles'}
                </p>
              </div>

              {(!selectedList.articles || selectedList.articles.length === 0) ? (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <h2>No articles in this list</h2>
                  <p>Add articles to "{selectedList.list_name}" from your bookmarks or news feed</p>
                </div>
              ) : (
                <div className="articles-grid">
                  {selectedList.articles.map(article => (
                    <div key={article.article_url} className="article-wrapper">
                      <NewsCard
                        article={{
                          title: article.title,
                          summary: article.summary,
                          url: article.article_url,
                          source: article.source,
                          author: article.author,
                          image_url: article.image_url,
                          published_at: article.published_at,
                          category: article.category,
                          sentiment: article.sentiment,
                        }}
                      />
                      <button
                        className="remove-article-btn"
                        onClick={() => handleRemoveFromList(article.article_url)}
                        title="Remove from this list"
                      >
                        ❌ Remove from list
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Reading List</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateList} className="create-form">
              <div className="form-group">
                <label htmlFor="list-name">List Name *</label>
                <input
                  id="list-name"
                  type="text"
                  className="form-input"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g., Tech News, Weekend Reads"
                  maxLength={100}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="list-description">Description (Optional)</label>
                <textarea
                  id="list-description"
                  className="form-textarea"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Brief description of this reading list..."
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={creating || !newListName.trim()}
                >
                  {creating ? 'Creating...' : 'Create List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingLists;
