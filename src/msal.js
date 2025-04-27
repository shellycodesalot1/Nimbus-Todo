// msal.js
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "6438927f-5f93-41f7-80aa-d6516cd19114",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage", // or "localStorage"
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ["User.Read"],
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
