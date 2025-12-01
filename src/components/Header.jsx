import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={toggleSidebar}>
          <span className="menu-icon">☰</span>
        </button>
      </div>
      
      <div className="header-right">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search..." />
        </div>
        
        <button className="notification-button">
          <span className="notification-icon">🔔</span>
          <span className="notification-badge">3</span>
        </button>
        
        <div className="user-profile">
          <div className="avatar">👨‍💼</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'Admin User'}</div>
            <div className="user-role">{user?.role || 'Administrator'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
