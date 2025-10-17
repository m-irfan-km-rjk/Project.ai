import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './ProfilePage.module.css';
import { FaUserCircle, FaLock, FaProjectDiagram, FaSignOutAlt } from 'react-icons/fa';

const ProfilePage = () => {
    const navigate = useNavigate();
    
    // Dummy data
    const userData = {
        name: 'Alex Doe',
        email: 'alex.doe@example.com',
        projectCount: 7,
        profilePic: ''
    };

    const handleLogout = () => {
        console.log("User logged out");
        navigate('/login');
    };

    return (
        <div className={styles.dashboard}>
            <Sidebar />
            <main className={styles.mainContent}>
                <div className={styles.card}>
                    <div className={styles.profileHeader}>
                        {userData.profilePic ? (
                            <img src={userData.profilePic} alt="Profile" className={styles.avatar} />
                        ) : (
                            <FaUserCircle className={styles.avatarPlaceholder} />
                        )}
                        <h3>{userData.name}</h3>
                        <p>{userData.email}</p>
                    </div>
                    <div className={styles.profileStats}>
                        <div className={styles.statItem}>
                            <FaProjectDiagram />
                            <span>{userData.projectCount}</span>
                            <p>Projects</p>
                        </div>
                    </div>
                    {/* Link to change password page */}
                    <Link to="/change-password" className={styles.changePasswordLink}>
                        <FaLock /> Change Password
                    </Link>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;