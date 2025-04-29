# Nimbus-Todo
Nimbus To-Do ☁️
Nimbus To-Do is a cloud-based task management app built with React and Microsoft Azure services. It offers a simple, secure, and scalable way to manage tasks anywhere, anytime
 Key Features
 Secure Sign-In with Microsoft Azure Active Directory B2C (MSAL Authentication).


Task Management — Create, edit, and delete tasks effortlessly.


 Cloud Storage with Azure Cosmos DB for persistent, real-time data.


 Serverless APIs powered by Azure Functions (CRUD operations).


 Analytics Dashboard to view task insights and completions.


 Modern UI — Responsive, clean, and intuitive with React and custom styling.


Global Availability using Azure Static Web Apps for fast and reliable access.


Project Structure
NIMBUS-TODO/
├── .github/                    # GitHub workflows
├── .vscode/                    # Editor settings
├── azure-functions/            # Azure serverless backend (APIs for tasks)
├── build/                      # Production build output
├── node_modules/               # Node.js dependencies
├── public/                     # Static public assets
├── src/                        # React app source code
│   ├── api/                    # Frontend API service calls
│   ├── components/             # Reusable UI components
│   ├── context/                # Global app state (Auth, Tasks)
│   ├── fonts/                  # Custom fonts
│   ├── AnalyticsPage.js        # Analytics view
│   ├── Dashboard.js            # Dashboard home
│   ├── HomePage.js             # Task listing
│   ├── LoginPage.js            # Sign-In screen
│   ├── SignUp.js               # User registration
│   ├── auth.js                 # Authentication handling
│   ├── azure.js                # MSAL configuration
│   ├── msal.js                 # MSAL instance
│   └── ...                     # CSS & Support files
├── app.js                      # Azure Functions local runtime
├── index.html                  # Main HTML shell
├── login.html                  # Static fallback login page
├── signup.html                 # Static fallback signup page
├── staticwebapp.config.json     # Azure Static Web Apps routing and auth config
├── local.settings.json         # Local Azure Functions settings
├── .env                        # Local environment variables
├── package.json                # NPM package file (frontend)
├── README.md                   # Project documentation
└── others...
Tech Stack
Frontend
Backend
Cloud
Other
React.js
Azure Functions
Azure Static Web Apps
HTML, CSS
JavaScript
Node.js
Azure Cosmos DB
MSAL Authentication


 How to Run Locally
1. Clone the repository
git clone https://github.com/your-username/Nimbus-Todo.git
cd Nimbus-Todo
2. Install project dependencies
npm install
3. Set up environment variables
Create a .env file at the project root:
REACT_APP_CLIENT_ID=your-azure-client-id
REACT_APP_TENANT_NAME=your-b2c-tenant-name
REACT_APP_SIGNIN_POLICY=your-signin-policy
REACT_APP_AUTHORITY_DOMAIN=your-b2c-authority-domain
REACT_APP_FUNCTION_APP_URL=https://your-function-app.azurewebsites.net
4. Run the frontend
npm start
Local app available at http://localhost:3000/.
5. Run the Azure Functions backend (optional for local dev)
Install Azure Functions Core Tools if not installed:
npm install -g azure-functions-core-tools@4 --unsafe-perm true
Then:
cd azure-functions
func start
 Authentication Flow
User signs in through Azure Active Directory B2C via MSAL.


A secure token is issued and stored.


All protected API calls (task create/update/delete) include this token.


Static Web App routes are protected via static webapp.config.json.


 Deployment Pipeline
Frontend is deployed via Azure Static Web Apps.


Backend Functions are automatically linked to the Static Web App.




Cosmos DB stores user tasks securely.


Authentication is managed via Azure AD B2C with MSAL integration.


Deployment is fully automated with GitHub Actions (.github/workflows/).
Analytics
The AnalyticsPage.js provides insights like:
Number of tasks created


Completed tasks


Task trends over time
Acknowledgements
Microsoft Azure Static Web Apps


Azure Functions Team


MSAL.js team


React Community
