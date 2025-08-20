# إقرأ (Iqra) - Quran Learning PWA

A modern Progressive Web App for learning Quran recitation with voice recognition and progress tracking.

## Features

### ✨ Core Features (Included)
- **Surah & Ayah Picker** - Browse and select from essential Quranic verses with tajweed colors
- **Module System** - Organized learning modules for structured practice
- **Voice Recognition** - Record your pronunciation and get instant feedback using Arabic text
- **Progress Tracking** - Track accuracy, attempts, and learning streaks
- **PWA Support** - Install on mobile and desktop, works offline for UI/text

### 📱 Technical Features
- Responsive design for mobile and desktop
- Web Speech API for voice recognition
- localStorage for offline progress tracking
- Service Worker for PWA functionality
- Tajweed color-coded text display
- Robust Arabic text normalization for accurate voice comparison

### 🚫 Non-Scope (Not Included)
- **No Native Mobile Apps** - Web-only, no Flutter/React Native/Android Studio
- **No Offline Speech Recognition** - Voice features require internet connection
- **No Advanced Backend** - Uses localStorage only, no database/server
- **No Complete Quran** - Limited to essential surahs for demo purposes

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern browser with Web Speech API support (Chrome recommended)

### Installation & Running

**Development:**
```bash
npm i && npm run dev
```
Then open `http://localhost:5173` and allow microphone access when prompted.

**Production PWA:**
```bash
npm run build && npm run preview
```
Then open `http://localhost:4173` to test the PWA build.

### Important Notes

- **Voice Features**: Require internet connection and work best in Google Chrome (desktop/Android)
- **PWA Offline**: Provides offline shell for UI and text display, but speech recognition needs internet
- **Browser Support**: Chrome/Edge recommended for full functionality

## Browser Compatibility

### Recommended Browsers
- **Google Chrome** (Desktop & Mobile) - Full support
- **Microsoft Edge** (Desktop & Mobile) - Full support
- **Safari** (Desktop & Mobile) - Limited speech recognition

### Required Permissions
- **Microphone Access** - Required for voice recognition
- **Notifications** (Optional) - For practice reminders

## Usage Guide

### Getting Started
1. **Select a Module** - Choose from beginner-friendly modules
2. **Pick a Surah** - Select which Surah to practice
3. **Choose an Ayah** - Navigate through verses
4. **Study the Text** - Review Arabic, transliteration, and translation
5. **Practice Speaking** - Click the microphone to record your pronunciation
6. **Get Feedback** - See accuracy scores and areas for improvement
7. **Track Progress** - Monitor your learning journey

### Module Structure
- **Module 1: Essential Surahs** - Al-Fatiha, Al-Ikhlas, Al-Falaq, An-Nas
- **Module 2: Al-Fatiha Mastery** - Deep dive into the opening chapter
- **Module 3: Protection Surahs** - Focus on Al-Falaq and An-Nas

### Voice Recognition Tips
- Speak clearly and at a moderate pace
- Use a quiet environment
- Allow microphone access in browser settings
- Practice transliteration pronunciation first
- Aim for 70%+ accuracy for "correct" classification

## PWA Installation

### On Mobile (Android/iOS)
1. Open the app in Chrome/Safari
2. Tap the "Add to Home Screen" option
3. The app will install like a native app

### On Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Or use Chrome menu → "Install Iqra..."

## Data & Privacy

### Local Storage
- All progress data is stored locally in your browser
- No data is sent to external servers
- Data persists between sessions
- Clear browser data to reset progress

### Speech Recognition
- Uses browser's built-in Web Speech API
- Audio is processed locally when possible
- Some browsers may send audio to cloud services
- No audio recordings are permanently stored

## Project Structure

```
Iqra/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── favicon.svg           # App icon
│   └── pwa-icon.svg          # PWA icons
├── src/
│   ├── components/           # React components
│   │   ├── Header.jsx
│   │   ├── ModuleSelector.jsx
│   │   ├── SurahPicker.jsx
│   │   ├── AyahDisplay.jsx
│   │   ├── VoiceRecorder.jsx
│   │   └── ProgressTracker.jsx
│   ├── data/
│   │   └── quranData.js      # Quran text with tajweed
│   ├── utils/
│   │   ├── storage.js        # localStorage utilities
│   │   └── speechRecognition.js # Speech API utilities
│   ├── App.jsx               # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.js           # Vite configuration
└── README.md
```

## Technologies Used

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library

### PWA Features
- **Vite PWA Plugin** - Service worker and manifest generation
- **Web Speech API** - Voice recognition
- **localStorage** - Offline data persistence

### Styling
- **CSS Custom Properties** - Design system
- **Responsive Design** - Mobile-first approach
- **Flexbox/Grid** - Layout system

## Troubleshooting

### Speech Recognition Not Working
- Ensure you're using Chrome or Edge browser
- Check microphone permissions in browser settings
- Try refreshing the page and allowing permissions again
- Test microphone with other applications

### PWA Not Installing
- Make sure you're using HTTPS (or localhost)
- Clear browser cache and try again
- Check if browser supports PWA installation

### Progress Not Saving
- Ensure localStorage is enabled in browser
- Check if you're in incognito/private mode
- Try clearing browser data and starting fresh

## Future Enhancements

### Potential Features (Not in Current Scope)
- Additional Surahs and complete Quran text
- Audio playback of proper pronunciation
- Advanced tajweed rules explanation
- Social features and leaderboards
- Offline speech recognition
- Multiple language support

## Contributing

This is a Final Year Project demo. For educational purposes:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. The Quranic text is in the public domain.

## Acknowledgments

- Quranic text sourced from open-source Islamic databases
- Tajweed rules based on traditional Islamic scholarship
- Web Speech API provided by browser vendors
- Icon design inspired by Islamic calligraphy

---

**Made with ❤️ for learning and education**

*"Read! In the name of your Lord who created." - Quran 96:1*
