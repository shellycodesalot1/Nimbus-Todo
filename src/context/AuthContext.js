import React, { createContext, useContext, useEffect, useState } from "react";
import { msalInstance, loginRequest } from "../msal"; // <-- still from msal.js
import { EventType } from "@azure/msal-browser";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async () => {
    try {
      await msalInstance.initialize(); // ✅ Ensure initialized before login
      const response = await msalInstance.loginPopup(loginRequest);
      const account = response.account;
      msalInstance.setActiveAccount(account);
      setUser({
        name: account.name,
        username: account.username,
        localAccountId: account.localAccountId, // ✅ Now added
      });
    } catch (err) {
      console.error("❌ Login failed:", err);
    }
  };

  const logout = () => {
    const currentAccount = msalInstance.getActiveAccount();
    if (currentAccount) {
      msalInstance.logoutPopup({
        account: currentAccount,
        postLogoutRedirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net",
      });
      setUser(null);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await msalInstance.initialize(); // ✅ Initialize on startup
        const currentAccount = msalInstance.getAllAccounts()[0];
        if (currentAccount) {
          msalInstance.setActiveAccount(currentAccount);
          setUser({
            name: currentAccount.name,
            username: currentAccount.username,
            localAccountId: currentAccount.localAccountId, // ✅ Now added
          });
        }
      } catch (err) {
        console.error("❌ MSAL failed to initialize:", err);
      }
    };
    init();

    const callbackId = msalInstance.addEventCallback((event) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS &&
        event.payload.account
      ) {
        msalInstance.setActiveAccount(event.payload.account);
        setUser({
          name: event.payload.account.name,
          username: event.payload.account.username,
          localAccountId: event.payload.account.localAccountId, // ✅ Now added
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
