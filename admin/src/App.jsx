import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/DashboardPage";
import Identities from "./pages/IdentitiesPage";
// import Documents from "./pages/Documents";
// import NFTs from "./pages/NFTs";
// import Blockchain from "./pages/Blockchain";
// import Users from "./pages/Users";
// import Activity from "./pages/Activity";
// import Settings from "./pages/Settings";
import TestFeatures from "./pages/TestFeaturesPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="identities" element={<Identities />} />
          {/* <Route path="documents" element={<Documents />} />
          <Route path="nfts" element={<NFTs />} />
          <Route path="blockchain" element={<Blockchain />} />
          <Route path="users" element={<Users />} />
          <Route path="activity" element={<Activity />} />
          <Route path="settings" element={<Settings />} /> */}
          <Route path="test" element={<TestFeatures />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
