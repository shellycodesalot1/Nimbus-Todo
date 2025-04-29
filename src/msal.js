// msal.js
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "6438927f-5f93-41f7-80aa-d6516cd19114",
    authority: "https://nimbustodo1.b2clogin.com/nimbustodo1.onmicrosoft.com/B2C_1_nimbussignup_signin",
    knownAuthorities: ["nimbustodo1.b2clogin.com"],
    redirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net",
    postLogoutRedirectUri: "https://ashy-grass-0bd7dc61e.azurestaticapps.net",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage", // or "localStorage"
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ["openid", "profile"],
};

// ✅ No initialize needed if using loginPopup
export const handleMicrosoftLogin = async () => {
  try {
    const response = await msalInstance.loginPopup(loginRequest); // 🔥 just loginPopup
    return response.account;
  } catch (error) {
    console.error("Microsoft login failed:", error);
    throw error;
  }
};
