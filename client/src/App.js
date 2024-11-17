import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PostsList from './components/PostsList';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import './App.css'; // Importing the custom styles

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header Section */}
        <header className="app-header">
          <h1>Instagram-like Post Management</h1>
        </header>

        {/* Navigation Bar */}
        <nav className="app-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/create" className="nav-link">Create Post</Link>
        </nav>

        {/* Routes for different components */}
        <div className="content-container">
          <Routes>
            <Route path="/" element={<PostsList />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
