import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft, FaRegLightbulb, FaTools, FaBullseye, FaListUl,
    FaChevronDown, FaChevronUp, FaCloudUploadAlt
} from "react-icons/fa";
import styles from "./ProjectDetailPage.module.css";
import axios from "axios";
import { useAuth } from "../../hooks/AuthContext";
import { v4 as uuidv4 } from "uuid";

const CircularProgress = ({ percentage }) => {
    const sqSize = 120;
    const strokeWidth = 10;
    const radius = (sqSize - strokeWidth) / 2;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * percentage) / 100;

    return (
        <div className={styles.progressContainer}>
            <svg width={sqSize} height={sqSize} viewBox={`0 0 ${sqSize} ${sqSize}`}>
                <circle className={styles.circleBackground} cx={sqSize / 2} cy={sqSize / 2} r={radius} strokeWidth={strokeWidth} />
                <circle
                    className={styles.circleProgress}
                    cx={sqSize / 2}
                    cy={sqSize / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
                    style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }}
                />
            </svg>
            <span className={styles.progressText}>{Math.round(percentage)}%</span>
        </div>
    );
};

const ProjectDetailPage = () => {
    const { projectid } = useParams();
    const navigate = useNavigate();
    const { userId } = useAuth();

    const [projectData, setProjectData] = useState(null);
    const [todoItems, setTodoItems] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]); // 👈 local image state
    const [isUploading, setIsUploading] = useState(false); // upload loading state

    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/projects/${projectid}`, {
                    headers: { userid: userId },
                });
                setProjectData(response.data.project);
                const stepsWithIds = response.data.project.steps.map((step) => ({
                    ...step,
                    id: step.id || uuidv4(),
                }));
                setTodoItems(stepsWithIds);
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };
        fetchProject();
    }, [projectid, userId]);

    const completionPercentage = useMemo(() => {
        if (todoItems.length === 0) return 0;
        const completed = todoItems.filter((i) => i.completed).length;
        return (completed / todoItems.length) * 100;
    }, [todoItems]);

    const handleTodoToggle = async (id) => {
        const updated = todoItems.map((i) =>
            i.id === id ? { ...i, completed: !i.completed } : i
        );
        setTodoItems(updated);
        const completedCount = updated.filter((i) => i.completed).length;
        const progress = (completedCount / updated.length) * 100;

        try {
            await axios.put(`http://localhost:3000/api/projects/${projectid}/steps/update`, {
                steps: updated.map((i) => ({
                    step_number: i.step_number,
                    step_title: i.step_title,
                    implementation_details: i.implementation_details,
                    completed: i.completed,
                    resources: i.resources || [],
                })),
                progress,
            });
        } catch (error) {
            console.error("Failed to update progress:", error);
        }
    };

    // 👇 Handle image selection
    // 👇 Handle image selection with max limit
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Determine remaining slots
        const existingCount = projectData?.images?.length || 0;
        const remainingSlots = 5 - existingCount;

        if (files.length > remainingSlots) {
            alert(`You can only upload ${remainingSlots} more image(s).`);
            setSelectedImages(files.slice(0, remainingSlots));
        } else {
            setSelectedImages(files);
        }
    };


    // 👇 Upload to backend (Cloudinary)
    const handleImageUpload = async () => {
        if (selectedImages.length === 0) return alert("No images selected!");
        setIsUploading(true);

        const formData = new FormData();
        selectedImages.forEach((img) => formData.append("images", img));

        try {
            const response = await axios.post(
                `http://localhost:3000/api/projects/${projectid}/upload-images`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            // update UI with new image URLs
            setProjectData((prev) => ({
                ...prev,
                images: [...(prev.images || []), ...response.data.images],
            }));
            setSelectedImages([]);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload images.");
        } finally {
            setIsUploading(false);
        }
    };

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
                        {/* Description Card */}
                        <div className={`${styles.card} ${styles.descriptionCard}`}>
                            <div className={styles.sectionHeader}>
                                <FaRegLightbulb className={styles.sectionIcon} />
                                <h3>Project Description</h3>
                            </div>
                            <p>{projectData?.description || "No description."}</p>

                            <div className={styles.sectionHeader}>
                                <FaTools className={styles.sectionIcon} />
                                <h3>Technology Stack</h3>
                            </div>
                            <div className={styles.techStack}>
                                {projectData?.stack?.length ? (
                                    projectData.stack.map((tech, i) => (
                                        <span key={i} className={styles.techBadge}>
                                            {tech}
                                        </span>
                                    ))
                                ) : (
                                    <span>No tech specified.</span>
                                )}
                            </div>

                            <div className={styles.sectionHeader}>
                                <FaBullseye className={styles.sectionIcon} />
                                <h3>Tags</h3>
                            </div>
                            <ul>
                                {projectData?.tags?.length
                                    ? projectData.tags.map((t, i) => <li key={i}>{t}</li>)
                                    : "No tags."}
                            </ul>

                            {/* 🖼️ Image Upload Section */}
                            <div className={styles.sectionHeader}>
                                <FaCloudUploadAlt className={styles.sectionIcon} />
                                <h3>Project Images</h3>
                            </div>

                            <div className={styles.imageGrid}>
                                {projectData?.images?.map((url, i) => (
                                    <img key={i} src={url} alt={`Project ${i}`} className={styles.imagePreview} />
                                ))}
                            </div>

                            <div className={styles.imageUploadSection}>
                                <div className="flex items-center gap-3">
                                    {/* Choose Images */}
                                    <label
                                        htmlFor="images"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
                                    >
                                        Choose Images
                                    </label>
                                    <input
                                        id="images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                    {/* Upload Button */}
                                    <button
                                        onClick={handleImageUpload}
                                        disabled={isUploading || selectedImages.length === 0}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                                    >
                                        {isUploading ? "Uploading..." : "Upload"}
                                    </button>
                                </div>

                                {/* Helper text */}
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG, or WEBP (max 5MB each). You can upload {5 - (projectData?.images?.length || 0)} more.
                                </p>
                            </div>

                            {/* Show uploaded images */}
                        </div>

                        {/* Steps Section */}
                        <div className={`${styles.card} ${styles.todoCard}`}>
                            <div className={styles.sectionHeader}>
                                <FaListUl className={styles.sectionIcon} />
                                <h3>Steps to Complete</h3>
                            </div>

                            {todoItems.length === 0 ? (
                                <button className={styles.generateButton} onClick={() => alert("Generate steps API soon!")}>
                                    Generate Steps
                                </button>
                            ) : (
                                <ul className={styles.todoList}>
                                    {todoItems.map((item) => (
                                        <li
                                            key={item.id}
                                            className={`${styles.todoItem} ${item.completed ? styles.completed : ""}`}
                                        >
                                            <div className={styles.todoHeader}>
                                                <div
                                                    className={styles.todoMain}
                                                    onClick={() => handleTodoToggle(item.id)}
                                                >
                                                    <div className={styles.todoCheckbox}>
                                                        {item.completed && <span>&#10003;</span>}
                                                    </div>
                                                    <span>{item.step_title}</span>
                                                </div>
                                                <button
                                                    className={styles.expandBtn}
                                                    onClick={() => toggleExpand(item.id)}
                                                >
                                                    {expandedId === item.id ? <FaChevronUp /> : <FaChevronDown />}
                                                </button>
                                            </div>

                                            {expandedId === item.id && (
                                                <div className={styles.todoDescription}>
                                                    {item.implementation_details || "No details."}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
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