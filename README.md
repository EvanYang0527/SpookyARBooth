# 🕸️ Spooky AR Photo Booth

A browser-based Halloween photo booth application that uses your camera to capture photos and applies spooky AI-powered effects. Built for the **ITS Technology Innovation Office**.

## Features

- 📸 Real-time camera preview with frame guide
- 👻 Four spooky effect options:
  - **Cartoon Ghost** - Playful ghostly overlay
  - **Haunted Fog** - Eerie fog atmosphere
  - **VHS Glitch** - Retro horror distortion
  - **Pumpkin Aura** - Fiery Halloween glow
- 🎨 AI-powered image processing
- 💾 High-resolution PNG/JPG download
- 🔄 Retry and retake functionality
- 📱 Responsive design (desktop & mobile)
- 🎃 Halloween-themed UI with orange and purple accents

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and build
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **getUserMedia API** for camera access
- **Canvas API** for image capture and processing

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome, Safari, Firefox, Edge)
- Camera access permission

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd spooky-ar-photo-booth
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables by creating a `.env.development` (or `.env`) file with your Google Gemini credentials:
```env
GOOGLE_API_KEY=your_google_gemini_api_key
GOOGLE_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

The `GOOGLE_API_ENDPOINT` value above targets the latest Gemini 1.5 Flash model and can be adjusted if you prefer a different model.

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## AI Effects API

The app now connects directly to the Google Gemini API and sends the captured photo (as base64) alongside effect-specific prompts. Gemini returns the processed image as base64, which is displayed in the results panel.

### Available Effects

- `cartoon_ghost` - Cartoon Ghost effect
- `haunted_fog` - Haunted Fog effect
- `vhs_glitch` - VHS Glitch effect
- `pumpkin_aura` - Pumpkin Aura effect

### Error Handling

The app handles:
- Network errors (with retry)
- API errors (4xx, 5xx)
- Camera access errors
- Missing Gemini configuration

Retryable errors (5xx, 429) will automatically retry up to 2 times with exponential backoff.

## Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)

## Camera Permissions

On first use, the browser will request camera permission. Users must grant access for the app to function.

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Top header with branding
│   ├── CameraView.tsx      # Camera preview and capture
│   ├── EffectPicker.tsx    # Effect selection UI
│   └── ResultPanel.tsx     # Result display and download
├── services/
│   └── effectsApi.ts       # API service with retry logic
├── App.tsx                 # Main app with state management
├── main.tsx                # App entry point
└── index.css               # Global styles

public/
└── logo.png                # Placeholder logo
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Deployment

The app is a static site and can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

Make sure to set the `GOOGLE_API_KEY` and `GOOGLE_API_ENDPOINT` environment variables in your deployment platform.

## Customization

### Changing Effects

Edit `src/components/EffectPicker.tsx` to add or modify effects.

### Styling

The app uses Tailwind CSS with a custom Halloween theme:
- Dark backgrounds (gray-900)
- Orange accents (orange-400, orange-500)
- Purple accents (purple-400, purple-600)

Modify `tailwind.config.js` to customize the theme.

### API Integration

Update `src/services/effectsApi.ts` to customize:
- Request/response format
- Retry logic
- Error handling
- Intensity settings

## Troubleshooting

### Camera not working
- Ensure browser has camera permission
- Try HTTPS (required on some browsers)
- Check if another app is using the camera

### API errors
- Verify `GOOGLE_API_KEY` and `GOOGLE_API_ENDPOINT` are set correctly
- Check API endpoint is accessible
- Review browser console for detailed errors

### Build errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## License

Built by **ITS Technology Innovation Office**

## Support

For questions or issues, contact the ITS Technology Innovation Office.

---

**Powered by ITS Technology Innovation Office 🎃**
