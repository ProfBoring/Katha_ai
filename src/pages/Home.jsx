import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { generateProjectReport } from '../services/groqService';

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'report'
    const [loadingReport, setLoadingReport] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');

    useEffect(() => {
        const savedProjects = JSON.parse(localStorage.getItem('katha_projects') || '[]');
        setProjects(savedProjects);
        if (savedProjects.length > 0) {
            setSelectedProject(savedProjects[0]);
        }
    }, []);

    const saveProjects = (updatedProjects) => {
        setProjects(updatedProjects);
        localStorage.setItem('katha_projects', JSON.stringify(updatedProjects));
    };

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setView('dashboard');
    };

    const handleProgressClick = async (project) => {
        setSelectedProject(project);
        setView('report');

        // Check if project already has a report
        if (project.tasks && project.tasks.length > 0) {
            return;
        }

        setLoadingReport(true);
        try {
            const data = await generateProjectReport(project.content);
            const taskObjects = data.tasks.map(t => ({ text: t, completed: false }));

            const updatedProjects = projects.map(p =>
                p.id === project.id
                    ? { ...p, tasks: taskObjects, budget: data.budget }
                    : p
            );

            saveProjects(updatedProjects);
            setSelectedProject(updatedProjects.find(p => p.id === project.id));
        } catch (error) {
            console.error('Failed to generate report:', error);
        } finally {
            setLoadingReport(false);
        }
    };

    const toggleTask = (taskIndex) => {
        const updatedProjects = projects.map(p => {
            if (p.id === selectedProject.id) {
                const newTasks = [...p.tasks];
                newTasks[taskIndex].completed = !newTasks[taskIndex].completed;

                // Calculate new progress
                const completedCount = newTasks.filter(t => t.completed).length;
                const progress = Math.round((completedCount / newTasks.length) * 100);

                return { ...p, tasks: newTasks, progress1: progress };
            }
            return p;
        });

        saveProjects(updatedProjects);
        setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id));
    };

    const addTask = () => {
        if (!newTaskText.trim()) return;

        const updatedProjects = projects.map(p => {
            if (p.id === selectedProject.id) {
                const newTasks = [...(p.tasks || []), { text: newTaskText, completed: false }];
                const completedCount = newTasks.filter(t => t.completed).length;
                const progress = Math.round((completedCount / newTasks.length) * 100);
                return { ...p, tasks: newTasks, progress1: progress };
            }
            return p;
        });

        saveProjects(updatedProjects);
        setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id));
        setNewTaskText('');
    };

    const deleteTask = (index) => {
        const updatedProjects = projects.map(p => {
            if (p.id === selectedProject.id) {
                const newTasks = p.tasks.filter((_, i) => i !== index);
                const completedCount = newTasks.filter(t => t.completed).length;
                const progress = newTasks.length > 0 ? Math.round((completedCount / newTasks.length) * 100) : 0;
                return { ...p, tasks: newTasks, progress1: progress };
            }
            return p;
        });

        saveProjects(updatedProjects);
        setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id));
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
                            <span>Project Report - {selectedProject.title}</span>
                        </div>

                        {loadingReport ? (
                            <div className="loading">
                                <div className="spinner"></div>
                                <span>Analyzing script and generating production tasks...</span>
                            </div>
                        ) : (
                            <div className="report-grid">
                                <div className="task-list-container">
                                    <div className="task-list-header">
                                        <div className="task-checkbox"></div>
                                        <span>TASK LIST</span>
                                        <span style={{ marginLeft: 'auto' }}>↓</span>
                                    </div>
                                    {selectedProject.tasks?.map((task, i) => (
                                        <div key={i} className="task-item">
                                            <div
                                                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                                                onClick={() => toggleTask(i)}
                                            ></div>
                                            <span style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>
                                                {task.text}
                                            </span>
                                            <span
                                                style={{ marginLeft: 'auto', cursor: 'pointer', opacity: 0.5 }}
                                                onClick={() => deleteTask(i)}
                                            >🗑️</span>
                                        </div>
                                    ))}
                                    <div className="add-task" style={{ display: 'flex', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Add Task"
                                            value={newTaskText}
                                            onChange={(e) => setNewTaskText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addTask()}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                borderBottom: '1px solid var(--brown)',
                                                outline: 'none',
                                                flex: 1,
                                                color: 'var(--brown)'
                                            }}
                                        />
                                        <span onClick={addTask} style={{ cursor: 'pointer' }}>+</span>
                                    </div>
                                </div>

                                <div className="budget-container">
                                    <div className="budget-card">
                                        <div className="budget-header">BUDGET ESTIMATED</div>
                                        <div className="budget-value">
                                            <span>$ {selectedProject.budget || 0}</span>
                                            <span className="budget-arrow">∨</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--dark-brown)', opacity: 0.7 }}>
                                        * Budget estimated by AI based on script complexity and content.
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
