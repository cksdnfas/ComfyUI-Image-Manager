# ComfyUI Image Manager - Docker Deployment

## 🚀 Fast Build Strategy (Base Image)

I have implemented the **Base Image Strategy** to optimize your Docker build process. This splits the monolithic build into two parts: a heavy "Base Image" (rarely changes) and a light "App Image" (changes often).

### Architecture Changes

#### 1. Base Image (`Dockerfile.base` / `.base.gpu`)
This image contains:
- Debian OS dependencies (ffmpeg, python3, build-essential)
- Node.js environment
- **Python Virtual Environment with PyTorch** (The heavy part)

You build this once. It takes time, but you don't do it often.

#### 2. App Image (`Dockerfile`)
This image contains:
- Your Application Code (`bundle.js`, `frontend/`, `python/scripts`)
- `FROM comfyui-manager-base`

This builds in **seconds** because it just copies your code on top of the pre-built environment.

## How to Use

### Step 1: Build the Base Image (First time only)

**For Standard (CPU):**
```bash
docker build -t comfyui-manager-base:cpu -f Dockerfile.base .
```

**For NVIDIA GPU:**
```bash
docker build -t comfyui-manager-base:gpu -f Dockerfile.base.gpu .
```

### Step 2: Build/Run the App

**Standard (CPU):**
```bash
docker-compose up -d --build
```
*Build time: ~5 seconds* because it reuses `comfyui-manager-base:cpu`.

**With GPU:**
Edit `docker-compose.yml`:
```yaml
build:
  args:
    BASE_IMAGE: comfyui-manager-base:gpu  # <--- Change this
```

Then run:
```bash
docker-compose up -d --build
```


## 📦 Image Details

- **Base Image**: Custom Base (Debian-based)
- **Platform**: linux/amd64, linux/arm64
- **User**: Non-root (uid 1001)

## 💾 Data Storage

### Default Configuration

The default `docker-compose.yml` uses a **single named volume** (`comfyui-data`) for all application data:

```
comfyui-data/
├── uploads/       # Original images and videos
├── database/      # SQLite database files
├── logs/          # Application logs
├── temp/          # Temporary files and thumbnails
├── models/        # AI model cache (WD Tagger)
├── config/        # Application settings (settings.json)
└── RecycleBin/    # Deleted files (if delete protection enabled)
```

**Volume Location** (Docker managed):
- Linux: `/var/lib/docker/volumes/comfyui-data/_data`
- Windows: `\\\\wsl$\\docker-desktop-data\\data\\docker\\volumes\\comfyui-data\\_data`
- macOS: `~/Library/Containers/com.docker.docker/Data/vms/0/`

### Custom Storage Locations

See **docker-compose.examples.yml** for various configuration examples:

1. **Bind Mount** - Use a specific host directory
2. **External Library** - Import existing image collections
3. **Separate Volumes** - Split data across different storage
4. **NFS/Network Storage** - Shared storage for multi-server setups

#### Quick Example: Bind Mount

Edit `docker-compose.yml`:

```yaml
services:
  comfyui-manager:
    volumes:
      # Replace this line:
      # - comfyui-data:/app/data

      # With your host path:
      - /path/to/your/data:/app/data

      # Windows example: D:/comfyui-data:/app/data
      # Linux example: /home/user/comfyui-data:/app/data
```

## 🔧 Configuration

### Environment Variables

Available environment variables (set in `docker-compose.yml`):

```yaml
environment:
  - NODE_ENV=production       # Environment mode
  - PORT=1666                 # Internal container port (don't change)
  - HOST=0.0.0.0             # Listen address
  - LOCALE=en                # Interface language (en, ko)

  # Optional: Override individual data paths
  # - RUNTIME_BASE_PATH=/app/data
  # - RUNTIME_UPLOADS_DIR=/custom/path
  # - RUNTIME_DATABASE_DIR=/custom/path
  # - RUNTIME_TEMP_DIR=/custom/path
  # - RUNTIME_MODELS_DIR=/custom/path
  # - RUNTIME_RECYCLE_BIN_DIR=/custom/path
```

### Port Configuration

To change the host port (default 1666):

```yaml
ports:
  - "8080:1666"  # Access via http://localhost:8080
```

## 🎥 Features

- ✅ Image processing (Sharp)
- ✅ Video processing (FFmpeg)
- ✅ SQLite database
- ✅ WD v3 Tagger (Python + PyTorch)
- ✅ **GPU Acceleration support** (NVIDIA CUDA)
- ✅ Health checks
- ✅ Auto-restart
- ✅ Persistent data storage

## 🐛 Troubleshooting

### GPU (CUDA) not available

If you've built the GPU image but still see "CUDA is not available":

1.  **Check Hardware**: Do you have an NVIDIA GPU?
2.  **Check Host Drivers**: Install latest NVIDIA drivers on your host machine.
3.  **Check NVIDIA Container Toolkit**: You **MUST** install this on the host to expose GPU to containers. 
    - [Installation Guide](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
4.  **WSL2 Users**: Ensure you have latest Windows NVIDIA drivers and [support for WSL2](https://docs.nvidia.com/cuda/wsl-user-guide/index.html).
5.  **Docker Compose**: Ensure the `deploy` section in `docker-compose.yml` is uncommented.

### Container won't start

```bash
# Check logs
docker-compose logs -f

# Or for specific container
docker logs comfyui-image-manager
```

### Port already in use

```yaml
# In docker-compose.yml
ports:
  - "8080:1666"  # Use port 8080 instead of 1666
```

### Permission denied (bind mounts)

```bash
# Linux: Set ownership to uid 1001
sudo chown -R 1001:1001 /path/to/host/directory

# Or: Create directory first with correct permissions
mkdir -p /path/to/data
chmod 755 /path/to/data
```

### Database issues

```bash
# Reset database and recreate
docker-compose down -v
docker-compose up -d
```

### Access from host network

Make sure `HOST=0.0.0.0` in environment variables (default).

## 📊 Resource Requirements

- **CPU**: 1-2 cores recommended (4+ for WD Tagger)
- **RAM**: 1GB minimum, 2-4GB recommended (more for AI tagging)
- **Disk**: 2GB base + storage for images/videos

## 🔐 Security

- Non-root user (uid 1001, gid 1001)
- No privileged access required
- Health checks enabled (30s interval)
- Minimal attack surface (Debian Slim base)

## 📝 Maintenance

### Update container

```bash
# Pull latest image
docker-compose pull

# Recreate container
docker-compose up -d
```

### Backup all data

```bash
# Backup entire volume to tar.gz
docker run --rm \
  -v comfyui-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/comfyui-backup-$(date +%Y%m%d).tar.gz -C /data .
```

### Restore data

```bash
# Restore from backup
docker run --rm \
  -v comfyui-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/comfyui-backup-YYYYMMDD.tar.gz -C /data
```

### View volume information

```bash
# Inspect volume details
docker volume inspect comfyui-data

# List all volumes
docker volume ls
```

### Clean up unused volumes

```bash
# Remove all unused volumes (CAUTION!)
docker volume prune
```

## 🚀 Advanced Deployment

### Using Docker CLI

```bash
# Build image
docker build -t comfyui-image-manager .

# Run with named volume
docker run -d \
  --name comfyui-manager \
  -p 1666:1666 \
  -v comfyui-data:/app/data \
  --restart unless-stopped \
  comfyui-image-manager

# Run with bind mount
docker run -d \
  --name comfyui-manager \
  -p 1666:1666 \
  -v /path/to/data:/app/data \
  --restart unless-stopped \
  comfyui-image-manager
```

### Using Docker Swarm

```bash
docker stack deploy -c docker-compose.yml comfyui
```

### Resource Limits

Add to `docker-compose.yml`:

```yaml
services:
  comfyui-manager:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## 📚 Additional Resources

- **docker-compose.examples.yml** - Various configuration examples
- **Source Repository** - [GitHub](https://github.com/your-repo) (if applicable)
- **Documentation** - See project docs for detailed feature guides

---

**Build Date**: 2025-12-27T11:11:01.575Z
**Version**: 1.0.0
**Docker Image**: comfyui-image-manager:latest
