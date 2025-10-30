# Echorithm Frontend

Modern React-based frontend for the Echorithm Personalized News Aggregator.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components (Login, Register)
│   ├── Header/         # Navigation header
│   ├── Sidebar/        # Category sidebar
│   ├── NewsCard/       # Article cards with embedded reader
│   ├── Footer/         # Footer component
│   └── profile/        # User profile components
├── pages/              # Page components
│   ├── Home.jsx        # Main news feed
│   └── ForYou.jsx      # Personalized feed
├── services/           # API integration
│   └── api.js          # Axios instance & endpoints
├── constants/          # App constants
│   └── categories.js   # News categories
└── utils/              # Utility functions
    └── formatDate.js   # Date formatting
```

## 🛠️ Tech Stack

- **React 19.1.0** - UI library
- **Vite 7.0.0** - Build tool & dev server
- **React Router 7.6.3** - Client-side routing
- **Axios 1.8.0** - HTTP client

## 🎨 Design System

The app uses a consistent design system with:
- **Primary Gradient**: Purple to Pink (#7b2ff7 → #f107a3)
- **Accent Color**: Cyan (#38bdf8)
- **Typography**: Inter (body), Poppins/Montserrat (headings)
- **Spacing**: Standardized spacing scale (xs, sm, md, lg, xl, 2xl)

See `DESIGN_SYSTEM.md` in the project root for full details.

## 🔑 Environment Variables

Create a `.env` file in this directory:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## 📦 Available Scripts

- `npm run dev` - Start development server on `http://localhost:5173`
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🔧 Configuration

- **Vite Config**: `vite.config.js`
- **ESLint Config**: `eslint.config.js`

## 📖 Component Guide

### NewsCard
Displays article with:
- Sentiment analysis badges
- Named entity chips
- Category tags
- Embedded iframe reader with live timer
- Bookmark functionality

### Header
Navigation with:
- Logo and branding
- Category links
- User profile dropdown
- Authentication state

### Sidebar
Category filtering with:
- Visual category cards
- Icon representations
- Article counts
- Active state highlighting

For complete project documentation, see the main `README.md` in the project root.
