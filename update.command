#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Đang tự động lưu thay đổi và cập nhật lên web..."
git add .
git commit -m "Auto-update game: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main
echo ""
echo "✅ ĐÃ XONG! Web đang tự động cập nhật trong 5-10 giây."
echo "Bạn chỉ cần F5 (tải lại) trang web để thấy phiên bản mới nhất!"
sleep 3
