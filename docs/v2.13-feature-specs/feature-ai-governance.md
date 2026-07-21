# Đặc Tả Phân Hệ Quản Trị Trí Tuệ Nhân Tạo (`AI Governance Feature Specification`) - v2.13

## 1. Mục Đích (`Purpose`)
Tài liệu này đặc tả quy trình vận hành phân hệ Quản trị Trí tuệ Nhân tạo (AI Governance Layer) trong LegalFlow v2.13. Đảm bảo mọi kết quả từ AI đều được đối chiếu, kiểm soát và xác minh tính pháp lý bởi con người trước khi phát hành.

## 2. Phạm Vi (`Scope`)
Quy trình trích xuất, phân tích và gợi ý xử lý hồ sơ tự động từ các mô hình học máy. Áp dụng cho các tính năng nhận diện chứng từ và phân loại hồ sơ tài chính.

## 3. Đường Cơ Sở (`Baseline`)
* **Thẻ tham chiếu:** `v2.13-development`
* Kế thừa nguyên trạng kiến trúc bảo mật từ Phase 12R-ALT.

## 4. Trạng Thái Hiện Tại, Hạn Chế & Hành Động Tương Lai (`Current Status, Limitations, Future Actions`)
* **Trạng thái:** Đang trong chu kỳ phát triển (`Development Phase`).
* **Hạn chế:** Chỉ áp dụng trên môi trường thử nghiệm; nghiêm cấm sử dụng dữ liệu công dân thật, in accordance with governance rules.
* **Hành động tương lai:** Hoàn thiện UI/UX và chuẩn bị hồ sơ kiểm toán rủi ro cho bước đánh giá mở rộng (Expansion Review).

## 5. Quy Trình Chi Tiết (`Detailed Workflow`)
1. **Data Input:** Chứng từ hoặc thông tin thô được nạp vào AI Engine dưới dạng mã hóa. Dữ liệu nhạy cảm được làm mờ (Sanitized) in accordance with governance rules.
2. **Validation:** Engine tự động kiểm tra tính hợp lệ của trường thông tin, loại bỏ các tệp tin chứa mã độc (Malware scan) hoặc sai cấu trúc.
3. **Human Verification:** AI xuất ra các khuyến nghị (Ví dụ: Dự thảo văn bản, kết quả đối chiếu số tiền). Giao diện buộc Cán bộ Xử lý (`REVIEWING_OFFICER`) phải tick chọn xác nhận thủ công (Dual Control / Human-in-the-loop) để tiếp tục.
4. **Completion:** Kết quả đã được xác nhận sẽ được ghi vào cơ sở dữ liệu nghiệp vụ và lưu vết đầy đủ trong Audit Model.

## 6. Tham Chiếu Bằng Chứng (`Evidence Reference`)
* **Dữ liệu giả lập:** `[PLACEHOLDER - LINK TO SIMULATED UAT DATA / AI INFERENCE LOGS]`
* **Trạng thái kiểm thử:** PASS / VERIFIED within controlled pilot scope.

## 7. Cột Mốc Phát Triển (`Milestones`)
* **Short-term:** Triển khai cơ chế xác minh bắt buộc (Human-in-the-loop UI) và ghi vết quyết định.
* **Long-term:** Mở rộng danh mục mô hình phân tích cho các loại hồ sơ phức tạp hơn khi được ủy quyền.
