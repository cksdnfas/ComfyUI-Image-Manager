# ComfyUI Image Manager v2.0.1a

AI Image Management and Analysis System for ComfyUI

## Overview

ComfyUI Image Manager is a comprehensive system for managing, analyzing, and organizing AI-generated images. It provides automatic metadata extraction, AI-powered tagging, and advanced search capabilities to help you efficiently manage your image library.

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
```bash
cd build-output/docker
docker-compose up -d
```

See [build-output/docker/README.md](build-output/docker/README.md) for detailed Docker setup instructions.

### 2. Portable Version
```bash
cd build-output/portable
# Run the application
node.exe app/bootstrap.js
```

The portable version includes:
- Bundled Node.js runtime
- All dependencies pre-installed
- Ready to run without additional setup

## System Requirements

- Node.js 18.0.0 or higher (included in portable version)
- 4GB RAM or more recommended
- FFmpeg (for video support)

## Quick Start

### Using Docker (Recommended)

1. Navigate to the docker directory:
```bash
cd build-output/docker
```

2. Configure your environment:
```bash
cp .env.example .env
# Edit .env file with your settings
```

3. Start the application:
```bash
docker-compose up -d
```

4. Access the web interface at `http://localhost:3000`

### Using Portable Version

1. Navigate to the portable directory:
```bash
cd build-output/portable
```

2. Run the application:
```bash
node.exe app/bootstrap.js
```

3. Access the web interface at `http://localhost:3000`

## Default Login

On first run, an admin account is automatically created:
- **Username**: admin
- **Password**: admin

Please change the password immediately after first login.

## Security

- Password security with Argon2 hashing
- HTTPS support (auto-generated self-signed certificates)
- Session-based authentication
- Rate limiting enabled

## Release Notes

For detailed release notes and changes, see:
- [English Release Notes](build-md/RELEASE_2.0.0a_EN.md)
- [Korean Release Notes](build-md/RELEASE_2.0.0a.md)

## Important Notes

- This is an **alpha release** intended for testing purposes only
- Some features may be unstable or subject to change
- Please report any issues or bugs you encounter

## License

Personal Project

---

**Author**: cksdnfas
**Version**: 2.0.1a
**Repository**: https://github.com/cksdnfas/ComfyUI-Image-Manager
