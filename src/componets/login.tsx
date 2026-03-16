import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      navigate('/list', { replace: true });
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-split">
      {/* Left – Hero */}
      <div className="login-hero">
        <h1 className="login-hero-title">
          Employee Insights — view data, verify identity, and explore analytics in one place.
        </h1>
      </div>

      {/* Right – Form */}
      <div className="login-form-side">
        <div className="login-form-wrap">
          <div className="login-header">
            <div className="login-logo" aria-hidden>
              <span className="login-logo-icon" />
            </div>
            <h2 className="login-welcome">Employee Dashboard</h2>
            <p className="login-tagline">
              Sign in to access the employee list, identity verification, and analytics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-password-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="login-password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="login-password-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="login-password-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .login-split {
          display: flex;
          min-height: 100vh;
          width: 100%;
        }

        .login-hero {
          flex: 1;
          background: linear-gradient(to bottom right, #0f172a, #1e3a8a, #ea580c);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }

        .login-hero-title {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3.75rem);
          font-weight: 700;
          line-height: 1.2;
          color: #fff;
          max-width: 28rem;
        }

        .login-form-side {
          flex: 1;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }

        .login-form-wrap {
          width: 100%;
          max-width: 28rem;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          background: #3b82f6;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .login-logo-icon {
          width: 1.5rem;
          height: 1.5rem;
          background: #fff;
          border-radius: 2px;
          display: block;
        }

        .login-welcome {
          margin: 0 0 0.5rem;
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
        }

        .login-tagline {
          margin: 0;
          font-size: 0.9375rem;
          color: #4b5563;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .login-field label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .login-field input {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          line-height: 1.5;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background: #fff;
          color: #111827;
          box-sizing: border-box;
        }

        .login-field input::placeholder {
          color: #9ca3af;
        }

        .login-field input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .login-password-wrap {
          position: relative;
        }

        .login-password-wrap input {
          padding-right: 2.75rem;
        }

        .login-password-toggle {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-right: 0.75rem;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
        }

        .login-password-toggle:hover {
          color: #374151;
        }

        .login-password-toggle:focus {
          outline: none;
        }

        .login-password-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .login-error {
          margin: 0;
          font-size: 0.875rem;
          color: #b91c1c;
        }

        .login-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          background: #ea580c;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        .login-btn:hover {
          background: #c2410c;
        }

        .login-btn:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(234, 88, 12, 0.5);
        }

        @media (max-width: 768px) {
          .login-split {
            flex-direction: column;
          }
          .login-hero {
            min-height: 40vh;
          }
        }
      `}</style>
    </div>
  );
}

// Login page renders a simple form that updates the global AuthContext
// and then redirects the user into the protected area of the app.
