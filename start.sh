#!/bin/bash
cd "$(dirname "$0")"

echo ""
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║                    ComfyUI Image Manager                               ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check and install dependencies if needed
./node app/bootstrap.js
if [ $? -ne 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════════════════╗"
    echo "║  ❌ Bootstrap failed                                                  ║"
    echo "╚════════════════════════════════════════════════════════════════════════╝"
    echo ""
    read -p "Press Enter to continue..."
    exit 1
fi

echo ""
echo "Starting server..."
echo ""

./node app/bundle.js

if [ $? -ne 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════════════════╗"
    echo "║  ❌ Error: Server failed to start                                     ║"
    echo "║                                                                        ║"
    echo "║  Please check:                                                         ║"
    echo "║  - Port 1566 is not in use                                            ║"
    echo "║  - All files are present                                              ║"
    echo "║  - Check logs folder for errors                                       ║"
    echo "╚════════════════════════════════════════════════════════════════════════╝"
    echo ""
    read -p "Press Enter to continue..."
    exit 1
fi
