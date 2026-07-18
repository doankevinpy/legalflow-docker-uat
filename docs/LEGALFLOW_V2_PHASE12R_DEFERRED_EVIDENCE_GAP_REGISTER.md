# Sổ Theo Dõi Khoảng Trống Bằng Chứng Bị Hoãn (`Deferred Evidence Gap Register`) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12R
## Phase 12R: Deferred Evidence Gap Register

> [!CAUTION]
> **TÚYÊN BỐ THEO DÕI BẰNG CHỨNG (`EVIDENCE TRACKING DISCLAIMER`):**
> Sổ theo dõi này ghi nhận các khoảng trống bằng chứng hành chính và pháp lý dẫn đến quyết định **DEFERRED** ở Phase 12Q. Tuyệt đối không tự ý ghi nhận trạng thái `RECEIVED` hoặc `VERIFIED` khi chưa nhận được tệp văn bản thật. Mọi thông tin nhạy cảm của văn bản thật (chữ ký scan, dấu mộc đỏ, tài liệu mật) không được đưa vào Git; chỉ ghi nhận metadata đã làm sạch tại đây.

---

## 1. Danh Mục Khoảng Trống Bằng Chứng Bị Hoãn (`Deferred Evidence Gap List`)

| Mã Bằng Chứng (`Evidence ID`) | Yêu Cầu Còn Thiếu (`Missing Requirement`) | Căn Cứ Phase 12Q (`Phase 12Q Basis`) | Loại Bằng Chứng (`Evidence Type`) | Cơ Quan Cung Cấp (`Provider`) | Người Theo Dõi (`Owner`) | Ngày Dự Kiến (`Target Date`) | Trạng Thái (`Status`) | Trạng Thái Chặn (`Blocking`) | Ghi Chú Bảo Mật (`Security Note`) |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **`GAP-12R-01`** | Biên bản Quy chế Phối hợp Liên ngành | `EX-GATE-04` / Bị chặn do thiếu thoả thuận hành chính | Văn bản hành chính (Scan PDF) | Cơ quan Thuế & Đơn vị Một cửa | `PILOT_BUSINESS_OWNER` | TBD | **`NOT REQUESTED`** | **`YES`** | Lưu tệp ngoại tuyến, không commit bản PDF lên kho Git. |
| **`GAP-12R-02`** | Phê duyệt mở rộng Giai đoạn 12Q | `GO_NO_GO_DECISION` / Bị hoãn chờ phê duyệt | Văn bản hành chính (Chữ ký điện tử / Scan) | Hội đồng Thẩm định Độc lập | `TECH_LEAD` | TBD | **`NOT REQUESTED`** | **`YES`** | Khối chữ ký tại Phase 12Q đang để trống; cần văn bản quyết định riêng. |

---

## 2. Tiêu Chí Kiểm Chứng Bằng Chứng (`Verification Criteria`)

Để một khoản trống (Gap) được chuyển trạng thái sang `VERIFIED`, bằng chứng tiếp nhận phải thỏa mãn:
1. **Tính pháp lý:** Phải có con dấu và chữ ký (thủ công hoặc điện tử) hợp lệ của người có thẩm quyền.
2. **Tính trọn vẹn:** Văn bản không bị cắt xén, thiếu trang hoặc bôi xóa trái phép.
3. **Phạm vi áp dụng:** Nội dung văn bản phải đề cập chính xác đến "Phân hệ Nghĩa vụ tài chính trên LegalFlow v2.12".
4. **Hiệu lực thời gian:** Văn bản phải còn hoặc đang trong thời hạn hiệu lực được phép triển khai thí điểm thực tế.

*(Các trạng thái cho phép: `NOT REQUESTED` / `REQUESTED` / `RECEIVED` / `VERIFIED` / `REJECTED` / `EXPIRED`)*
