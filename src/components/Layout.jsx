import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
