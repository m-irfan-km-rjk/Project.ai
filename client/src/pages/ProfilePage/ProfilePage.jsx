import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './ProfilePage.module.css';
import { FaUserCircle, FaLock, FaProjectDiagram, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/AuthContext';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [userData, setUserData] = useState( null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`https://projectai-morw.onrender.com/api/users/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, []);

    if (!userData) {
        return <div>Loading...</div>;
    }

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