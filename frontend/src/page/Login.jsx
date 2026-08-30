import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) return setError(data.message);
            login(data.user);
            navigate("/profile");
        } catch {
            setError("Something went wrong");
        }
    };

    return ( 
        <>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
        </>
    );
}

export default Login;