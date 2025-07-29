#!/bin/bash
# deploy-teams-function.sh
# Script to deploy the Teams meeting Supabase Edge Function

echo "🚀 Deploying Teams Meeting Edge Function to Supabase"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "Install it with: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase."
    echo "Login with: supabase login"
    exit 1
fi

echo "✅ Supabase authentication verified"

# Deploy the function
echo "📦 Deploying create-teams-meeting function..."
supabase functions deploy create-teams-meeting

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Teams meeting function deployed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Add your Azure secrets to Supabase Edge Functions environment"
    echo "2. Update your Azure App Registration to use Application permissions"
    echo "3. Grant admin consent for your tenant"
    echo ""
    echo "Your function URL:"
    echo "https://your-project.supabase.co/functions/v1/create-teams-meeting"
    echo ""
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
