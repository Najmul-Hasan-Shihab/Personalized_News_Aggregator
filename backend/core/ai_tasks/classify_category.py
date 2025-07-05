from transformers import pipeline

# Initialize zero-shot classifier (once)
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Define your category labels
CATEGORY_LABELS = [
    "technology", "business", "health", "sports", "entertainment", "science", "politics", "travel", "environment"
]

def predict_category(title, content, fallback_label="general"):
    try:
        text = f"{title.strip()} {content.strip()}"[:1000]  # limit to 1000 chars
        result = classifier(text, candidate_labels=CATEGORY_LABELS)
        top_label = result["labels"][0]
        confidence = result["scores"][0]

        if confidence > 0.5:  # optional confidence threshold
            return top_label
        else:
            return fallback_label
    except Exception as e:
        print("❌ Category prediction failed:", e)
        return fallback_label
