#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting deployment process..."

# Install Vercel CLI globally
echo "📦 Installing Vercel CLI..."
npm install -g vercel

# Build the application
echo "🔨 Building the application..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel deploy --prod

echo "✅ Deployment completed successfully!"

# Optional: Set up custom domain alias (uncomment and modify as needed)
# echo "🔗 Setting up custom domain..."
# vercel alias set your-deployment-url.vercel.app your-custom-domain.com

echo "🎉 All done! Your application is now live."
