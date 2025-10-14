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

3. Configure environment variables:
   - Copy the example file and rename it if needed (for Vite you can use `.env`, `.env.local`, or `.env.development`).

```bash
cp .env.example .env.development
```

4. Edit your environment file and add your Google Gemini credentials:

```env
GOOGLE_API_KEY=your-google-gemini-api-key
GOOGLE_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

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

## Google Gemini Integration

The AI-powered effects are generated using the [Google Gemini API](https://ai.google.dev/). Provide an API key and a model endpoint capable of returning image responses (for example `gemini-1.5-flash`).

### Environment Variables

- `GOOGLE_API_KEY` – your Google AI Studio / Gemini API key.
- `GOOGLE_API_ENDPOINT` – the full REST endpoint for the model you want to call (e.g. `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`).

> **Tip:** When deploying, make sure these variables are available to the Vite build step. The Vite configuration exposes variables prefixed with `GOOGLE_` to the client runtime.

### Available Effects

The following preset prompts are available in the app:

- `cartoon_ghost` – Adds a playful translucent cartoon ghost companion.
- `haunted_fog` – Surrounds the scene with eerie fog and moonlit ambience.
- `vhs_glitch` – Applies a retro VHS horror glitch aesthetic.
- `pumpkin_aura` – Casts a fiery pumpkin-orange aura around the subject.

### Error Handling

The app handles:
- Network errors (with retry and exponential backoff)
- Google API errors (4xx, 5xx)
- Safety-filtered generations
- Missing configuration values

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
- Check the configured endpoint is accessible and returns image responses
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
