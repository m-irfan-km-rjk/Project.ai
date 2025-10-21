import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./GenerateIdeaPage.module.css";

// --- SVG Icons ---
const ArrowUpIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M12 4L4 12h5v6h6v-6h5L12 4z" /></svg>);
const LightbulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M12,2A7,7,0,0,0,5,9c0,2.38,1.19,4.47,3,5.74V17a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14.74c1.81-1.27,3-3.36,3-5.74A7,7,0,0,0,12,2ZM9,21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V20H9Z"/></svg>);
// ---

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
                {ideas.map((idea) => (
                    <li
                        key={idea.id} // Use idea.id for the key
                        className={`${styles.ideaCard} ${getDifficultyClass(idea.difficulty)}`}
                        onClick={() => onIdeaSelect(idea)}
                    >
                        <h4 className={styles.ideaTitle}>{idea.title}</h4>
                        <p className={styles.ideaDescription}>{idea.description}</p>
                        <div className={styles.ideaDetails}>
                            <div className={styles.stack}>
                                <strong>Stack:</strong> 
                                {/* Map over stack objects to get names */}
                                {idea.stack.map(s => s.name).join(", ")}
                            </div>
                            <div className={styles.tags}>
                                {/* Map over tag objects */}
                                {idea.tags.map(tag => (
                                    <span key={tag.id} className={styles.tag}>{tag.name}</span>
                                ))}
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
    const userName = "Alex"; // Replace with actual user data

    const showWelcomeMessage = ideas.length === 0 && !isLoading;

    const handleGenerate = () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            // UPDATED: Added 'id' to ideas and structured 'stack' and 'tags' as objects with 'id'
            const generatedIdeas = [
                {
                    id: "idea-1", // Unique ID for the idea
                    title: "PetConnect",
                    description: "A social network for pet owners to share photos, stories, and arrange playdates.",
                    difficulty: "Hard",
                    stack: [
                        { id: "s-1", name: "React" },
                        { id: "s-2", name: "Node.js" },
                        { id: "s-3", name: "MongoDB" },
                        { id: "s-4", name: "Socket.io" }
                    ],
                    tags: [
                        { id: "t-1", name: "Social" },
                        { id: "t-2", name: "Pets" },
                        { id: "t-3", name: "Real-time" }
                    ]
                },
                {
                    id: "idea-2",
                    title: "Finance Whiz",
                    description: "A mobile app that helps students track their spending and save money with gamified challenges.",
                    difficulty: "Medium",
                    stack: [
                        { id: "s-5", name: "React Native" },
                        { id: "s-6", name: "Firebase" },
                        { id: "s-7", name: "Chart.js" }
                    ],
                    tags: [
                        { id: "t-4", name: "Finance" },
                        { id: "t-5", name: "Education" },
                        { id: "t-6", name: "Mobile" }
                    ]
                },
                {
                    id: "idea-3",
                    title: "MealMate AI",
                    description: "An intelligent meal planner that suggests recipes and automatically generates a grocery list based on your dietary preferences.",
                    difficulty: "Easy",
                    stack: [
                        { id: "s-1", name: "React" },
                        { id: "s-8", name: "Next.js" },
                        { id: "s-9", name: "Edamam API" }
                    ],
                    tags: [
                        { id: "t-7", name: "AI" },
                        { id: "t-8", name: "Health" },
                        { id: "t-9", name: "Food" }
                    ]
                }
            ];
            setIdeas(generatedIdeas);
            setIsLoading(false);
        }, 2000);
    };

    const handleIdeaSelect = (idea) => {
        const newProject = {
            id: Date.now(), // Use a timestamp or wait for backend ID
            title: idea.title,
            description: idea.description,
            status: "Pending",
            progress: 5,
            tags: idea.tags, // Pass the array of tag objects
        };
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