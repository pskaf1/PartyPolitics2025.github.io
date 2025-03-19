import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  let timeoutId = null; // This will be used to delay hiding the menu

  // ✅ Show dropdown when hovering
  const handleMouseEnter = () => {
    clearTimeout(timeoutId); // Prevent menu from hiding immediately
    setDropdownVisible(true);
  };

  // ✅ Delay hiding the dropdown to allow time to click
  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setDropdownVisible(false);
    }, 300); // 300ms delay before hiding
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">WDC</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/debate-topics">Debate Topics</Link></li>
          <li><button onClick={() => navigate("/debate-room/123")} className="nav-button">Debate Room</button></li>

          {/* Profile Dropdown */}
          <li
            className="profile-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <i className="fas fa-user-circle profile-icon"></i>
            {dropdownVisible && (
              <div className="dropdown-menu" ref={dropdownRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
