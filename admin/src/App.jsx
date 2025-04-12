import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import IdentitiesPage from "./pages/IdentitiesPage";
import DocumentsPage from "./pages/DocumentsPage";
import NFTsPage from "./pages/NFTsPage";
import BlockchainPage from "./pages/BlockchainPage";
import UsersPage from "./pages/UsersPage";
import ActivityPage from "./pages/ActivityPage";
import SettingsPage from "./pages/SettingsPage";
import TestFeaturesPage from "./pages/TestFeaturesPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/navigation/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="identities" element={<IdentitiesPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="nfts" element={<NFTsPage />} />
            <Route path="blockchain" element={<BlockchainPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="test" element={<TestFeaturesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
