import React, { useState } from 'react';
import '../css/Login.css';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate =useNavigate();
    
    // State variables for login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    ;

    // State variables for registration form
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [userType, setUserType] = useState('');

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        
        if (loginEmail === '' || loginPassword === '') {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: loginEmail, 
                    password: loginPassword,
                }),
            });
    
            const data = await response.json();
            if (response.ok) {
               const userProfile=data.user.user_type;
                

                alert(`Login successful logintype:${userProfile}`);
               if(userProfile==="admin")
                    navigate('/dynamic-form');
               else 
                    navigate('/home');
                setLoginEmail('');
                setLoginPassword('');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

       
        if (registerUsername === '' || registerEmail === '' || registerPassword === '' || userType === '') {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerUsername,
                    email: registerEmail,
                    password: registerPassword,
                    user_type: userType
                }),
            });
    
            const data = await response.json();
            if (response.ok) {
                alert('Registration successful');
                toggleForm();
                setRegisterUsername('');
                setRegisterEmail('');
                setRegisterPassword('');
                setUserType('');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
    <div className="container">
        <div className="wrapper">
            {isLogin ? (
                <div className="login-form">
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={loginEmail} 
                                onChange={(e) => setLoginEmail(e.target.value)} 
                                required 
                            />
                            <i className="bx bxs-user"></i>
                        </div>
                        <div className="input-box">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={loginPassword} 
                                onChange={(e) => setLoginPassword(e.target.value)} 
                                required 
                            />
                            <i className="bx bxs-lock-alt"></i>
                        </div>
                        <div className="remember-forgot">
                            <label><input type="checkbox" /> Remember me</label>
                            <a href="#">Forgot password?</a>
                        </div>
                        <button type="submit" className="btn">Login</button>
                        <div className="register-link">
                            <p>Don't have an account? <a href="#" onClick={toggleForm}>Register</a></p>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="register-form">
                    <form onSubmit={handleRegisterSubmit}>
                        <h1>Register</h1>
                        <div className="input-box">
                            <input 
                                type="text" 
                                placeholder="Username" 
                                value={registerUsername} 
                                onChange={(e) => setRegisterUsername(e.target.value)} 
                                required 
                            />
                            <i className="bx bxs-user"></i>
                        </div>
                        <div className="input-box">
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                value={registerEmail} 
                                onChange={(e) => setRegisterEmail(e.target.value)} 
                                required 
                            />
                            <i className="bx bxs-envelope"></i>
                        </div>
                        <div className="input-box">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={registerPassword} 
                                onChange={(e) => setRegisterPassword(e.target.value)} 
                                required 
                            />
                            <i className="bx bxs-lock-alt"></i>
                        </div>
                        <div className="input-box">
                            <select 
                                name="user-type" 
                                id="user-type" 
                                value={userType} 
                                onChange={(e) => setUserType(e.target.value)} 
                                required
                            >
                                <option value="">Select User Type</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <div className="remember-forgot">
                            <input type="checkbox" /> I agree to the terms and conditions
                        </div>
                        <button type="submit" className="btn">Register</button>
                        <div className="login-link">
                            <p>Already have an account? <a href="#" onClick={toggleForm}>Login</a></p>
                        </div>
                    </form>
                </div>
            )}
        </div>
    </div>
    );
};

export default Login;
