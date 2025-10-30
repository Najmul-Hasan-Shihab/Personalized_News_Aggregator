from transformers import pipeline
import re

# Lazy loading - classifier is None until first use
_classifier = None

# Category labels with better descriptions for zero-shot
CATEGORY_LABELS = [
    "technology", "business", "health", "sports", 
    "entertainment", "science", "politics", "travel", "environment"
]

# Category keywords for quick classification
CATEGORY_KEYWORDS = {
    "technology": ["tech", "software", "ai", "computer", "digital", "app", "internet", "cyber", "innovation"],
    "business": ["business", "economy", "market", "finance", "company", "stock", "trade", "investment"],
    "health": ["health", "medical", "disease", "doctor", "hospital", "vaccine", "patient", "treatment"],
    "sports": ["sports", "game", "player", "team", "championship", "football", "basketball", "tennis"],
    "entertainment": ["movie", "film", "music", "celebrity", "actor", "singer", "show", "concert"],
    "science": ["science", "research", "study", "discovery", "scientist", "experiment", "university"],
    "politics": ["politics", "government", "election", "president", "minister", "parliament", "vote"],
    "travel": ["travel", "tourism", "vacation", "destination", "hotel", "flight", "visit"],
    "environment": ["climate", "environment", "pollution", "green", "carbon", "energy", "nature", "wildlife"]
}

def _get_classifier():
    """Lazy load zero-shot classifier."""
    global _classifier
    if _classifier is None:
        print("📥 Loading category classification model (BART-MNLI)...")
        _classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
            device=-1  # CPU
        )
    return _classifier

def quick_keyword_match(text):
    """Quick category detection using keywords."""
    text_lower = text.lower()
    
    # Count keyword matches for each category
    scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for keyword in keywords if keyword in text_lower)
        if score > 0:
            scores[category] = score
    
    # Return category with highest score if confident
    if scores:
        best_category = max(scores, key=scores.get)
        if scores[best_category] >= 2:  # At least 2 keyword matches
            return best_category
    
    return None

def clean_text_for_classification(text):
    """Clean and prepare text for classification."""
    # Remove URLs
    text = re.sub(r'http\S+|www\.\S+', '', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def predict_category(title, content, fallback_label="general"):
    """Predict article category with improved accuracy."""
    try:
        # Combine title (weighted more) and content
        title_clean = clean_text_for_classification(title.strip())
        content_clean = clean_text_for_classification(content.strip())
        
        # Title is more important, so repeat it
        text = f"{title_clean} {title_clean} {content_clean}"[:800]
        
        # Quick keyword-based classification first (faster)
        keyword_category = quick_keyword_match(text)
        if keyword_category:
            print(f"✅ Category (keyword): {keyword_category}")
            return keyword_category
        
        # If no clear keyword match, use ML model
        classifier = _get_classifier()
        
        result = classifier(
            text,
            candidate_labels=CATEGORY_LABELS,
            multi_label=False,
            hypothesis_template="This article is about {}."  # Better template
        )
        
        top_label = result["labels"][0]
        top_score = result["scores"][0]
        
        # Higher confidence threshold
        if top_score > 0.4:
            print(f"✅ Category (ML): {top_label} ({top_score:.2f})")
            return top_label
        else:
            print(f"⚠️ Low confidence ({top_score:.2f}), using fallback")
            return fallback_label
            
    except Exception as e:
        print(f"❌ Category prediction failed: {e}")
        return fallback_label

