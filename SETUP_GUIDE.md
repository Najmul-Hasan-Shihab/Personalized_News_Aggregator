# 🚀 Quick Start Guide - Echorithm

**Last Updated:** October 29, 2025

This is a streamlined guide to get your development environment up and running quickly.

---

## ⚡ Prerequisites Checklist

Before starting, ensure you have:

- [ ] Python 3.11+ installed (`python --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] MongoDB installed and running (or MongoDB Atlas account)
- [ ] Git installed
- [ ] A code editor (VS Code recommended)

---

## 📥 Step 1: Clone and Navigate

```powershell
git clone https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator.git
cd Personalized_News_Aggregator
```

---

## 🔧 Step 2: Backend Setup

### 2.1 Create Virtual Environment

```powershell
cd backend
python -m venv venv
```

### 2.2 Activate Virtual Environment

**PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```

**If you get an execution policy error:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
```

### 2.3 Install Dependencies

```powershell
pip install -r requirements.txt
```

**This will take a few minutes.** It installs Django, MongoDB drivers, AI/ML libraries, etc.

### 2.4 Configure Environment Variables

**Copy the example file:**
```powershell
cp .env.example .env
```

**Edit `.env` file** and add your API keys:

```env
# Get free API keys from:
# NewsAPI: https://newsapi.org/register
# GNews: https://gnews.io/register  
# Mediastack: https://mediastack.com/product

NEWSAPI_KEY=your_actual_newsapi_key_here
GNEWS_KEY=your_actual_gnews_key_here
MEDIASTACK_KEY=your_actual_mediastack_key_here
```

**The file already has placeholder values, but get your own keys for best results!**

### 2.5 Start MongoDB

**If using local MongoDB:**
```powershell
# Windows
net start MongoDB

# Or check if it's already running
Get-Service MongoDB
```

**If using MongoDB Atlas:**
- Update `MONGODB_URI` in `.env` with your connection string
- Example: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/`

### 2.6 Run Migrations

```powershell
python manage.py migrate
```

### 2.7 Start Backend Server

```powershell
python manage.py runserver
```

**✅ Backend should now be running at:** `http://127.0.0.1:8000`

---

## 🎨 Step 3: Frontend Setup

**Open a NEW terminal** (keep backend running)

### 3.1 Navigate to Frontend

```powershell
cd frontend/echorithm
```

### 3.2 Install Dependencies

```powershell
npm install
```

**This will take a few minutes.**

### 3.3 Configure Environment (Optional)

The frontend already has a `.env` file with default settings. If your backend is on a different URL, update it:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 3.4 Start Frontend Dev Server

```powershell
npm run dev
```

**✅ Frontend should now be running at:** `http://localhost:5173`

---

## 📰 Step 4: Fetch Initial News Articles

**Open a THIRD terminal** (or use your browser)

### Option A: Using Browser
Navigate to: `http://127.0.0.1:8000/articles/update/`

### Option B: Using PowerShell
```powershell
Invoke-WebRequest -Uri http://127.0.0.1:8000/articles/update/
```

### Option C: Using curl (Git Bash)
```bash
curl http://127.0.0.1:8000/articles/update/
```

**⏰ This will take 5-10 minutes on first run** because:
1. Downloading AI models (~2-3 GB)
2. Fetching articles from 3 news APIs
3. Processing with AI (summarization, sentiment, NER, categorization)
4. Storing in MongoDB

**You'll see progress in the backend terminal.**

---

## 🎉 Step 5: Explore the App

### 5.1 Open the App
Visit `http://localhost:5173` in your browser

### 5.2 Create an Account
1. Click **Sign Up** button
2. Enter username and password
3. Click **Open Account**

### 5.3 Set Your Preferences
1. Click your profile icon (top right)
2. Go to **Profile** page
3. Select categories you're interested in
4. Click **Save**

### 5.4 Explore Features
- **Home** - Browse all articles by category
- **For You** - Personalized feed based on your preferences
- **Profile** - Manage preferences and account

---

## 🐛 Troubleshooting

### Backend won't start

**Error: `ModuleNotFoundError: No module named 'decouple'`**
```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

**Error: `MongoDB connection failed`**
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start it if stopped
net start MongoDB

# Or use MongoDB Atlas and update .env
```

**Error: `ImportError: cannot import name 'config'`**
- Make sure you installed `python-decouple`
- Check that `.env` file exists in `backend/` directory

### Frontend won't start

**Error: `Cannot find module 'axios'`**
```powershell
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

**Error: `VITE_API_BASE_URL is not defined`**
- Make sure `.env` file exists in `frontend/echorithm/`
- Restart the dev server after creating `.env`

### No articles showing

**Check backend logs:**
1. Did article update complete successfully?
2. Are there errors in the terminal?

**Fetch articles manually:**
```powershell
Invoke-WebRequest -Uri http://127.0.0.1:8000/articles/update/
```

**Check MongoDB:**
```powershell
# Connect to MongoDB shell
mongosh

# Switch to database
use news_aggregator_db

# Count articles
db.articles.count()

# View sample article
db.articles.findOne()
```

### API keys not working

**Get new free API keys:**
- NewsAPI: https://newsapi.org/register (500 requests/day free)
- GNews: https://gnews.io/register (100 requests/day free)
- Mediastack: https://mediastack.com/product (100 requests/month free)

**Update `.env` file with new keys.**

---

## 🔄 Daily Development Workflow

### Starting Work

```powershell
# Terminal 1: Backend
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver

# Terminal 2: Frontend
cd frontend/echorithm
npm run dev

# Terminal 3: MongoDB (if local)
net start MongoDB
```

### Stopping Work

```powershell
# Press Ctrl+C in each terminal to stop servers

# Deactivate Python virtual environment
deactivate
```

---

## 📚 Useful Commands

### Backend

```powershell
# Create superuser for Django admin
python manage.py createsuperuser

# Access Django admin
# Visit: http://127.0.0.1:8000/admin/

# Run tests
python manage.py test

# Make migrations (after model changes)
python manage.py makemigrations
python manage.py migrate

# Open Django shell
python manage.py shell
```

### Frontend

```powershell
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### MongoDB

```powershell
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use database
use news_aggregator_db

# Show collections
show collections

# Query articles
db.articles.find().pretty()

# Count articles
db.articles.countDocuments()

# Find articles by category
db.articles.find({category: "technology"}).pretty()

# Clear all articles (careful!)
db.articles.deleteMany({})
```

---

## 🚀 Quick Commands Reference

```powershell
# Full restart (run these in order)
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver

# New terminal
cd frontend/echorithm
npm run dev

# Update articles
Invoke-WebRequest -Uri http://127.0.0.1:8000/articles/update/
```

---

## 🎯 What to Do After Setup

1. **Read the full README.md** for detailed documentation
2. **Check PROJECT_ANALYSIS.md** to understand the codebase
3. **Review QUICK_WINS_SUMMARY.md** to see recent improvements
4. **Start contributing!** Pick an issue from the project analysis

---

## 🆘 Getting Help

If you're stuck:

1. Check the error message carefully
2. Review this guide's troubleshooting section
3. Check the README.md for more details
4. Search existing GitHub issues
5. Create a new issue with:
   - Error message
   - Steps you took
   - Your environment (OS, Python version, Node version)

---

## 🎓 Learning Resources

### Django
- [Official Django Tutorial](https://docs.djangoproject.com/en/5.2/intro/tutorial01/)
- [Django REST Framework](https://www.django-rest-framework.org/)

### React
- [Official React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)

### MongoDB
- [MongoDB University](https://university.mongodb.com/) (free courses)

### AI/ML
- [Hugging Face Course](https://huggingface.co/course)
- [PyTorch Tutorials](https://pytorch.org/tutorials/)

---

**Happy Coding! 🎉**

*If this guide helped you, consider giving the project a ⭐ on GitHub!*
