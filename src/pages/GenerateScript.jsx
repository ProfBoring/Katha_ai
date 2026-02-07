import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { generateScript } from '../services/groqService';

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
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!params.prompt) return;
        setLoading(true);
        try {
            const script = await generateScript(params);
            setOutput(script);
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
                    </div>
                )}
            </main>
        </div>
    );
}
