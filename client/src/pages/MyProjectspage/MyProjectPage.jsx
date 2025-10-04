import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./MyProjectsPage.module.css";
import { FaArrowRight } from "react-icons/fa";

// Enhanced ProjectCard component
const ProjectCard = ({ id, title, description, status, progress }) => {
    // Determine status color based on status text
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return styles.completed;
            case "pending":
                return styles.pending;
            default:
                return styles.pending;
        }
    };

    return (
        <Link to={`/project/${id}`} className={styles.projectCardLink}>
            <div className={styles.projectCard}>
                <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{title}</h3>
                    <span className={`${styles.statusBadge} ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </div>
                <p className={styles.cardDescription}>{description}</p>
                <div className={styles.cardFooter}>
                    <div className={styles.progressBarContainer}>
                        <div
                            className={styles.progressBar}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className={styles.progressText}>{progress}%</span>
                </div>
                <div className={styles.viewDetails}>
                    View Details <FaArrowRight />
                </div>
            </div>
        </Link>
    );
};

// Initial dummy data for projects
const initialProjects = [
    { id: 1, title: "AI Startup Idea", description: "Exploring AI tools for businesses.", status: "Completed", progress: 100 },
    { id: 2, title: "E-commerce Platform", description: "React + MongoDB store.", status: "Completed", progress: 100 },
    { id: 3, title: "Blog CMS", description: "Custom CMS with Markdown support.", status: "Pending", progress: 90 },
];

const MyProjectsPage = () => {
    const [projects, setProjects] = useState(initialProjects);

    // This effect runs once when the component mounts to check for a new project
    useEffect(() => {
        const newProjectJSON = sessionStorage.getItem('newProject');
        if (newProjectJSON) {
            const newProject = JSON.parse(newProjectJSON);
            
            // Add the new project to the state, checking for duplicates
            setProjects(prevProjects => {
                if (prevProjects.some(p => p.id === newProject.id)) {
                    return prevProjects; // Avoid adding duplicates
                }
                return [newProject, ...prevProjects]; // Add new project to the top of the list
            });

            // Clean up session storage so the project isn't added again on refresh
            sessionStorage.removeItem('newProject');
        }
    }, []);

    return (
        <div className={styles.dashboard}>
            <Sidebar />
            <main className={styles.mainContent}>
                <h2>Your Projects</h2>
                <div className={styles.projectsGrid}>
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            title={project.title}
                            description={project.description}
                            status={project.status}
                            progress={project.progress}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MyProjectsPage;

