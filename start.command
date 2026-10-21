#!/bin/bash
cd "$(dirname "$0")"
echo "🌸 ========================================= 🌸"
echo "   Đang khởi động Cozy Farm 3D: Cặp Đôi Nông Dân"
echo "🌸 ========================================= 🌸"
echo "Trình duyệt sẽ tự động mở sau giây lát..."
sleep 1
open "http://localhost:8080"
python3 -m http.server 8080
