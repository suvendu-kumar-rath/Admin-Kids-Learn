import { useState } from 'react';
import './Students.css';

function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const students = [
    { id: 1, name: 'Emma Wilson', age: 8, grade: '3rd', courses: 5, progress: 85, status: 'active', avatar: '👧' },
    { id: 2, name: 'Oliver Brown', age: 9, grade: '4th', courses: 4, progress: 72, status: 'active', avatar: '👦' },
    { id: 3, name: 'Sophia Davis', age: 7, grade: '2nd', courses: 6, progress: 91, status: 'active', avatar: '👧' },
    { id: 4, name: 'Noah Martinez', age: 10, grade: '5th', courses: 3, progress: 68, status: 'active', avatar: '👦' },
    { id: 5, name: 'Ava Garcia', age: 8, grade: '3rd', courses: 5, progress: 88, status: 'inactive', avatar: '👧' },
    { id: 6, name: 'Liam Johnson', age: 9, grade: '4th', courses: 4, progress: 75, status: 'active', avatar: '👦' },
    { id: 7, name: 'Isabella Lee', age: 7, grade: '2nd', courses: 6, progress: 93, status: 'active', avatar: '👧' },
    { id: 8, name: 'Mason White', age: 10, grade: '5th', courses: 3, progress: 65, status: 'inactive', avatar: '👦' }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || student.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="students-page">
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>Manage and monitor student progress</p>
        </div>
        <button className="add-student-btn">
          <span>➕</span> Add New Student
        </button>
      </div>

      <div className="students-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search students by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${selectedFilter === 'active' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-btn ${selectedFilter === 'inactive' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('inactive')}
          >
            Inactive
          </button>
        </div>
      </div>

      <div className="students-grid">
        {filteredStudents.map(student => (
          <div key={student.id} className="student-card">
            <div className="student-header">
              <div className="student-avatar">{student.avatar}</div>
              <span className={`status-badge ${student.status}`}>
                {student.status}
              </span>
            </div>
            
            <div className="student-info">
              <h3>{student.name}</h3>
              <div className="student-details">
                <span>👤 Age: {student.age}</span>
                <span>📚 Grade: {student.grade}</span>
              </div>
            </div>

            <div className="student-stats">
              <div className="stat-item">
                <div className="stat-label">Courses</div>
                <div className="stat-value">{student.courses}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Progress</div>
                <div className="stat-value">{student.progress}%</div>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${student.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="student-actions">
              <button className="action-btn view">View Profile</button>
              <button className="action-btn edit">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Students;
