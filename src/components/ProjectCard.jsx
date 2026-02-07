export default function ProjectCard({ title, progress1, progress2, onMenuClick }) {
    return (
        <div className="project-card">
            <span className="project-icon">📋</span>
            <span className="project-title">{title}</span>
            <button className="project-menu" onClick={onMenuClick}>⋮</button>
            <div className="project-progress">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress1}%` }}></div>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress2}%` }}></div>
                </div>
            </div>
        </div>
    );
}
