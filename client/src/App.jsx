import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import GenerateIdeaPage from "./pages/GenerateIdeaPage/GenerateIdeaPage";
import MyProjectsPage from "./pages/MyProjectspage/MyProjectPage";
import ProjectDetailPage from "./pages/ProjectDetailPage/ProjectDetailPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage/ChangePasswordPage";
import './App.css';
import { AuthProvider } from "./hooks/AuthContext";

function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/generate" element={<GenerateIdeaPage />} />
      <Route path="/projects" element={<MyProjectsPage />} />
      {/* NOTE: This is a static route for now. You can change it to a dynamic 
        route like "/projects/:id" when you are fetching specific project data.
      */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/project/:projectid" element={<ProjectDetailPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="*" element={<h2>404: Page Not Found</h2>} />
    </Routes>
    </AuthProvider>
  );
}

export default App;