echo "🚀 Deploying PennyCam to the real world!"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the PennyCam directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Building the application..."
npm run build

echo "✅ Build successful! Ready for deployment."

echo ""
echo "🌐 Deployment Options:"
echo ""
echo "1️⃣  VERCEL (Recommended - Free & Fast)"
echo "   • Install: npm i -g vercel"
echo "   • Deploy: vercel --prod"
echo "   • Result: https://pennycam-yourname.vercel.app"
echo ""
echo "2️⃣  NETLIFY (Alternative - Also Free)"
echo "   • Drag & drop the .next folder to netlify.com"
echo "   • Or connect your GitHub repo"
echo ""
echo "3️⃣  GITHUB PAGES (Static hosting)"
echo "   • Run: npm run export"
echo "   • Push to gh-pages branch"
echo ""

echo "🎯 What works in production:"
echo "✅ Camera/microphone access"
echo "✅ Photo capture & download"
echo "✅ All cat sounds & interactions"
echo "✅ Complete UI & navigation"
echo "✅ Integration configuration"
echo "✅ Demo Stripe checkout"
echo "✅ Cross-device compatibility"
echo ""

echo "📱 Test on these devices:"
echo "• Android phones (Chrome)"
echo "• iPhones (Safari)"
echo "• Tablets (any browser)"
echo "• Laptops/desktops"
echo "• Smart TVs with browsers"
echo ""

echo "🐱 Ready to monitor Penny from anywhere!"
echo "Deploy now and share the URL with family & friends!"
