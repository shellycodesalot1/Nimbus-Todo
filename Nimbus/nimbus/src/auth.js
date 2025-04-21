import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig } from './azure';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL
let isInitialized = false;
const initializeMsal = async () => {
    if (!isInitialized) {
        try {
            await msalInstance.initialize();
            isInitialized = true;
            console.log('MSAL initialized successfully');
            // Log the current configuration
            console.log('Current MSAL configuration:', {
                redirectUri: msalConfig.auth.redirectUri,
                postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
                environment: process.env.NODE_ENV
            });
        } catch (error) {
            console.error('Failed to initialize MSAL:', error);
            throw error;
        }
    }
};

// Login request object
const loginRequest = {
    scopes: ["openid", "profile", "offline_access"],
};

// Function to handle login
export const login = async () => {
    try {
        // Ensure MSAL is initialized
        await initializeMsal();

        // Check if there's an interaction in progress
        if (msalInstance.getAllAccounts().length > 0) {
            // If user is already logged in, just return the account
            const account = msalInstance.getAllAccounts()[0];
            msalInstance.setActiveAccount(account);
            return { account };
        }

        // Check for interaction in progress
        const currentAccount = msalInstance.getActiveAccount();
        if (!currentAccount) {
            try {
                // Clear any existing interactions
                await msalInstance.handleRedirectPromise();
            } catch (error) {
                console.log("No redirect promise to handle");
            }
        }
        
        // Log the login attempt configuration
        console.log('Attempting login with configuration:', {
            redirectUri: msalConfig.auth.redirectUri,
            scopes: loginRequest.scopes
        });
        
        // Use loginPopup for a better user experience with PKCE
        const response = await msalInstance.loginPopup({
            ...loginRequest,
            redirectUri: msalConfig.auth.redirectUri
        });

        if (response) {
            // Get account information
            const account = response.account;
            // Set active account
            msalInstance.setActiveAccount(account);
            return response;
        }
    } catch (error) {
        console.error("Login failed:", error);
        // Log additional error details if available
        if (error.errorCode === 'redirect_uri_mismatch') {
            console.error('Redirect URI mismatch details:', {
                providedUri: msalConfig.auth.redirectUri,
                errorMessage: error.message
            });
        }
        throw error;
    }
};

// Function to handle logout
export const logout = async () => {
    try {
        // Ensure MSAL is initialized
        await initializeMsal();
        
        const logoutRequest = {
            account: msalInstance.getActiveAccount(),
        };
        return msalInstance.logout(logoutRequest);
    } catch (error) {
        console.error("Logout failed:", error);
        throw error;
    }
};

// Function to get access token
export const getToken = async () => {
    try {
        // Ensure MSAL is initialized
        await initializeMsal();
        
        const account = msalInstance.getActiveAccount();
        if (!account) {
            throw new Error("No active account!");
        }

        const request = {
            scopes: ["openid", "profile", "offline_access"],
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
    } catch (error) {
        console.error("Token acquisition failed:", error);
        throw error;
    }
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
    return !!msalInstance.getActiveAccount();
};

// Export the MSAL instance
export { msalInstance }; 