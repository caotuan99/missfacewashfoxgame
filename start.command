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

IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")
echo "✅ Máy chủ đã sẵn sàng tại: http://localhost:$PORT"
if [ "$IP" != "localhost" ]; then
    echo "📱 CHƠI TRÊN ĐIỆN THOẠI (cùng Wi-Fi): http://$IP:$PORT"
fi
echo "🌐 Đang tự động mở trình duyệt..."
(sleep 1 && open "http://localhost:$PORT") &
python3 -m http.server $PORT
