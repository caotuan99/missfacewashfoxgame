#!/bin/bash
cd "$(dirname "$0")"
echo "🦊 ========================================= 🦊"
echo "   FaceWashFox Store Simulator - Spa Da Mặt 3D"
echo "🦊 ========================================= 🦊"
echo "Trình duyệt sẽ tự động mở sau giây lát..."
sleep 1
open "http://localhost:8080"
python3 -m http.server 8080
