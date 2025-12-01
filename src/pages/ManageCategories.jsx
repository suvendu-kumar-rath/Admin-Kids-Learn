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
      setError(null);
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
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response:', data);
      console.log('Type of data:', typeof data);
      console.log('Is data an array?', Array.isArray(data));
      console.log('Data keys:', Object.keys(data || {}));
      
      // Ensure data is an array - handle different response structures
      let categoriesArray = [];
      
      // Check all possible response structures
      if (Array.isArray(data)) {
        console.log('✅ Data is directly an array');
        categoriesArray = data;
      } else if (data && data.success && Array.isArray(data.data)) {
        console.log('✅ Found data in data.data array');
        categoriesArray = data.data;
      } else if (data && Array.isArray(data.categories)) {
        console.log('✅ Found data in data.categories array');
        categoriesArray = data.categories;
      } else if (data && Array.isArray(data.items)) {
        console.log('✅ Found data in data.items array');
        categoriesArray = data.items;
      } else if (data && data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
        console.log('⚠️ data.data is an object, not an array. Converting...');
        // If data.data is an object with category properties, extract them
        if (data.data.categories && Array.isArray(data.data.categories)) {
          categoriesArray = data.data.categories;
        } else {
          categoriesArray = [data.data];
        }
      } else if (data && typeof data === 'object' && data.success === false) {
        console.log('❌ API returned error response');
        throw new Error(data.message || 'Failed to fetch categories');
      } else if (data && typeof data === 'object') {
        console.log('⚠️ Data is a single object, wrapping in array');
        categoriesArray = [data];
      } else {
        console.log('❌ Unknown data structure');
      }
      
      console.log('Processed categories array:', categoriesArray);
      console.log('Categories count:', categoriesArray.length);
      
      if (categoriesArray.length > 0) {
        console.log('First category sample:', categoriesArray[0]);
      } else {
        console.warn('⚠️ Categories array is empty! Raw data was:', data);
      }
      
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
            console.log('=== MANUAL API TEST ===');
            console.log('Testing direct API call...');
            fetch('https://app.boldtribe.in/api/categories', { mode: 'cors' })
              .then(res => {
                console.log('Direct API response status:', res.status);
                console.log('Direct API response ok:', res.ok);
                return res.json();
              })
              .then(data => {
                console.log('Direct API data:', data);
                console.log('Data type:', typeof data);
                console.log('Is array?:', Array.isArray(data));
                if (data && typeof data === 'object') {
                  console.log('Data keys:', Object.keys(data));
                }
                alert('Check console for API response. Data received: ' + JSON.stringify(data).substring(0, 200));
              })
              .catch(err => {
                console.error('Direct API error:', err);
                alert('API Error: ' + err.message);
              });
          }}
        >
          🧪 Test API
        </button>
      </div>

      {loading && (
        <div className="loading-info">⏳ Loading categories...</div>
      )}

      {!loading && categories.length === 0 && !error && (
        <div className="debug-info">
          ℹ️ No categories found. Check console for API response details.
        </div>
      )}

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
        <div className="categories-column-list">
          {filteredCategories.map((category) => (
            <div key={category.id || category._id} className="category-row-item">
              <div className="category-row-content">
                <div className="category-icon-box">
                  {category.icon || '📂'}
                </div>
                
                <div className="category-info">
                  <h3 className="category-title">{category.name || category.title || 'Untitled Category'}</h3>
                  <p className="category-desc">{category.description || 'No description available'}</p>
                  
                  <div className="category-meta">
                    <span className="meta-item">
                      <span className="meta-icon">🆔</span>
                      <span>ID: {category.id || category._id || 'N/A'}</span>
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">📋</span>
                      <span>{category.itemCount || category.items?.length || 0} items</span>
                    </span>
                    {category.createdAt && (
                      <span className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                      </span>
                    )}
                    {category.status && (
                      <span className={`status-tag ${(category.status || 'active').toLowerCase()}`}>
                        {category.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="category-row-actions">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageCategories;