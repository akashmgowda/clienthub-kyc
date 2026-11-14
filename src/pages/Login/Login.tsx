import { useState, type FormEvent } from 'react';
import './Login.css';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!emailPattern.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setError('Sign-in is not connected yet. We will enable it after the Spring Boot authentication API is ready.');
  };

  return (
    <main className="login-page">
      <section className="login-intro" aria-label="About ClientHub">
        <div className="brand"><span className="brand-mark">C</span> ClientHub</div>
        <div className="intro-copy">
          <span className="eyebrow">CLIENT ONBOARDING PLATFORM</span>
          <h1>Manage client onboarding with confidence.</h1>
          <p>One secure workspace for client records, KYC applications, and review workflows.</p>
          <div className="intro-tags"><span>Client management</span><span>KYC workflows</span><span>Review & approval</span></div>
        </div>
        <small>ClientHub · Internal workspace</small>
      </section>
      <section className="login-panel" aria-labelledby="login-heading">
        <div className="login-card">
          <span className="eyebrow">WELCOME BACK</span>
          <h2 id="login-heading">Sign in to ClientHub</h2>
          <p className="login-subtitle">Enter your work credentials to continue.</p>
          <form onSubmit={handleLogin} noValidate>
            <label htmlFor="email">Work email</label>
            <input id="email" name="email" type="email" autoComplete="username" placeholder="name@company.com" value={email} onChange={e => {setEmail(e.target.value); setError('');}} required />
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e => {setPassword(e.target.value); setError('');}} required minLength={8} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
            {error && <p className="form-message" role="alert">{error}</p>}
            <button className="submit-button" type="submit">Sign in</button>
          </form>
          <p className="security-note">Authentication integration is coming next. Do not enter real credentials yet.</p>
        </div>
      </section>
    </main>
  );
}

export default Login;
