import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./GenerateIdeaPage.module.css";
import axios from "axios"; // Import axios

// --- SVG Icons (no changes here) ---
const ArrowUpIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M12 4L4 12h5v6h6v-6h5L12 4z" /></svg>);
const LightbulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M12,2A7,7,0,0,0,5,9c0,2.38,1.19,4.47,3,5.74V17a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14.74c1.81-1.27,3-3.36,3-5.74A7,7,0,0,0,12,2ZM9,21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V20H9Z"/></svg>);
// ---

// --- AIResponse Component (no changes here) ---
const AIResponse = ({ ideas, onIdeaSelect, onRegenerate }) => {
    const getDifficultyClass = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case "hard":
                return styles.hard;
            case "medium":
                return styles.medium;
            case "easy":
                return styles.easy;
            default:
                return "";
        }
    };

    return (
        <div className={styles.ideasBox}>
            <h3>Here are some ideas. Click one to create a new project:</h3>
            <ul className={styles.ideaList}>
                {ideas.map((idea, index) => (
                    <li
                        key={index}
                        className={`${styles.ideaCard} ${getDifficultyClass(idea.difficulty)}`}
                        onClick={() => onIdeaSelect(idea)}
                    >
                        <h4 className={styles.ideaTitle}>{idea.title}</h4>
                        <p className={styles.ideaDescription}>{idea.description}</p>
                        <div className={styles.ideaDetails}>
                            <div className={styles.stack}>
                                <strong>Stack:</strong> {idea.stack.join(", ")}
                            </div>
                            <div className={styles.tags}>
                                {idea.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                            </div>
                        </div>
                    </li>
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
    const userName = "Alex"; // This can be replaced with actual user data later

    const showWelcomeMessage = ideas.length === 0 && !isLoading;

    // --- MODIFIED handleGenerate function ---
    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);

        try {
            // Make API call to your backend
            const response = await axios.post('http://localhost:3000/api/generate-ideas', { prompt });
            // The backend returns an object with a key, assuming it's "project_ideas"
            setIdeas(response.data.project_ideas); 
        } catch (error) {
            console.error("Error generating ideas:", error);
            // Optionally, show an error message to the user
            alert("Sorry, we couldn't generate ideas right now. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleIdeaSelect = (idea) => {
        const newProject = {
            id: Date.now(),
            title: idea.title,
            description: idea.description,
            status: "Pending",
            progress: 5,
            tags: idea.tags,
            // Include stack and other details if needed for the detail page
            stack: idea.stack 
        };
        // Store the selected idea to pass to the detail page
        sessionStorage.setItem('selectedProjectIdea', JSON.stringify(idea));
        sessionStorage.setItem('newProject', JSON.stringify(newProject));
        navigate('/projects');
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleGenerate();
    };

    const handleStartOver = () => {
        setIdeas([]);
        setPrompt("");
    };

    // --- Return statement (no changes here) ---
    return (
        <div className={styles.dashboard}>
            <Sidebar />
            <main className={styles.mainContent}>
                <div className={`${styles.chatContainer} ${showWelcomeMessage ? styles.centered : ''}`}>
                    {showWelcomeMessage && (
                         <div className={styles.welcomeContainer}>
                            <div className={styles.welcomeIcon}><LightbulbIcon /></div>
                            <h1>Hello, {userName}! Let's create a new project.</h1>
                            <p>Enter a prompt below to start generating ideas.</p>
                        </div>
                    )}

                    {isLoading && (
                         <div className={styles.loadingContainer}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                         </div>
                    )}
                    
                    {ideas.length > 0 && !isLoading && (
                        <div>
                            <AIResponse ideas={ideas} onIdeaSelect={handleIdeaSelect} onRegenerate={handleStartOver} />
                        </div>
                    )}
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