// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./components/profile/Profile";
import ForYou from "./pages/ForYou";
import Header from "./components/Header/Header";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Header />
      <div className="app">
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/foryou" element={<ForYou />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
