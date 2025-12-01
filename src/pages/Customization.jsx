import { useNavigate } from 'react-router-dom';
import './Customization.css';

function Customization() {
  const navigate = useNavigate();

  const customizationOptions = [
    {
      id: 1,
      title: 'Add Category',
      description: 'Create new learning categories with items, images, and voice recordings',
      icon: '📁',
      action: '/customization/add-category',
      color: 'blue'
    },
    {
      id: 2,
      title: 'Manage Categories',
      description: 'View, edit, and organize existing categories',
      icon: '📂',
      action: '/customization/manage-categories',
      color: 'purple'
    }
  ];

  const handleOptionClick = (action) => {
    navigate(action);
  };

  return (
    <div className="customization-page">
      <div className="page-header">
        <div>
          <h1>Customization</h1>
          <p>Customize and manage your learning content</p>
        </div>
      </div>

      <div className="customization-grid">
        {customizationOptions.map((option) => (
          <div
            key={option.id}
            className={`customization-card ${option.color}`}
            onClick={() => handleOptionClick(option.action)}
          >
            <div className="card-icon">{option.icon}</div>
            <div className="card-content">
              <h3>{option.title}</h3>
              <p>{option.description}</p>
            </div>
            <div className="card-arrow">→</div>
          </div>
        ))}
      </div>

      <div className="quick-stats">
        <h2>Content Overview</h2>
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-number">12</div>
            <div className="stat-label">Total Categories</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">248</div>
            <div className="stat-label">Learning Items</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">356</div>
            <div className="stat-label">Images Uploaded</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">248</div>
            <div className="stat-label">Voice Recordings</div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">➕</span>
            <div className="activity-details">
              <div className="activity-title">New category "Animals" added</div>
              <div className="activity-time">2 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">✏️</span>
            <div className="activity-details">
              <div className="activity-title">Updated "Numbers" category</div>
              <div className="activity-time">5 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🎤</span>
            <div className="activity-details">
              <div className="activity-title">Added voice recording to "Colors"</div>
              <div className="activity-time">1 day ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customization;
