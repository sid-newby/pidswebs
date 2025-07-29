# Supabase Edge Function Setup for Teams Integration

This guide shows how to set up Teams meeting creation using Supabase Edge Functions instead of a separate backend server.

## Prerequisites

1. Supabase project set up
2. Azure App Registration with **Application Permissions** (not delegated)

## Step 1: Azure App Registration Setup

### Required Application Permissions:
- `Calendars.ReadWrite` (Application)
- `OnlineMeetings.ReadWrite` (Application)
- `User.Read.All` (Application) - optional

### Steps:
1. Go to Azure Portal → App Registrations
2. Select your app registration
3. Go to "API permissions"
4. **Remove all delegated permissions**
5. **Add Application permissions:**
   - Microsoft Graph → Application permissions
   - Search for and add: `Calendars.ReadWrite`, `OnlineMeetings.ReadWrite`
6. **Grant admin consent** for your tenant
7. Go to "Certificates & secrets"
8. Create a new **client secret** (save this securely!)

## Step 2: Supabase Environment Variables

Add these secrets to your Supabase project:

1. Go to Supabase Dashboard → Settings → Edge Functions
2. Add the following environment variables:

```bash
AZURE_CLIENT_ID=your-client-id-from-azure
AZURE_CLIENT_SECRET=your-client-secret-from-azure  
AZURE_TENANT_ID=your-tenant-id-from-azure
ORGANIZER_USER_ID=organizer@yourcompany.com  # Optional, defaults to 'me'
```

## Step 3: Deploy the Edge Function

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase functions deploy create-teams-meeting

# Or deploy all functions
supabase functions deploy
```

## Step 4: Test the Setup

Your frontend will automatically use the Supabase Edge Function at:
```
https://your-project.supabase.co/functions/v1/create-teams-meeting
```

## Step 5: Verify Integration

1. Open your app
2. Try to schedule a Teams meeting
3. Check the browser console for any errors
4. Verify the meeting appears in the organizer's calendar
5. Confirm external attendees receive the invitation

## Environment Variables Summary

### Frontend (.env):
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_PUBLIC=your-anon-key
VITE_AZURE_CLIENT_ID=your-client-id  # Only for display purposes
VITE_AZURE_TENANT_ID=your-tenant-id  # Only for display purposes
```

### Supabase Edge Function Environment:
```bash
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret  # NEVER expose this in frontend!
AZURE_TENANT_ID=your-tenant-id
ORGANIZER_USER_ID=organizer@yourcompany.com  # Optional
```

## Benefits of This Approach

✅ **No separate backend server needed**
✅ **Works with external attendees from any domain**
✅ **Secure client secret storage**
✅ **Scales automatically with Supabase**
✅ **Integrated with your existing Supabase setup**

## Troubleshooting

### Function Not Found
- Ensure the function is deployed: `supabase functions deploy create-teams-meeting`
- Check function logs: `supabase functions logs create-teams-meeting`

### Permission Denied
- Verify you have **Application permissions**, not delegated
- Ensure admin consent is granted for your tenant

### Meeting Creation Fails
- Check Supabase function logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure the organizer user has a valid Microsoft 365 license

### External Attendees Not Receiving Invitations
- This is expected with application permissions
- The meeting will be created and attendees should receive calendar invitations
- Test with a real external email address

## Cost Considerations

- Supabase Edge Functions have generous free tier limits
- Much more cost-effective than running a dedicated backend server
- Scales automatically with usage
