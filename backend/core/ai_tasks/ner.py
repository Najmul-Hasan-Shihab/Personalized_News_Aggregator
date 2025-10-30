from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
import re

model_name = "dslim/bert-base-NER"

# Lazy loading - pipeline is None until first use
_ner_pipeline = None

def _get_ner_pipeline():
    """Lazy load NER pipeline."""
    global _ner_pipeline
    if _ner_pipeline is None:
        print("📥 Loading NER model (BERT)...")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForTokenClassification.from_pretrained(model_name)
        _ner_pipeline = pipeline(
            "ner",
            model=model,
            tokenizer=tokenizer,
            aggregation_strategy="simple",
            device=-1  # CPU
        )
    return _ner_pipeline

def clean_entity(entity_text):
    """Clean and normalize entity text."""
    # Remove hashtags, @ symbols
    entity = re.sub(r'[#@]', '', entity_text)
    # Remove special characters but keep spaces, hyphens, apostrophes, and periods
    entity = re.sub(r'[^\w\s\-.\']', '', entity)
    # Remove leading/trailing punctuation
    entity = entity.strip('.-_')
    # Remove extra spaces
    entity = re.sub(r'\s+', ' ', entity).strip()
    
    # Better capitalization (preserve acronyms)
    words = entity.split()
    cleaned_words = []
    for word in words:
        # Keep all-caps words (likely acronyms like FBI, NASA)
        if word.isupper() and len(word) > 1:
            cleaned_words.append(word)
        # Keep words with internal caps (like McDonald's)
        elif any(c.isupper() for c in word[1:]):
            cleaned_words.append(word)
        else:
            cleaned_words.append(word.capitalize())
    
    return ' '.join(cleaned_words)

def merge_similar_entities(entities):
    """Merge entities that are substrings or very similar."""
    merged = []
    skip_indices = set()
    
    for i, entity in enumerate(entities):
        if i in skip_indices:
            continue
        
        # Check if this entity is a substring of any other
        is_substring = False
        for j, other in enumerate(entities):
            if i != j and j not in skip_indices:
                # If current entity is part of a longer entity, skip it
                if entity.lower() in other.lower() and len(entity) < len(other):
                    is_substring = True
                    break
                # If other entity is part of current, mark it for skipping
                elif other.lower() in entity.lower() and len(other) < len(entity):
                    skip_indices.add(j)
        
        if not is_substring:
            merged.append(entity)
    
    return merged

def filter_valid_entities(entities):
    """Filter out invalid or low-quality entities."""
    valid = []
    seen = set()
    
    for entity in entities:
        # Clean the entity
        cleaned = clean_entity(entity)
        
        # Skip if too short or invalid
        if len(cleaned) < 2:
            continue
            
        # Skip common words and articles
        if cleaned.lower() in ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']:
            continue
        
        # Skip single characters or pure numbers
        if len(cleaned) == 1 or cleaned.replace(',', '').isdigit():
            continue
        
        # Skip if already seen (case-insensitive)
        if cleaned.lower() in seen:
            continue
        
        seen.add(cleaned.lower())
        valid.append(cleaned)
    
    # Merge similar entities
    valid = merge_similar_entities(valid)
    
    return valid

def extract_entities(text):
    """Extract clean, meaningful entities from text."""
    try:
        if not text or len(text.split()) < 20:
            return []

        ner_pipeline = _get_ner_pipeline()
        
        # Limit text length for efficiency
        words = text.split()
        if len(words) > 300:
            # Take first 200 and last 100 words (usually contain key entities)
            text = ' '.join(words[:200] + words[-100:])
        
        # Run NER
        results = ner_pipeline(text)
        
        # Extract entity words with score threshold
        raw_entities = [
            ent['word'] 
            for ent in results 
            if ent['entity_group'] in ["PER", "LOC", "ORG", "MISC"] 
            and ent.get('score', 0) > 0.80  # Slightly lower threshold for better recall
        ]
        
        # Filter and clean entities
        entities = filter_valid_entities(raw_entities)
        
        # Limit to top 15 most relevant (increased from 10)
        entities = entities[:15]
        
        print(f"✅ Extracted {len(entities)} entities: {entities[:5]}")
        return entities
        
    except Exception as e:
        print(f"❌ NER failed: {e}")
        return []

