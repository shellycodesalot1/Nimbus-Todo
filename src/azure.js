import * as msal from '@azure/msal-browser';

// 🔐 Azure B2C Config
const b2cConfig = {
  tenantName: "nimbustodo1",
  clientId: "6438927f-5f93-41f7-80aa-d6516cd19114",
  signUpSignInPolicy: "B2C_1_nimbussignup_signin",
  authorityDomain: "b2clogin.com"
};

// 🧭 Authority URLs
const authorityBase = `https://${b2cConfig.tenantName}.${b2cConfig.authorityDomain}`;
const authority = `${authorityBase}/${b2cConfig.tenantName}.onmicrosoft.com/${b2cConfig.signUpSignInPolicy}`;

// ⚙️ MSAL Configuration
const msalConfig = {
  auth: {
    clientId: b2cConfig.clientId,
    authority,
    knownAuthorities: [authorityBase],
    redirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net",
    postLogoutRedirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net",
    navigateToLoginRequestUrl: true
  },
  cache: {
    cacheLocation: "localStorage", // or "sessionStorage" if preferred
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

// 🚀 MSAL Instance
export const msalInstance = new msal.PublicClientApplication(msalConfig);

// ✅ Initialize MSAL on startup (optional for popup flow)
export const initializeMsal = async () => {
  try {
    await msalInstance.initialize();
    console.log("✅ MSAL initialized");
  } catch (error) {
    console.error("❌ MSAL initialization failed:", error);
    throw error;
  }
};

// 🔐 Login with Microsoft (popup flow)
export const handleMicrosoftLogin = async () => {
  try {
    await initializeMsal(); // ensure it's initialized

    const response = await msalInstance.loginPopup(loginRequest);
    const account = response.account;
    msalInstance.setActiveAccount(account);

    console.log("✅ Login successful:", account);

    return {
      name: account.name,
      username: account.username
    };
  } catch (error) {
    console.error("❌ Microsoft login failed:", error);
    throw error;
  }
};

// 🔓 Logout
export const handleLogout = () => {
  const logoutRequest = {
    account: msalInstance.getActiveAccount()
  };
  msalInstance.logoutRedirect(logoutRequest);
};

// 🎟️ Get Access Token
export const getToken = async () => {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    throw new Error("No active account");
  }

  const tokenRequest = {
    ...loginRequest,
    account
  };

  try {
    const response = await msalInstance.acquireTokenSilent(tokenRequest);
    return response.accessToken;
  } catch (error) {
    if (error instanceof msal.InteractionRequiredAuthError) {
      const response = await msalInstance.acquireTokenPopup(tokenRequest);
      return response.accessToken;
    }
    throw error;
  }
};

// 🕵️ Check if user is authenticated
export const isAuthenticated = () => {
  return !!msalInstance.getActiveAccount();
};
