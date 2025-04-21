import React, { createContext, useContext, useEffect, useState } from 'react';
import { msalInstance, loginRequest } from '../azure';
import { EventType } from '@azure/msal-browser';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async () => {
    try {
      const response = await msalInstance.loginPopup(loginRequest);
      const account = response.account;
      setUser({
        name: account.name,
        username: account.username,
      });
    } catch (err) {
      console.error('❌ Login failed:', err);
    }
  };

  const logout = () => {
    const currentAccount = msalInstance.getActiveAccount();
    if (currentAccount) {
      msalInstance.logoutPopup({
        account: currentAccount,
        postLogoutRedirectUri: '/',
      });
      setUser(null);
    }
  };

  useEffect(() => {
    const currentAccount = msalInstance.getAllAccounts()[0];
    if (currentAccount) {
      setUser({
        name: currentAccount.name,
        username: currentAccount.username,
      });
    }

    const callbackId = msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        msalInstance.setActiveAccount(event.payload.account);
        setUser({
          name: event.payload.account.name,
          username: event.payload.account.username,
        });
      }
    });

    return () => {
      if (callbackId) msalInstance.removeEventCallback(callbackId);
    };
  }, []);

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
