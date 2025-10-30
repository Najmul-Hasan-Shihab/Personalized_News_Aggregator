// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./components/Auth/AuthPage";
import Profile from "./components/profile/Profile";
import ForYou from "./pages/ForYou";
import SearchResults from "./pages/SearchResults";
import Header from "./components/Header/Header";

import "./App.css";

const App = () => {
  return (
    <Router>
      <Header />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/foryou" element={<ForYou />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
