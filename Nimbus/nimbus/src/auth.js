import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig, loginRequest, b2cConfig } from './azure';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL as a Promise
const initializeMsal = async () => {
    if (!msalInstance.initialized) {
        try {
            await msalInstance.initialize();
            console.log('MSAL initialized successfully');
        } catch (error) {
            console.error('Failed to initialize MSAL:', error);
            throw error;
        }
    }
    return msalInstance;
};

// Initialize immediately
initializeMsal().catch(error => {
    console.error("Failed to initialize MSAL on load:", error);
});

// Function to handle Microsoft login
export async function handleMicrosoftLogin() {
    try {
        // Ensure MSAL is initialized
        const instance = await initializeMsal();
        
        // Clear any existing errors in sessionStorage
        sessionStorage.removeItem('msal.error');
        sessionStorage.removeItem('msal.interaction.error');
        
        console.log('Attempting login with config:', msalConfig);
        
        const authResult = await instance.loginPopup({
            ...loginRequest,
            prompt: "select_account"
        });
        console.log("Login successful", authResult);
        
        // Get user info from claims
        const userInfo = {
            name: authResult.account.name,
            username: authResult.account.username,
            email: authResult.account.idTokenClaims.emails?.[0],
            givenName: authResult.account.idTokenClaims.given_name,
            identityProvider: authResult.account.idTokenClaims.idp
        };
        
        return userInfo;
        
    } catch (error) {
        console.error("Login failed", error);
        console.error("Error details:", {
            name: error.name,
            message: error.message,
            errorCode: error.errorCode,
            stack: error.stack
        });

        // Check for specific error types
        if (error.errorCode === 'user_cancelled') {
            throw new Error('Login was cancelled by the user');
        } else if (error.errorCode === 'popup_window_error') {
            throw new Error('Failed to open login popup. Please allow popups for this site.');
        }
        
        throw error;
    }
}

// Export the MSAL instance for use in other files
export { msalInstance };

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
        scopes: [`https://${b2cConfig.tenantName}.onmicrosoft.com/${b2cConfig.signUpSignInPolicy}/user.read`],
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