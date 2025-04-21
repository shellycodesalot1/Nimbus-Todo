import React, { createContext, useContext, useState, useEffect } from 'react';
import { msalInstance, login as msalLogin, logout as msalLogout, getToken as msalGetToken } from '../auth';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check if there's an active account in MSAL
                const currentAccount = msalInstance.getActiveAccount();
                
                if (currentAccount) {
                    // Get user info from account
                    const userData = {
                        name: currentAccount.name,
                        username: currentAccount.username,
                        id: currentAccount.localAccountId
                    };
                    setUser(userData);
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Cleanup function
        return () => {
            // Reset state on unmount
            setUser(null);
            setError(null);
        };
    }, []);

    const login = async () => {
        try {
            setError(null);
            const response = await msalLogin();

            if (response) {
                const userData = {
                    name: response.account.name,
                    username: response.account.username,
                    id: response.account.localAccountId
                };
                
                setUser(userData);

                // After successful login, navigate to dashboard
                window.location.href = '/dashboard';
                
                return userData;
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await msalLogout();
            setUser(null);
            setError(null);
        } catch (err) {
            console.error('Logout error:', err);
            setError(err);
            throw err;
        }
    };

    const getToken = async () => {
        try {
            return await msalGetToken();
        } catch (err) {
            console.error('Token acquisition error:', err);
            setError(err);
            throw err;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        getToken,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 