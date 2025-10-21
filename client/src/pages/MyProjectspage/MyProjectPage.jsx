import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./MyProjectsPage.module.css";
import { FaArrowRight } from "react-icons/fa";

// Enhanced ProjectCard component
const ProjectCard = ({ id, title, description, status, progress, tags }) => {
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
                <div className={styles.tagsContainer}>
                    {/* UPDATED: Map over tags as objects, using tag.id for key and tag.name for text */}
                    {tags && tags.map(tag => (
                        <span key={tag.id} className={styles.tag}>{tag.name}</span>
                    ))}
                </div>
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

// UPDATED: Initial dummy data for projects now uses tag objects with IDs
const initialProjects = [
    { 
        id: 1, 
        title: "AI Startup Idea", 
        description: "Exploring AI tools for businesses.", 
        status: "Completed", 
        progress: 100, 
        tags: [
            { id: "t-10", name: "AI" }, 
            { id: "t-11", name: "Business" }, 
            { id: "t-12", name: "Startup" }
        ] 
    },
    { 
        id: 2, 
        title: "E-commerce Platform", 
        description: "React + MongoDB store.", 
        status: "Completed", 
        progress: 100, 
        tags: [
            { id: "t-13", name: "Web" }, 
            { id: "t-14", name: "E-commerce" }, 
            { id: "t-15", name: "React" }
        ] 
    },
    { 
        id: 3, 
        title: "Blog CMS", 
        description: "Custom CMS with Markdown support.", 
        status: "Pending", 
        progress: 90, 
        tags: [
            { id: "t-13", name: "Web" }, 
            { id: "t-16", name: "CMS" }, 
            { id: "t-17", name: "Content" }
        ] 
    },
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
                // The newProject from session storage now also has tags as objects
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
                            // Provide a default empty array if tags are missing
                            tags={project.tags || []}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MyProjectsPage;