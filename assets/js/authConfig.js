// Config object to be passed to Msal on creation.
// For a full list of msal.js configuration parameters, 
// visit https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
const msalConfig = {
    auth: {
        clientId: "30ce4608-5ead-46e3-8d90-f5d8c0d41d36",
        authority: "https://login.microsoftonline.com/3596192b-fdf5-4e2c-a6fa-acb706c963d8",
        redirectUri: "https://tablerstation.us/DowntimePlanner/",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
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
            }
        }
    }
};

// Add here the scopes that you would like the user to consent during sign-in
const loginRequest = {
    scopes: ["User.Read"]
};

// Add here the scopes to request when obtaining an access token for MS Graph API

const tokenRequest = {
    scopes: ["User.Read", "Mail.Read", "Sites.Read.All", "Sites.ReadWrite.All", "People.Read"],
    forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};
