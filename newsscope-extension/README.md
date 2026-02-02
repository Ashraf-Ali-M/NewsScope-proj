# NewsScope Browser Extension

A modern browser extension for analyzing news articles for bias, credibility, and sentiment.

## Features

- 🔍 **Article Analysis**: Analyze news articles for bias, credibility, and sentiment
- 📊 **Real-time Results**: Get instant analysis results in a beautiful popup interface
- 🎯 **Context Menu**: Right-click selected text to analyze specific passages
- 💾 **Result Storage**: Automatically saves your last analysis
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Installation

### Chrome / Edge / Brave

1. Open your browser and navigate to the extensions page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`

2. Enable **Developer mode** (toggle in the top-right corner)

3. Click **Load unpacked**

4. Navigate to and select the `newsscope-extension` folder:
   ```
   /home/faisal/Documents/Projects/NewsScope-proj/newsscope-extension
   ```

5. The NewsScope extension should now appear in your extensions list!

### Firefox

1. Open Firefox and navigate to: `about:debugging#/runtime/this-firefox`

2. Click **Load Temporary Add-on**

3. Navigate to the `newsscope-extension` folder and select the `manifest.json` file:
   ```
   /home/faisal/Documents/Projects/NewsScope-proj/newsscope-extension/manifest.json
   ```

4. The extension will be loaded temporarily (until you restart Firefox)

**Note**: For permanent installation in Firefox, you'll need to sign the extension through Mozilla's Add-on Developer Hub.

## Usage

### Analyze Current Page

1. Click the NewsScope icon in your browser toolbar
2. Click the **"Analyze Current Page"** button
3. View the analysis results showing:
   - Bias Score (Low/Medium/High)
   - Credibility (Low/Medium/High)
   - Sentiment (Positive/Neutral/Negative)
   - Article Type

### Analyze Selected Text

1. Select any text on a webpage
2. Right-click and choose **"Analyze with NewsScope"**
3. The extension will analyze just the selected text

## Project Structure

```
newsscope-extension/
├── manifest.json          # Extension configuration (Manifest v3)
├── popup.html            # Popup interface HTML
├── popup.css             # Popup styling
├── popup.js              # Popup logic
├── background.js         # Background service worker
├── content.js            # Content script for page analysis
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## Technical Details

- **Manifest Version**: 3 (latest standard)
- **Permissions**: 
  - `activeTab`: Access current tab content
  - `contextMenus`: Add right-click menu options
  - `storage`: Save analysis results
- **Browser Compatibility**: Chrome, Edge, Brave, Firefox (with minor adjustments)

## Current Analysis Features

The extension currently includes a **placeholder analysis algorithm** that:
- Detects sentiment based on positive/negative keywords
- Identifies potential bias through loaded language
- Assesses credibility based on article length and structure
- Categorizes article types

**Note**: This is a foundation for integrating more sophisticated ML models or API-based analysis in the future.

## Future Enhancements

- [ ] Integration with ML models for advanced analysis
- [ ] API connection to backend analysis service
- [ ] Visual highlighting of biased text on pages
- [ ] Historical analysis tracking
- [ ] Export analysis reports
- [ ] Customizable analysis parameters
- [ ] Multi-language support

## Development

To modify the extension:

1. Make your changes to the extension files
2. Go to your browser's extensions page
3. Click the **reload** icon on the NewsScope extension
4. Test your changes

## Troubleshooting

### Extension won't load
- Make sure you're selecting the correct folder (`newsscope-extension/`)
- Check that all required files are present
- Look for errors in the browser console

### Popup doesn't open
- Check the browser console for JavaScript errors
- Verify that `popup.html` and `popup.js` are in the extension folder

### Analysis doesn't work
- Make sure you're on a webpage (not a browser settings page)
- Check the browser console for errors
- Verify the content script is loading properly

## License

This project is part of the NewsScope academic project.

## Version

**v1.0.0** - Initial release with basic analysis features
