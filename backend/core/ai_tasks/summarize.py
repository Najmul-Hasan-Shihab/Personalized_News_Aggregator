from transformers import pipeline, AutoTokenizer
import torch

#Load primary and fallback models
primary_model="facebook/bart-large-cnn"
fallback_model="t5-small"

#load pipelines
summarizer_primary = pipeline("summarization", model=primary_model, tokenizer=primary_model, device=0 if torch.cuda.is_available() else -1)
summarizer_fallback = pipeline("summarization", model=fallback_model, tokenizer=fallback_model, device=0 if torch.cuda.is_available() else -1)

#Tokenizer for truncation
tokenizer=AutoTokenizer.from_pretrained(primary_model)

def truncate_text(text, max_tokens=1024):
    tokens=tokenizer.encode(text, truncation=True, max_length=max_tokens)
    return tokenizer.decode(tokens, skip_special_tokens=True)

def generate_summary(text, use_fallback=False):
    if not text or len(text.split()) < 30:
        print("Skipped short article.")
        return ""

    try:
        truncated_text = truncate_text(text)
        summarizer = summarizer_fallback if use_fallback or len(text.split()) < 100 else summarizer_primary
        summary = summarizer(truncated_text, max_length=100, min_length=30, do_sample=False)[0]['summary_text']
        return summary
    except Exception as e:
        print("❌ Summarization failed:", e)
        return ""

