"use client";
import {useState} from "react"
import axiosClient from "../../../shared/api/axiosClient"
import {useAuth as useAuthContext} from "../../../shared/hooks/useAuthContext"

export const useAuth = () => {
    const {login: contextLogin, logout: contextLogout} = useAuthContext()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const login = async (credentials) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axiosClient.post("/auth/login", credentials)
            contextLogin(res.data.data)
            return res.data
        } catch (err) {
            const message = err.response ?. data ?. message || "Đăng nhập thất bại"
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (data) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axiosClient.post("/auth/register", data)
            return res.data
        } catch (err) {
            const message = err.response ?. data ?. message || "Đăng ký thất bại"
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            await contextLogout()
        } catch (err) {
            console.error("Logout failed", err)
        }
    }

    return {
        login,
        register,
        logout,
        isLoading,
        error
    }
}
