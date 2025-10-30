# 🧠 Echorithm - Personalized News Aggregator

> An AI-powered news aggregation platform that curates personalized news feeds using machine learning for summarization, sentiment analysis, and intelligent categorization.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.2.3-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [AI/ML Features](#aiml-features)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

---

## 🎯 About

**Echorithm** is a Software Engineering final year project that aggregates news from multiple sources and enhances them with AI-powered features to provide users with personalized, intelligent news consumption.

### Mission
To create a smart news platform that:
- Aggregates news from multiple reliable sources
- Uses AI to summarize, analyze sentiment, and categorize content
- Provides personalized news feeds based on user interests
- Delivers a clean, modern user experience

---

## ✨ Features

### Current Features
- ✅ **Multi-Source Aggregation** - Fetches news from NewsAPI, GNews, and Mediastack
- ✅ **AI Summarization** - Automatic article summarization using BART and T5 models
- ✅ **Sentiment Analysis** - Analyzes article sentiment (Positive/Neutral/Negative)
- ✅ **Named Entity Recognition** - Extracts persons, locations, organizations from articles
- ✅ **Automatic Categorization** - Zero-shot classification into 9+ categories
- ✅ **User Authentication** - JWT-based secure authentication
- ✅ **User Preferences** - Save and manage category preferences
- ✅ **Category Filtering** - Browse news by specific categories
- ✅ **Responsive Design** - Modern, mobile-friendly interface

### Planned Features
- 🔄 **Personalized "For You" Feed** - ML-powered recommendations
- 🔄 **Search Functionality** - Full-text search across articles
- 🔄 **Bookmarks/Favorites** - Save articles for later
- 🔄 **Social Features** - Reactions, comments, sharing
- 🔄 **Real-time Updates** - Live news updates
- 🔄 **Dark Mode** - Theme switching
- 🔄 **Advanced Analytics** - Reading habits and insights

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Django 5.2.3 + Django REST Framework
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Databases:** 
  - SQLite (Django authentication)
  - MongoDB (news articles & user preferences)
- **AI/ML Models:**
  - `facebook/bart-large-cnn` - Text summarization
  - `cardiffnlp/twitter-roberta-base-sentiment-latest` - Sentiment analysis
  - `dslim/bert-base-NER` - Named entity recognition
  - `facebook/bart-large-mnli` - Zero-shot classification
- **Libraries:** 
  - PyTorch, Transformers (Hugging Face)
  - Requests, PyMongo

### Frontend
- **Framework:** React 19.1.0
- **Build Tool:** Vite 7.0.0
- **Routing:** React Router DOM 7.6.3
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Styling:** CSS Modules

### External APIs
- [NewsAPI](https://newsapi.org/) - General news aggregation
- [GNews](https://gnews.io/) - Global news coverage
- [Mediastack](https://mediastack.com/) - News data with categories

---

## 🏗️ Architecture

```
┌─────────────┐
│  News APIs  │ (NewsAPI, GNews, Mediastack)
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         Django Backend (REST API)       │
│  ┌────────────┐  ┌──────────────────┐  │
│  │ Aggregator │─>│  AI Processing   │  │
│  └────────────┘  │  • Summarization │  │
│                  │  • Sentiment     │  │
│                  │  • NER           │  │
│                  │  • Categorization│  │
│                  └──────────────────┘  │
└───────────┬─────────────────────────────┘
            │
            ▼
    ┌──────────────┐
    │   MongoDB    │
    │  (Articles & │
    │ Preferences) │
    └──────────────┘
            │
            ▼
┌───────────────────────────┐
│   React Frontend (Vite)   │
│  • Home Feed              │
│  • Personalized Feed      │
│  • User Profile           │
│  • Authentication         │
└───────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Python** 3.11 or higher
- **Node.js** 18+ and npm
- **MongoDB** 4.4+ (local or MongoDB Atlas)
- **Git**

**Optional:**
- **CUDA-enabled GPU** for faster AI model inference
- **Redis** for caching (planned feature)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator.git
cd Personalized_News_Aggregator
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1
# Windows (CMD)
.\venv\Scripts\activate.bat
# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate
```

#### 3. Frontend Setup

```bash
cd ../frontend/echorithm

# Install dependencies
npm install
```

#### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# https://www.mongodb.com/docs/manual/installation/

# Start MongoDB service
# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# Mac
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the connection string in backend `.env` file

---

### Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
# Copy the example file
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Django Settings
SECRET_KEY=your-super-secret-key-here-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=news_aggregator_db

# News API Keys (Get free keys from respective websites)
NEWSAPI_KEY=your_newsapi_key_here
GNEWS_KEY=your_gnews_key_here
MEDIASTACK_KEY=your_mediastack_key_here

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Get Your API Keys:**
- NewsAPI: https://newsapi.org/register
- GNews: https://gnews.io/register
- Mediastack: https://mediastack.com/product

#### Frontend Environment Variables

Create a `.env` file in `frontend/echorithm/`:

```bash
cd frontend/echorithm
# Copy the example file
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_APP_NAME=Echorithm
```

---

### Running the Application

#### 1. Start MongoDB

Make sure MongoDB is running (if using local installation):

```bash
# Check if MongoDB is running
# Windows
net start MongoDB

# Linux
sudo systemctl status mongod
```

#### 2. Start Backend Server

```bash
cd backend

# Activate virtual environment (if not already active)
.\venv\Scripts\Activate.ps1  # Windows PowerShell

# Run development server
python manage.py runserver
```

Backend will be available at: **http://127.0.0.1:8000**

#### 3. Start Frontend Development Server

Open a new terminal:

```bash
cd frontend/echorithm

# Start Vite dev server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

#### 4. Fetch Initial News Data

Open another terminal and trigger the article update endpoint:

```bash
# Using curl (Git Bash, Linux, Mac)
curl http://127.0.0.1:8000/articles/update/

# Using PowerShell
Invoke-WebRequest -Uri http://127.0.0.1:8000/articles/update/

# Or visit in browser
# http://127.0.0.1:8000/articles/update/
```

This will:
- Fetch articles from all news sources
- Process them with AI models
- Store them in MongoDB

**Note:** First run may take 5-10 minutes as AI models download (~2-3 GB).

---

## 📚 API Documentation

### Base URL
```
http://127.0.0.1:8000
```

### Endpoints

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register/` | Register new user | No |
| POST | `/login/` | Login and get JWT tokens | No |
| POST | `/token/refresh/` | Refresh access token | No |

**Register:**
```bash
POST /register/
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password123"
}
```

**Login:**
```bash
POST /login/
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password123"
}

# Response:
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Articles

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/articles/` | Get all articles | No |
| GET | `/articles/update/` | Fetch and process new articles | No |
| GET | `/articles/filtered/` | Get personalized articles | Yes |

**Get All Articles:**
```bash
GET /articles/

# Response: Array of article objects
[
  {
    "title": "Article Title",
    "source": "BBC",
    "author": "John Smith",
    "url": "https://...",
    "urlToImage": "https://...",
    "publishedAt": "2025-10-29T10:30:00Z",
    "content": "Full article content...",
    "summary": "AI-generated summary...",
    "category": "technology",
    "sentiment_label": "Positive",
    "sentiment_confidence": 0.89,
    "entities": ["Apple", "Tim Cook", "California"]
  }
]
```

#### User Preferences

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/preferences/` | Get user's category preferences | Yes |
| POST | `/preferences/update/` | Update category preferences | Yes |

**Update Preferences:**
```bash
POST /preferences/update/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "categories": ["technology", "science", "health"]
}
```

---

## 📁 Project Structure

```
Personalized_News_Aggregator/
├── backend/
│   ├── backend/                 # Django project settings
│   │   ├── settings.py         # Main configuration
│   │   ├── urls.py             # Root URL routing
│   │   └── wsgi.py             # WSGI config
│   ├── core/                    # Main application
│   │   ├── views.py            # API endpoints
│   │   ├── urls.py             # App URL routing
│   │   ├── serializers.py      # DRF serializers
│   │   ├── utils.py            # Article aggregation logic
│   │   ├── db.py               # MongoDB connection
│   │   ├── ai_tasks/           # AI/ML modules
│   │   │   ├── summarize.py    # Text summarization
│   │   │   ├── sentiment.py    # Sentiment analysis
│   │   │   ├── ner.py          # Named entity recognition
│   │   │   └── classify_category.py  # Category classification
│   │   └── news_sources/       # News API integrations
│   │       ├── newsapi.py      # NewsAPI integration
│   │       ├── gnews.py        # GNews integration
│   │       └── mediastack.py   # Mediastack integration
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3              # SQLite database
├── frontend/
│   └── echorithm/
│       ├── src/
│       │   ├── App.jsx         # Main app component
│       │   ├── pages/          # Page components
│       │   │   ├── Home.jsx    # Home feed
│       │   │   └── ForYou.jsx  # Personalized feed
│       │   ├── components/     # Reusable components
│       │   │   ├── Auth/       # Login/Register
│       │   │   ├── Header/     # Navigation header
│       │   │   ├── Sidebar/    # Category sidebar
│       │   │   ├── NewsCard/   # Article card
│       │   │   └── profile/    # User profile
│       │   ├── services/       # API integration
│       │   │   └── api.js      # API client
│       │   └── constants/      # App constants
│       │       └── categories.js
│       ├── package.json
│       └── vite.config.js
├── README.md                    # This file
└── PROJECT_ANALYSIS.md          # Detailed project analysis
```

---

## 🤖 AI/ML Features

### 1. Text Summarization
- **Models:** BART-large-CNN (primary), T5-small (fallback)
- **Purpose:** Generates concise summaries of lengthy articles
- **Implementation:** `backend/core/ai_tasks/summarize.py`

### 2. Sentiment Analysis
- **Model:** Cardiff NLP RoBERTa
- **Output:** Positive/Neutral/Negative with confidence score
- **Implementation:** `backend/core/ai_tasks/sentiment.py`

### 3. Named Entity Recognition (NER)
- **Model:** BERT-base-NER
- **Extracts:** People, Locations, Organizations, Misc entities
- **Implementation:** `backend/core/ai_tasks/ner.py`

### 4. Category Classification
- **Model:** BART-large-MNLI (zero-shot)
- **Categories:** Technology, Business, Health, Sports, Entertainment, Science, Politics, Travel, Environment
- **Implementation:** `backend/core/ai_tasks/classify_category.py`

### Performance Considerations
- First run downloads models (~2-3 GB)
- Models loaded in memory (requires 4-8 GB RAM)
- GPU acceleration supported (CUDA)
- Consider caching for production

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend/echorithm
npm run test
```

**Note:** Test suite is currently under development.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 👥 Team

**Software Engineering Final Year Project**

- **FAHIM** - Backend Development
- **MISKAT** - Frontend Development
- **SHIHAB** - AI/ML Integration
- **TASIN** - Database & DevOps

**Supervised by:** Mohammad Arfizurrahman

---

## 🐛 Known Issues

See [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) for a comprehensive list of current issues and planned improvements.

**Critical:**
- Environment variables need to be configured (API keys)
- First-time setup requires AI model downloads
- MongoDB must be running before starting backend

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Project Repository:** [GitHub](https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator)
- **Issue Tracker:** [GitHub Issues](https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator/issues)
- **Project Analysis:** [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md)

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) for common issues
2. Search existing [GitHub Issues](https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator/issues)
3. Create a new issue with detailed description

---

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for transformer models
- [NewsAPI](https://newsapi.org/), [GNews](https://gnews.io/), [Mediastack](https://mediastack.com/) for news data
- Django and React communities for excellent documentation
- Our supervisor for guidance and support

---

**Made with ❤️ by Team FAHIM-MISKAT-SHIHAB-TASIN**

*Last Updated: October 29, 2025*
