# UAT Analytics Report (Phase 7.5)

## 1. Scope
Báo cáo nghiệm thu này bao quát toàn bộ các hạng mục thuộc Module Analytics:
- **Phase 7.5A**: Backend Analytics API
- **Phase 7.5B**: Frontend Analytics Dashboard UI
- **Phase 7.5C**: Analytics UAT

## 2. Kết quả (Results)
- **Seed mock data**: PASS
- **Admin/Manager access analytics**: PASS
- **Staff/Viewer blocked 403**: PASS
- **Overview API**: PASS
- **by-neighborhood/by-field/cross-tab**: PASS
- **No PII in analytics response**: PASS
- **Social insights disclaimer**: PASS
- **Frontend build**: PASS

## 3. Ethics Note (Lưu ý Đạo đức & Khoa học Xã hội)
- Các insight (nhận định, giả thuyết) do hệ thống phân tích và gợi ý chỉ mang tính chất **giả thuyết diễn giải**, tuyệt đối không được xem là kết luận nhân quả chắc chắn.
- Dữ liệu số lượng đơn thư hiện tại là **số liệu tuyệt đối**, chưa được chuẩn hóa theo tỷ lệ dân số, số hộ gia đình, hay mật độ cư trú của từng khu vực. Do đó, một khu phố có nhiều đơn thư không đồng nghĩa với tỷ lệ bất ổn cao hơn.
- Ngôn ngữ sử dụng trong mọi văn bản và giao diện UI được kiểm soát nghiêm ngặt: **Không dùng từ ngữ kỳ thị, gán nhãn tiêu cực** cho bất kỳ khu phố hoặc cộng đồng dân cư nào.

## 4. Security Note (Lưu ý Bảo mật)
- Báo cáo và giao diện tuyệt đối **không** ghi nhận bất kỳ token, mật khẩu, JWT secret hay database URL nào.
- Toàn bộ nội dung của các biến môi trường và kết nối cơ sở dữ liệu local hoàn toàn không được tiếp xúc hay rò rỉ ra public report/UI.
- Quá trình UAT được chạy hoàn toàn bằng **dữ liệu giả lập (mock data)**, không có dữ liệu thật hay PII nào tham gia vào quá trình phân tích thống kê.

## 5. Known Limitations (Hạn chế hiện tại)
- Dữ liệu phục vụ kiểm thử và hiển thị UI hiện tại đều là **mock data** (dữ liệu giả lập).
- Hệ thống phân tích không (chưa) có khả năng tham chiếu và chuẩn hóa số liệu theo dữ liệu dân số/số hộ thực tế tại từng khu vực hành chính.
- UI/UX của Dashboard hiện tại đang được đánh giá trên phương diện kỹ thuật chức năng; **chưa kiểm thử UX trực tiếp bởi người dùng thật** (end-user testing).
- Tính năng xuất (Export) báo cáo Dashboard ra file **PDF/Excel** chưa được hỗ trợ trong phiên bản này.
