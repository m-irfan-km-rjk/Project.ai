import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import axios from 'axios';
import { useAuth } from '../../hooks/AuthContext';
// import backgroundImage from '../../assets/background.jpg';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUserId } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.post('https://projectai-morw.onrender.com/api/login', { username, password })
            .then(response => {
                if (response.data.success) {
                    setUserId(response.data.userId);
                    navigate('/generate');
                } else {
                    alert(response.data.message);
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                alert('An error occurred during login. Please try again.');
            });

        console.log({ username, password });
    };

    return (
        // <div className={styles.loginPage} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                <div className={styles.avatar}></div>
                <h2>LOGIN</h2>
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <label>Username</label>
                        <input type="text" placeholder="Enter Your Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input type="password" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
                <p className={styles.signupLink}>
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;