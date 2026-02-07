import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';

const dummyProjects = [
    { id: 1, title: 'UNTITLED 6', progress1: 80, progress2: 60 },
    { id: 2, title: 'UNTITLED 5', progress1: 70, progress2: 50 },
    { id: 3, title: 'UNTITLED 4', progress1: 90, progress2: 75 },
    { id: 4, title: 'UNTITLED 3', progress1: 60, progress2: 40 },
    { id: 5, title: 'UNTITLED 2', progress1: 85, progress2: 70 },
    { id: 6, title: 'UNTITLED 1', progress1: 55, progress2: 35 },
];

export default function Home() {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <h1 className="page-title">PROJECTS</h1>
                <div className="projects-list">
                    {dummyProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            title={project.title}
                            progress1={project.progress1}
                            progress2={project.progress2}
                            onMenuClick={() => console.log('Menu clicked for', project.title)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
