#!/bin/bash
cd "$(dirname "$0")"

echo "🦊 ========================================================= 🦊"
echo "   FaceWashFox Store Simulator - 3D Spa Da Mặt"
echo "   Đang khởi động máy chủ Web cục bộ cho 3D Model GLB..."
echo "🦊 ========================================================= 🦊"

# Find an available port
PORT=8080
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; do
    PORT=$((PORT + 1))
done

echo "✅ Máy chủ đã sẵn sàng tại: http://localhost:$PORT"
echo "🌐 Đang tự động mở trình duyệt..."
(sleep 1 && open "http://localhost:$PORT") &
python3 -m http.server $PORT
