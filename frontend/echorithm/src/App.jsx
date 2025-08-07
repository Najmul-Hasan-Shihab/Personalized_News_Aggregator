import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./components/Auth/AuthPage";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;