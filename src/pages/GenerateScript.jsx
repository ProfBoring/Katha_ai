import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CharacterCard from '../components/CharacterCard';
import AmbienceCard from '../components/AmbienceCard';
import { generateScript, generateCharacters, generateAmbience } from '../services/groqService';

export default function GenerateScript() {
    const [params, setParams] = useState({
        title: '',
        prompt: '',
        genre: 'Drama',
        timePeriod: 'Modern Day',
        dialogueStyle: 'Naturalistic',
        contentType: 'Feature Film',
        length: 'medium'
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
                progress1: Math.floor(Math.random() * 40) + 60,
                progress2: Math.floor(Math.random() * 40) + 40
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

                    <div className="slider-container">
                        <input
                            type="range"
                            className="slider"
                            min="0"
                            max="100"
                            defaultValue="70"
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

                {output && (
                    <div className="output-section">
                        <h2 className="page-title">GENERATED SCRIPT</h2>
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
