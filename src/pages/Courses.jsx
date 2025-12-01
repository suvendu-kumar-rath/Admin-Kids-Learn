import { useState } from 'react';
import './Courses.css';

function Courses() {
  const [view, setView] = useState('grid');

  const courses = [
    {
      id: 1,
      title: 'Math Adventures',
      category: 'Mathematics',
      level: 'Beginner',
      students: 234,
      lessons: 24,
      duration: '8 weeks',
      rating: 4.8,
      status: 'active',
      icon: '🔢'
    },
    {
      id: 2,
      title: 'Science Explorers',
      category: 'Science',
      level: 'Intermediate',
      students: 198,
      lessons: 30,
      duration: '10 weeks',
      rating: 4.7,
      status: 'active',
      icon: '🔬'
    },
    {
      id: 3,
      title: 'English Stories',
      category: 'Language',
      level: 'Beginner',
      students: 187,
      lessons: 20,
      duration: '6 weeks',
      rating: 4.9,
      status: 'active',
      icon: '📖'
    },
    {
      id: 4,
      title: 'Creative Arts',
      category: 'Art',
      level: 'All Levels',
      students: 156,
      lessons: 18,
      duration: '6 weeks',
      rating: 4.6,
      status: 'active',
      icon: '🎨'
    },
    {
      id: 5,
      title: 'Music & Rhythm',
      category: 'Music',
      level: 'Beginner',
      students: 143,
      lessons: 16,
      duration: '5 weeks',
      rating: 4.5,
      status: 'active',
      icon: '🎵'
    },
    {
      id: 6,
      title: 'Coding for Kids',
      category: 'Technology',
      level: 'Intermediate',
      students: 129,
      lessons: 22,
      duration: '8 weeks',
      rating: 4.8,
      status: 'draft',
      icon: '💻'
    }
  ];

  return (
    <div className="courses-page">
      <div className="page-header">
        <div>
          <h1>Courses</h1>
          <p>Manage and create learning courses</p>
        </div>
        <button className="add-course-btn">
          <span>➕</span> Create New Course
        </button>
      </div>

      <div className="courses-controls">
        <div className="search-filter-group">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search courses..." />
          </div>
          
          <select className="category-filter">
            <option value="all">All Categories</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
            <option value="language">Language</option>
            <option value="art">Art</option>
            <option value="music">Music</option>
            <option value="technology">Technology</option>
          </select>
        </div>

        <div className="view-toggle">
          <button 
            className={`view-btn ${view === 'grid' ? 'active' : ''}`}
            onClick={() => setView('grid')}
          >
            ⊞
          </button>
          <button 
            className={`view-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            ☰
          </button>
        </div>
      </div>

      <div className={`courses-${view}`}>
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <div className="course-icon">{course.icon}</div>
              <span className={`status-badge ${course.status}`}>
                {course.status}
              </span>
            </div>

            <div className="course-content">
              <h3>{course.title}</h3>
              <div className="course-meta">
                <span className="category-tag">{course.category}</span>
                <span className="level-tag">{course.level}</span>
              </div>

              <div className="course-stats">
                <div className="stat">
                  <span className="stat-icon">👥</span>
                  <span className="stat-text">{course.students} students</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">📚</span>
                  <span className="stat-text">{course.lessons} lessons</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">⏱️</span>
                  <span className="stat-text">{course.duration}</span>
                </div>
              </div>

              <div className="course-rating">
                <span className="stars">⭐ {course.rating}</span>
                <span className="rating-text">Rating</span>
              </div>
            </div>

            <div className="course-actions">
              <button className="action-btn primary">View Details</button>
              <button className="action-btn secondary">Edit Course</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
