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

import React from "react";      
import { FaCodeBranch, FaArrowRight, FaAngleRight, FaCircleNotch } from "react-icons/fa";
import { BsListTask } from "react-icons/bs";
import styles from "./ProjectDetailPage.module.css";
// import Sidebar from "../../components/Sidebar/Sidebar"; // Uncomment if needed

// Reusable circular progress component
const CircularProgress = ({ percentage }) => {
  return (
    <div className={styles.progressContainer}>
      {/* You can bring back the SVG if you want a real circular progress bar */}
      <span className={styles.progressText}>{percentage}%</span>
    </div>
  );
};

const ProjectDetailPage = () => {
  const todoItems = [
    { icon: <BsListTask />, text: "Initial Commit" },
    { icon: <FaCodeBranch />, text: "Path Changed" },
    { icon: <FaArrowRight />, text: "Now" },
    { icon: <FaAngleRight />, text: "Next for exploration ..." },
    { icon: <FaCircleNotch />, text: "Final Step" },
  ];

  return (
    <div className={styles.dashboard}>
      {/* <Sidebar /> */} {/* Keep for navigation if needed */}
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Project Details</h2>
        </div>

        <div className={styles.contentGrid}>
          {/* Left column */}
          <div className={styles.leftColumn}>
            <div className={`${styles.card} ${styles.descriptionCard}`}>
              <h3>Description of the Project</h3>
              <p>
                A detailed description of the project goes here. It explains the goals,
                the technology stack, and the expected outcomes of this specific project.
              </p>
            </div>

            <div className={`${styles.card} ${styles.todoCard}`}>
              <h3>Steps to Complete the Project</h3>
              <ul className={styles.todoList}>
                {todoItems.map((item, index) => (
                  <li key={index}>
                    <div className={styles.todoIcon}>{item.icon}</div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column */}
          <div className={styles.rightColumn}>
            <div className={`${styles.card} ${styles.statusCard}`}>
              <h3>Status</h3>
              <CircularProgress percentage={77} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetailPage;
