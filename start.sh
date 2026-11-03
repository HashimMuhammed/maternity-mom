#!/usr/bin/env bash
set -e

# Change to the project directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

# Add local node to PATH if present
if [ -d "$DIR/.node/bin" ]; then
  export PATH="$DIR/.node/bin:$PATH"
fi

echo "==================================================="
echo "🌸 Starting MamaBear Maternity Companion App..."
echo "==================================================="
echo ""
echo "📱 Local URL:    http://localhost:5173"
echo "🌐 Network URL:  Available on your Wi-Fi network"
echo "Press Ctrl+C to stop the server anytime."
echo ""

npm run dev

