import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth(); // Access user and logout from AuthContext

  const showDropdown = () => {
    setDropdownVisible(true);
  };

  const hideDropdown = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.matches(':hover')) {
        setDropdownVisible(false);
      }
    }, 200); // Delay to improve hover experience
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">OTN</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/debate-topics">Debate Topics</Link></li>
          <li><Link to="/debate-room">Debate Room</Link></li>
          <li 
            className="profile-dropdown"
            onMouseEnter={showDropdown}
            onMouseLeave={hideDropdown}
          >
            <i className="fas fa-user-circle profile-icon"></i>
            {dropdownVisible && (
              <div className="dropdown-menu" ref={dropdownRef}>
                {user ? (
                  <>
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                    <button onClick={logout} className="dropdown-item">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/sign-up" className="dropdown-item">Sign Up</Link>
                    <Link to="/login" className="dropdown-item">Log In</Link>
                  </>
                )}
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
