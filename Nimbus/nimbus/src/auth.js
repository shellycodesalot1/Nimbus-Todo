import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig, msalInstance, loginRequest } from './azure';

// Function to handle login
export const login = async () => {
    try {
        // Use loginPopup for a better user experience with PKCE
        const response = await msalInstance.loginPopup(loginRequest);
        if (response) {
            // Get account information
            const account = response.account;
            // Set active account
            msalInstance.setActiveAccount(account);
            return response;
        }
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

// Function to handle logout
export const logout = () => {
    const logoutRequest = {
        account: msalInstance.getActiveAccount(),
    };
    return msalInstance.logout(logoutRequest);
};

// Function to get access token
export const getToken = async () => {
    const account = msalInstance.getActiveAccount();
    if (!account) {
        throw new Error("No active account!");
    }

    const request = {
        ...loginRequest,
        account: account
    };

    try {
        const response = await msalInstance.acquireTokenSilent(request);
        return response.accessToken;
    } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
            // If silent token acquisition fails, acquire token using popup
            const response = await msalInstance.acquireTokenPopup(request);
            return response.accessToken;
        }
        throw error;
    }
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
    return !!msalInstance.getActiveAccount();
}; 