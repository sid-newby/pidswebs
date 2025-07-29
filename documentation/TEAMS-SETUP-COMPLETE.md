# Teams Integration Setup - Complete Guide

## ✅ What's Been Created

Your Teams scheduler now works with **any external email domain** (Gmail, Yahoo, other companies, etc.) using Supabase Edge Functions instead of a separate backend server.

### Files Created:
- `supabase/functions/create-teams-meeting/index.ts` - Edge function for creating Teams meetings
- `supabase/functions/create-teams-meeting/deno.json` - Deno configuration
- `supabase/functions/create-teams-meeting/types.d.ts` - TypeScript declarations
- `documentation/supabase-teams-setup.md` - Complete setup guide
- `deploy-teams-function.sh` - Deployment script

### Files Updated:
- `src/services/teamsBackendService.js` - Now uses Supabase Edge Function
- `src/components/TeamsScheduler.jsx` - Updated to work with new backend

## 🚀 Next Steps to Complete Setup

### 1. Azure App Registration Changes (CRITICAL)
```bash
# Current issue: Your Azure app only has DELEGATED permissions
# This only allows same-domain users (won't work with external emails)

# Required: Change to APPLICATION permissions
```

**Steps:**
1. Go to [Azure Portal](https://portal.azure.com) → App Registrations
2. Find your app: `6f89e14a-61b2-4211-bf1b-12092d8e0172`
3. Go to "API permissions"
4. **DELETE** all current delegated permissions
5. **ADD** these Application permissions:
   - `Microsoft Graph → Application permissions → Calendars.ReadWrite`
   - `Microsoft Graph → Application permissions → OnlineMeetings.ReadWrite`
6. Click "Grant admin consent for [Your Organization]"
7. Go to "Certificates & secrets" → Create new client secret
8. **Save the client secret value** (you'll need it for Supabase)

### 2. Add Secrets to Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Edge Functions → Environment Variables
4. Add these secrets:

```bash
AZURE_CLIENT_ID=6f89e14a-61b2-4211-bf1b-12092d8e0172
AZURE_CLIENT_SECRET=your-new-client-secret-from-step-1
AZURE_TENANT_ID=94ae48a2-8514-481d-876c-86651ae94f96
ORGANIZER_USER_ID=your-email@yourcompany.com  # Optional
```

### 3. Deploy the Function
```bash
# Make deployment script executable
chmod +x deploy-teams-function.sh

# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Deploy the function
./deploy-teams-function.sh
```

### 4. Test the Integration
1. Open your app in browser
2. Try to schedule a Teams meeting with an external email (like @gmail.com)
3. Check browser console for any errors
4. Verify meeting appears in your calendar
5. Confirm external user receives invitation

## 🔧 Current Environment Variables

### Your Frontend (.env) - ✅ Already Set:
```bash
VITE_SUPABASE_URL=https://pezxclevoxxultsilpqh.supabase.co
VITE_SUPABASE_ANON_PUBLIC=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_AZURE_CLIENT_ID=6f89e14a-61b2-4211-bf1b-12092d8e0172
VITE_AZURE_TENANT_ID=94ae48a2-8514-481d-876c-86651ae94f96
VITE_AZURE_REDIRECT_URI=http://localhost:5174
```

### Supabase Environment - ❌ Need to Add:
```bash
AZURE_CLIENT_ID=6f89e14a-61b2-4211-bf1b-12092d8e0172
AZURE_CLIENT_SECRET=your-client-secret-from-azure
AZURE_TENANT_ID=94ae48a2-8514-481d-876c-86651ae94f96
ORGANIZER_USER_ID=your-email@yourcompany.com  # Who hosts the meetings
```

## 🎯 Key Benefits After Setup

✅ **Works with ANY email domain**
- `customer@gmail.com` ✅
- `client@yahoo.com` ✅  
- `partner@anydomain.com` ✅

✅ **No separate backend server needed**
✅ **Secure client secret storage**
✅ **Scales automatically**
✅ **Cost-effective (Supabase free tier)**

## 🆘 Troubleshooting

### Function Not Deploying
```bash
# Check if you're logged in
supabase projects list

# If not logged in
supabase login

# Try deploying again
supabase functions deploy create-teams-meeting
```

### Meeting Creation Fails
1. Check Supabase function logs:
   ```bash
   supabase functions logs create-teams-meeting
   ```
2. Verify Azure permissions are **Application** (not Delegated)
3. Ensure admin consent is granted
4. Check all environment variables are set in Supabase

### External Users Not Getting Invitations
- This should work with Application permissions
- Check that the meeting appears in your calendar
- Verify the external email is valid
- Test with a real email address you can access

## 📞 Need Help?

If you run into issues:
1. Check the detailed setup guide: `documentation/supabase-teams-setup.md`
2. Verify Azure permissions are set to **Application** (most common issue)
3. Ensure all Supabase environment variables are set
4. Check function deployment logs

The main change needed is switching from **Delegated** to **Application** permissions in Azure - this is what enables external domain invitations!
