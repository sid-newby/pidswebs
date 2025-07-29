// src/services/msalAuth.js
import { PublicClientApplication } from '@azure/msal-browser';

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || import.meta.env.VITE_SITE_URL || window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage', // Use localStorage to persist across tabs/windows
    storeAuthStateInCookie: false, // Set to true if you have issues on IE11 or Edge
  },
  system: {
    allowNativeBroker: false, // Disables WAM Broker
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
    navigateFrameWait: 0
  }
};

// Create MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Store auth token temporarily in sessionStorage to survive page reloads
const AUTH_TEMP_KEY = 'msal_temp_token';

// Initialize MSAL
export const initializeMsal = async () => {
  try {
    console.log('MSAL initializing...');
    
    // Check for temporary stored auth data first
    const tempAuthData = sessionStorage.getItem(AUTH_TEMP_KEY);
    if (tempAuthData) {
      console.log('Found temporary auth data:', tempAuthData);
      sessionStorage.removeItem(AUTH_TEMP_KEY);
    }
    
    await msalInstance.initialize();
    console.log('MSAL initialized successfully');
    
    console.log('Current URL:', window.location.href);
    console.log('URL hash:', window.location.hash);
    console.log('URL search:', window.location.search);
    
    // Check if there's an auth response in the URL hash BEFORE trying handleRedirectPromise
    if (window.location.hash.includes('code=') || window.location.hash.includes('access_token=')) {
      console.log('Auth hash detected, storing temporarily and processing...');
      console.log('Hash content:', window.location.hash);
      
      // Store the hash for potential recovery
      sessionStorage.setItem(AUTH_TEMP_KEY, window.location.hash);
    }
    
    // Always try to handle redirect promise
    console.log('Handling redirect promise...');
    const response = await msalInstance.handleRedirectPromise();
    console.log('Redirect promise result:', response);
    
    if (response) {
      console.log('Authentication successful!', response.account);
      // Clean the URL hash and remove temp storage
      window.history.replaceState({}, document.title, window.location.pathname);
      sessionStorage.removeItem(AUTH_TEMP_KEY);
      return;
    }
    
    // If we had a hash but no response, something went wrong
    if (window.location.hash.includes('code=') || window.location.hash.includes('access_token=')) {
      console.log('Auth hash detected but no response from handleRedirectPromise - this indicates an issue');
      console.log('Cleaning URL hash...');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Check if we need to initiate login from query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'true') {
      console.log('Login parameter detected, initiating login...');
      // Remove the login parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Use MSAL redirect directly
      try {
        await msalInstance.loginRedirect(loginRequest);
      } catch (error) {
        console.error('Login redirect failed:', error);
      }
      return;
    }
    
    // Check if there are any cached accounts
    console.log('Checking cached accounts...');
    const accounts = msalInstance.getAllAccounts();
    console.log('Cached accounts:', accounts);
    
    console.log('MSAL initialization complete');
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

  // Sign in - try popup first, fallback to redirect
  signIn: async () => {
    try {
      console.log('Starting sign-in process...');
      
      // Try popup first (works better for embedded contexts)
      try {
        console.log('Attempting popup login...');
        const response = await msalInstance.loginPopup(loginRequest);
        console.log('Popup login successful:', response.account);
        return response;
      } catch (popupError) {
        console.log('Popup login failed, trying redirect:', popupError);
        
        // If popup fails, try redirect
        try {
          await msalInstance.loginRedirect(loginRequest);
          // loginRedirect doesn't return - it redirects the page
          return null;
        } catch (redirectError) {
          console.log('Redirect also failed:', redirectError);
          throw new Error('Both popup and redirect authentication methods failed. Please try again or contact support.');
        }
      }
    } catch (error) {
      console.error('Sign-in error:', error);
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
      console.log('Silent token acquisition failed, trying popup:', error);
      const response = await msalInstance.acquireTokenPopup(accessTokenRequest);
      return response.accessToken;
    }
  },
};
