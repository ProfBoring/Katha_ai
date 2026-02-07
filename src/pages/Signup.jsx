import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dummy auth - just navigate to home
        navigate('/home');
    };

    return (
        <div className="auth-section">
            <div className="auth-container">
                <h1 className="auth-title">SIGN UP</h1>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Full Name"
                            value={form.fullName}
                            onChange={handleChange('fullName')}
                        />
                        <span className="input-icon">👤</span>
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            className="input-field"
                            placeholder="Valid E-mail"
                            value={form.email}
                            onChange={handleChange('email')}
                        />
                        <span className="input-icon">✉</span>
                    </div>

                    <div className="input-group">
                        <input
                            type="tel"
                            className="input-field"
                            placeholder="Mobile Number"
                            value={form.mobile}
                            onChange={handleChange('mobile')}
                        />
                        <span className="input-icon">📞</span>
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Strong Password"
                            value={form.password}
                            onChange={handleChange('password')}
                        />
                        <span className="input-icon">🔒</span>
                    </div>

                    <button type="submit" className="btn-primary" style={{ alignSelf: 'center' }}>
                        NEXT
                    </button>
                </form>

                <p className="auth-link">
                    Already a member? <Link to="/">Log In</Link>
                </p>
            </div>
        </div>
    );
}
