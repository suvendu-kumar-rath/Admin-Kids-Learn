import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, getAuthToken } from '../config/api';
import './AddCategory.css';

function AddCategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoryName: '',
    itemName: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      
      setImageFile(file);
      setErrors(prev => ({ ...prev, image: '' }));
      
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
    setImagePreview(null);
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
        setErrors(prev => ({ ...prev, audio: '' }));
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrors(prev => ({ ...prev, audio: 'Could not access microphone. Please check permissions.' }));
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
    setAudioURL(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    }
    
    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }
    
    if (!imageFile) {
      newErrors.image = 'Please upload an image';
    }
    
    if (!audioBlob) {
      newErrors.audio = 'Please record a voice message';
    }
    
    setErrors(newErrors);
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
      
      // Add text fields (based on API response structure)
      formDataToSend.append('categoryName', formData.categoryName);
      formDataToSend.append('itemName', formData.itemName);
      formDataToSend.append('description', `${formData.itemName} picture and sound`);
      formDataToSend.append('isPublic', 'true');
      
      // Add image file
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      // Add audio file (voice recording)
      if (audioBlob) {
        formDataToSend.append('voice', audioBlob, 'recording.wav');
      }
      
      // Make API call
      const token = getAuthToken();
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Submitting to:', API_ENDPOINTS.CREATE_ITEM);
      console.log('With token:', token ? 'Yes' : 'No');
      
      let response;
      try {
        // Try proxy endpoint first
        response = await fetch(API_ENDPOINTS.CREATE_ITEM, {
          method: 'POST',
          headers,
          body: formDataToSend,
        });
      } catch (proxyError) {
        console.log('Proxy failed, trying direct URL:', proxyError);
        // If proxy fails, try direct URL
        response = await fetch('https://app.boldtribe.in/api/items/create', {
          method: 'POST',
          mode: 'cors',
          headers,
          body: formDataToSend,
        });
      }
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Item created successfully:', result);
      
      // Check if the response indicates success
      if (result.success) {
        const itemData = result.data;
        
        // Show detailed success message
        alert(`Learning item "${itemData.itemName}" created successfully in category "${itemData.category?.name}"!\n\nItem ID: ${itemData.id}\nCategory: ${itemData.category?.name}\nImage: ${itemData.imageUrl ? 'Uploaded' : 'None'}\nVoice: ${itemData.voiceUrl ? 'Uploaded' : 'None'}`);
        
        // Reset form
        setFormData({ categoryName: '', itemName: '' });
        setImageFile(null);
        setImagePreview(null);
        setAudioBlob(null);
        setAudioURL(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Navigate back to customization after a short delay
        setTimeout(() => {
          navigate('/customization');
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to create learning item');
      }
      navigate('/customization');
      
    } catch (error) {
      console.error('Error creating category:', error);
      alert(`Failed to create category: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-category-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/customization')}>
          ← Back
        </button>
        <div>
          <h1>Add New Category</h1>
          <p>Create a new learning category with items and media</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="add-category-form">
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
              className={errors.categoryName ? 'error' : ''}
            />
            {errors.categoryName && <span className="error-text">{errors.categoryName}</span>}
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
              className={errors.itemName ? 'error' : ''}
            />
            {errors.itemName && <span className="error-text">{errors.itemName}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>Upload Photo</h2>
          
          <div className="upload-area">
            {!imagePreview ? (
              <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                <div className="upload-icon">📷</div>
                <div className="upload-text">Click to upload image</div>
                <div className="upload-hint">PNG, JPG up to 5MB</div>
              </div>
            ) : (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="remove-button"
                  onClick={handleRemoveImage}
                >
                  ✕
                </button>
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
          {errors.image && <span className="error-text">{errors.image}</span>}
        </div>

        <div className="form-section">
          <h2>Record Voice</h2>
          
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
                  Click to record pronunciation for this item
                </div>
              </div>
            ) : (
              <div className="audio-player">
                <audio controls src={audioURL} />
                <button
                  type="button"
                  className="remove-audio-button"
                  onClick={handleRemoveAudio}
                >
                  🗑️ Remove Recording
                </button>
              </div>
            )}
          </div>
          {errors.audio && <span className="error-text">{errors.audio}</span>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/customization')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : '✓ Post Category'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategory;
