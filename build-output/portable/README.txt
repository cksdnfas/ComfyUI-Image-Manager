# ComfyUI Image Manager - Portable Edition

## 🚀 Quick Start

### First Run (Automatic Setup)

**Important:** On first run, the application will automatically download required dependencies.
- This requires an internet connection (one-time only)
- Takes 1-2 minutes depending on your connection speed
- Dependencies are cached for future runs

### Windows
1. Double-click `start.bat`
2. Wait for automatic dependency installation (first run only)
3. Server will start automatically after setup
4. Open your browser to the URL displayed

### Linux/Mac
1. Open terminal in this directory
2. Run: `chmod +x start.sh` (first time only)
3. Run: `./start.sh`
4. Wait for automatic dependency installation (first run only)
5. Open your browser to the URL displayed

### Offline Usage

If you need to use this in an offline environment:
1. Run once with internet connection to download dependencies
2. After first successful run, no internet is required
3. The `app/node_modules/` folder contains all required dependencies

### Prerequisites (Optional - for WD v3 Tagger feature)

If you want to use the AI tagging feature, install Python dependencies:

```bash
pip install -r app/python/requirements.txt
```

**Note:** The application works without Python - tagging is an optional feature.

## 📝 Configuration

1. Copy `.env.example` to `.env`
2. Edit `.env` to customize settings
3. Restart the application

## 🤖 WD v3 Tagger (Optional AI Feature)

The application includes an optional AI image tagging feature:

### Setup
1. Install Python 3.8+ (if not already installed)
2. Install dependencies:
   ```bash
   pip install -r app/python/requirements.txt
   ```
3. Enable in `.env`:
   ```
   TAGGER_ENABLED=true
   PYTHON_PATH=python
   ```

### Features
- Automatic tag detection (characters, objects, style)
- Rating classification (safe/questionable/explicit)
- Multiple model options (vit, swinv2, convnext)
- Models download automatically on first use (~600MB-1GB)

### GPU Acceleration (Optional)
For faster tagging with NVIDIA GPU:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

## 🌐 Remote Access

To access from other devices on your network:
- The server will automatically display all available URLs when it starts
- Use the "Network" URLs shown in the console

For external internet access:
- See the full deployment guide in DEPLOYMENT_GUIDE.md (if included)
- Configure port forwarding on your router (port 1566)

## 📁 Data Storage

All data is stored in these folders (created automatically):
- `uploads/` - Your images and videos
- `database/` - Database files (images.db, api-generation-history.db)
- `config/` - Application settings (settings.json)
- `logs/` - Application logs
- `models/` - AI model cache (if using tagger)
- `temp/` - Temporary files

## 🔧 Troubleshooting

### Port already in use
Change PORT in `.env` file

### Server won't start
- Check if port 1566 is available
- Check logs/ folder for error messages
- Ensure all files are present (app/, node.exe/node)

### Dependencies not downloading
- Ensure you have internet connection (first run only)
- Check if npm is accessible: `npm --version`
- If npm is not found, install Node.js from https://nodejs.org/
- Manually install: `cd app && npm install --production`

### Cannot access from other devices
- Ensure HOST=0.0.0.0 in `.env`
- Check firewall settings
- Use the network URLs shown when starting

### Tagging not working
- Check if Python is installed: `python --version`
- Install dependencies: `pip install -r app/python/requirements.txt`
- Check `PYTHON_PATH` in `.env` (try 'python3' on Linux/Mac)
- First use downloads models (~1GB) - be patient!

## 📚 Documentation

For detailed documentation:
- API Documentation
- Deployment Guide
- Development Guide

Visit: https://github.com/yourusername/comfyui-image-manager

## 📦 Package Contents

- `node.exe` - Node.js runtime (v22.20.0)
- `app/` - Application files
  - `app/bundle.js` - Main application
  - `app/python/` - Python scripts for AI tagging (optional)
  - `app/node_modules/` - Native dependencies
    - `sharp/` - Image processing library
    - `better-sqlite3/` - Database engine
    - `ffmpeg-static/` - Video processing (FFmpeg binary)
    - `ffprobe-static/` - Video metadata extraction (FFprobe binary)
    - `argon2/` - Password hashing for NovelAI authentication
    - `blake2/` - Cryptographic hashing for NovelAI authentication
    - + All required dependencies
- `start.bat` / `start.sh` - Startup scripts
- `.env.example` - Configuration template
- `config/` - Settings storage directory
- `database/` - Database files
- `uploads/` - Image and video storage
- `models/` - AI model cache (created on first use)

## 🎥 Video Processing

The application includes built-in video processing capabilities:

**Supported Formats**: MP4, WebM, AVI, MOV, MKV, and more

**Features**:
- Automatic thumbnail generation (animated WebP)
- Video metadata extraction (duration, resolution, codec, bitrate)
- Frame-by-frame preview
- FFmpeg and FFprobe binaries are included

**Note**: Video processing works out of the box - no additional setup required!

## 💡 Tips

- Keep this folder together - don't move individual files
- **First run requires internet** for automatic dependency download
- After first run, works completely offline
- The app folder contains all necessary dependencies after setup
- Portable - can be moved to any location after first run
- Python is optional - only needed for AI tagging feature
- Models are downloaded once and cached in `models/` folder
- Video processing is automatic with included FFmpeg binaries

## 🔄 How Auto-Download Works

1. **First Run**: `start.bat`/`start.sh` runs `bootstrap.js`
2. **Dependency Check**: Verifies if native modules (sharp, sqlite3) are present
3. **Auto-Install**: If missing, automatically runs `npm install` in `app/` folder
4. **Caching**: Downloaded modules are saved in `app/node_modules/`
5. **Subsequent Runs**: No download needed, starts immediately

This approach allows:
- ✅ Smaller Git repository size (no node_modules committed)
- ✅ Automatic platform-specific binary download
- ✅ Works on Windows, Linux, and Mac
- ✅ Offline usage after first run

---

**Version:** 1.0.0
**Platform:** win32 x64
**Node.js:** v22.20.0
**Built:** 2025-11-23T10:48:58.715Z
