import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Profile() {
    const { user, loading, logout } = useAuth();

    if (loading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/login" replace />;

    return ( 
        <>
            <h1>Profile</h1>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <button onClick={logout}>Log out</button>
        </>
    );
}

export default Profile;