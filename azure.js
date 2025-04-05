// Microsoft Azure integration functions

// Initialize MSAL (Microsoft Authentication Library) configuration
const msalConfig = {
    auth: {
        clientId: "YOUR_AZURE_AD_CLIENT_ID", // Replace with your Azure AD client ID
        authority: "https://login.microsoftonline.com/YOUR_TENANT_ID", // Replace with your tenant ID
        redirectUri: window.location.origin
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
    }
};

// Create MSAL instance
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Azure AD scopes
const loginRequest = {
    scopes: ["openid", "profile", "User.Read"]
};

// Azure AD B2C scopes (if using B2C)
const b2cScopes = ["https://yourtenant.onmicrosoft.com/yourapp/read"]; // Replace with your B2C scopes

// Function to handle Microsoft login
async function handleMicrosoftLogin() {
    try {
        const authResult = await msalInstance.loginPopup(loginRequest);
        console.log("Login successful", authResult);
        
        // Store the account info
        const account = msalInstance.getAccount();
        localStorage.setItem("azureAccount", JSON.stringify(account));
        
        // Get user info
        const userInfo = await getUserInfo(authResult.accessToken);
        
        // Store user data in your app
        localStorage.setItem("userData", JSON.stringify({
            name: userInfo.name || userInfo.displayName,
            email: userInfo.mail || userInfo.userPrincipalName,
            avatar: null // You can fetch this from Microsoft Graph if needed
        }));
        
        // Generate your app's auth token and store it
        const appToken = await getAppToken(userInfo);
        localStorage.setItem("authToken", appToken);
        
        // Redirect to main app
        window.location.href = "../index.html";
        
    } catch (error) {
        console.error("Login failed", error);
        alert("Microsoft login failed: " + error.message);
    }
}

// Function to get user info from Microsoft Graph
async function getUserInfo(accessToken) {
    try {
        const response = await fetch("https://graph.microsoft.com/v1.0/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch user info");
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error getting user info", error);
        throw error;
    }
}

// Function to get your app's token after Microsoft auth
async function getAppToken(userInfo) {
    // In a real app, you would call your backend to:
    // 1. Verify the Microsoft auth
    // 2. Create or update the user in your database
    // 3. Return your app's JWT token
    
    // This is a mock implementation
    return "sample-app-token-based-on-azure-auth";
}

// Function to connect to Azure Storage (for file attachments)
async function connectToAzureStorage() {
    // Implementation for connecting to Azure Blob Storage
    // This would allow users to attach files to tasks
}

// Function to save task data to Azure Cosmos DB
async function saveTasksToAzure(tasks) {
    // Implementation for saving tasks to Azure Cosmos DB
}

// Function to sync tasks with Azure
async function syncWithAzure() {
    try {
        // Check if user is authenticated with Azure
        const account = JSON.parse(localStorage.getItem("azureAccount"));
        if (!account) {
            await handleMicrosoftLogin();
            return;
        }
        
        // Get a fresh token
        const silentRequest = {
            scopes: loginRequest.scopes,
            account: account
        };
        
        const authResult = await msalInstance.acquireTokenSilent(silentRequest);
        
        // Now you can sync data with your Azure backend
        console.log("Syncing with Azure...");
        
        // Example: Save tasks to Cosmos DB
        // await saveTasksToAzure(tasks);
        
    } catch (error) {
        console.error("Sync failed", error);
        
        // If silent token acquisition fails, try with popup
        if (error instanceof msal.InteractionRequiredAuthError) {
            await handleMicrosoftLogin();
        }
    }
}

// Initialize Azure services when the app loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the main app page
    if (document.getElementById('task-list')) {
        // Check for Azure connection
        const azureAccount = localStorage.getItem("azureAccount");
        if (azureAccount) {
            console.log("Connected to Azure", JSON.parse(azureAccount));
            
            // You might want to add an indicator in the UI
            // that the app is connected to Azure
        }
    }
});