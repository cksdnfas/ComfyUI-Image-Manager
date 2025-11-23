# ComfyUI Image Manager v2.0.2

AI Image Management and Analysis System for ComfyUI

![Preview](../assets/Preview%20image.jpg)

## Overview

ComfyUI Image Manager is a comprehensive system for managing, analyzing, and organizing AI-generated images. It provides automatic metadata extraction, AI-powered tagging, and advanced search capabilities to help you efficiently manage your image library.

<video src="assets/Preview.mp4" controls width="100%"></video>

## Major Features

### External Folder Support
- Watch and manage folders from anywhere on your system
- Independent scan settings per folder (auto-scan interval, polling interval)
- Real-time file watching with periodic polling fallback
- Flexible runtime path configuration (`RUNTIME_BASE_PATH` environment variable)

### User Authentication System
- Argon2-based secure authentication
- Session-based login/logout
- Multi-user support
- Automatic admin account creation on first run

### AI Image Analysis
- Automatic metadata extraction (ComfyUI, NovelAI, Stable Diffusion)
- Auto-tagging with WD Tagger (optional)
- Automatic prompt collection and statistics
- Image similarity search (Perceptual Hash-based)

### Image Management
- Automatic thumbnail generation and optimization
- Group-based auto-classification (regex/string matching)
- Rating and favorites management
- Recycle bin with recovery support
- Video file support (FFmpeg)

### Generation History
- Real-time generation tracking via ComfyUI API integration
- Workflow and prompt history
- Automatic generation parameter storage

### Prompt Analysis
- Prompt usage frequency statistics
- Synonym grouping
- Positive/Negative prompt separation analysis

## Tech Stack

- **Backend**: Node.js, TypeScript, Express, SQLite3
- **Frontend**: React 19, Material-UI, Vite
- **Image Processing**: Sharp, FFmpeg
- **AI Analysis**: WD Tagger (optional)

## Deployment Options

This repository provides pre-built packages for easy deployment:

### 1. Docker Deployment (Recommended)

See [build-output/docker/README.md](build-output/docker/README.md) for detailed Docker setup instructions.

### 2. Portable Version

The portable version includes:
- Bundled Node.js runtime
- All dependencies pre-installed
- Ready to run without additional setup

## System Requirements

- Node.js 18.0.0 or higher (included in portable version)
- 4GB RAM or more recommended
- FFmpeg (for video support)

## Security

- Password security with Argon2 hashing
- HTTPS support (auto-generated self-signed certificates)
- Session-based authentication
- Rate limiting enabled

## Release Notes

For detailed release notes and changes, see:
- [v2.0.2 Release Notes](RELEASE/RELEASE_2.0.2.md)
- [v2.0.1a Release Notes](RELEASE/RELEASE_2.0.1a.md)
- [v2.0.0a Release Notes](RELEASE/RELEASE_2.0.0a.md)

## Important Notes

- Some features may be unstable or subject to change
- Please report any issues or bugs you encounter

## License

Personal Project

---

**Author**: cksdnfas
**Version**: 2.0.2
**Repository**: https://github.com/cksdnfas/ComfyUI-Image-Manager
