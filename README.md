# NewsScope

A Browser extension for analyzing political bias in news articles with AI-powered bias detection, summarization, and emotion analysis.

## Features

- 🎯 **Bias Detection** - Analyzes political bias (Left/Center/Right)
- 📝 **Article Summarization** - Generates concise summaries using PEGASUS-XSUM
- 😊 **Emotion Analysis** - Detects emotional tone (joy, sadness, anger, fear, surprise, love)
- 🎨 **Modern UI** - Clean, professional interface built with React + TypeScript

## Project Structure

```
NewsScope-proj/
├── backend/              # FastAPI backend server
│   ├── main.py          # API endpoints
│   ├── services.py      # ML model services
│   └── requirements.txt # Python dependencies
└── newsscope-extension/ # Browser extension (React + TypeScript)
    ├── src/             # React components
    ├── public/          # Static assets
    └── dist/            # Built extension (load this in Browser)
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server:**
   ```bash
   python main.py
   ```
   
   The server will start at `http://127.0.0.1:8000`

### Extension Setup

1. **Navigate to extension directory:**
   ```bash
   cd newsscope-extension
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   ```bash
   npm run build
   ```
   
   This creates the `dist/` folder with the compiled extension.

4. **Load extension in browser:**
   - Open your browser and go to the extensions page
     - Chrome/Edge: `chrome://extensions/` or `edge://extensions/`
     - Firefox: `about:addons`
   - Enable "Developer mode" (Chrome/Edge) or "Debug Add-ons" (Firefox)
   - Click "Load unpacked" (Chrome/Edge) or "Load Temporary Add-on" (Firefox)
   - Select the `newsscope-extension/dist/` folder

## Usage

1. **Start the backend server** (must be running for the extension to work)
2. **Navigate to any news article** in your browser
3. **Select text** from the article
4. **Click the NewsScope extension icon**
5. **Click "Analyze Selection"**

The extension will display:
- Political bias analysis
- Emotional tone breakdown
- Article summary

## Development

### Backend Development

```bash
cd backend
source venv/bin/activate
python main.py
```

API will be available at `http://127.0.0.1:8000`

**API Endpoints:**
- `POST /predict` - Bias detection
- `POST /summarize` - Text summarization
- `POST /emotion` - Emotion analysis

### Extension Development

```bash
cd newsscope-extension
npm run dev  # Development mode with hot reload
npm run build  # Production build
```

After making changes, rebuild and reload the extension in your browser.

## Models Used

- **Bias Detection:** Custom DistilBERT model (`bias_model_trial/`)
- **Summarization:** PEGASUS-XSUM (`google/pegasus-xsum`)
- **Emotion Analysis:** DistilBERT emotion classifier (`bhadresh-savani/distilbert-base-uncased-emotion`)

## Technologies

**Backend:**
- FastAPI
- PyTorch
- Transformers (Hugging Face)
- Python 3.x

**Extension:**
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)

## Requirements

- Python 3.8+
- Node.js 16+
- Modern browser (Chrome, Edge, or Firefox)
- ~2GB disk space (for ML models)

## License

MIT

## Author

Developed as an academic project for news analysis and media literacy.
