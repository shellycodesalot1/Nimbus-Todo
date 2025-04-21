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

// Define redirect URIs exactly as registered in B2C
const redirectUris = {
    development: {
        loginRedirectUri: 'http://localhost:3000',
        logoutRedirectUri: 'http://localhost:3000'
    },
    production: {
        loginRedirectUri: 'https://ashy-grass-0bd7dc61e.azurestaticapps.net',
        logoutRedirectUri: 'https://ashy-grass-0bd7dc61e.azurestaticapps.net'
    }
};

// Get the current environment's URIs
const isDevelopment = process.env.NODE_ENV === 'development';
const currentUris = isDevelopment ? redirectUris.development : redirectUris.production;

// Microsoft Azure B2C configuration
export const msalConfig = {
    auth: {
        clientId: b2cConfig.clientId,
        authority: signUpSignInAuthority,
        knownAuthorities: [`${b2cConfig.tenantName}.${b2cConfig.authorityDomain}`],
        redirectUri: currentUris.loginRedirectUri,
        navigateToLoginRequestUrl: true,
        validateAuthority: false,
        postLogoutRedirectUri: currentUris.logoutRedirectUri
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true
    },
    system: {
        allowNativeBroker: false,
        windowHashTimeout: 60000,
        iframeHashTimeout: 6000,
        loadFrameTimeout: 0,
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
                    default:
                        console.log(message);
                        return;
                }
            },
            piiLoggingEnabled: false
        }
    }
};

// Debug logging
console.log('Environment:', process.env.NODE_ENV);
console.log('B2C Authority:', signUpSignInAuthority);
console.log('MSAL Config:', {
    clientId: msalConfig.auth.clientId,
    authority: msalConfig.auth.authority,
    redirectUri: msalConfig.auth.redirectUri,
    postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
    knownAuthorities: msalConfig.auth.knownAuthorities
});

export const loginRequest = {
    scopes: [
        "openid",
        "profile",
        "offline_access"
    ]
}; 