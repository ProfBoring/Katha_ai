import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const savedProjects = JSON.parse(localStorage.getItem('katha_projects') || '[]');
        setProjects(savedProjects);
        if (savedProjects.length > 0) {
            setSelectedProject(savedProjects[0]);
        }
    }, []);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
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
            </main>
        </div>
    );
}
