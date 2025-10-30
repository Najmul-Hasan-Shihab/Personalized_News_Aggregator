from transformers import pipeline, AutoTokenizer
import torch
import re

#Model names
primary_model="facebook/bart-large-cnn"
fallback_model="t5-small"

# Lazy loading - models are None until first use
_summarizer_primary = None
_summarizer_fallback = None
_tokenizer = None

def _get_tokenizer():
    """Lazy load tokenizer."""
    global _tokenizer
    if _tokenizer is None:
        print("📥 Loading tokenizer...")
        _tokenizer = AutoTokenizer.from_pretrained(primary_model)
    return _tokenizer

def _get_primary_summarizer():
    """Lazy load primary summarization model."""
    global _summarizer_primary
    if _summarizer_primary is None:
        print("📥 Loading primary summarization model (BART)...")
        _summarizer_primary = pipeline(
            "summarization", 
            model=primary_model, 
            tokenizer=primary_model, 
            device=0 if torch.cuda.is_available() else -1
        )
    return _summarizer_primary

def _get_fallback_summarizer():
    """Lazy load fallback summarization model."""
    global _summarizer_fallback
    if _summarizer_fallback is None:
        print("📥 Loading fallback summarization model (T5)...")
        _summarizer_fallback = pipeline(
            "summarization", 
            model=fallback_model, 
            tokenizer=fallback_model, 
            device=0 if torch.cuda.is_available() else -1
        )
    return _summarizer_fallback

def clean_text(text):
    """Clean and prepare text for summarization."""
    # Remove URLs
    text = re.sub(r'http\S+|www\.\S+', '', text)
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    # Remove common article footers and CTAs
    text = re.sub(r'(Read more|Continue reading|Click here|Subscribe|Sign up|Follow us|Share this).*$', '', text, flags=re.IGNORECASE)
    # Remove social media handles
    text = re.sub(r'@\w+', '', text)
    text = re.sub(r'#\w+', '', text)
    # Remove HTML entities
    text = re.sub(r'&\w+;', ' ', text)
    # Fix spacing around punctuation
    text = re.sub(r'\s+([.,!?;:])', r'\1', text)
    text = re.sub(r'([.,!?;:])\s*([a-zA-Z])', r'\1 \2', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove repetitive phrases (same word 3+ times in a row)
    text = re.sub(r'\b(\w+)(\s+\1){2,}\b', r'\1', text, flags=re.IGNORECASE)
    
    return text.strip()

def truncate_text(text, max_tokens=1024):
    """Intelligently truncate text to max tokens."""
    tokenizer = _get_tokenizer()
    text = clean_text(text)
    
    # Split into sentences to avoid cutting mid-sentence
    sentences = re.split(r'(?<=[.!?])\s+', text)
    truncated = []
    token_count = 0
    
    for sentence in sentences:
        sentence_tokens = tokenizer.encode(sentence, add_special_tokens=False)
        if token_count + len(sentence_tokens) <= max_tokens:
            truncated.append(sentence)
            token_count += len(sentence_tokens)
        else:
            break
    
    return ' '.join(truncated)

def post_process_summary(summary):
    """Clean up the generated summary with grammar fixes."""
    # Fix common AI-generated issues
    # Remove incomplete sentences at the end
    sentences = re.split(r'(?<=[.!?])\s+', summary)
    complete_sentences = []
    
    for sentence in sentences:
        sentence = sentence.strip()
        # Only keep sentences that end with proper punctuation
        if sentence and sentence[-1] in '.!?':
            # Fix spacing issues
            sentence = re.sub(r'\s+([.,!?;:])', r'\1', sentence)
            sentence = re.sub(r'([.,!?;:])\s*([a-zA-Z])', r'\1 \2', sentence)
            # Fix double spaces
            sentence = re.sub(r'\s+', ' ', sentence)
            # Ensure first letter is capitalized
            if sentence:
                sentence = sentence[0].upper() + sentence[1:]
            complete_sentences.append(sentence)
    
    summary = ' '.join(complete_sentences)
    
    # If no complete sentences, try to salvage
    if not summary:
        summary = re.sub(r'\s+', ' ', summary).strip()
        if summary and summary[-1] not in '.!?':
            summary += '.'
        if summary:
            summary = summary[0].upper() + summary[1:]
    
    # Fix common word breaks (e.g., "U .S." -> "U.S.")
    summary = re.sub(r'\b([A-Z])\s*\.\s*([A-Z])\s*\.', r'\1.\2.', summary)
    summary = re.sub(r'\b([A-Z])\s+([A-Z])\b', r'\1\2', summary)
    
    # Remove duplicate punctuation
    summary = re.sub(r'([.!?]){2,}', r'\1', summary)
    
    # Final cleanup
    summary = re.sub(r'\s+', ' ', summary).strip()
    
    return summary

def generate_summary(text, use_fallback=False):
    """Generate a clean, readable summary."""
    if not text or len(text.split()) < 30:
        print("⚠️ Text too short for summarization.")
        return ""

    try:
        # Clean and truncate the text
        truncated_text = truncate_text(text, max_tokens=800)
        
        # Skip if cleaned text is too short
        if len(truncated_text.split()) < 30:
            print("⚠️ Cleaned text too short.")
            return ""
        
        # Choose model based on text length and preference
        word_count = len(truncated_text.split())
        if use_fallback or word_count < 80:
            summarizer = _get_fallback_summarizer()
            max_len, min_len = 60, 20
        else:
            summarizer = _get_primary_summarizer()
            max_len, min_len = 130, 40
        
        # Generate summary with better parameters
        result = summarizer(
            truncated_text,
            max_length=max_len,
            min_length=min_len,
            do_sample=False,
            num_beams=4,  # Better quality
            early_stopping=True
        )
        
        summary = result[0]['summary_text']
        
        # Post-process for better readability
        summary = post_process_summary(summary)
        
        print(f"✅ Summary generated: {len(summary)} chars")
        return summary
        
    except Exception as e:
        print(f"❌ Summarization failed: {e}")
        # Try fallback if primary failed
        if not use_fallback:
            print("🔄 Trying fallback model...")
            return generate_summary(text, use_fallback=True)
        return ""


