import { useEffect, useState } from "react"
import { AuthContext } from "./authContext"

const API_URL = import.meta.env.VITE_API_URL
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
            .then((response) => response.ok ? response.json() : null)
            .then((data) => setUser(data?.user ?? null))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    const login = (loggedInUser) => setUser(loggedInUser)

    const logout = async () => {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include"
        })
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
