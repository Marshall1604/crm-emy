# CRM EMY PROJECT RULES & GITHUB DEPLOYMENT POLICY

## 1. QUY TẮC ĐĂNG GITHUB BẮT BUỘC (2-STEP CONFIRMATION)
- **TUYỆT ĐỐI KHÔNG BAO GIỜ** tự động chạy `git push` lên GitHub sau khi sửa code hoặc hoàn thành tính năng.
- Sau khi kiểm tra xong (build, security, runtime audit), Agent phải báo cáo kết quả và hỏi rõ ràng:
  > **"Bạn có đồng ý đăng lên GitHub ngay bây giờ không? [Yes / No]"**
- **CHỈ KHI** người dùng trả lời **"Yes"** (hoặc "Đồng ý" / "OK"), Agent mới được phép chạy `git push`.

## 2. CHUẨN MÃ NGUỒN VÀ KIẾN TRÚC DỰ ÁN
- **Chống Crash Runtime**: Mọi chuỗi, số tiền, và dữ liệu đọc từ `localStorage` hoặc Supabase phải luôn dùng hàm bọc an toàn (`safeNumber`, `safeInitials`, `formatCurrency`, `optional chaining ?.`).
- **Edge Runtime Compatibility**: File `middleware.ts` không được sử dụng API chỉ có ở Node.js (như `Buffer`).
- **Next.js & Vercel Config**: Không thêm `generateBuildId: Date.now()` vào `next.config.ts`.
