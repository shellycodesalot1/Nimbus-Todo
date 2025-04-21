import * as msal from '@azure/msal-browser';

// 🔐 B2C Config
const b2cConfig = {
  tenantName: "nimbustodo1",
  clientId: "6438927f-5f93-41f7-80aa-d6516cd19114",
  signUpSignInPolicy: "B2C_1_nimbussignup_signin",
  authorityDomain: "b2clogin.com"
};

// 🧭 Authority URL
const authorityBase = `https://${b2cConfig.tenantName}.${b2cConfig.authorityDomain}`;
const authority = `${authorityBase}/${b2cConfig.tenantName}.onmicrosoft.com/${b2cConfig.signUpSignInPolicy}`;

// ⚙️ MSAL Configuration
const msalConfig = {
  auth: {
    clientId: b2cConfig.clientId,
    authority,
    knownAuthorities: [`${b2cConfig.tenantName}.${b2cConfig.authorityDomain}`],
    redirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net",
    postLogoutRedirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net",
    navigateToLoginRequestUrl: true
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  },
  system: {
    allowRedirectInIframe: true,
    loggerOptions: {
      loggerCallback: (level, message) => console.log(`MSAL: ${message}`),
      logLevel: msal.LogLevel.Warning
    }
  }
};

// 🔑 Login Scopes
export const loginRequest = {
  scopes: ["openid", "profile", "offline_access"]
};

// 🚀 Create and export MSAL instance
export const msalInstance = new msal.PublicClientApplication(msalConfig);

// ✅ Initialize MSAL before login
export const initializeMsal = async () => {
  try {
    await msalInstance.initialize();
    console.log("MSAL initialized successfully ✅");
  } catch (error) {
    console.error("❌ MSAL initialization failed:", error);
    throw error;
  }
};

// ✅ Login Helper (Now includes initialization check)
export const handleMicrosoftLogin = async () => {
  try {
    // Ensure MSAL is initialized
    if (!msalInstance.getActiveAccount()) {
      await initializeMsal();
    }

    // Try logging in
    const response = await msalInstance.loginPopup(loginRequest);
    const account = response.account;
    msalInstance.setActiveAccount(account);  // Set active account

    return {
      name: account.name,
      username: account.username
    };
  } catch (error) {
    console.error("❌ Microsoft login failed:", error);
    throw error;
  }
};