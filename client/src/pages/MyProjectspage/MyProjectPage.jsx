// import React from 'react';
// import Sidebar from '../../components/Sidebar/Sidebar';
// import styles from './MyProjectsPage.module.css';

// // This would be a separate component: src/components/ProjectCard/ProjectCard.js
// const ProjectCard = () => (
//     <div className={styles.projectCard}>
//         {/* Placeholder for project content */}
//     </div>
// );

// const MyProjectsPage = () => {
//     // Dummy data for projects
//     const projects = Array.from({ length: 7 });

//     return (
//         <div className={styles.dashboard}>
//             <Sidebar />
//             <main className={styles.mainContent}>
//                 <h2>Your projects...</h2>
//                 <div className={styles.projectsGrid}>
//                     {projects.map((_, index) => (
//                         <ProjectCard key={index} />
//                     ))}
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default MyProjectsPage;

import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./MyProjectsPage.module.css";

// Example ProjectCard component
const ProjectCard = ({ title, description, status }) => (
  <div className={styles.projectCard}>
    <h3>{title}</h3>
    <p>{description}</p>
    <span className={styles.status}>{status}</span>
  </div>
);

const MyProjectsPage = () => {
  // Dummy data for projects
  const projects = [
    { title: "AI Startup Idea", description: "Exploring AI tools for businesses.", status: "In Progress" },
    { title: "E-commerce Platform", description: "React + MongoDB store.", status: "Completed" },
    { title: "Blog CMS", description: "Custom CMS with Markdown support.", status: "In Review" },
    { title: "Fitness Tracker App", description: "Mobile-first health tracker.", status: "Pending" },
    { title: "Portfolio Website", description: "Personal showcase site.", status: "Completed" },
    { title: "Chatbot Assistant", description: "AI-powered chatbot.", status: "In Progress" },
    { title: "Social Media Dashboard", description: "Analytics for social media posts.", status: "In Planning" }
  ];

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h2>Your Projects</h2>
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              status={project.status}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyProjectsPage;
