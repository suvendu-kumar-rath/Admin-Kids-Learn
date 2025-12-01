import './Analytics.css';

function Analytics() {
  const monthlyData = [
    { month: 'Jan', students: 45, courses: 12, revenue: 4500 },
    { month: 'Feb', students: 52, courses: 14, revenue: 5200 },
    { month: 'Mar', students: 61, courses: 16, revenue: 6100 },
    { month: 'Apr', students: 58, courses: 15, revenue: 5800 },
    { month: 'May', students: 70, courses: 18, revenue: 7000 },
    { month: 'Jun', students: 78, courses: 20, revenue: 7800 }
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.students));

  const performanceMetrics = [
    { category: 'Mathematics', completion: 88, satisfaction: 4.7, students: 234 },
    { category: 'Science', completion: 82, satisfaction: 4.5, students: 198 },
    { category: 'Language', completion: 92, satisfaction: 4.9, students: 187 },
    { category: 'Art', completion: 85, satisfaction: 4.6, students: 156 },
    { category: 'Music', completion: 78, satisfaction: 4.4, students: 143 }
  ];

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Track performance and insights</p>
        </div>
        <button className="export-btn">
          <span>📊</span> Export Report
        </button>
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <div className="summary-icon blue">📈</div>
          <div className="summary-content">
            <div className="summary-label">Total Revenue</div>
            <div className="summary-value">$36,400</div>
            <div className="summary-change positive">+15.3% this month</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon green">✅</div>
          <div className="summary-content">
            <div className="summary-label">Completion Rate</div>
            <div className="summary-value">85%</div>
            <div className="summary-change positive">+5.2% this month</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon purple">⭐</div>
          <div className="summary-content">
            <div className="summary-label">Avg. Satisfaction</div>
            <div className="summary-value">4.7/5</div>
            <div className="summary-change positive">+0.3 this month</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">🎯</div>
          <div className="summary-content">
            <div className="summary-label">Active Students</div>
            <div className="summary-value">364</div>
            <div className="summary-change positive">+28 this month</div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <div className="card-header">
            <h2>Student Growth</h2>
            <select className="time-filter">
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>
          
          <div className="bar-chart">
            {monthlyData.map((data, index) => (
              <div key={index} className="bar-group">
                <div className="bar-container">
                  <div 
                    className="bar"
                    style={{ height: `${(data.students / maxValue) * 100}%` }}
                  >
                    <span className="bar-value">{data.students}</span>
                  </div>
                </div>
                <div className="bar-label">{data.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h2>Course Performance</h2>
          </div>
          
          <div className="performance-list">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="performance-item">
                <div className="performance-header">
                  <div className="category-name">{metric.category}</div>
                  <div className="student-count">👥 {metric.students}</div>
                </div>
                
                <div className="metric-row">
                  <div className="metric-label">Completion Rate</div>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill completion"
                      style={{ width: `${metric.completion}%` }}
                    ></div>
                  </div>
                  <div className="metric-value">{metric.completion}%</div>
                </div>
                
                <div className="metric-row">
                  <div className="metric-label">Satisfaction</div>
                  <div className="stars-rating">
                    {'⭐'.repeat(Math.floor(metric.satisfaction))}
                  </div>
                  <div className="metric-value">{metric.satisfaction}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h2>Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📚</div>
            <div className="insight-content">
              <h3>Top Performing Course</h3>
              <p>English Stories has the highest completion rate at 92%</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🚀</div>
            <div className="insight-content">
              <h3>Fastest Growing</h3>
              <p>Mathematics enrollment increased by 28% this month</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">💡</div>
            <div className="insight-content">
              <h3>Improvement Opportunity</h3>
              <p>Music courses could benefit from additional interactive content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
