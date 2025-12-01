import './Dashboard.css';

function Dashboard() {
  const stats = [
    { icon: '👥', label: 'Total Students', value: '1,234', change: '+12%', color: 'blue' },
    { icon: '📚', label: 'Active Courses', value: '48', change: '+5%', color: 'purple' },
    { icon: '✅', label: 'Completed Lessons', value: '3,456', change: '+18%', color: 'green' },
    { icon: '⭐', label: 'Average Rating', value: '4.8', change: '+0.3', color: 'orange' }
  ];

  const recentActivities = [
    { id: 1, student: 'Emma Wilson', action: 'Completed', course: 'Math Basics', time: '2 mins ago' },
    { id: 2, student: 'Oliver Brown', action: 'Started', course: 'Science Fun', time: '15 mins ago' },
    { id: 3, student: 'Sophia Davis', action: 'Achieved', course: 'English Reading', time: '1 hour ago' },
    { id: 4, student: 'Noah Martinez', action: 'Completed', course: 'Art & Craft', time: '2 hours ago' },
    { id: 5, student: 'Ava Garcia', action: 'Started', course: 'Music Basics', time: '3 hours ago' }
  ];

  const topCourses = [
    { name: 'Math Adventures', students: 234, completion: 85, trend: 'up' },
    { name: 'Science Explorers', students: 198, completion: 78, trend: 'up' },
    { name: 'English Stories', students: 187, completion: 92, trend: 'up' },
    { name: 'Creative Arts', students: 156, completion: 88, trend: 'down' },
    { name: 'Music & Rhythm', students: 143, completion: 75, trend: 'up' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your learning platform.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-change">{stat.change} from last month</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card recent-activities">
          <div className="card-header">
            <h2>Recent Activities</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">👤</div>
                <div className="activity-content">
                  <div className="activity-title">
                    <strong>{activity.student}</strong> {activity.action.toLowerCase()} <span>{activity.course}</span>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card top-courses">
          <div className="card-header">
            <h2>Top Courses</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="courses-list">
            {topCourses.map((course, index) => (
              <div key={index} className="course-item">
                <div className="course-info">
                  <div className="course-name">{course.name}</div>
                  <div className="course-stats">
                    <span className="student-count">👥 {course.students} students</span>
                    <span className={`trend ${course.trend}`}>
                      {course.trend === 'up' ? '↗' : '↘'}
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${course.completion}%` }}
                  ></div>
                </div>
                <div className="completion-text">{course.completion}% completed</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">➕</span>
            <span className="action-label">Add Student</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📝</span>
            <span className="action-label">Create Course</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span className="action-label">View Reports</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">💬</span>
            <span className="action-label">Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
