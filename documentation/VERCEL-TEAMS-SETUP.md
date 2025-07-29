# Vercel Teams Integration Setup - Complete Guide

## ✅ What's Been Created

Your Teams scheduler now works with **any external email domain** using Vercel serverless functions.

### Files Created/Updated:
- `vercel.json` - Vercel configuration
- `api/create-teams-meeting.js` - Vercel serverless function
- `src/services/teamsBackendService.js` - Updated to use Vercel API
- `src/services/msalAuth.js` - Updated with configurable redirect URI
- `.env` - Added site URL and API base URL variables
- `package.json` - Added @azure/msal-node dependency

## 🚀 Setup Steps

### 1. Azure App Registration Changes (CRITICAL)
**Current issue: Your Azure app has DELEGATED permissions - this only works with same-domain users**

**Required: Change to APPLICATION permissions**

1. Go to [Azure Portal](https://portal.azure.com) → App Registrations
2. Find your app: `6f89e14a-61b2-4211-bf1b-12092d8e0172`
3. Go to "API permissions"
4. **DELETE** all current delegated permissions
5. **ADD** these Application permissions:
   - `Microsoft Graph → Application permissions → Calendars.ReadWrite`
   - `Microsoft Graph → Application permissions → OnlineMeetings.ReadWrite`
6. Click "Grant admin consent for [Your Organization]"
7. Go to "Certificates & secrets" → Create new client secret
8. **Save the client secret value** (you'll need it for Vercel)

### 2. Update Environment Variables

#### For Development (.env) - ✅ Already Updated:
```bash
VITE_SUPABASE_ANON_PUBLIC=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_URL=https://pezxclevoxxultsilpqh.supabase.co
VITE_AZURE_CLIENT_ID=6f89e14a-61b2-4211-bf1b-12092d8e0172
VITE_AZURE_TENANT_ID=94ae48a2-8514-481d-876c-86651ae94f96
VITE_AZURE_REDIRECT_URI=http://localhost:5174
VITE_SITE_URL=http://localhost:5174               # New
VITE_API_BASE_URL=http://localhost:5174           # New
```

#### For Production - Update These:
```bash
# When you deploy to Vercel, update these to your actual site URL:
VITE_SITE_URL=https://your-site.vercel.app
VITE_API_BASE_URL=https://your-site.vercel.app
VITE_AZURE_REDIRECT_URI=https://your-site.vercel.app
```

### 3. Vercel Environment Variables (Server-side)

In your Vercel Dashboard → Settings → Environment Variables, add:

```bash
AZURE_CLIENT_ID=6f89e14a-61b2-4211-bf1b-12092d8e0172
AZURE_CLIENT_SECRET=your-client-secret-from-azure
AZURE_TENANT_ID=94ae48a2-8514-481d-876c-86651ae94f96
ORGANIZER_USER_ID=your-email@yourcompany.com  # Optional
```

⚠️ **NEVER** put the client secret in your frontend .env file!

### 4. Deploy to Vercel

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Install dependencies
npm install

# Deploy to Vercel
vercel

# Follow the prompts to link your project
```

### 5. Update Azure Redirect URI

After deploying to Vercel:
1. Note your Vercel URL (e.g., `https://your-site.vercel.app`)
2. Go back to Azure Portal → App Registrations → Authentication
3. Update redirect URI to: `https://your-site.vercel.app`

### 6. Test the Integration

1. Visit your deployed site
2. Try to schedule a Teams meeting with an external email (@gmail.com)
3. Check browser console for errors
4. Verify meeting appears in organizer's calendar
5. Confirm external user receives invitation

## 🔧 How It Works

### Development (localhost:5174):
```
Frontend → http://localhost:5174/api/create-teams-meeting → Serverless Function
```

### Production (your-site.vercel.app):
```
Frontend → https://your-site.vercel.app/api/create-teams-meeting → Serverless Function
```

## 🎯 Key Benefits

✅ **Works with ANY email domain**
- `customer@gmail.com` ✅
- `client@yahoo.com` ✅  
- `partner@anydomain.com` ✅

✅ **No separate backend server needed**
✅ **Serverless - scales automatically**
✅ **Secure client secret storage**
✅ **Easy Vercel deployment**

## 🆘 Troubleshooting

### Function Not Working
1. Check Vercel Function Logs in dashboard
2. Verify all environment variables are set in Vercel
3. Ensure Azure permissions are **Application** (not Delegated)

### Meeting Creation Fails
1. Check Vercel function logs
2. Verify admin consent is granted in Azure
3. Test with a real external email address

### CORS Issues
The Vercel function has CORS headers configured - this should work across domains.

### External Users Not Getting Invitations
- With Application permissions, this should work
- Verify the meeting shows up in your calendar
- Check that the organizer user has a valid M365 license

## 📝 Production Checklist

- [ ] Azure permissions changed to **Application**
- [ ] Admin consent granted
- [ ] Client secret created and added to Vercel
- [ ] All Vercel environment variables set
- [ ] Site deployed to Vercel
- [ ] Azure redirect URI updated to production URL
- [ ] Production environment variables updated
- [ ] External email test successful

## 🌍 Environment Variables Summary

### Frontend (.env):
```bash
# These are safe to expose (VITE_ prefix)
VITE_SITE_URL=https://your-site.vercel.app
VITE_API_BASE_URL=https://your-site.vercel.app
VITE_AZURE_CLIENT_ID=6f89e14a-61b2-4211-bf1b-12092d8e0172
VITE_AZURE_TENANT_ID=94ae48a2-8514-481d-876c-86651ae94f96
VITE_AZURE_REDIRECT_URI=https://your-site.vercel.app
```

### Vercel (Server-side):
```bash
# These are secret and only accessible to server functions
AZURE_CLIENT_ID=6f89e14a-61b2-4211-bf1b-12092d8e0172
AZURE_CLIENT_SECRET=your-secret-value
AZURE_TENANT_ID=94ae48a2-8514-481d-876c-86651ae94f96
ORGANIZER_USER_ID=your-email@yourcompany.com
```

The key change is switching from **Delegated** to **Application** permissions in Azure - this enables external domain invitations!
