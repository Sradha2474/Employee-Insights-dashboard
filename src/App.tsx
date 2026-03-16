import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginScreen from './componets/login';
import ListPage from './componets/ListPage';
import ProtectedRoute from './componets/ProtectedRoute';
import DetailsPage from './componets/DetailsPage';
import AnalyticsPage from './componets/AnalyticsPage';
import './App.css';

function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/list" replace />;
  return <LoginScreen />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route
          path="/list"
          element={
            <ProtectedRoute>
              <ListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details/:id"
          element={
            <ProtectedRoute>
              <DetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/:id"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
