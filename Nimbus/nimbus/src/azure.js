import { LogLevel } from '@azure/msal-browser';

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
export const msalConfig = {
    auth: {
        clientId: b2cConfig.clientId,
        authority: signUpSignInAuthority,
        knownAuthorities: [authorityBase],
        redirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net/dashboard",
        postLogoutRedirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net",
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        break;
                    case LogLevel.Info:
                        console.info(message);
                        break;
                    case LogLevel.Verbose:
                        console.debug(message);
                        break;
                    case LogLevel.Warning:
                        console.warn(message);
                        break;
                }
            },
            piiLoggingEnabled: false
        },
        windowHashTimeout: 60000,
        iframeHashTimeout: 6000,
        loadFrameTimeout: 0
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
    scopes: [`https://${b2cConfig.tenantName}.onmicrosoft.com/${b2cConfig.signUpSignInPolicy}/user.read`]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
}; 