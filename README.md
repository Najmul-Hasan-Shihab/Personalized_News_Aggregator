# 🧠 Echorithm - AI-Powered News Aggregator# 🧠 Echorithm - AI-Powered Personalized News Aggregator



> Intelligent news platform combining multiple sources with advanced AI for summarization, sentiment analysis, and personalized recommendations.> An intelligent news aggregation platform that combines multiple news sources with advanced AI/ML capabilities for summarization, sentiment analysis, entity recognition, and personalized recommendations.



[![Python](https://img.shields.io/badge/Python-3.13+-blue.svg)](https://www.python.org/)[![Python](https://img.shields.io/badge/Python-3.13+-blue.svg)](https://www.python.org/)

[![Django](https://img.shields.io/badge/Django-5.2.3-green.svg)](https://www.djangoproject.com/)[![Django](https://img.shields.io/badge/Django-5.2.3-green.svg)](https://www.djangoproject.com/)

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)

[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)](https://www.mongodb.com/)[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)](https://www.mongodb.com/)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)



------



## 📸 Screenshots## � Screenshots



<div align="center"><div align="center">

  

### Home Feed### Home Page - Personalized Feed

![Home Page](./assets/screenshots/home-page.png)![Home Page](./assets/screenshots/home-page.png)

*AI-curated news feed with sentiment analysis and category tags*

### Article Reader

![Article Reader](./assets/screenshots/article-reader.png)### Article Reader with Embedded View

![Article Reader](./assets/screenshots/article-reader.png)

### Analytics Dashboard*Embedded article reader with live reading time tracking*

![Analytics](./assets/screenshots/analytics-dashboard.png)

### Advanced Analytics Dashboard

### User Profile![Analytics Dashboard](./assets/screenshots/analytics-dashboard.png)

![Profile](./assets/screenshots/user-profile.png)*Comprehensive reading habits analytics with insights and visualizations*



</div>### User Profile & Preferences

![User Profile](./assets/screenshots/user-profile.png)

---*Customizable profile with reading preferences and interests*



## 🎯 About</div>



**Echorithm** is an AI-powered news aggregator developed as a Software Engineering final year project (2024-2025). It aggregates news from multiple sources, processes content using machine learning, and delivers personalized reading experiences.---



**Problem:** Traditional news platforms overwhelm users with unfiltered content.  ## �📋 Table of Contents

**Solution:** AI-driven aggregation with smart summarization, sentiment analysis, and personalized recommendations.

- [About](#about)

---- [Key Features](#key-features)

- [Tech Stack](#tech-stack)

## ✨ Features- [Architecture](#architecture)

- [AI/ML Capabilities](#aiml-capabilities)

- **🤖 AI Processing:** Summarization (BART/T5), Sentiment Analysis (RoBERTa), NER (BERT), Auto-categorization- [Getting Started](#getting-started)

- **📰 Multi-Source:** NewsAPI, GNews, MediaStack + web scraping for full articles- [Project Structure](#project-structure)

- **👤 Personalization:** User preferences, reading history, ML recommendations (TF-IDF, cosine similarity)- [API Documentation](#api-documentation)

- **📊 Analytics:** Reading stats, activity timeline, peak times, personalized insights- [Future Enhancements](#future-enhancements)

- **🔖 Organization:** Bookmarks, reading lists, advanced search with suggestions- [Contributors](#contributors)

- **⚡ Modern UI:** React 19, responsive design, embedded reader with live timer- [License](#license)



------



## 🛠️ Tech Stack## 🎯 About



### Backend**Echorithm** is a comprehensive news aggregation platform that leverages artificial intelligence to provide users with a personalized, intelligent news consumption experience. Built as a Software Engineering final year project, it demonstrates the integration of modern web technologies with advanced AI/ML capabilities.

| Technology | Purpose |

|------------|---------|### 🎓 Project Context

| Python 3.13+ | Programming language |- **Type**: Final Year Software Engineering Project

| Django 5.2.3 | Web framework |- **Duration**: 2024-2025

| Django REST Framework | REST API |- **Objective**: Create an intelligent news platform that combines multiple data sources with AI-driven features for enhanced user experience

| MongoDB 7.0+ | Document database (articles, analytics) |

| SQLite | Relational database (Django auth) |### 🌟 Why Echorithm?

| PyTorch | ML framework |

| Transformers (HuggingFace) | Pre-trained AI models |Traditional news platforms overwhelm users with information without context. Echorithm solves this by:

| BeautifulSoup4 | Web scraping |- **Aggregating** news from multiple trusted sources into one unified feed

| Scikit-learn | ML utilities (TF-IDF, cosine similarity) |- **Understanding** article content through AI (sentiment, entities, topics)

- **Personalizing** content based on user interests and reading habits

### Frontend- **Tracking** reading patterns to provide insights and recommendations

| Technology | Purpose |- **Enhancing** articles with summaries and metadata for quick consumption

|------------|---------|

| React 19.1.0 | UI library |---

| Vite 7.0.0 | Build tool & dev server |

| React Router 7.6.3 | Client-side routing |## ✨ Key Features

| Axios 1.8.0 | HTTP client |

### 🤖 AI-Powered Content Processing

### AI/ML Models- **Smart Summarization** - Automatic article summarization using BART-large-CNN and T5 models

| Model | Task | Provider |- **Sentiment Analysis** - Real-time sentiment detection (Positive/Neutral/Negative) using RoBERTa

|-------|------|----------|- **Named Entity Recognition** - Extracts people, organizations, and locations using BERT-NER

| facebook/bart-large-cnn | Summarization | HuggingFace |- **Intelligent Categorization** - Auto-categorizes articles into topics (Technology, Sports, Business, etc.)

| t5-small | Summarization (fallback) | HuggingFace |- **Web Scraping** - Fetches full article content when APIs provide truncated text

| cardiffnlp/twitter-roberta-base-sentiment-latest | Sentiment Analysis | HuggingFace |

| dslim/bert-base-NER | Named Entity Recognition | HuggingFace |### 📰 News Aggregation

| facebook/bart-large-mnli | Zero-shot Classification | HuggingFace |- **Multi-Source Integration** - Combines news from NewsAPI, GNews, and MediaStack

- **Real-time Updates** - Automatic news refresh and deduplication

### External APIs- **Rich Metadata** - Source attribution, author information, publication dates

- NewsAPI (news aggregation)- **High-Quality Images** - Only articles with images for better visual experience

- GNews (news aggregation)

- MediaStack (news aggregation)### 👤 Personalization & Recommendations

- **User Preferences** - Customizable interests and category preferences

---- **Reading History** - Tracks articles read for better recommendations

- **ML-Based Recommendations** - TF-IDF and cosine similarity for content suggestions

## 🏗️ Architecture- **Bookmarking System** - Save articles for later reading

- **Reading Lists** - Organize articles into custom collections

```

┌─────────────┐### 📊 Advanced Analytics

│   Frontend  │  React 19 + Vite- **Reading Statistics** - Total articles read, time spent, completion rates

│   (React)   │  • News Feed • Reader • Analytics- **Activity Timeline** - 14-day visual timeline of reading habits

└──────┬──────┘  • Profile • Search • Bookmarks- **Peak Reading Times** - Identifies most active hours and days

       │- **Category Breakdown** - Visual distribution of reading preferences

       │ HTTP/REST (Axios)- **Personalized Insights** - AI-generated insights about reading behavior

       │

┌──────▼──────┐### 🎨 Modern User Experience

│   Backend   │  Django 5.2.3 + DRF- **Embedded Article Reader** - Read articles in modal with iframe support

│  (Django)   │  • REST API Endpoints- **Live Reading Timer** - Tracks actual time spent on each article

└──────┬──────┘  • JWT Authentication- **Sentiment Stickers** - Visual sentiment indicators on cards

       │         • Request Processing- **Responsive Design** - Optimized for desktop, tablet, and mobile

       ├─────────────────┬─────────────────┐- **Dark Mode Ready** - Modern purple gradient theme

       │                 │                 │

┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐### 🔐 Authentication & Security

│  MongoDB    │  │   SQLite    │  │  AI Models  │- **JWT Authentication** - Secure token-based authentication

│  (NoSQL)    │  │   (SQL)     │  │  (PyTorch)  │- **User Registration** - Complete signup with validation

└─────────────┘  └─────────────┘  └─────────────┘- **Protected Routes** - Authentication-required endpoints

 • Articles       • Users          • BART (Summarization)- **CORS Configuration** - Properly configured cross-origin requests

 • Analytics      • Auth            • RoBERTa (Sentiment)

 • History        • Sessions        • BERT (NER)---

 • Preferences                      • Classification

                                    • Recommendations## 🛠 Tech Stack

       │

┌──────▼──────────────────┐### Backend

│   External Services     │| Technology | Version | Purpose |

│  • NewsAPI • GNews      │|------------|---------|---------|

│  • MediaStack           │| Python | 3.13+ | Core programming language |

│  • Web Scraping         │| Django | 5.2.3 | Web framework |

└─────────────────────────┘| Django REST Framework | 3.15.0 | REST API development |

```| MongoDB | 7.0+ | NoSQL database |

| PyMongo | 4.13.0 | MongoDB driver |

---| PyTorch | 2.3.0 | Deep learning framework |

| Transformers | 4.37.2 | Hugging Face models |

## 🚀 Quick Start| BeautifulSoup4 | 4.14.2 | Web scraping |

| Scikit-learn | 1.5.0 | ML algorithms |

### Prerequisites

- Python 3.13+### AI/ML Models

- Node.js 18+| Model | Task | HuggingFace ID |

- MongoDB 7.0+ (local or MongoDB Atlas)|-------|------|----------------|

- Git| BART-large-CNN | Summarization | facebook/bart-large-cnn |

| T5-small | Fallback Summarization | t5-small |

### 1. Clone Repository| RoBERTa | Sentiment Analysis | cardiffnlp/twitter-roberta-base-sentiment-latest |

```bash| BERT-NER | Named Entity Recognition | dslim/bert-base-NER |

git clone https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator.git| BART-MNLI | Zero-shot Classification | facebook/bart-large-mnli |

cd Personalized_News_Aggregator

```### Frontend

| Technology | Version | Purpose |

### 2. Backend Setup|------------|---------|---------|

```bash| React | 19.1.0 | UI framework |

cd backend| Vite | 7.0.0 | Build tool |

python -m venv venv| React Router | 7.6.3 | Client-side routing |

.\venv\Scripts\Activate.ps1  # Windows PowerShell| Axios | 1.7.9 | HTTP client |

pip install -r requirements.txt| CSS3 | - | Styling |



# Create .env file### External APIs

cp .env.example .env- **NewsAPI** - Top headlines and news articles

# Edit .env and add your API keys:- **GNews** - Global news aggregation

# NEWSAPI_KEY=your_key_here- **MediaStack** - News data API

# GNEWS_KEY=your_key_here

# MEDIASTACK_KEY=your_key_here---



python manage.py migrate## 🏗 Architecture

python manage.py runserver

```### System Architecture



### 3. Frontend Setup (New Terminal)```

```bash┌─────────────────────────────────────────────────────────────┐

cd frontend/echorithm│                        Frontend (React)                      │

npm install│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │

npm run dev│  │   Home   │  Profile │ Analytics│Bookmarks │   Auth   │  │

```│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │

│                           ↓ Axios                            │

### 4. Fetch Initial Articles└─────────────────────────────────────────────────────────────┘

Open browser: `http://127.0.0.1:8000/articles/update/`                                ↓

(First run downloads AI models ~2-3 GB, takes 5-10 minutes)┌─────────────────────────────────────────────────────────────┐

│              Django REST API (Backend)                       │

### 5. Access Application│  ┌──────────────────────────────────────────────────────┐  │

Frontend: `http://localhost:5173`  │  │  Authentication │ Articles │ Analytics │ Preferences │  │

Backend API: `http://127.0.0.1:8000`│  └──────────────────────────────────────────────────────┘  │

│                           ↓                                  │

**See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.**│  ┌─────────────────────────────────────────────────────┐   │

│  │              AI Processing Pipeline                  │   │

---│  │  • Summarization (BART/T5)                          │   │

│  │  • Sentiment Analysis (RoBERTa)                     │   │

## 📡 API Endpoints│  │  • Named Entity Recognition (BERT)                  │   │

│  │  • Category Classification (BART-MNLI)              │   │

### Articles│  │  • Web Scraping (BeautifulSoup)                     │   │

```│  └─────────────────────────────────────────────────────┘   │

GET  /articles/                    # List all articles│                           ↓                                  │

GET  /articles/filtered/           # Filter by category└─────────────────────────────────────────────────────────────┘

GET  /articles/personalized/       # Personalized recommendations                              ↓

GET  /articles/search/             # Search articles┌─────────────────────────────────────────────────────────────┐

GET  /articles/update/             # Fetch new articles (triggers AI processing)│                    MongoDB Database                          │

POST /articles/track/              # Track article view│  • articles          • user_preferences                      │

```│  • reading_history   • search_history                        │

│  • bookmarks         • reading_lists                         │

### Authentication│  • analytics         • recommendations                       │

```└─────────────────────────────────────────────────────────────┘

POST /register/                    # Create account                              ↓

POST /login/                       # Login (get JWT tokens)┌─────────────────────────────────────────────────────────────┐

POST /token/refresh/               # Refresh access token│                    External News APIs                        │

```│        NewsAPI    │    GNews    │    MediaStack              │

└─────────────────────────────────────────────────────────────┘

### User Preferences```

```

GET  /preferences/                 # Get user preferences### Data Flow

POST /preferences/update/          # Update preferences

GET  /reading-history/             # Get reading history1. **News Aggregation**: System fetches articles from multiple APIs

```2. **Web Scraping**: Extracts full content when APIs provide truncated text

3. **AI Processing**: Each article is processed through ML pipeline

### Bookmarks & Lists4. **Storage**: Processed articles stored in MongoDB with metadata

```5. **Personalization**: User preferences and history influence recommendations

POST /bookmarks/add/               # Add bookmark6. **Analytics**: Reading sessions tracked for insights and analytics

POST /bookmarks/remove/            # Remove bookmark

GET  /bookmarks/                   # List bookmarks---

GET  /bookmarks/check/             # Check bookmark status

POST /reading-lists/create/        # Create reading list## 🤖 AI/ML Capabilities

GET  /reading-lists/               # List all reading lists

POST /reading-lists/add-article/   # Add to list### 1. Article Summarization

POST /reading-lists/remove-article/# Remove from list**Models**: BART-large-CNN (primary), T5-small (fallback)

POST /reading-lists/delete/        # Delete list

```**Process**:

- Cleans input text (removes ads, CTAs, HTML entities)

### Analytics- Truncates to model's token limit

```- Generates concise summary (50-150 words)

POST /analytics/track-session/     # Track reading session- Post-processes for grammar and complete sentences

GET  /analytics/stats/             # Reading statistics

GET  /analytics/timeline/          # 14-day activity timeline**Quality Improvements**:

GET  /analytics/peak-times/        # Peak reading hours/days- Removes duplicate punctuation

GET  /analytics/insights/          # Personalized insights- Fixes spacing (e.g., "U .S." → "U.S.")

```- Ensures complete sentences only

- Capitalizes properly

### Search

```### 2. Sentiment Analysis

GET  /search/suggestions/          # Search autocomplete**Model**: RoBERTa (Twitter-trained for sentiment)

POST /search/track/                # Track search query

```**Output**:

- Label: Positive, Neutral, or Negative

**Authentication:** Most endpoints require JWT token in header: `Authorization: Bearer <token>`- Confidence score (0-1)

- Visual emoji indicators (😊 😐 😔)

---

### 3. Named Entity Recognition (NER)

## 📁 Project Structure**Model**: BERT-NER



```**Extracts**:

Personalized_News_Aggregator/- People (e.g., "Elon Musk", "Joe Biden")

├── backend/- Organizations (e.g., "Tesla", "FBI", "NASA")

│   ├── manage.py- Locations (e.g., "New York", "Paris")

│   ├── requirements.txt

│   ├── backend/**Enhancements**:

│   │   ├── settings.py              # Django settings- Merges similar entities (removes substrings)

│   │   └── urls.py                  # URL routing- Preserves acronyms (FBI, NASA, CIA)

│   └── core/- Smart capitalization (McDonald's, O'Brien)

│       ├── models.py                # Django models- Confidence threshold: 0.80

│       ├── views.py                 # API views- Maximum 15 entities per article

│       ├── serializers.py           # DRF serializers

│       ├── urls.py                  # App URLs### 4. Category Classification

│       ├── db.py                    # MongoDB connection**Model**: BART-large-MNLI (Zero-shot classification)

│       ├── utils.py                 # Article processing

│       ├── analytics_endpoints.py   # Analytics API**Categories**:

│       ├── ai_tasks/- Technology

│       │   ├── summarize.py         # BART/T5 summarization- Sports

│       │   ├── sentiment.py         # RoBERTa sentiment- Business

│       │   ├── ner.py               # BERT entity extraction- Entertainment

│       │   ├── classify_category.py # BART-MNLI classification- Science

│       │   └── recommendations.py   # ML recommendations- Health

│       └── news_sources/- Politics

│           ├── newsapi.py           # NewsAPI integration- General

│           ├── gnews.py             # GNews integration

│           ├── mediastack.py        # MediaStack integration**Fallback**: Keyword-based classification when ML confidence low

│           └── article_scraper.py   # BeautifulSoup web scraping

│### 5. Content Recommendation

├── frontend/echorithm/**Algorithm**: TF-IDF + Cosine Similarity

│   ├── src/

│   │   ├── App.jsx**Features**:

│   │   ├── pages/- Based on reading history

│   │   │   ├── Home.jsx             # Main feed- Category preferences

│   │   │   ├── ForYou.jsx           # Personalized feed- Content similarity

│   │   │   ├── Bookmarks.jsx        # Saved articles- Recency weighting

│   │   │   ├── ReadingLists.jsx     # Reading lists

│   │   │   └── SearchResults.jsx    # Search results### 6. Web Scraping

│   │   ├── components/**Library**: BeautifulSoup4 + lxml

│   │   │   ├── Header/              # Navigation

│   │   │   ├── Sidebar/             # Category filter**Features**:

│   │   │   ├── NewsCard/            # Article card + reader- Extracts full article content from URLs

│   │   │   ├── Analytics/           # Analytics dashboard- Smart content detection (multiple selectors)

│   │   │   ├── profile/             # User profile- Removes ads, navigation, social media buttons

│   │   │   ├── Auth/                # Login/Register- Validates minimum content length

│   │   │   ├── SearchBar/           # Search component- Graceful fallback to API content

│   │   │   └── Footer/              # Footer

│   │   ├── services/---

│   │   │   └── api.js               # Axios API client- ✅ **Named Entity Recognition** - Extracts persons, locations, organizations from articles

│   │   └── constants/- ✅ **Automatic Categorization** - Zero-shot classification into 9+ categories

│   │       └── categories.js        # News categories- ✅ **User Authentication** - JWT-based secure authentication

│   ├── package.json- ✅ **User Preferences** - Save and manage category preferences

│   └── vite.config.js- ✅ **Category Filtering** - Browse news by specific categories

│- ✅ **Responsive Design** - Modern, mobile-friendly interface

├── assets/screenshots/              # Project screenshots

├── README.md                        # This file### Planned Features

├── SETUP_GUIDE.md                   # Detailed setup- 🔄 **Personalized "For You" Feed** - ML-powered recommendations

├── DESIGN_SYSTEM.md                 # UI design system- 🔄 **Search Functionality** - Full-text search across articles

├── CONTRIBUTING.md                  # Contribution guide- 🔄 **Bookmarks/Favorites** - Save articles for later

├── PROJECT_STATUS.md                # Project status- 🔄 **Social Features** - Reactions, comments, sharing

└── LICENSE                          # MIT License- 🔄 **Real-time Updates** - Live news updates

```- 🔄 **Dark Mode** - Theme switching

- 🔄 **Advanced Analytics** - Reading habits and insights

---

---

## 🎨 Design System

## 🛠️ Tech Stack

The frontend uses a custom design system with:

- **Colors:** Purple-to-pink gradient (#7b2ff7 → #f107a3), cyan accents (#38bdf8)### Backend

- **Typography:** Inter (body), Poppins/Montserrat (headings)- **Framework:** Django 5.2.3 + Django REST Framework

- **Spacing:** Standardized scale (xs: 0.25rem → 2xl: 3rem)- **Authentication:** JWT (djangorestframework-simplejwt)

- **Components:** Consistent cards, buttons, animations- **Databases:** 

- **Responsive:** Mobile-first approach  - SQLite (Django authentication)

  - MongoDB (news articles & user preferences)

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for complete design tokens and patterns.- **AI/ML Models:**

  - `facebook/bart-large-cnn` - Text summarization

---  - `cardiffnlp/twitter-roberta-base-sentiment-latest` - Sentiment analysis

  - `dslim/bert-base-NER` - Named entity recognition

## 🤖 AI/ML Pipeline  - `facebook/bart-large-mnli` - Zero-shot classification

- **Libraries:** 

### Article Processing Flow  - PyTorch, Transformers (Hugging Face)

1. **Fetch** articles from 3 APIs (NewsAPI, GNews, MediaStack)  - Requests, PyMongo

2. **Scrape** full content using BeautifulSoup4 (if truncated)

3. **Summarize** using BART-large-CNN (fallback: T5-small)### Frontend

4. **Analyze** sentiment using RoBERTa (Positive/Neutral/Negative + confidence)- **Framework:** React 19.1.0

5. **Extract** entities using BERT-NER (People, Organizations, Locations)- **Build Tool:** Vite 7.0.0

6. **Classify** category using BART-MNLI (Technology, Sports, Business, etc.)- **Routing:** React Router DOM 7.6.3

7. **Store** in MongoDB with all metadata- **HTTP Client:** Axios

8. **Recommend** similar articles using TF-IDF + cosine similarity- **Icons:** Lucide React

- **Styling:** CSS Modules

### Model Performance

- **Summarization:** ~2-3s per article (GPU) / ~5-7s (CPU)### External APIs

- **Sentiment:** ~1s per article- [NewsAPI](https://newsapi.org/) - General news aggregation

- **NER:** ~1-2s per article- [GNews](https://gnews.io/) - Global news coverage

- **Classification:** ~1-2s per article- [Mediastack](https://mediastack.com/) - News data with categories

- **Total:** ~10-15s per article (first run with model loading: ~30-40s)

---

---

## 🏗️ Architecture

## 🌟 Key Achievements

```

- ✅ **Multi-Source Aggregation:** 3 APIs + web scraping = 95%+ content coverage┌─────────────┐

- ✅ **AI Integration:** 5 transformer models working in production│  News APIs  │ (NewsAPI, GNews, Mediastack)

- ✅ **Smart Fallbacks:** 3-tier content strategy (scraped → API → title)└──────┬──────┘

- ✅ **Real-time Analytics:** Live reading tracking, visualizations, insights       │

- ✅ **Modern Stack:** React 19, Django 5.2.3, MongoDB, PyTorch       ▼

- ✅ **Production Ready:** Error handling, authentication, responsive design┌─────────────────────────────────────────┐

│         Django Backend (REST API)       │

---│  ┌────────────┐  ┌──────────────────┐  │

│  │ Aggregator │─>│  AI Processing   │  │

## 🔮 Future Enhancements│  └────────────┘  │  • Summarization │  │

│                  │  • Sentiment     │  │

### Short-term│                  │  • NER           │  │

- [ ] Real-time notifications (WebSocket/SSE)│                  │  • Categorization│  │

- [ ] Email digest functionality│                  └──────────────────┘  │

- [ ] Article sharing with social media└───────────┬─────────────────────────────┘

- [ ] Comment system for discussions            │

- [ ] Multi-language support            ▼

    ┌──────────────┐

### Long-term    │   MongoDB    │

- [ ] Mobile app (React Native)    │  (Articles & │

- [ ] Voice assistant integration    │ Preferences) │

- [ ] Video/podcast news support    └──────────────┘

- [ ] Browser extension            │

- [ ] Advanced ML models (GPT-based summarization)            ▼

┌───────────────────────────┐

---│   React Frontend (Vite)   │

│  • Home Feed              │

## 👥 Contributors│  • Personalized Feed      │

│  • User Profile           │

- **Najmul Hasan Shihab** - Full-stack development, AI integration│  • Authentication         │

- **Fahim** - Backend development, API integration└───────────────────────────┘

- **Miskat** - Frontend development, UI/UX design```

- **Tasin** - Database design, testing

## 🚀 Getting Started

**Supervised by:** Mohammad Arfizurrahman

### Prerequisites

**Institution:** [Your University]  

**Academic Year:** 2024-2025  - **Python 3.13+** - [Download](https://www.python.org/downloads/)

**Project Type:** Software Engineering Final Year Project- **Node.js 18+** - [Download](https://nodejs.org/)

- **MongoDB 7.0+** - [Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)

---- **Git** - [Download](https://git-scm.com/downloads)



## 📄 License### Quick Start



This project is licensed under the MIT License - see [LICENSE](LICENSE) file.#### 1. Clone Repository



``````bash

MIT License - Copyright (c) 2024-2025 Najmul Hasan Shihab, Fahim, Miskat, Tasingit clone https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator.git

```cd Personalized_News_Aggregator

```

---

#### 2. Backend Setup

## 🔗 Links

```bash

- **Repository:** [GitHub](https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator)cd backend

- **Setup Guide:** [SETUP_GUIDE.md](SETUP_GUIDE.md)

- **Design System:** [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)# Create and activate virtual environment

- **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)python -m venv venv

- **Project Status:** [PROJECT_STATUS.md](PROJECT_STATUS.md).\venv\Scripts\Activate.ps1  # Windows PowerShell

# source venv/bin/activate    # Linux/Mac

---

# Install dependencies

## 🙏 Acknowledgmentspip install -r requirements.txt



- **HuggingFace** for pre-trained transformer models# Run migrations

- **NewsAPI, GNews, MediaStack** for news datapython manage.py migrate

- **Django & React** communities for excellent documentation```

- **MongoDB** for flexible document storage

- Our supervisor **Mohammad Arfizurrahman** for guidance#### 3. Configure Environment



---Create `backend/.env`:



<div align="center">```env

SECRET_KEY=your-django-secret-key-here

**Built with ❤️ using Python, Django, React, and AI**DEBUG=True

MONGODB_URI=mongodb://localhost:27017/

*If you find this project useful, consider giving it a ⭐ on GitHub!*MONGODB_DB_NAME=news_aggregator_db



</div># Get free API keys from:

NEWSAPI_KEY=your_newsapi_key          # https://newsapi.org/register
GNEWS_KEY=your_gnews_key              # https://gnews.io/register  
MEDIASTACK_KEY=your_mediastack_key    # https://mediastack.com/product

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

#### 4. Frontend Setup

```bash
cd frontend/echorithm
npm install
```

Create `frontend/echorithm/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

#### 5. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend/echorithm
npm run dev
```

**Terminal 3 - Fetch News:**
```bash
curl http://127.0.0.1:8000/articles/update/
```

Access the application at **http://localhost:5173**

> ⚠️ **First Run Note**: AI models will download automatically (~2-3 GB). This may take 5-10 minutes.

---

## 📁 Project Structure

```
Personalized_News_Aggregator/
├── backend/                          # Django REST API
│   ├── backend/                      # Project configuration
│   │   ├── settings.py              # Django settings
│   │   ├── urls.py                  # Main URL routing
│   │   └── wsgi.py
│   ├── core/                        # Main application
│   │   ├── models.py                # Database models
│   │   ├── views.py                 # API endpoints
│   │   ├── urls.py                  # App URL routing
│   │   ├── serializers.py           # DRF serializers
│   │   ├── db.py                    # MongoDB connection
│   │   ├── utils.py                 # Utility functions
│   │   ├── ai_tasks/                # AI/ML modules
│   │   │   ├── summarize.py        # BART/T5 summarization
│   │   │   ├── sentiment.py        # RoBERTa sentiment
│   │   │   ├── ner.py              # BERT entity recognition
│   │   │   └── classify_category.py # BART-MNLI classification
│   │   ├── news_sources/           # News API integrations
│   │   │   ├── newsapi.py
│   │   │   ├── gnews.py
│   │   │   ├── mediastack.py
│   │   │   └── article_scraper.py  # Web scraping
│   │   └── analytics_endpoints.py  # Analytics API
│   ├── requirements.txt             # Python dependencies
│   ├── manage.py
│   └── db.sqlite3                  # Django auth DB
│
├── frontend/
│   └── echorithm/                   # React application
│       ├── src/
│       │   ├── components/          # React components
│       │   │   ├── NewsCard/       # Article card
│       │   │   ├── Header/         # Navigation header
│       │   │   ├── Footer/         # Page footer
│       │   │   ├── Auth/           # Login/Register
│       │   │   ├── profile/        # User profile
│       │   │   ├── Analytics/      # Analytics dashboard
│       │   │   └── CategoryCard/
│       │   ├── pages/              # Page components
│       │   │   ├── Home.jsx        # Main feed
│       │   │   └── ForYou.jsx      # Personalized feed
│       │   ├── services/           # API services
│       │   │   └── api.js          # Axios configuration
│       │   ├── constants/          # Constants
│       │   └── utils/              # Utility functions
│       ├── package.json
│       └── vite.config.js
│
├── assets/                          # Project assets
│   └── screenshots/                # UI screenshots
│       ├── home-page.png
│       ├── article-reader.png
│       ├── analytics-dashboard.png
│       └── user-profile.png
│
├── README.md                        # This file
└── LICENSE                         # MIT License
```

---

## 🔌 API Documentation

### Base URL
```
http://127.0.0.1:8000
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register/` | Register new user | ❌ |
| POST | `/login/` | Login (get JWT tokens) | ❌ |
| POST | `/token/refresh/` | Refresh access token | ❌ |

**Example - Register:**
```json
POST /register/
{
  "username": "john_doe",
  "password": "securePass123"
}
```

**Example - Login:**
```json
POST /login/
{
  "username": "john_doe",
  "password": "securePass123"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1...",
  "refresh": "eyJ0eXAiOiJKV1...",
  "username": "john_doe"
}
```

### Articles Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/articles/` | Get all articles | ❌ |
| GET | `/articles/update/` | Fetch latest news | ❌ |
| POST | `/articles/track/` | Track article view | ✅ |
| GET | `/articles/search/?q=query` | Search articles | ❌ |

### User Preferences

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/preferences/` | Get user preferences | ✅ |
| POST | `/preferences/` | Update preferences | ✅ |

### Bookmarks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/bookmarks/` | Get all bookmarks | ✅ |
| POST | `/bookmarks/` | Add bookmark | ✅ |
| DELETE | `/bookmarks/{url}/` | Remove bookmark | ✅ |
| GET | `/bookmarks/check/` | Check bookmark status | ✅ |

### Analytics

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/analytics/track-session/` | Track reading session | ✅ |
| GET | `/analytics/stats/?days=30` | Get reading statistics | ✅ |
| GET | `/analytics/timeline/?days=30` | Get activity timeline | ✅ |
| GET | `/analytics/peak-times/?days=30` | Get peak reading times | ✅ |
| GET | `/analytics/insights/?days=30` | Get AI insights | ✅ |

### Authentication Header
```bash
Authorization: Bearer <access_token>
```

---

## 🎨 Features Showcase

### 1. Intelligent Article Cards
- Sentiment badges with emoji indicators
- Named entities displayed as interactive chips
- Category tags for quick filtering
- AI-generated summaries for quick reading
- Inline bookmark functionality

### 2. Embedded Article Reader
- Read articles in modal without leaving the site
- Live reading timer (minutes:seconds)
- Automatic CSP/X-Frame-Options detection
- Graceful fallback to new tab
- Reading time tracking for analytics

### 3. Advanced Analytics Dashboard
**Metrics Cards:**
- Total articles read
- Total reading time
- Average reading time per article
- Completion rate (30+ seconds)

**Visualizations:**
- 14-day activity timeline (bar chart)
- Peak reading hours (bar chart)
- Peak reading days (bar chart)
- Category distribution (progress bars)

**AI Insights:**
- Reading streak detection
- Most active hours/days
- Favorite categories
- Reading speed analysis
- Personalized recommendations

### 4. User Profile Management
- Editable profile information
- Cover photo and profile picture
- Bio and contact details
- Education and work information
- Interest tags (multi-select categories)
- Posts/Analytics tab system

### 5. Personalization System
- Category preferences (Technology, Sports, etc.)
- Reading history tracking
- ML-based content recommendations
- Custom reading lists
- Search history

---

## 🔮 Future Enhancements

### Short-term (Next Release)
- [ ] Social sharing (Twitter, Facebook, LinkedIn)
- [ ] Email newsletter subscriptions
- [ ] Mobile app (React Native)
- [ ] Push notifications for trending news
- [ ] Multi-language support

### Long-term (Future Versions)
- [ ] Collaborative filtering recommendations
- [ ] User comments and discussions
- [ ] Article rating system
- [ ] Advanced search filters (date, source, sentiment)
- [ ] Export reading analytics (PDF/CSV)
- [ ] Third-party integrations (Pocket, Instapaper)
- [ ] Voice article reading (text-to-speech)
- [ ] Dark mode toggle
- [ ] RSS feed aggregation
- [ ] Real-time news updates (WebSockets)

---

## 🤝 Contributing

This was a final year project and is now complete. However, if you'd like to fork and extend it:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Contributors

### Development Team

**Najmul Hasan Shihab**
- Role: Full-Stack Developer, ML Engineer
- GitHub: [@Najmul-Hasan-Shihab](https://github.com/Najmul-Hasan-Shihab)
- Contributions: System architecture, AI/ML integration, Backend & Frontend development

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Hugging Face** for providing pre-trained transformer models
- **NewsAPI, GNews, MediaStack** for news data APIs
- **Django & React communities** for excellent documentation
- **MongoDB** for flexible NoSQL database
- **Our advisors and faculty** for guidance throughout the project

---

## 📧 Contact

For questions or feedback about this project:

- **GitHub Issues**: [Report a bug](https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator/issues)
- **Email**: [Your email here]

---

## ⭐ Star This Repository

If you found this project helpful, please give it a star! It helps others discover this work.

---

<div align="center">

**Built with ❤️ by Najmul Hasan Shihab**

*Final Year Software Engineering Project 2024-2025*

[⬆ Back to Top](#-echorithm---ai-powered-personalized-news-aggregator)

</div>
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
├── SETUP_GUIDE.md               # Detailed setup instructions
└── DESIGN_SYSTEM.md             # Design system documentation
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

## 🐛 Known Issues & Considerations

**Critical Setup Requirements:**
- Environment variables must be configured (API keys required)
- First-time setup requires AI model downloads (~2-3 GB)
- MongoDB must be running before starting backend

**Potential Issues:**
- Some news websites may block content scraping (403 errors)
- API rate limits apply (check individual API documentation)
- Large AI models require significant processing time on first load

For detailed troubleshooting, see [SETUP_GUIDE.md](SETUP_GUIDE.md).

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Project Repository:** [GitHub](https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator)
- **Issue Tracker:** [GitHub Issues](https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator/issues)
- **Setup Guide:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Design System:** [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions
2. Search existing [GitHub Issues](https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator/issues)
3. Create a new issue with detailed description and error logs

---

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for transformer models
- [NewsAPI](https://newsapi.org/), [GNews](https://gnews.io/), [Mediastack](https://mediastack.com/) for news data
- Django and React communities for excellent documentation
- Our supervisor for guidance and support

---

**Made with ❤️ by Team FAHIM-MISKAT-SHIHAB-TASIN**

*Last Updated: October 29, 2025*
