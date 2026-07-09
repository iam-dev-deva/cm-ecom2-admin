import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { getStoredUser, logout } from '../../utils/auth';
import ChangePasswordModal from '../modals/ChangePasswordModal';



export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [showMenu, setShowMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="navbar">
        <button className="hamburger" aria-label="Toggle sidebar" onClick={() => onToggleSidebar && onToggleSidebar()}>
          <FaBars />
        </button>

        <div className="navbar-brand">
          <span className="navbar-title">ARUDRA Admin</span>
          {user?.UserName && (
            <span className="navbar-user">
              Welcome to ARUDRA Admin Panel
            </span>
          )}
        </div>

        <div className="profile-menu" ref={menuRef}>
          <FaUserCircle
            className="profile-icon"
            onClick={() => setShowMenu(!showMenu)}
          />

          {showMenu && (
            <div className="profile-dropdown">
              <div className="dropdown-user">
                {user?.UserName}
              </div>

              <button onClick={() => {
                setShowPasswordModal(true);
                setShowMenu(false);
              }}>
                Change Password
              </button>

              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}