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
        redirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net",
        validateAuthority: false,
        postLogoutRedirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net",
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false
    },
    system: {
        allowRedirectInIframe: true,
        iframeHashTimeout: 6000
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
        throw error;
    }
} 