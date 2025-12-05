# YouTube Downloader with yt-dlp

A browser extension that adds a download button to YouTube pages, sending download requests to a local yt-dlp server.

## Features
- Adds download button directly to YouTube interface
- Supports video (high quality) and audio-only (MP3) downloads
- Remembers your last format choice
- Sends requests to local yt-dlp server via HTTP

## Prerequisites

### 1. Install Python
- Download from [python.org](https://www.python.org/downloads/)
- During installation, check **"Add Python to PATH"**

### 2. Install yt-dlp
Open Command Prompt or Terminal and run:

```bash
# Windows
pip install yt-dlp

# Linux/Mac
pip3 install yt-dlp
```

**Verify installation:**
```bash
yt-dlp --version
```

### 3. Set Downloads Location
The default download location is:
- **Windows:** `C:\Users\[YourUsername]\Downloads\yt_downloads`
- **Linux/Mac:** `~/Downloads/yt_downloads`

To change the download location, edit `yt_server.py`:
```python
# Change this line to your preferred path
downloads_folder = os.path.join(os.path.expanduser("~"), "Downloads", "yt_downloads")
```

### 4. Install Browser Extension
1. Install **Tampermonkey** extension:
   - [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/tampermonkey/)

2. Configure Tampermonkey:
   - Click Tampermonkey icon → **Dashboard**
   - Go to **Settings** tab
   - Under **General**, set **Config mode** to **"Advanced"**
   - Under **Security**, ensure **"Allow access to file URLs"** is enabled

## Installation

### Step 1: Get the User Script
1. Download or copy the `youtube_downloader.js` file
2. Open Tampermonkey dashboard
3. Click **Utilities** tab
4. Under **Import from URL**, paste the script URL or choose **Import from file**
5. Click **Install**

### Step 2: Start the Server
```bash
# Open terminal/command prompt in the project folder
python yt_server.py
```

**First run note:** Windows may ask for firewall permission - click "Allow access".

### Step 3: Verify Installation
1. Open any YouTube video (e.g., `https://www.youtube.com/watch?v=...`)
2. You should see a "Download" button next to the YouTube subscribe button
3. Select format (Video/Audio) and click Download
4. Check the server terminal for progress updates

## How to Use

1. **Navigate to any YouTube video**
2. **Select format from dropdown:**
   - **Video (high quality):** Best video + best audio merged to MP4
   - **Audio only (MP3):** Best audio converted to MP3
3. **Click Download button**
4. **Confirm download** in the popup
5. **Check terminal** for download progress
6. **Find files** in your downloads folder

## Troubleshooting

### "Command not found" for yt-dlp
```bash
# Try using python module directly
python -m yt_dlp --version

# Or update pip and reinstall
pip install --upgrade pip
pip install --upgrade yt-dlp
```

### Server won't start (Port 9999 already in use)
Edit `yt_server.py` and change:
```python
# Change 9999 to another port (e.g., 9998, 8888)
PORT = 9999
```
Then update the user script to match.

### Tampermonkey script not working
1. Check if script is enabled (green toggle in Tampermonkey dashboard)
2. Ensure script matches URL: `https://www.youtube.com/watch?v=*`
3. Check browser console for errors (F12 → Console)

### Downloads not starting
1. Verify server is running: Open `http://localhost:9999` in browser
2. Check firewall isn't blocking Python
3. Try running server as administrator (Windows)

## File Structure

```
youtube-downloader/
├── README.md               # This file
├── youtube_downloader.js  # Tampermonkey script
├── yt_server.py           # Python HTTP server
└── downloads/             # Created automatically
    ├── video_file.mp4
    └── audio_file.mp3
```

## Server Commands

**Start server:** `python yt_server.py`  
**Stop server:** Press `Ctrl+C` in terminal  
**Test server:** Open `http://localhost:9999` in browser  

## Technical Details

- **Server:** Python HTTP server on port 9999
- **Communication:** HTTP GET requests with yt-dlp commands
- **Download location:** Customizable in yt_server.py
- **Format options:**
  - Video: `yt-dlp -f "bestvideo+bestaudio" --merge-output-format mp4`
  - Audio: `yt-dlp -x --audio-format mp3 --audio-quality 0`

## Security Notes

- Server runs locally only (localhost:9999)
- No external connections made
- Requires manual confirmation for each download
- Downloads only from currently viewed YouTube video

## License

Free for personal use. yt-dlp is licensed under the Unlicense.
