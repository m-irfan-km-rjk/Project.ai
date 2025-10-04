import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./GenerateIdeaPage.module.css";

// --- SVG Icons ---
const ArrowUpIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M12 4L4 12h5v6h6v-6h5L12 4z" /></svg>);
const LightbulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M12,2A7,7,0,0,0,5,9c0,2.38,1.19,4.47,3,5.74V17a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14.74c1.81-1.27,3-3.36,3-5.74A7,7,0,0,0,12,2ZM9,21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V20H9Z"/></svg>);
// ---

const AIResponse = ({ ideas, onIdeaSelect, onRegenerate }) => {
    return (
        <div className={styles.ideasBox}>
            <h3>Here are some ideas. Click one to create a new project:</h3>
            <ul className={styles.ideaList}>
                {ideas.map((idea, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                         <button
                            className={styles.ideaButton}
                            onClick={() => onIdeaSelect(idea.title)}
                        >
                            {idea.title}
                        </button>
                    </motion.li>
                ))}
            </ul>
            <button onClick={onRegenerate} className={styles.resetButton}>
                Start Over
            </button>
        </div>
    );
};

const GenerateIdeaPage = () => {
    const [prompt, setPrompt] = useState("");
    const [ideas, setIdeas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const userName = "Alex"; // Replace with actual user data

    const showWelcomeMessage = ideas.length === 0 && !isLoading;

    const handleGenerate = () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            const generatedIdeas = [
                { title: "A social media platform for pet owners." },
                { title: "A gamified personal finance app for students." },
                { title: "An AI-powered meal planning and grocery list generator." }
            ];
            setIdeas(generatedIdeas);
            setIsLoading(false);
        }, 2000);
    };

    const handleIdeaSelect = (ideaText) => {
        const newProject = {
            id: Date.now(), // Use a timestamp for a unique ID
            title: ideaText,
            description: "A newly generated AI project idea.",
            status: "Pending",
            progress: 5, // Start with a small amount of progress
        };
        // Store the new project in session storage to pass it to the projects page
        sessionStorage.setItem('newProject', JSON.stringify(newProject));
        // Navigate to the projects page
        navigate('/projects');
    };

    const handleKeyDown = (e) => { 
        if (e.key === "Enter") handleGenerate(); 
    };

    const handleStartOver = () => {
        setIdeas([]);
        setPrompt("");
    };

    return (
        <div className={styles.dashboard}>
            <Sidebar />
            <main className={styles.mainContent}>
                <div className={`${styles.chatContainer} ${showWelcomeMessage ? styles.centered : ''}`}>
                    <AnimatePresence>
                        {showWelcomeMessage && (
                             <motion.div
                                key="welcome"
                                className={styles.welcomeContainer}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className={styles.welcomeIcon}><LightbulbIcon /></div>
                                <h1>Hello, {userName}! Let's create a new project.</h1>
                                <p>Enter a prompt below to start generating ideas.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isLoading && (
                         <div className={styles.loadingContainer}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                         </div>
                    )}
                    
                    <AnimatePresence>
                        {ideas.length > 0 && !isLoading && (
                            <motion.div
                                key="ideas"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <AIResponse ideas={ideas} onIdeaSelect={handleIdeaSelect} onRegenerate={handleStartOver} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g., a project using React and a weather API"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerate}
                        className={styles.button}
                        disabled={isLoading || !prompt.trim()}
                        aria-label="Generate Ideas"
                    >
                        <ArrowUpIcon />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default GenerateIdeaPage;

