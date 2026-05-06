import { useState } from "react";
import { loginUser } from "../api/chat";

export default function LoginPage({ onLogin }) {
  console.log("LoginPage rendering");
  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ username, password, role });
      onLogin(data);
    } catch (err) {
      setError("Invalid credentials. Try admin/admin123 or any username with password user123.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        padding: '40px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: 'white',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ marginBottom: '16px', fontSize: '28px' }}>🎓 Sign in to College Portal</h2>
        <p style={{ marginBottom: '24px', opacity: 0.9 }}>
          Login as a student or admin to access your dashboard.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
          <button
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: role === 'user' ? '2px solid white' : '1px solid rgba(255,255,255,0.3)',
              background: role === 'user' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            onClick={() => setRole('user')}
            type="button"
          >
            Student
          </button>
          <button
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: role === 'admin' ? '2px solid white' : '1px solid rgba(255,255,255,0.3)',
              background: role === 'admin' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            onClick={() => setRole('admin')}
            type="button"
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === 'admin' ? 'admin' : 'Enter your name'}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={role === 'admin' ? 'admin123' : 'user123'}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>

          {error && (
            <div style={{ marginBottom: '16px', color: '#ff6b6b', fontSize: '14px', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '25px',
              border: 'none',
              background: loading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px'
            }}
          >
            {loading ? 'Logging in...' : `Login as ${role === 'admin' ? 'Admin' : 'Student'}`}
          </button>
        </form>

        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          <strong>Admin:</strong> admin / admin123<br/>
          <strong>Student:</strong> any username / user123
        </div>
      </div>
    </div>
  );
}
