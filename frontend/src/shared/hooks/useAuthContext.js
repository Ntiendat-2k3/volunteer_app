import {createContext, useContext, useEffect, useState} from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Khi load app, gọi /auth/me để lấy user nếu đã login
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await axiosClient.get('/auth/me');
                setUser(res.data.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        await axiosClient.post('/auth/logout');
        setUser(null);
    };

    return (<AuthContext.Provider value={
        {user, loading, login, logout}
    }> {children} </AuthContext.Provider>);
}

export function useAuth() {
    return useContext(AuthContext);
}
