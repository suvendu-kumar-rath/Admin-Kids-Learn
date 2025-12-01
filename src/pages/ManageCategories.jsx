import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import './ManageCategories.css';

function ManageCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('Fetching categories from:', API_ENDPOINTS.CATEGORIES);
      
      let response;
      try {
        // Try authenticated request first
        response = await apiRequest(API_ENDPOINTS.CATEGORIES);
      } catch (authError) {
        console.log('Authenticated request failed, trying direct URL:', authError);
        // If authenticated request fails, try direct URL
        response = await fetch('https://app.boldtribe.in/api/categories', {
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
      }
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response:', data);
      console.log('Type of data:', typeof data);
      console.log('Is data an array?', Array.isArray(data));
      
      // Ensure data is an array
      let categoriesArray = [];
      if (Array.isArray(data)) {
        categoriesArray = data;
      } else if (data && Array.isArray(data.categories)) {
        categoriesArray = data.categories;
      } else if (data && Array.isArray(data.data)) {
        categoriesArray = data.data;
      } else if (data && Array.isArray(data.items)) {
        categoriesArray = data.items;
      } else if (data && typeof data === 'object') {
        // If it's a single object, wrap it in an array
        categoriesArray = [data];
      }
      
      console.log('Processed categories array:', categoriesArray);
      console.log('Categories count:', categoriesArray.length);
      
      setCategories(categoriesArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(`Failed to load categories: ${err.message}`);
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = Array.isArray(categories) ? categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleEdit = (categoryId) => {
    navigate(`/customization/edit-category/${categoryId}`);
  };

  const handleDelete = (categoryId) => {
    // TODO: Implement delete functionality
    if (window.confirm('Are you sure you want to delete this category?')) {
      console.log('Delete category:', categoryId);
    }
  };

  if (loading) {
    return (
      <div className="manage-categories-page">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate('/customization')}>
            ← Back
          </button>
          <div>
            <h1>Manage Categories</h1>
            <p>Loading categories...</p>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner">📚</div>
          <p>Fetching categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-categories-page">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate('/customization')}>
            ← Back
          </button>
          <div>
            <h1>Manage Categories</h1>
            <p>Error loading categories</p>
          </div>
        </div>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>{error}</h3>
          <button className="retry-button" onClick={fetchCategories}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-categories-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/customization')}>
          ← Back
        </button>
        <div>
          <h1>Manage Categories</h1>
          <p>View and manage all learning categories ({categories.length} total)</p>
        </div>
        <button className="add-new-button" onClick={() => navigate('/customization/add-category')}>
          ➕ Add New Category
        </button>
      </div>

      <div className="categories-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="refresh-button" onClick={fetchCategories}>
          🔄 Refresh
        </button>
        <button 
          className="test-api-button" 
          onClick={() => {
            console.log('Testing direct API call...');
            fetch('https://app.boldtribe.in/api/categories', { mode: 'cors' })
              .then(res => {
                console.log('Direct API response status:', res.status);
                return res.json();
              })
              .then(data => {
                console.log('Direct API data:', data);
                alert('Check console for API response');
              })
              .catch(err => {
                console.error('Direct API error:', err);
                alert('API Error: ' + err.message);
              });
          }}
        >
          🧪 Test API Direct
        </button>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="no-categories">
          <div className="no-categories-icon">📁</div>
          <h3>{searchTerm ? 'No categories found' : 'No categories available'}</h3>
          <p>{searchTerm ? 'Try adjusting your search terms' : 'Start by creating your first category'}</p>
          {!searchTerm && (
            <button className="create-first-button" onClick={() => navigate('/customization/add-category')}>
              ➕ Create First Category
            </button>
          )}
        </div>
      ) : (
        <div className="categories-table-container">
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Items Count</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id || category._id}>
                  <td>{category.id || category._id || 'N/A'}</td>
                  <td>
                    <div className="category-name">
                      <span className="category-icon">{category.icon || '📂'}</span>
                      {category.name || category.title || 'Untitled Category'}
                    </div>
                  </td>
                  <td>
                    <div className="description-cell">
                      {category.description || 'No description available'}
                    </div>
                  </td>
                  <td>
                    <span className="items-count">
                      {category.itemCount || category.items?.length || 0}
                    </span>
                  </td>
                  <td>
                    {category.createdAt ? 
                      new Date(category.createdAt).toLocaleDateString() : 
                      'Unknown'
                    }
                  </td>
                  <td>
                    <span className={`status-badge ${(category.status || 'active').toLowerCase()}`}>
                      {category.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn update-btn"
                        onClick={() => handleEdit(category.id || category._id)}
                        title="Update Category"
                      >
                        ✏️ Update
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(category.id || category._id)}
                        title="Delete Category"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageCategories;