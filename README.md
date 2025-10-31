# 🧠 Echorithm – AI-Powered Personalized News Aggregator

> An intelligent news aggregation platform that combines multiple sources with advanced AI/ML capabilities for **summarization**, **sentiment analysis**, **entity recognition**, and **personalized recommendations**.

[![Python](https://img.shields.io/badge/Python-3.13+-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.2.3-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 Overview

**Echorithm** is an AI-driven news aggregator that curates, analyzes, and personalizes news content for users.  
It aggregates articles from multiple APIs and uses transformer-based models to summarize, classify, and deliver insights tailored to each user’s reading habits.

**Core Capabilities**
- AI-powered article summarization (BART / T5)
- Sentiment analysis with RoBERTa
- Named-entity recognition with BERT
- Category classification via zero-shot learning
- Personalized recommendations based on reading history
- Analytics dashboard with reading insights

---

## ✨ Key Features

### 🤖 AI Processing
- **Summarization:** Concise AI-generated summaries  
- **Sentiment Analysis:** Positive / Neutral / Negative tagging  
- **Entity Recognition:** People, organizations, locations  
- **Auto-Categorization:** Topics like Tech, Sports, Business, etc.

### 📰 Aggregation
- Unified feed from **NewsAPI**, **GNews**, and **MediaStack**
- Smart web-scraping fallback for truncated articles
- Real-time deduplication and metadata enrichment

### 👤 Personalization
- Preference-based feed and recommendations  
- TF-IDF + cosine similarity suggestions  
- Reading history tracking and analytics  
- Bookmarking and reading lists  

### 📊 Analytics & Insights
- Reading time, completion rate, and streaks  
- 14-day activity timeline and peak reading hours  
- Personalized insights and category breakdowns  

### 🎨 Modern Interface
- Responsive React 19 frontend with Vite  
- Embedded article reader with live reading timer  
- Dark-mode ready UI with gradient theme  

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React 19.1.0, Vite 7, React Router 7, Axios |
| **Backend** | Python 3.13+, Django 5.2.3, Django REST Framework |
| **Database** | MongoDB (content, analytics), SQLite (auth) |
| **AI/ML** | PyTorch, Hugging Face Transformers, Scikit-learn |
| **External APIs** | NewsAPI, GNews, MediaStack |
| **Scraping** | BeautifulSoup4 + lxml |

---

## 🏗️ System Architecture

```text
┌───────────────────────────────┐
│        React Frontend         │
│  ├── Home / ForYou / Profile  │
│  ├── Analytics / Bookmarks    │
│  └── Auth / Search            │
└───────────────┬───────────────┘
                │ Axios (REST)
┌───────────────▼───────────────┐
│        Django REST API        │
│  ├── Authentication & Users   │
│  ├── Article Aggregation      │
│  ├── AI Processing Pipeline   │
│  └── Analytics Endpoints      │
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│        MongoDB Database       │
│  • Articles                   │
│  • Reading History            │
│  • Analytics & Preferences    │
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│        External APIs          │
│  NewsAPI • GNews • MediaStack │
└───────────────────────────────┘

└───────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.13+  
- Node.js 18+  
- MongoDB 7.0+ (local or Atlas)  
- Git

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator.git
cd Personalized_News_Aggregator
```
### 2️⃣ Backend Setup 
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows
# source venv/bin/activate   # Linux/Mac
pip install -r requirements.txt
```
#### Create .env in backend/:
```bash
SECRET_KEY=your-django-secret
DEBUG=True
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=news_aggregator_db

NEWSAPI_KEY=your_newsapi_key
GNEWS_KEY=your_gnews_key
MEDIASTACK_KEY=your_mediastack_key

CORS_ALLOWED_ORIGINS=http://localhost:5173
```
#### Run migrations:
```bash
python manage.py migrate
python manage.py runserver

```
### 3️⃣ Frontend Setup
```bash
cd frontend/echorithm
npm install
npm run dev
```

#### Access the app at http://localhost:5173
#### ⚠️ On first run, AI models will download (~2–3 GB).
---

## 📡 API Overview
### Authentication

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/register/` | Register user |
| POST | `/login/` | Login & get JWT |
| POST | `/token/refresh/` | Refresh token |

### Articles

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/articles/` | Get all articles |
| GET | `/articles/update/` | Fetch latest articles |
| GET | `/articles/search/?q=term` | Search articles |
| POST | `/articles/track/` | Track article view |

### Preferences & Bookmarks

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/preferences/` | Get user preferences |
| POST | `/preferences/` | Update preferences |
| GET | `/bookmarks/` | List bookmarks |
| POST | `/bookmarks/` | Add bookmark |
| DELETE | `/bookmarks/{id}/` | Remove bookmark |

### Analytics

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/analytics/track-session/` | Track reading session |
| GET | `/analytics/stats/` | Reading statistics |
| GET | `/analytics/timeline/` | Activity timeline |
| GET | `/analytics/insights/` | AI-generated insights |

#### All authenticated requests require: 
```bash
Authorization: Bearer <access_token>
``` 
---

## 🤖 AI/ML Pipeline

| Stage | Model | Task |
|--------|--------|------|
| Summarization | `facebook/bart-large-cnn`, `t5-small` | Text summarization |
| Sentiment | `cardiffnlp/twitter-roberta-base-sentiment-latest` | Sentiment analysis |
| NER | `dslim/bert-base-NER` | Entity recognition |
| Classification | `facebook/bart-large-mnli` | Zero-shot topic classification |

---

### 🧩 Pipeline Flow
-1. Fetch news from APIs  
-2. Scrape full content if truncated  
-3. Generate summaries  
-4. Run sentiment and entity extraction  
-5. Classify category  
-6. Store processed data in MongoDB  
-7. Generate recommendations and insights  

---

### ⚙️ Performance
- Average: **10–15 seconds per article (CPU)**  
- GPU acceleration supported (**CUDA**)  

---

## 🧠 Analytics Dashboard Highlights

- Total articles read  
- Reading time & completion rate  
- 14-day activity visualization  
- Category-wise breakdown  
- Personalized insights (reading streaks, peak hours)  

---

## 📸 Screenshots



| Screenshot 1 | Screenshot 2 | Screenshot 3 |
|---------------|---------------|---------------|
| ![Screenshot 1](./assets/screenshots/screen1.png) | ![Screenshot 2](./assets/screenshots/screen2.png) | ![Screenshot 3](./assets/screenshots/screen3.png) |
| ![Screenshot 4](./assets/screenshots/screen4.png) | ![Screenshot 5](./assets/screenshots/screen5.png) | ![Screenshot 6](./assets/screenshots/screen6.png) |



---

## 🔮 Roadmap

### Short-Term
- [ ] Social sharing  
- [ ] Email newsletter  
- [ ] Push notifications  
- [ ] Multi-language support  

### Long-Term
- [ ] Voice article reading (TTS)  
- [ ] Advanced ML recommendations  
- [ ] Mobile app (React Native)  
- [ ] Real-time live updates (WebSocket)  

---

## 🤝 Contributing

Contributions are welcome!  

-1. Fork the repo  
-2. Create a feature branch (`git checkout -b feature/Name`)  
-3. Commit (`git commit -m "Add feature"`)  
-4. Push and open a PR  

**Please follow:**
- PEP 8 for Python  
- Prettier + ESLint for React  
- Add meaningful commits and update documentation  

---

## 👥 Authors

**Najmul Hasan Shihab** – Full-Stack Developer, ML Integration  
- GitHub: [@Najmul-Hasan-Shihab](https://github.com/Najmul-Hasan-Shihab)

**Contributors**
- **Fahim** – Backend Development  
- **Miskat** – Frontend & UI Design  
- **Tasin** – Database & QA  

---

## 📜 License

This project is licensed under the **MIT License**.  
See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for transformer models  
- [NewsAPI](https://newsapi.org/), [GNews](https://gnews.io/), [MediaStack](https://mediastack.com/) for data sources  
- Django & React communities  
- MongoDB for NoSQL support  

---

<div align="center">

**Built with ❤️ using Python, Django, React, and AI**

⭐ *If you find this project helpful, please give it a star!* ⭐

</div>



