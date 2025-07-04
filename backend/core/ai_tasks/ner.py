from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

model_name = "dslim/bert-base-NER"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)

ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

def extract_entities(text):
    try:
        if not text or len(text.split()) < 30:
            return []

        results = ner_pipeline(text)
        entities = list({ent['word'] for ent in results if ent['entity_group'] in ["PER", "LOC", "ORG", "MISC"]})

        return entities
    except Exception as e:
        print("❌ NER failed:", e)
        return []
