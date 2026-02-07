import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CharacterCard from '../components/CharacterCard';
import AmbienceCard from '../components/AmbienceCard';
import { generateScript, generateCharacters, generateAmbience } from '../services/groqService';
import { exportToPDF, exportToWord } from '../utils/exportUtils';

export default function GenerateScript() {
    const [params, setParams] = useState({
        title: '',
        prompt: '',
        genre: 'Drama',
        timePeriod: 'Modern Day',
        dialogueStyle: 'Naturalistic',
        contentType: 'Feature Film',
        length: 30 // Default to 30 minutes
    });

    const [output, setOutput] = useState('');
    const [characters, setCharacters] = useState([]);
    const [ambience, setAmbience] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!params.prompt) return;
        setLoading(true);
        setOutput('');
        setCharacters([]);
        setAmbience([]);

        try {
            const script = await generateScript(params);
            setOutput(script);

            // Generate characters and ambience in parallel
            const [charList, ambList] = await Promise.all([
                generateCharacters(script),
                generateAmbience(script)
            ]);

            setCharacters(charList);
            setAmbience(ambList);

            // Persist to localStorage
            const savedProjects = JSON.parse(localStorage.getItem('katha_projects') || '[]');
            const newProject = {
                id: Date.now(),
                title: params.title || `UNTITLED ${savedProjects.length + 1}`,
                content: script,
                characters: charList,
                ambience: ambList,
                genre: params.genre,
                timestamp: new Date().toISOString(),
                progress1: 0
            };
            localStorage.setItem('katha_projects', JSON.stringify([newProject, ...savedProjects]));

        } catch (error) {
            console.error('Generation failed:', error);
            setOutput('Failed to generate script. Please check your API key or try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <h1 className="page-title">GENERATE SCRIPT</h1>

                <div className="generate-form">
                    <div className="form-row">
                        <input
                            type="text"
                            className="form-input title-input"
                            placeholder="Enter Project Title"
                            value={params.title}
                            onChange={(e) => setParams({ ...params, title: e.target.value })}
                        />
                    </div>

                    <textarea
                        className="prompt-textarea"
                        placeholder="Enter Script Prompt"
                        value={params.prompt}
                        onChange={(e) => setParams({ ...params, prompt: e.target.value })}
                    />

                    <div className="form-row">
                        <div className="select-wrapper">
                            <select
                                className="form-select"
                                value={params.genre}
                                onChange={(e) => setParams({ ...params, genre: e.target.value })}
                            >
                                <option>Drama</option>
                                <option>Comedy</option>
                                <option>Sci-Fi</option>
                                <option>Horror</option>
                                <option>Thriller</option>
                                <option>Action</option>
                                <option>Romance</option>
                                <option>Mystery</option>
                                <option>Fantasy</option>
                                <option>Documentary</option>
                                <option>Western</option>
                                <option>Musical</option>
                                <option>Noir</option>
                                <option>Adventure</option>
                            </select>
                        </div>

                        <div className="select-wrapper">
                            <select
                                className="form-select"
                                value={params.timePeriod}
                                onChange={(e) => setParams({ ...params, timePeriod: e.target.value })}
                            >
                                <option>Modern Day</option>
                                <option>1980s</option>
                                <option>Future</option>
                                <option>Medieval</option>
                                <option>Victorian</option>
                                <option>Ancient Rome</option>
                                <option>Renaissance</option>
                                <option>1920s</option>
                                <option>1950s</option>
                                <option>1990s</option>
                                <option>Prehistoric</option>
                                <option>Cyberpunk Era</option>
                                <option>World War II</option>
                                <option>Wild West</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="select-wrapper">
                            <select
                                className="form-select"
                                value={params.dialogueStyle}
                                onChange={(e) => setParams({ ...params, dialogueStyle: e.target.value })}
                            >
                                <option>Naturalistic</option>
                                <option>Stylized</option>
                                <option>Poetic</option>
                                <option>Fast-paced</option>
                                <option>Slang-heavy</option>
                                <option>Formal</option>
                                <option>Minimalist</option>
                                <option>Melodramatic</option>
                                <option>Sarcastic</option>
                                <option>Period-accurate</option>
                                <option>Sorkin-esque</option>
                                <option>Tarantino-esque</option>
                            </select>
                        </div>

                        <div className="select-wrapper">
                            <select
                                className="form-select"
                                value={params.contentType}
                                onChange={(e) => setParams({ ...params, contentType: e.target.value })}
                            >
                                <option>Feature Film</option>
                                <option>Short Film</option>
                                <option>TV Episode</option>
                                <option>Web Series</option>
                            </select>
                        </div>
                    </div>

                    <div className="slider-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: 'var(--brown)', fontWeight: 600 }}>
                            <span>Duration</span>
                            <span>{params.length} mins</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', width: '100%', alignItems: 'center' }}>
                            <input
                                type="range"
                                className="slider"
                                min="1"
                                max="120"
                                value={params.length}
                                onChange={(e) => setParams({ ...params, length: parseInt(e.target.value) })}
                                style={{ flex: 1 }}
                            />
                            <button
                                className="btn-primary"
                                onClick={handleGenerate}
                                disabled={loading}
                            >
                                {loading ? <div className="spinner"></div> : 'GENERATE'}
                            </button>
                        </div>
                    </div>
                </div>

                {output && (
                    <div className="output-section">
                        <h2 className="page-title">GENERATED SCRIPT</h2>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <button className="btn-secondary" onClick={() => exportToPDF(params.title, output)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                EXPORT PDF
                            </button>
                            <button className="btn-secondary" onClick={() => exportToWord(params.title, output)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                EXPORT WORD
                            </button>
                        </div>
                        <div className="output-box">{output}</div>

                        {(characters.length > 0 || ambience.length > 0) && (
                            <div className="cards-section" style={{ marginTop: '3rem' }}>
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
                                        <h3 className="cards-title" style={{ marginTop: '2.5rem' }}>AMBIENCE & SOUND DESIGN</h3>
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
                )}
            </main>
        </div>
    );
}
