// import React from 'react';
// import Sidebar from '../../components/Sidebar/Sidebar';
// import styles from './ProjectDetailPage.module.css';
// import { FaCodeBranch, FaArrowRight, FaAngleRight, FaCircleNotch } from 'react-icons/fa';
// import { BsListTask } from 'react-icons/bs';

// // This could be a reusable component
// const CircularProgress = ({ percentage }) => {
//     const sqSize = 120;
//     const strokeWidth = 10;
//     const radius = (sqSize - strokeWidth) / 2;
//     const viewBox = `0 0 ${sqSize} ${sqSize}`;
//     const dashArray = radius * Math.PI * 2;
//     const dashOffset = dashArray - (dashArray * percentage) / 100;

//     return (
//         <div className={styles.progressContainer}>
//             {/* <svg width={sqSize} height={sqSize} viewBox={viewBox}>
//                 <circle
//                     className={styles.circleBackground}
//                     cx={sqSize / 2}
//                     cy={sqSize / 2}
//                     r={radius}
//                     strokeWidth={`${strokeWidth}px`}
//                 />
//                 <circle
//                     className={styles.circleProgress}
//                     cx={sqSize / 2}
//                     cy={sqSize / 2}
//                     r={radius}
//                     strokeWidth={`${strokeWidth}px`}
//                     transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
//                     style={{
//                         strokeDasharray: dashArray,
//                         strokeDashoffset: dashOffset,
//                     }}
//                 />
//             </svg> */}
//             <span className={styles.progressText}>{percentage}%</span>
//         </div>
//     );
// };

// const ProjectDetailPage = () => {
//     const todoItems = [
//         { icon: <BsListTask />, text: 'Initial Commit' },
//         { icon: <FaCodeBranch />, text: 'Path Changed' },
//         { icon: <FaArrowRight />, text: 'Now' },
//         { icon: <FaAngleRight />, text: 'Next for exploration ...' },
//         { icon: <FaCircleNotch />, text: 'Final Step' },
//     ];

//     return (
//         <div className={styles.dashboard}>
//             {/* The sidebar isn't in the design, but likely needed for navigation */}
//             {/* <Sidebar /> */}
//             <main className={styles.mainContent}>
//                 <div className={styles.header}>
//                     <h2>Project Details</h2>
//                 </div>
//                 <div className={styles.contentGrid}>
//                     <div className={styles.leftColumn}>
//                         <div className={`${styles.card} ${styles.descriptionCard}`}>
//                             <h3>Description Of the project</h3>
//                             <p>
//                                 A detailed description of the project goes here. It explains the goals,
//                                 the technology stack, and the expected outcomes of this specific project.
//                             </p>
//                         </div>
//                         <div className={`${styles.card} ${styles.todoCard}`}>
//                             <h3>A To-do List of the steps to be completed to finish the project</h3>
//                             <ul className={styles.todoList}>
//                                 {todoItems.map((item, index) => (
//                                     <li key={index}>
//                                         <div className={styles.todoIcon}>{item.icon}</div>
//                                         <span>{item.text}</span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>
//                     <div className={styles.rightColumn}>
//                          <div className={`${styles.card} ${styles.statusCard}`}>
//                             <h3>Status</h3>
//                             <CircularProgress percentage={77} />
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default ProjectDetailPage;

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaCodeBranch, FaArrowRight, FaAngleRight, FaCircleNotch, FaArrowLeft,
    FaRegLightbulb, FaTools, FaBullseye // New icons
} from "react-icons/fa";
import { BsListTask } from "react-icons/bs";
import styles from "./ProjectDetailPage.module.css";

// CircularProgress component remains the same
const CircularProgress = ({ percentage }) => {
    const sqSize = 120;
    const strokeWidth = 10;
    const radius = (sqSize - strokeWidth) / 2;
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * percentage) / 100;

    return (
        <div className={styles.progressContainer}>
            <svg width={sqSize} height={sqSize} viewBox={viewBox}>
                <circle
                    className={styles.circleBackground}
                    cx={sqSize / 2}
                    cy={sqSize / 2}
                    r={radius}
                    strokeWidth={`${strokeWidth}px`}
                />
                <circle
                    className={styles.circleProgress}
                    cx={sqSize / 2}
                    cy={sqSize / 2}
                    r={radius}
                    strokeWidth={`${strokeWidth}px`}
                    transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
                    style={{
                        strokeDasharray: dashArray,
                        strokeDashoffset: dashOffset,
                    }}
                />
            </svg>
            <span className={styles.progressText}>{Math.round(percentage)}%</span>
        </div>
    );
};


const ProjectDetailPage = () => {
    const navigate = useNavigate();

    const initialTodos = [
        { id: 1, icon: <BsListTask />, text: "Initial Commit", completed: true },
        { id: 2, icon: <FaCodeBranch />, text: "Path Changed", completed: true },
        { id: 3, icon: <FaArrowRight />, text: "Now", completed: true },
        { id: 4, icon: <FaAngleRight />, text: "Next for exploration ...", completed: false },
        { id: 5, icon: <FaCircleNotch />, text: "Final Step", completed: false },
    ];

    const [todoItems, setTodoItems] = useState(initialTodos);

    const handleTodoToggle = (id) => {
        setTodoItems(
            todoItems.map((item) =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    };

    const completionPercentage = useMemo(() => {
        const completedCount = todoItems.filter((item) => item.completed).length;
        return (completedCount / todoItems.length) * 100;
    }, [todoItems]);


    return (
        <div className={styles.dashboard}>
            <main className={styles.mainContent}>
                <div className={styles.header}>
                    <button onClick={() => navigate(-1)} className={styles.backButton}>
                        <FaArrowLeft />
                    </button>
                    <h2>Project Details</h2>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.leftColumn}>
                        {/* Enhanced Description Card */}
                        <div className={`${styles.card} ${styles.descriptionCard}`}>
                            <div className={styles.descriptionSection}>
                                <div className={styles.sectionHeader}>
                                    <FaRegLightbulb className={styles.sectionIcon} />
                                    <h3>Project Description</h3>
                                </div>
                                <p>
                                    A detailed description of the project goes here. It explains the purpose,
                                    target audience, and the core functionalities of the application.
                                </p>
                            </div>
                            <div className={styles.descriptionSection}>
                                <div className={styles.sectionHeader}>
                                    <FaTools className={styles.sectionIcon} />
                                    <h3>Technology Stack</h3>
                                </div>
                                <div className={styles.techStack}>
                                    <span>React</span>
                                    <span>Node.js</span>
                                    <span>MongoDB</span>
                                    <span>CSS Modules</span>
                                </div>
                            </div>
                            <div className={styles.descriptionSection}>
                                <div className={styles.sectionHeader}>
                                    <FaBullseye className={styles.sectionIcon} />
                                    <h3>Project Goals</h3>
                                </div>
                                <ul className={styles.goalsList}>
                                    <li>Develop a responsive and intuitive user interface.</li>
                                    <li>Ensure seamless data flow between front-end and back-end.</li>
                                    <li>Implement robust user authentication and authorization.</li>
                                </ul>
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.todoCard}`}>
                            <h3>Steps to Complete the Project</h3>
                            <ul className={styles.todoList}>
                                {todoItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className={`${styles.todoItem} ${item.completed ? styles.completed : ''}`}
                                        onClick={() => handleTodoToggle(item.id)}
                                    >
                                        <div className={styles.todoCheckbox}>
                                            {item.completed && <span>&#10003;</span>}
                                        </div>
                                        <div className={styles.todoIcon}>{item.icon}</div>
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={`${styles.card} ${styles.statusCard}`}>
                            <h3>Status</h3>
                            <CircularProgress percentage={completionPercentage} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetailPage;