from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from services import analyze_bias, generate_summary, analyze_emotion

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="NewsScope API",
    description="Backend API for NewsScope Bias Analyzer",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In production, restrict to extension ID.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class ArticleRequest(BaseModel):
    text: str

class BiasResponse(BaseModel):
    bias: str
    confidence: float

class SummaryResponse(BaseModel):
    summary: str

class EmotionResponse(BaseModel):
    dominant_emotion: str
    confidence: float
    all_emotions: dict



@app.get("/")
def health_check():
    return {"status": "running", "service": "NewsScope API"}

@app.post("/predict", response_model=BiasResponse)
async def predict_endpoint(article: ArticleRequest):
    try:
        if len(article.text) < 50:
            raise HTTPException(status_code=400, detail="Text is too short. Please select at least 50 characters.")
            
        result = analyze_bias(article.text)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Error in predict: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during prediction.")

@app.post("/summarize", response_model=SummaryResponse)
async def summarize_endpoint(article: ArticleRequest):
    try:
        if len(article.text) < 50:
            raise HTTPException(status_code=400, detail="Text is too short for summarization.")
            
        summary_text = generate_summary(article.text)
        return {"summary": summary_text}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Error in summarize: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during summarization.")

@app.post("/emotion", response_model=EmotionResponse)
async def emotion_endpoint(article: ArticleRequest):
    try:
        if len(article.text) < 10:
            raise HTTPException(status_code=400, detail="Text is too short for emotion analysis.")
            
        result = analyze_emotion(article.text)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Error in emotion analysis: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during emotion analysis.")



