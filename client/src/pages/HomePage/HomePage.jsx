import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
// Make sure to add your background image to src/assets
import backgroundImage from '../../assets/Bg.jpeg';

const HomePage = () => {
  return (
    <div className={styles.homePage} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <header className={styles.header}>
            <h1>PROJECT.AI</h1>
            <Link to="/login" className={styles.signInButton}>Sign In</Link>
        </header>
        <main className={styles.mainContent}>
            <div className={styles.descriptionBox}>
                <p>
                    This project presents the development of an AI-powered React application
                    designed to assist users in generating, managing, and executing innovative
                    project ideas. The application provides intelligent project suggestions tailored to
                    user interests and outlines step-by-step implementation plans for each selected
                    idea. Users can choose to add projects they like to a personalized dashboard,
                    enabling them to track progress, visualize project status through interactive
                    components, and maintain an organized workflow.
                </p>
            </div>
        </main>
    </div>
  );
};

export default HomePage;