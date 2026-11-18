import { useEffect, useState } from "react"
import { AuthContext } from "./authContext"

const API_URL = import.meta.env.VITE_API_URL
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

const getCurrentUser = async (signal) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            credentials: "include",
            signal
        })
        if (!response.ok) {
            return null
        }

        const data = await response.json()
        return normalizeUser(data?.user ?? null)
    } catch {
        return null
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const refreshUser = async () => {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        return currentUser
    }

    useEffect(() => {
        const controller = new AbortController()
        getCurrentUser(controller.signal).then((currentUser) => {
            if (!controller.signal.aborted) {
                setUser(currentUser)
                setLoading(false)
            }
        })

        return () => {
            controller.abort()
        }
    }, [])

    const login = (loggedInUser) => {
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
