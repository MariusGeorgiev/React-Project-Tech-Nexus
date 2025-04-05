import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Register from "./pages/auth/Register/Register";
import Login from "./pages/auth/Login/Login";
import AboutUs from "./pages/AboutUs/AboutUs";
import AddNew from "./pages/AddNew/AddNew";
import AllNews from "./pages/AllNews/AllNews";
import DetailsArticle from "./pages/DetailsArticle/DetailsArticle";
import EditArticle from "./pages/EditArticle/EditArticle";
import UsersStats from "./pages/UsersStats/UsersStats";


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
            <Route path="/add-new" element={<AddNew />} />
            <Route path="/all-news" element={<AllNews />} />
            <Route path="/details-article/:id" element={<DetailsArticle />} />
            <Route path="/edit-article/:id" element={<EditArticle />} />
            <Route path="/users-stats" element={<UsersStats />} />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;