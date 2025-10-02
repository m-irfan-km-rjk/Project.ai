import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Password validation rules
  const requirements = [
    { test: (pw) => pw.length >= 6, label: "At least 6 characters" },
    { test: (pw) => /[A-Z]/.test(pw), label: "One uppercase letter" },
    { test: (pw) => /\d/.test(pw), label: "One number" },
    { test: (pw) => /[!@#$%^&*]/.test(pw), label: "One special symbol (!@#$%^&*)" },
  ];

  const isPasswordValid = requirements.every((req) => req.test(password));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isPasswordValid) return; // Prevent submission if password invalid
    if (password !== confirmPassword) return; // Prevent if mismatch

    // TODO: Implement registration logic
    axios.post('http:localhost:3000/api/register', { username, password })
      .then(response => {
        if (response.data.success) {
          navigate('/login');
        } else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        console.error('Registration error:', error);
        alert('An error occurred during registration. Please try again.');
      });

    console.log({ username, password });
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Password requirements list */}
            <ul className={styles.passwordRequirements}>
              {requirements.map((req, index) => {
                const passed = req.test(password);
                return (
                  <li
                    key={index}
                    className={passed ? styles.requirementMet : styles.requirementNotMet}
                  >
                    {passed ? "✅" : "❌"} {req.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter Your Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && confirmPassword !== password && (
              <p className={styles.errorText}>❌ Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isPasswordValid || password !== confirmPassword}
          >
            Submit
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
