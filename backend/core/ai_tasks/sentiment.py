from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
import re

# Model name
model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"  

# Lazy loading - models are None until first use
_tokenizer = None
_model = None

# Sentiment labels
labels = ["Negative", "Neutral", "Positive"]

def _get_model():
    """Lazy load sentiment model."""
    global _model, _tokenizer
    if _model is None:
        print("📥 Loading sentiment analysis model (RoBERTa)...")
        _tokenizer = AutoTokenizer.from_pretrained(model_name)
        _model = AutoModelForSequenceClassification.from_pretrained(model_name)
        _model.eval()  # Set to evaluation mode
    return _tokenizer, _model

def clean_text_for_sentiment(text):
    """Clean text for sentiment analysis."""
    # Remove URLs
    text = re.sub(r'http\S+|www\.\S+', 'http', text)
    # Replace usernames
    text = re.sub(r'@\w+', '@user', text)
    # Remove excessive punctuation
    text = re.sub(r'([!?.]){2,}', r'\1', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_meaningful_text(text, max_words=200):
    """Extract the most meaningful part of text for sentiment analysis."""
    # Clean the text
    text = clean_text_for_sentiment(text)
    
    # Split into sentences
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    # Prioritize first and last sentences (often contain main sentiment)
    if len(sentences) > 4:
        selected = sentences[:2] + sentences[-2:]
    else:
        selected = sentences
    
    combined = ' '.join(selected)
    
    # Truncate to max words
    words = combined.split()
    if len(words) > max_words:
        combined = ' '.join(words[:max_words])
    
    return combined

def analyze_sentiment(text):
    """Analyze sentiment with improved accuracy."""
    try:
        if not text or len(text.strip()) < 20:
            return {"label": "Neutral", "confidence": 0.0}

        tokenizer, model = _get_model()
        
        # Extract and clean meaningful text
        processed_text = extract_meaningful_text(text, max_words=150)
        
        if len(processed_text.split()) < 10:
            return {"label": "Neutral", "confidence": 0.0}
        
        # Tokenize with proper truncation
        inputs = tokenizer(
            processed_text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True
        )

        # Run inference
        with torch.no_grad():
            outputs = model(**inputs)
            scores = F.softmax(outputs.logits, dim=1)[0]
            predicted = torch.argmax(scores).item()
            confidence = scores[predicted].item()

        # Apply confidence threshold for neutral
        if confidence < 0.6:
            predicted = 1  # Default to Neutral if uncertain
            confidence = scores[1].item()

        result = {
            "label": labels[predicted],
            "confidence": round(confidence, 3)
        }
        
        print(f"✅ Sentiment: {result['label']} ({result['confidence']})")
        return result

    except Exception as e:
        print(f"❌ Sentiment analysis failed: {e}")
        return {"label": "Neutral", "confidence": 0.0}
