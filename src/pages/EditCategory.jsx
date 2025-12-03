import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ENDPOINTS, getAuthToken } from '../config/api';
import './EditCategory.css';

// Normalize API responses so we consistently get { category, item }
const resolveItemResponse = (apiResult, itemId) => {
  const idString = String(itemId);
  const root = apiResult?.data ?? apiResult;

  let category = root?.category ?? root?.data?.category ?? null;
  let item = root?.item ?? root?.data?.item ?? null;

  const pickItem = (items) => {
    if (!Array.isArray(items)) return null;
    return items.find((it) => String(it.id) === idString) || items[0] || null;
  };

  if (!item && Array.isArray(root?.items)) {
    item = pickItem(root.items);
  }

  if (!item && category && Array.isArray(category.items)) {
    item = pickItem(category.items);
  }

  if (!category && item?.category) {
    category = item.category;
  }

  // If everything else fails, treat root as the item (legacy responses)
  if (!item && root && typeof root === 'object') {
    item = root;
  }

  return { category, item };
};

function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    itemName: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [existingAudioUrl, setExistingAudioUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchCategoryDetails();
    }
  }, [id]);

  const fetchCategoryDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching category with ID:', id);
      console.log('API endpoint:', API_ENDPOINTS.CATEGORY_BY_ID(id));
      
      const token = getAuthToken();
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      let response;
      try {
        // Try with proxy/base URL first (items/:id)
        response = await fetch(API_ENDPOINTS.CATEGORY_BY_ID(id), { headers });
      } catch (proxyError) {
        console.log('Proxy failed, trying direct URL for item:', proxyError);
        // If proxy fails, try direct URL for item
        response = await fetch(`https://app.boldtribe.in/api/categories/${id}`, {
          mode: 'cors',
          headers
        });
      }
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Raw API response:', result);
      
      // Normalize response so we always work with category + item
      const { category: categoryData, item: itemData } = resolveItemResponse(result, id);
      
      if (!itemData) {
        throw new Error('No item data found in API response');
      }
      
      console.log('Resolved category data:', categoryData);
      console.log('Resolved item data:', itemData);
      
      // Prefill form data
      setFormData({
        categoryName: categoryData?.name || itemData.category?.name || itemData.name || itemData.title || '',
        itemName: itemData.itemName || itemData.name || '',
        description: itemData.description || ''
      });

      // Set existing image - handle full URL or path
      if (itemData.imageUrl || itemData.image) {
        const imageUrl = itemData.imageUrl || itemData.image;
        const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://app.boldtribe.in${imageUrl}`;
        setExistingImageUrl(fullImageUrl);
        setImagePreview(fullImageUrl);
      }

      // Set existing audio/voice - handle full URL or path
      if (itemData.voiceUrl || itemData.audioUrl || itemData.audio || itemData.voice) {
        const audioUrl = itemData.voiceUrl || itemData.audioUrl || itemData.audio || itemData.voice;
        const fullAudioUrl = audioUrl.startsWith('http') ? audioUrl : `https://app.boldtribe.in${audioUrl}`;
        setExistingAudioUrl(fullAudioUrl);
        setAudioURL(fullAudioUrl);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching category details:', err);
      setError(`Failed to load category details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setFormErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      
      setImageFile(file);
      setFormErrors(prev => ({ ...prev, image: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(existingImageUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioURL(audioUrl);
        setFormErrors(prev => ({ ...prev, audio: '' }));
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setFormErrors(prev => ({ ...prev, audio: 'Could not access microphone. Please check permissions.' }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRemoveAudio = () => {
    setAudioBlob(null);
    setAudioURL(existingAudioUrl || null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    }
    
    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('categoryName', formData.categoryName);
      formDataToSend.append('itemName', formData.itemName);
      formDataToSend.append('description', formData.description || `${formData.itemName} picture and sound`);
      formDataToSend.append('isPublic', 'true');
      
      // Add new image file if uploaded
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      // Add new audio file if recorded
      if (audioBlob) {
        formDataToSend.append('voice', audioBlob, 'recording.wav');
      }
      
      console.log('Updating item/category with ID:', id);
      
      const token = getAuthToken();
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Use items/:id endpoint for updating
      let response;
      try {
        // Try via configured base URL first
        response = await fetch(API_ENDPOINTS.ITEM_BY_ID(id), {
          method: 'PUT',
          headers,
          body: formDataToSend,
        });
      } catch (proxyError) {
        console.log('Proxy/base URL PUT failed, trying direct URL for item:', proxyError);
        response = await fetch(`https://app.boldtribe.in/api/items/${id}`, {
          method: 'PUT',
          mode: 'cors',
          headers,
          body: formDataToSend,
        });
      }
      
      console.log('Update response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Item/category updated successfully:', result);
      
      alert(`Item "${formData.itemName}" updated successfully!`);
      navigate('/customization/manage-categories');
    } catch (err) {
      console.error('Error updating category:', err);
      alert(`Failed to update category: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-category-page">
        <div className="loading-container">
          <div className="loading-spinner">📚</div>
          <p>Loading category details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-category-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>{error}</h3>
          <button className="retry-button" onClick={fetchCategoryDetails}>
            🔄 Retry
          </button>
          <button className="back-button" onClick={() => navigate('/customization/manage-categories')}>
            ← Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-category-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/customization/manage-categories')}>
          ← Back
        </button>
        <div>
          <h1>Edit Category</h1>
          <p>Update category details and media</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="edit-category-form">
        <div className="form-section">
          <h2>Category Details</h2>
          
          <div className="form-group">
            <label htmlFor="categoryName">
              Category Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleInputChange}
              placeholder="e.g., Animals, Colors, Numbers"
              className={formErrors.categoryName ? 'error' : ''}
            />
            {formErrors.categoryName && <span className="error-text">{formErrors.categoryName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="itemName">
              Item Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              placeholder="e.g., Lion, Red, Number One"
              className={formErrors.itemName ? 'error' : ''}
            />
            {formErrors.itemName && <span className="error-text">{formErrors.itemName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description for this category"
              rows="3"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Update Photo</h2>
          
          <div className="upload-area">
            {!imagePreview ? (
              <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                <div className="upload-icon">📷</div>
                <div className="upload-text">Click to upload new image</div>
                <div className="upload-hint">PNG, JPG up to 5MB</div>
              </div>
            ) : (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <div className="image-overlay">
                  {imageFile && <span className="new-badge">New</span>}
                  <button
                    type="button"
                    className="change-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📷 Change
                  </button>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={handleRemoveImage}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
          {formErrors.image && <span className="error-text">{formErrors.image}</span>}
        </div>

        <div className="form-section">
          <h2>Update Voice Recording</h2>
          
          <div className="recording-area">
            {!audioURL ? (
              <div className="recording-controls">
                {!isRecording ? (
                  <button
                    type="button"
                    className="record-button"
                    onClick={startRecording}
                  >
                    <span className="record-icon">🎤</span>
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="record-button recording"
                    onClick={stopRecording}
                  >
                    <span className="record-icon pulse">⏺️</span>
                    <span>Stop Recording</span>
                  </button>
                )}
                <div className="recording-hint">
                  Click to record new pronunciation for this item
                </div>
              </div>
            ) : (
              <div className="audio-player">
                <audio controls src={audioURL} />
                <div className="audio-controls">
                  {audioBlob && <span className="new-badge">New Recording</span>}
                  <button
                    type="button"
                    className="record-new-button"
                    onClick={() => setAudioURL(null)}
                  >
                    🎤 Record New
                  </button>
                  <button
                    type="button"
                    className="remove-audio-button"
                    onClick={handleRemoveAudio}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            )}
          </div>
          {formErrors.audio && <span className="error-text">{formErrors.audio}</span>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/customization/manage-categories')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : '✓ Update Category'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCategory;