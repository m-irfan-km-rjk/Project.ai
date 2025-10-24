import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './ChangePasswordPage.module.css';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from "../../hooks/AuthContext";

const ChangePasswordPage = () => {
    const { userId } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        axios.put(`https://projectai-morw.onrender.com/api/users/${userId}/change-password`, {
            oldPassword : currentPassword,
            newPassword
        })
        .then(response => {
            alert('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        })
        .catch(error => {
            alert('Error changing password: ' + error.response.data.message);
        });
        
    };

    return (
        <div className={styles.dashboard}>
            <Sidebar />
            <main className={styles.mainContent}>
                <div className={styles.card}>
                    <Link to="/profile" className={styles.backLink}>
                        <FaArrowLeft /> Back to Profile
                    </Link>
                    <h2 className={styles.cardTitle}><FaLock /> Change Your Password</h2>
                    <form onSubmit={handlePasswordChange}>
                        <div className={styles.formGroup}>
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                        <button type="submit" className={styles.updateButton}>Update Password</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ChangePasswordPage;