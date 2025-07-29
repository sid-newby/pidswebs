// src/services/msalAuth.js
import { PublicClientApplication } from '@azure/msal-browser';

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set to true if you have issues on IE11 or Edge
  },
};

// Create MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL
export const initializeMsal = async () => {
  try {
    await msalInstance.initialize();
    await msalInstance.handleRedirectPromise();
  } catch (error) {
    console.error('MSAL initialization error:', error);
  }
};

// Scopes needed for Teams meeting creation
const loginRequest = {
  scopes: ['User.Read', 'Calendars.ReadWrite', 'OnlineMeetings.ReadWrite'],
};

// Authentication functions
export const msalAuth = {
  // Check if user is already signed in
  isAuthenticated: () => {
    const accounts = msalInstance.getAllAccounts();
    return accounts.length > 0;
  },

  // Get current account
  getCurrentAccount: () => {
    const accounts = msalInstance.getAllAccounts();
    return accounts[0] || null;
  },

  // Sign in with popup
  signIn: async () => {
    try {
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      console.log('Login successful:', loginResponse.account);
      return loginResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    const account = msalInstance.getAllAccounts()[0];
    if (account) {
      await msalInstance.logoutPopup({
        account: account,
      });
    }
  },

  // Get access token silently
  getAccessToken: async () => {
    const account = msalInstance.getAllAccounts()[0];
    if (!account) {
      throw new Error('No authenticated account found');
    }

    const accessTokenRequest = {
      scopes: loginRequest.scopes,
      account: account,
    };

    try {
      // Try to get token silently first
      const response = await msalInstance.acquireTokenSilent(accessTokenRequest);
      return response.accessToken;
    } catch (error) {
      // If silent token acquisition fails, try with popup
      console.log('Silent token acquisition failed, trying popup');
      const response = await msalInstance.acquireTokenPopup(accessTokenRequest);
      return response.accessToken;
    }
  },
};