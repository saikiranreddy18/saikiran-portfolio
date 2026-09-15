# Interactive Portfolio

A modern, interactive portfolio website built with Next.js and deployed on Vercel for automatic updates.

## Features

- ⚡ Fast performance with Next.js 14
- 🚀 Automatic deployment with Vercel
- 📱 Responsive design
- 🎨 Interactive room experience
- 🔄 Auto-deploy on git push

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## Deployment with Vercel

### Initial Setup

1. **Push to GitHub**
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Enable Auto-Deploy**
   - Vercel automatically deploys on every push to `main` branch
   - No additional setup needed!

### Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# For production
vercel --prod
```

## Project Structure

```
portfolio/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page (redirects to /portfolio)
│   ├── portfolio/      # Portfolio page
│   ├── globals.css     # Global styles
├── public/             # Static files (portfolio assets)
│   ├── index.html      # Portfolio app
│   ├── assets/         # JS and CSS files
│   └── images/         # Images
├── package.json        # Dependencies
├── next.config.js      # Next.js configuration
├── vercel.json         # Vercel deployment config
└── README.md           # This file
```

## Updates

To update the portfolio:

1. Make changes locally
2. Test with `npm run dev`
3. Commit changes
4. Push to GitHub
5. Vercel automatically deploys!

```bash
git add .
git commit -m "Update portfolio content"
git push origin main
```

## Environment Variables

Create a `.env.local` file if needed (not required for this portfolio):

```
# Example
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Performance

- Lighthouse Score: 90+
- Page load time: < 2s
- Optimized assets and caching

## License

MIT

## Author

Sai Kiran  
[Your Website]  
[Your Email]
