import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CharacterCard from '../components/CharacterCard';
import AmbienceCard from '../components/AmbienceCard';
import { editScript, generateCharacters, generateAmbience } from '../services/groqService';
import { exportToPDF, exportToWord } from '../utils/exportUtils';

export default function EditScript() {
    const [script, setScript] = useState('');
    const [editPrompt, setEditPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [characters, setCharacters] = useState([]);
    const [ambience, setAmbience] = useState([]);

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => setScript(e.target.result);
        reader.readAsText(file);
    };

    const handleEdit = async () => {
        if (!script || !editPrompt) return;
        setLoading(true);
        try {
            const edited = await editScript(script, editPrompt);
            setScript(edited);

            // Also update characters and ambience
            const [charList, ambList] = await Promise.all([
                generateCharacters(edited),
                generateAmbience(edited)
            ]);
            setCharacters(charList);
            setAmbience(ambList);
        } catch (error) {
            console.error('Edit failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <h1 className="page-title">EDIT YOUR SCRIPT</h1>

                <div className="edit-container">
                    <div className="import-section">
                        <label className="import-btn">
                            IMPORT EXISTING SCRIPT
                            <input type="file" style={{ display: 'none' }} onChange={handleImport} accept=".txt,.md" />
                        </label>
                    </div>

                    <textarea
                        className="script-editor"
                        placeholder="Script content appears here..."
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                    />

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
                        <button className="btn-secondary" onClick={() => exportToPDF('Edited Script', script)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                            EXPORT PDF
                        </button>
                        <button className="btn-secondary" onClick={() => exportToWord('Edited Script', script)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                            EXPORT WORD
                        </button>
                    </div>

                    <div className="form-row">
                        <input
                            type="text"
                            className="form-input"
                            style={{ flex: 1 }}
                            placeholder="Enter Edit Instructions (e.g. 'Make it more tense')"
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                        />
                        <button
                            className="btn-primary"
                            onClick={handleEdit}
                            disabled={loading}
                        >
                            {loading ? 'EDITING...' : 'APPLY EDITS'}
                        </button>
                    </div>

                    {(characters.length > 0 || ambience.length > 0) && (
                        <div className="cards-section">
                            {characters.length > 0 && (
                                <>
                                    <h3 className="cards-title">CHARACTER CARDS</h3>
                                    <div className="cards-grid">
                                        {characters.map((char, i) => (
                                            <CharacterCard
                                                key={i}
                                                name={char.name}
                                                description={char.description}
                                                traits={char.traits}
                                                arc={char.arc}
                                                colorPalette={char.colorPalette}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {ambience.length > 0 && (
                                <>
                                    <h3 className="cards-title" style={{ marginTop: '2rem' }}>AMBIENCE & SOUND DESIGN</h3>
                                    <div className="cards-grid">
                                        {ambience.map((amb, i) => (
                                            <AmbienceCard key={i} title={amb.title} description={amb.description} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
