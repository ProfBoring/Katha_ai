import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const authRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dummy auth - just navigate to home
        navigate('/home');
    };

    const scrollToAuth = () => {
        authRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing-wrapper">
            {/* Video Intro Section */}
            <section className="video-section">
                <video
                    className="video-element"
                    autoPlay
                    muted
                    playsInline
                    id="intro-video"
                    preload="auto"
                >
                    <source src="/intro_video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </section>

            {/* Auth Section */}
            <section className="auth-section" ref={authRef}>
                <div className="auth-container">
                    <h1 className="auth-title">LOGIN</h1>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="email"
                                className="input-field"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <span className="input-icon">✉</span>
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="input-icon">🔒</span>
                        </div>

                        <button type="submit" className="btn-primary" style={{ alignSelf: 'center' }}>
                            LOGIN
                        </button>
                    </form>

                    <p className="auth-link">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </section>
        </div>
    );
}
