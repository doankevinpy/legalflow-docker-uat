# Ma Trận Thẩm Quyền Phê Duyệt & Chữ Ký (`Signoff & Decision Authority Matrix`) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12R
## Phase 12R: Executive Signoff & Decision Authority Matrix

> [!CAUTION]
> **TÚYÊN BỐ VỀ KHỐI CHỮ KÝ TRỐNG (`BLANK SIGNATURE BLOCK DISCLAIMER`):**
> Tài liệu này xác định rõ thẩm quyền và trách nhiệm phê duyệt trong các chu kỳ mở rộng hệ thống. Đội ngũ Kỹ thuật tuyệt đối **KHÔNG ĐƯỢC PHÉP ĐIỀN TÊN CÁ NHÂN HOẶC CHỮ KÝ** vào các biểu mẫu dưới đây. Các trường chữ ký bắt buộc phải để trống chờ tiếp nhận văn bản thật.

---

## 1. Ma Trận Thẩm Quyền Ra Quyết Định (`Decision Authority Matrix`)

| Vai Trò (`Role`) | Thẩm Quyền Quyết Định (`Authority Scope`) | Trách Nhiệm Cốt Lõi (`Core Responsibility`) | Loại Văn Bản Cần Ký (`Document Type to Sign`) | Điều Kiện Bắt Buộc Trước Khi Ký (`Pre-conditions to Sign`) | Bằng Chứng Yêu Cầu Chờ Xem (`Required Evidence Audit`) | Quyền Ra Quyết Định `GO/NO-GO` Mở Rộng? | Quyền Yêu Cầu Dừng Khẩn Cấp (`Emergency Stop`)? |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **`BUSINESS_OWNER`** | Phê duyệt nghiệp vụ & mở rộng địa bàn thí điểm | Chịu trách nhiệm về rủi ro thủ tục hành chính, tính đúng đắn của dữ liệu. | Quyết định Mở rộng Triển khai (Bản cứng) | Có Biên bản Quy chế Phối hợp với CQT. Đạt tiêu chuẩn UX tối thiểu. | Bộ hồ sơ Phase 12Q Evaluation (EVIDENCE-ONLY). | **`YES`** *(Quyết định cuối cùng)* | **`YES`** |
| **`SECURITY_LEAD`** | Phê duyệt ranh giới bảo mật & rủi ro an toàn thông tin | Đảm bảo hệ thống không rò rỉ dữ liệu, rào chắn API hoạt động đúng mức thiết kế. | Biên bản Đánh giá Rủi ro Kỹ thuật | Hệ thống không ghi nhận lỗi Critical/High trong Pilot. | Audit Log coverage; Báo cáo Safety Review Phase 12P. | `NO` *(Chỉ cấp phép về mặt an toàn)* | **`YES`** *(Quyền đóng hệ thống ngay lập tức)* |
| **`TECH_LEAD`** | Phê duyệt kỹ thuật & khả năng phục hồi (Rollback) | Chịu trách nhiệm mã nguồn, môi trường UAT/Prod, cam kết RPO=0. | Biên bản Xác nhận Sẵn sàng Hệ thống | Hạ tầng ổn định, không có lỗi Blocking tồn đọng. Git Repository được đóng băng nhánh chính. | RPO Audit Report; Backup Checksum. | `NO` | **`YES`** |

---

## 2. Bảng Theo Dõi Trạng Thái Phê Duyệt Hệ Thống Hiện Tại (`Current Signoff Tracker`)

| Mã Phê Duyệt (`Signoff ID`) | Nội Dung Trình Duyệt (`Signoff Subject`) | Vai Trò Chịu Trách Nhiệm (`Authority`) | Trạng Thái Ký (`Signoff Status`) | Chữ Ký Ghi Nhận (Để Trống) (`Signature Field`) |
| :---: | :--- | :---: | :---: | :--- |
| **`SO-12R-01`** | **Xác nhận kết quả UAT nội bộ (Phase 12P/12Q)** | `TECH_LEAD` | **`NOT REQUESTED`** | *(Trống)* |
| **`SO-12R-02`** | **Cam kết an toàn dữ liệu, rủi ro bảo mật đạt mức LOW** | `SECURITY_LEAD` | **`NOT REQUESTED`** | *(Trống)* |
| **`SO-12R-03`** | **Phê duyệt Quyết định Mở rộng Hệ thống (Expansion Go-Live)** | `BUSINESS_OWNER` | **`PENDING`** | *(Trống)* |

*(Các trạng thái hợp lệ: `NOT REQUESTED` / `PENDING` / `SIGNED` / `REJECTED`)*
