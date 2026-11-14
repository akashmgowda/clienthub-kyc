import { useState } from 'react';
import './Login.css'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    // Check if either field is missing a value
    const isButtonDisabled = !email || !password;


    const handleLogin = () => {

        if (!email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setError("");

        console.log("Email", email);
        console.log("Password", password);
    }  

    return (
        <div className="login-container">
            <div className="login-container">

                <h1>ClientHub</h1>
                <p>Welcome Back</p>

                <input
                  type="email"
                  placeholder='Email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <label>
                  <input 
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                    Show Password
                </label>

                {error && <p className="error-message">{error}</p>}

                <button 
                  onClick={handleLogin} 
                  disabled={isButtonDisabled}
                >
                    Login
                </button>


            </div>
        </div>

    );
}

export default Login;