import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { generateProjectReport } from '../services/groqService';

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'report'
    const [reportData, setReportData] = useState(null);
    const [loadingReport, setLoadingReport] = useState(false);

    useEffect(() => {
        const savedProjects = JSON.parse(localStorage.getItem('katha_projects') || '[]');
        setProjects(savedProjects);
        if (savedProjects.length > 0) {
            setSelectedProject(savedProjects[0]);
        }
    }, []);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setView('dashboard');
    };

    const handleProgressClick = async (project) => {
        setSelectedProject(project);
        setLoadingReport(true);
        setView('report');
        try {
            const data = await generateProjectReport(project.content);
            setReportData(data);
        } catch (error) {
            console.error('Failed to generate report:', error);
            setReportData({ tasks: ["Error generating tasks"], budget: 0 });
        } finally {
            setLoadingReport(false);
        }
    };

    const toggleTask = (index) => {
        const newTasks = [...reportData.tasks];
        // In a real app, we'd have a checked state. Here we'll just toggle a dummy state
        setReportData({ ...reportData, tasks: newTasks });
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                {view === 'dashboard' ? (
                    <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 4rem)' }}>
                        <div style={{ flex: '0 0 350px', overflowY: 'auto', paddingRight: '1rem' }}>
                            <h1 className="page-title">PROJECTS</h1>
                            <div className="projects-list">
                                {projects.length > 0 ? (
                                    projects.map((project) => (
                                        <div
                                            key={project.id}
                                            onClick={() => handleProjectClick(project)}
                                            style={{
                                                cursor: 'pointer',
                                                marginBottom: '1rem',
                                                padding: '2px',
                                                borderRadius: '14px',
                                                border: selectedProject?.id === project.id ? '2px solid var(--brown)' : '2px solid transparent',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <ProjectCard
                                                title={project.title}
                                                progress1={project.progress1}
                                                progress2={project.progress2}
                                                onProgressClick={() => handleProgressClick(project)}
                                                onMenuClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('Menu clicked for', project.title);
                                                }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>No generated scripts yet. Go to "Generate Script" to create one!</p>
                                )}
                            </div>
                        </div>

                        {selectedProject && (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                            }}>
                                <h1 className="page-title">SCRIPT PREVIEW: {selectedProject.title}</h1>
                                <div className="output-box" style={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)'
                                }}>
                                    {selectedProject.content}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="report-view">
                        <div className="report-header" onClick={() => setView('dashboard')}>
                            <span>&lt;</span>
                            <span>Project Report</span>
                        </div>

                        {loadingReport ? (
                            <div className="loading">
                                <div className="spinner"></div>
                                <span>Generating production report...</span>
                            </div>
                        ) : (
                            <div className="report-grid">
                                <div className="task-list-container">
                                    <div className="task-list-header">
                                        <div className="task-checkbox"></div>
                                        <span>TASK LIST</span>
                                        <span style={{ marginLeft: 'auto' }}>↓</span>
                                    </div>
                                    {reportData?.tasks.map((task, i) => (
                                        <div key={i} className="task-item">
                                            <div className="task-checkbox" onClick={() => toggleTask(i)}></div>
                                            <span>{task}</span>
                                            <span style={{ marginLeft: 'auto', opacity: 0.5 }}>...</span>
                                        </div>
                                    ))}
                                    <div className="add-task">+ Add Task</div>
                                </div>

                                <div className="budget-container">
                                    <div className="budget-card">
                                        <div className="budget-header">BUDGET ESTIMATED</div>
                                        <div className="budget-value">
                                            <span>$ {reportData?.budget || 20000}</span>
                                            <span className="budget-arrow">∨</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
