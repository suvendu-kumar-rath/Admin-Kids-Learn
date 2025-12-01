import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './EditCategory.css';

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
      const response = await fetch(API_ENDPOINTS.CATEGORY_BY_ID(id));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const category = await response.json();
      
      // Prefill form data
      setFormData({
        categoryName: category.name || category.title || '',
        itemName: category.itemName || '',
        description: category.description || ''
      });

      // Set existing image
      if (category.imageUrl || category.image) {
        setExistingImageUrl(category.imageUrl || category.image);
        setImagePreview(category.imageUrl || category.image);
      }

      // Set existing audio
      if (category.audioUrl || category.audio) {
        setExistingAudioUrl(category.audioUrl || category.audio);
        setAudioURL(category.audioUrl || category.audio);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching category details:', err);
      setError('Failed to load category details. Please try again.');
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
    
    // Simulate API update call
    setTimeout(() => {
      console.log('Updated Category Data:', {
        id,
        ...formData,
        imageFile: imageFile || 'existing image',
        audioBlob: audioBlob || 'existing audio'
      });
      
      alert('Category updated successfully!');
      setIsSubmitting(false);
      navigate('/customization/manage-categories');
    }, 1500);
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