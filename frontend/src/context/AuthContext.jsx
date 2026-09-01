import { useEffect, useState } from "react"
import { AuthContext } from "./authContext"

const API_URL = import.meta.env.VITE_API_URL
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const normalizeUser = (userData) => {
        if (!userData) {
            return null
        }

        return {
            ...userData,
            username: userData.username ?? userData.userName ?? "",
            name: userData.name ?? "User",
            email: userData.email ?? ""
        }
    }

    const refreshUser = async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
            const data = response.ok ? await response.json() : null
            setUser(normalizeUser(data?.user ?? null))
            return normalizeUser(data?.user ?? null)
        } catch {
            setUser(null)
            return null
        }
    }

    useEffect(() => {
        refreshUser().finally(() => setLoading(false))
    }, [])

    const login = (loggedInUser) => {
        if (!loggedInUser) {
            setUser(null)
            return
        }

        setUser(normalizeUser(loggedInUser))
    }

    const logout = async () => {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include"
        })
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}
