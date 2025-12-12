import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Layout from "./Layout";

function App() {
  return (
    <Routes>
      {/* redirect root */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* login has no layout */}
      <Route path="/login" element={<Login />} />

      {/* protected layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
      </Route>
    </Routes>
  );
}

export default App;
