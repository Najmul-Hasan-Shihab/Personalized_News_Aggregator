from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

# Model and tokenizer
model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"  # You can switch back to "twitter-roberta-base-sentiment" if needed
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Sentiment labels
labels = ["Negative", "Neutral", "Positive"]

def preprocess(text):
    """Replace usernames and URLs to match model training format."""
    return " ".join([
        "@user" if t.startswith("@") else "http" if t.startswith("http") else t
        for t in text.split()
    ])

def analyze_sentiment(text):
    try:
        if not text or len(text.strip()) < 30:
            return {"label": "Neutral", "confidence": 0.0}  # Fallback for short content

        cleaned_text = preprocess(text)
        inputs = tokenizer(cleaned_text, return_tensors="pt", truncation=True)

        with torch.no_grad():
            outputs = model(**inputs)
            scores = F.softmax(outputs.logits, dim=1)
            predicted = torch.argmax(scores).item()
            confidence = scores[0][predicted].item()

        return {
            "label": labels[predicted],
            "confidence": round(confidence, 3)
        }

    except Exception as e:
        print("❌ Sentiment analysis failed:", e)
        return {"label": "Neutral", "confidence": 0.0}