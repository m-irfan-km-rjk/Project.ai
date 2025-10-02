// import React, { useState } from 'react';
// import Sidebar from '../../components/Sidebar/Sidebar';
// import styles from './GenerateIdeaPage.module.css';
// import { FaArrowUp } from 'react-icons/fa';

// const GenerateIdeaPage = () => {
//     const [prompt, setPrompt] = useState('');
//     const [ideas, setIdeas] = useState([]); // Will hold the list of ideas
//     const [isLoading, setIsLoading] = useState(false);

//     const handleGenerate = () => {
//         if (!prompt) return;
//         setIsLoading(true);
//         // Simulate an API call
//         setTimeout(() => {
//             const generatedIdeas = [
//                 "1. Idea 1 - ........",
//                 "2. Idea 2 - ///////",
//                 "3. Idea 3 - '''''''",
//                 "4. Idea 4 - A social media platform for pets.",
//                 "5. Idea 5 - A gamified personal finance app."
//             ];
//             setIdeas(generatedIdeas);
//             setIsLoading(false);
//         }, 1500);
//     };

//     return (
//         <div className={styles.dashboard}>
//             <Sidebar />
//             <main className={styles.mainContent}>
//                 {ideas.length === 0 ? (
//                     <div className={styles.promptContainer}>
//                         <div className={styles.inputWrapper}>
//                             <input
//                                 type="text"
//                                 placeholder="Enter Your Idea..."
//                                 value={prompt}
//                                 onChange={(e) => setPrompt(e.target.value)}
//                                 onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
//                             />
//                             <button onClick={handleGenerate} disabled={isLoading}>
//                                 {isLoading ? '...' : <FaArrowUp />}
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className={styles.ideasContainer}>
//                         <h2>Entered Prompt: {prompt}</h2>
//                         <div className={styles.ideasBox}>
//                             <h3>List of Ideas to Select</h3>
//                             <ul>
//                                 {ideas.map((idea, index) => (
//                                     <li key={index}>{idea}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };

// export default GenerateIdeaPage;

import React, { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./GenerateIdeaPage.module.css";
import axios from "axios";

const GenerateIdeaPage = () => {
  const [prompt, setPrompt] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    axios.post('http://localhost:3000/api/generate-ideas', { prompt })
      .then(response => {
        setIdeas(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error generating ideas:', error);
        setIsLoading(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleGenerate();
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        {ideas.length === 0 ? (
          <div className={styles.promptContainer}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Enter your idea..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                aria-label="Generate Ideas"
              >
                {isLoading ? "..." : <FaArrowUp />}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.ideasContainer}>
            <h2>Entered Prompt: {prompt}</h2>
            <div className={styles.ideasBox}>
              <h3>List of Ideas to Select</h3>
              <ul>
                {ideas.map((idea, index) => (
                  <li key={index}>{idea.title}</li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setIdeas([]);
                  setPrompt("");
                }}
                className={styles.resetButton}
              >
                Generate Again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GenerateIdeaPage;
