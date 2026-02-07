import { useState } from 'react';

export default function ProjectCard({ title, progress1, progress2, onRename, onDelete, onProgressClick }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="project-card" style={{ position: 'relative', minHeight: '120px' }}>
            <span className="project-icon" style={{ fontSize: '2.5rem', marginRight: '1rem' }}>📋</span>
            <div className="project-title" style={{ fontSize: '1.25rem', fontWeight: 600, flex: 1, maxWidth: '200px' }}>
                {title}
            </div>

            <div
                className="project-menu"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                }}
                style={{
                    margin: '0 2rem',
                    backgroundColor: '#E8E2D1',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                    width: '35px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: 'var(--text-dark)'
                }}
            >
                ⋮
                {showMenu && (
                    <div style={{
                        position: 'absolute',
                        top: '70%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'var(--bg-cream)',
                        border: '1px solid var(--tan)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        width: '120px',
                        overflow: 'hidden'
                    }}>
                        <button
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: 'none',
                                background: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                borderBottom: '1px solid var(--tan)',
                                color: 'var(--text-dark)'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(false);
                                onRename();
                            }}
                        >
                            Rename
                        </button>
                        <button
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: 'none',
                                background: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#d32f2f'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(false);
                                onDelete();
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <div
                className="project-progress"
                onClick={(e) => {
                    e.stopPropagation();
                    onProgressClick && onProgressClick();
                }}
                style={{ cursor: 'pointer', marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${progress1}%` }}></div>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '40px' }}>{progress1}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${progress2}%` }}></div>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '40px' }}>{progress2}%</span>
                </div>
            </div>
        </div>
    );
}
