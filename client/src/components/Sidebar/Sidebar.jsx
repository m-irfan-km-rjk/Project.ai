import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { FaLightbulb, FaFolder, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
    navigate('/login');
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h3>PROJECT.AI</h3>
        <FaLightbulb color="#f1c40f" />
      </div>
      <nav className={styles.nav}>
        <NavLink to="/generate" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          <FaLightbulb />
          <span>Generate idea</span>
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          <FaFolder />
          <span>My Projects</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          <FaUser />
          <span>Profile</span>
        </NavLink>
      </nav>
      <div className={styles.logout} onClick={handleLogout}>
        <span>Logout</span>
        <FaSignOutAlt />
      </div>
    </div>
  );
};

export default Sidebar;