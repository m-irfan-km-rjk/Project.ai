import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./MyProjectsPage.module.css";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import {useAuth} from "../../hooks/AuthContext";

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
                return styles.inprogress;
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
                    {/* FIX: Ensure tags exist before trying to map over them */}
                    {tags && tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
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

const MyProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const {userId} = useAuth();

    // This effect runs once when the component mounts to check for a new project
    useEffect(() => {
        axios.get("http://localhost:3000/api/user/projects/", {
            headers: {
                userid: userId,
            },
         })
            .then((response) => {
                setProjects(response.data.projects);
            })
            .catch((error) => {
                console.error("Error fetching projects:", error);
            });
    }, []);

    return (
        <div className={styles.dashboard}>
            <Sidebar />
            <main className={styles.mainContent}>
                <h2>Your Projects</h2>
                <div className={styles.projectsGrid}>
                    {projects.map((project,key) => (
                        <ProjectCard
                            key={key}
                            id={project._id}
                            title={project.title}
                            description={project.description}
                            status={project.status}
                            progress={project.progress}
                            // FIX: Provide a default empty array if tags are missing
                            tags={project.tags || []}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MyProjectsPage;