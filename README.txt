# ComfyUI Image Manager - Portable Edition

## 🚀 Quick Start

### Prerequisites (Optional - for WD v3 Tagger feature)

If you want to use the AI tagging feature, install Python dependencies:

```bash
pip install -r app/python/requirements.txt
```

**Note:** The application works without Python - tagging is an optional feature.

### Windows
1. Double-click `start.bat`
2. Wait for the server to start (console window will open)
3. Open your browser to the URL displayed

### Linux/Mac
1. Open terminal in this directory
2. Run: `./start.sh`
3. Open your browser to the URL displayed

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
- `uploads/` - Your images
- `database/` - Database files
- `logs/` - Application logs
- `models/` - AI model cache (if using tagger)

## 🔧 Troubleshooting

### Port already in use
Change PORT in `.env` file

### Server won't start
- Check if port 1566 is available
- Check logs/ folder for error messages
- Ensure all files are present (app/, node.exe/node)

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

- `node.exe` - Node.js runtime (v22.17.1)
- `app/` - Application files
  - `app/bundle.js` - Main application
  - `app/python/` - Python scripts for AI tagging (optional)
  - `app/node_modules/` - Native dependencies (sharp, sqlite3)
- `start.bat` / `start.sh` - Startup scripts
- `.env.example` - Configuration template
- `models/` - AI model cache (created on first use)

## 💡 Tips

- Keep this folder together - don't move individual files
- The app folder contains all necessary dependencies
- No Node.js installation required on the system
- Portable - can be moved to any location
- Python is optional - only needed for AI tagging feature
- Models are downloaded once and cached in `models/` folder

---

**Version:** 1.0.0
**Platform:** win32 x64
**Node.js:** v22.17.1
**Built:** 2025-10-12T09:27:54.025Z
