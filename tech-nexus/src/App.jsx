import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Register from "./pages/auth/Register/Register";
import Login from "./pages/auth/Login/Login";
import AboutUs from "./pages/AboutUs/AboutUs";


const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;