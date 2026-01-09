from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification
from transformers import T5Tokenizer, T5ForConditionalGeneration, pipeline

# Load tokenizer and model explicitly
t5_tokenizer = T5Tokenizer.from_pretrained("t5-base")
t5_model = T5ForConditionalGeneration.from_pretrained("t5-base")

# Create summarizer pipeline manually
t5_summarizer = pipeline(
    "summarization",
    model=t5_model,
    tokenizer=t5_tokenizer,
    framework="pt"
)


app = FastAPI()

tokenizer = DistilBertTokenizerFast.from_pretrained("bias_model_trial")
model = DistilBertForSequenceClassification.from_pretrained("bias_model_trial")

summarizer = pipeline(
    "summarization", 
    # model="google/pegasus-xsum",
    model="t5-base",
    tokenizer="google/pegasus-xsum", 
    framework="pt"  # force PyTorch
)



class Article(BaseModel):
    text: str

@app.post("/predict")
def predict(article: Article):
    inputs = tokenizer(article.text, return_tensors="pt", truncation=True, max_length=512, padding=True)
    outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=1)
    label = torch.argmax(probs).item()
    label_map = {0: "Center", 1: "Left", 2: "Right"}
    return {
        "bias": label_map[label],
        "confidence": round(probs[0][label].item(), 2)
    }
    
@app.post("/summarize")
async def summarize_text(payload: dict):
    text = payload.get("text", "")
    if not text:
        return {"error": "No input text provided."}

    input_text = "summarize: " + text.strip()

    summary = t5_summarizer(
        input_text,
        max_length=150,
        min_length=30,
        do_sample=False
    )[0]["summary_text"]

    return {"summary": summary}

