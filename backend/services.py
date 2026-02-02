import torch
import re
import os

from transformers import (
    DistilBertTokenizerFast, 
    DistilBertForSequenceClassification,
    PegasusTokenizer,
    PegasusForConditionalGeneration,
    pipeline
)

# Load resources once (global scope for simplicity in this project)

print("Loading Bias Model...")
bias_tokenizer = DistilBertTokenizerFast.from_pretrained("bias_model_trial")
bias_model = DistilBertForSequenceClassification.from_pretrained("bias_model_trial")

print("Loading Summarization Model (PEGASUS-XSUM - news-specific)...")
# PEGASUS-XSUM: Designed specifically for news summarization
summary_tokenizer = PegasusTokenizer.from_pretrained("google/pegasus-xsum")
summary_model = PegasusForConditionalGeneration.from_pretrained("google/pegasus-xsum")
summary_model.eval()  # Inference-only mode

print("Loading Emotion Detection Model (lightweight)...")
# Using very small emotion model
emotion_pipeline = pipeline(
    "text-classification",
    model="bhadresh-savani/distilbert-base-uncased-emotion",
    top_k=None,  # Updated from deprecated return_all_scores
    device=-1  # CPU
)

print("✅ All models loaded successfully!")

def analyze_bias(text: str) -> dict:
    """
    Analyzes the political bias of the given text.
    Returns a dictionary with 'bias' (Left/Center/Right) and 'confidence'.
    """
    if not text.strip():
        raise ValueError("Empty text provided")

    # Tokenize
    inputs = bias_tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding=True)
    
    # Predict
    with torch.no_grad():
        outputs = bias_model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        
    label_idx = torch.argmax(probs).item()
    confidence = round(probs[0][label_idx].item(), 2)
    
    label_map = {0: "Center", 1: "Left", 2: "Right"}
    bias_label = label_map.get(label_idx, "Unknown")
    
    return {
        "bias": bias_label,
        "confidence": confidence
    }

def generate_summary(text: str) -> str:
    """
    Generates a high-quality abstractive summary using PEGASUS-XSUM.
    Designed specifically for news articles with proper generation parameters.
    """
    if not text.strip():
        raise ValueError("Empty text provided")
    
    # Clean the text
    text = re.sub(r'\s+', ' ', text).strip()  # Remove excessive whitespace
    
    # Truncate to ~900-1000 tokens (roughly 3500-4000 characters)
    max_chars = 4000
    if len(text) > max_chars:
        text = text[:max_chars]
    
    try:
        # Tokenize input
        inputs = summary_tokenizer(
            text,
            max_length=1024,
            truncation=True,
            return_tensors="pt"
        )
        
        # Generate summary with proper parameters
        with torch.no_grad():
            summary_ids = summary_model.generate(
                inputs["input_ids"],
                max_length=120,
                min_length=40,
                num_beams=4,
                early_stopping=True,
                do_sample=False,
                temperature=1.0,  # Not used when do_sample=False
                no_repeat_ngram_size=3,
                length_penalty=2.0
            )
        
        # Decode summary
        summary = summary_tokenizer.decode(
            summary_ids[0],
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True
        )
        
        return summary.strip()
        
    except Exception as e:
        print(f"Summarization error: {e}")
        # Fallback: return first 3 sentences
        sentences = text.split('.')[:3]
        return '. '.join(sentences) + '.'

def analyze_emotion(text: str) -> dict:
    """
    Analyzes the emotional tone of the text.
    Returns the dominant emotion and all emotion scores.
    Emotions: sadness, joy, love, anger, fear, surprise
    """
    if not text.strip():
        raise ValueError("Empty text provided")
    
    try:
        # Get emotion predictions (limit text for speed)
        results = emotion_pipeline(text[:512])[0]
        
        # Find dominant emotion
        dominant = max(results, key=lambda x: x['score'])
        
        # Format all emotions
        emotions = {item['label']: round(item['score'], 3) for item in results}
        
        return {
            "dominant_emotion": dominant['label'],
            "confidence": round(dominant['score'], 3),
            "all_emotions": emotions
        }
    except Exception as e:
        print(f"Emotion analysis error: {e}")
        # Fallback: return neutral
        return {
            "dominant_emotion": "neutral",
            "confidence": 0.5,
            "all_emotions": {"neutral": 0.5}
        }


