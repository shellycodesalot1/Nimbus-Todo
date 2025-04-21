import * as msal from '@azure/msal-browser';

// B2C Configuration
const b2cConfig = {
    tenantName: "nimbustodo1",
    clientId: "6438927f-5f93-41f7-80aa-d6516cd19114",
    signUpSignInPolicy: "B2C_1_nimbussignup_signin",
    authorityDomain: "b2clogin.com"
};

// Build authority URL
const authorityBase = `https://${b2cConfig.tenantName}.${b2cConfig.authorityDomain}`;
const signUpSignInAuthority = `${authorityBase}/${b2cConfig.tenantName}.onmicrosoft.com/${b2cConfig.signUpSignInPolicy}`;

// Microsoft Azure B2C configuration
const msalConfig = {
    auth: {
        clientId: b2cConfig.clientId,
        authority: signUpSignInAuthority,
        knownAuthorities: [`${b2cConfig.tenantName}.${b2cConfig.authorityDomain}`],
        redirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net/dashboard",
        validateAuthority: false,
        postLogoutRedirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net"
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    },
    system: {
        allowNativeBroker: false, 
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case msal.LogLevel.Error:
                        console.error(message);
                        return;
                    case msal.LogLevel.Info:
                        console.info(message);
                        return;
                    case msal.LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case msal.LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            },
            piiLoggingEnabled: false
        },
        windowHashTimeout: 60000,
        iframeHashTimeout: 6000,
        loadFrameTimeout: 0,
    }
};

// Debug logging
console.log('B2C Authority:', signUpSignInAuthority);
console.log('MSAL Config:', {
    clientId: msalConfig.auth.clientId,
    authority: msalConfig.auth.authority,
    redirectUri: msalConfig.auth.redirectUri,
    knownAuthorities: msalConfig.auth.knownAuthorities
});

export const loginRequest = {
    scopes: [
        "openid",
        "profile",
        "offline_access"
    ]
};

// Initialize MSAL instance
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Initialize MSAL
msalInstance.initialize().catch(error => {
    console.error("Failed to initialize MSAL:", error);
});

// Function to handle Microsoft login
export async function handleMicrosoftLogin() {
    try {
        // Ensure MSAL is initialized
        if (!msalInstance.initialized) {
            await msalInstance.initialize();
        }
        
        // Clear any existing errors in sessionStorage
        sessionStorage.removeItem('msal.error');
        sessionStorage.removeItem('msal.interaction.error');
        
        console.log('Attempting login with config:', msalConfig);
        
        const authResult = await msalInstance.loginPopup({
            ...loginRequest,
            prompt: "select_account"
        });
        console.log("Login successful", authResult);
        
        // Get user info from claims
        const userInfo = {
            name: authResult.account.name,
            username: authResult.account.username,
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