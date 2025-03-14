import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage"; // new
import CreatePage from "./pages/CreatePage"; // new
import DashboardPage from "./pages/DashboardPage"; // new
import ProfilePage from "./pages/ProfilePage"; // new
import TestPage from "./pages/TestPage";

import "./index.css";

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="create" element={<CreatePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="test" element={<TestPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
