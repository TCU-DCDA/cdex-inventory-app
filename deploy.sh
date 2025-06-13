#!/bin/bash

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in the 'dist' directory"
    echo "🚀 You can now:"
    echo "   1. Push this to GitHub"
    echo "   2. Go to your repo Settings > Pages"
    echo "   3. Set source to 'GitHub Actions'"
    echo "   4. The .github/workflows/pages.yml will deploy automatically"
else
    echo "❌ Build failed!"
    exit 1
fi
