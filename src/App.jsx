import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Customization from './pages/Customization';
import AddCategory from './pages/AddCategory';
import ManageCategories from './pages/ManageCategories';
import EditCategory from './pages/EditCategory';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/customization" replace />} />
                    <Route path="/customization" element={<Customization />} />
                    <Route path="/customization/add-category" element={<AddCategory />} />
                    <Route path="/customization/manage-categories" element={<ManageCategories />} />
                    <Route path="/customization/edit-category/:id" element={<EditCategory />} />
                    <Route path="*" element={<Navigate to="/customization" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
