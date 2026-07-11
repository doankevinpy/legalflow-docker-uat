# LEGALFLOW V2 - PHASE 11D
# SAMPLE DATASET REVIEW REGISTER

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11D Standard`  
**Ngày ban hành Sổ Review:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL SAMPLE DATASET REVIEW REGISTER`** *(Sổ Kiểm tra & Rà soát Bộ Dữ liệu Mẫu Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Sổ Kiểm tra và Rà soát chi tiết từng bản ghi (`Sample Dataset Review Register` - Phase 11D) trong bộ dữ liệu giả lập (`Sample Dataset`) trước khi ban hành Quyết định có đủ điều kiện kiểm thử kỹ thuật dry-run / import ở các giai đoạn tiếp theo (`Phase 11E`). Sổ Rà soát tổng hợp thông tin bộ dữ liệu (`Dataset Summary`), bảng kiểm tra từng bản ghi (`Record Review Register`), hướng dẫn phán quyết kiểm duyệt (`Review Decision Guide`) và danh mục 9 lỗi phổ biến cần thanh lọc (`Common Issues to Check`). Mục tiêu then chốt của sổ là tạo ra một bằng chứng kiểm toán chuẩn (`Audit Trail`), bảo đảm 100% bản ghi mẫu đều đạt tiêu chuẩn kỹ thuật 29 trường Phase 11C mà không chứa văn bản thật chưa qua phê duyệt hoặc dữ liệu nhạy cảm.

---

## 2. Dataset Summary

Bảng tổng hợp thông tin chung về tập file dữ liệu mẫu được đưa vào rà soát diễn tập (`Sample Dataset Overview & Metadata Table`):

| Dataset Property | Details & Verified Value | Notes & Technical Verification |
| :--- | :--- | :--- |
| **Dataset File Location** | `docs/LEGALFLOW_V2_PHASE11D_SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv` | File CSV chuẩn hóa theo cấu trúc header 29 cột Phase 11C (`UTF-8 no BOM`). |
| **Number of Records** | **`5 Records`** *(Bản ghi từ `SAMPLE-001` đến `SAMPLE-005`)* | 100% bản ghi có tiền tố `SAMPLE-`, đại diện cho 5 loại văn bản lõi. |
| **Review Date** | **`11/07/2026`** | Thời điểm rà soát diễn tập trên tài liệu Phase 11D. |
| **Reviewer / Audit Lead** | **`Legal Review Lead & Database Admin Team`** | Sự phối hợp giữa chuyên gia pháp chế và quản trị viên hệ thống. |
| **Overall Status** | **`APPROVED FOR DRY RUN (WITH WARNINGS)`** | Đạt 100% tiêu chuẩn cấu trúc, sẵn sàng chuyển tiếp Phase 11E kiểm thử script. |
| **Safety & Governance Notes** | **`ZERO REAL DATA / ZERO AUTO-ACTIVATION`** | Dữ liệu hoàn toàn giả lập, không nạp DB thực tế và không kích hoạt hiệu lực. |

---

## 3. Record Review Register

Bảng rà soát, kiểm tra chất lượng và đánh giá phán quyết chi tiết cho từng dòng bản ghi trong file CSV mẫu (`Detailed 5-Record Audit Table`):

| Record ID | Document Type (`type`) | Required Fields Complete (`Yes/No`) | Legal Status Valid (`Yes/No`) | Approval Status Valid (`Yes/No`) | Local Scope Clear (`Yes/No`) | Risk Note Present (`Yes/No`) | Decision (`Review Result`) | Notes & Audit Justification |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **SAMPLE-001** | `Decision` *(Quyết định Trung ương)* | `YES` *(29/29 cột đầy đủ)* | `YES` *(Effective)* | `YES` *(Approved)* | `YES` *(National)* | `YES` *(Đã ghi)* | **`Approved for Dry Run`** | Bản ghi mẫu khung luật chung trung ương, đầy đủ metadata, số hiệu chuẩn. |
| **SAMPLE-002** | `Decision` *(Quyết định Địa phương)* | `YES` *(29/29 cột đầy đủ)* | `YES` *(Effective)* | `YES` *(Approved)* | `YES` *(Local - Tỉnh X)* | `YES` *(Đã ghi)* | **`Approved for Dry Run`** | Bản ghi mẫu quy định hạn mức tách thửa đất ở, có quan hệ sửa đổi `SAMPLE-099`. |
| **SAMPLE-003** | `Plan` *(Kế hoạch Sử dụng đất)* | `YES` *(29/29 cột đầy đủ)* | `YES` *(Effective)* | `YES` *(Approved)* | `YES` *(Local - Huyện A)* | `YES` *(Đã ghi)* | **`Approved for Dry Run`** | Bản ghi mẫu Kế hoạch SDĐ Huyện A (`LAW-02`), ghi rõ yêu cầu rà soát E-Office map. |
| **SAMPLE-004** | `SOP` *(Quy trình Nội bộ TTHC)* | `YES` *(29/29 cột đầy đủ)* | `YES` *(Effective)* | `YES` *(Approved)* | `YES` *(Local - Tỉnh X)* | `YES` *(Đã ghi)* | **`Approved for Dry Run`** | Bản ghi mẫu SLA 10 ngày làm việc luân chuyển hồ sơ Một cửa - Phòng P2. |
| **SAMPLE-005** | `AdministrativeTemplate` *(Biểu mẫu)* | `YES` *(29/29 cột đầy đủ)* | `YES` *(Effective)* | `YES` *(Approved)* | `YES` *(National / Tỉnh X)* | `YES` *(Đã ghi)* | **`Approved for Dry Run`** | Bản ghi mẫu biểu mẫu hành chính `Mẫu 11/ĐK` phục vụ chuẩn hóa xuất Word Khối 3.3. |

---

## 4. Review Decision Guide

Danh mục 4 hướng phán quyết chuẩn xác dành cho Cán bộ Thẩm định khi kiểm tra từng dòng bản ghi hoặc toàn bộ dataset (`Standard Record Review Decision Guide`):
1. **`Approved for Dry Run` *(Phê duyệt đủ điều kiện kiểm thử Dry-Run):*** Bản ghi đáp ứng 100% tiêu chí 29 cột, có đủ 17 trường bắt buộc, hiệu lực `Effective`, đã có chữ ký `Approved`, phạm vi địa bàn rõ ràng và có cảnh báo `risk_note`. Đủ tiêu chuẩn đưa vào batch diễn tập kỹ thuật.
2. **`Approved with Warning` *(Phê duyệt kèm Cảnh báo đặc biệt):*** Bản ghi đạt chuẩn cấu trúc kỹ thuật, nhưng chứa các điều khoản chuyển tiếp phức tạp hoặc là dữ liệu giả lập mẫu cần ghi nhớ không được nạp thẳng vào luồng production chính thức.
3. **`Needs Cleanup` *(Yêu cầu làm sạch và rà soát lại dữ liệu):*** Bản ghi bị khuyết trường bắt buộc (`effective_date`, `docNumber`), lỗi sai định dạng ngày ISO `YYYY-MM-DD` hoặc có ký tự lạ. Yêu cầu trả lại cho tổ nhập liệu sửa chữa.
4. **`Rejected` *(Kiên quyết loại bỏ khỏi dataset):*** Bản ghi vi phạm các điều kiện cấm nạp: thiếu nguồn, hết hiệu lực, trạng thái `Unknown`, hoặc cố tình chèn văn bản thật nhạy cảm/chưa duyệt vào luồng dữ liệu giả lập.

---

## 5. Common Issues to Check

Danh mục 9 lỗi phổ biến và rủi ro dữ liệu cần rà soát thanh lọc triệt để trước khi chạy lệnh nạp (`9 Common Legal Dataset Issues Checklist`):
1. 🛑 **Thiếu `source_id` (`Missing Source ID Check`):** Bản ghi không có mã liên kết nguồn từ Sổ Đăng ký, làm mất khả năng truy vết hồ sơ rà soát thủ công ban đầu.
2. 🛑 **Thiếu `document_number` (`Missing Document Number Check`):** Số và ký hiệu văn bản bị để trống, gây lỗi trùng lặp hoặc không thể tạo trích dẫn trong file Word Khối 3.3.
3. 🛑 **Thiếu `effective_date` (`Missing Effective Date Check`):** Không có mốc thời gian hiệu lực thi hành hợp lệ (`YYYY-MM-DD`), AI Khối 3.1 không thể xác định ngày nộp hồ sơ có áp dụng luật hay không.
4. 🛑 **`legal_status` là `Unknown` (`Unknown Legal Status Check`):** Tình trạng hiệu lực pháp lý ghi mơ hồ `Unknown / Needs Review`, vi phạm nguyên tắc chỉ nạp văn bản đang có hiệu lực (`Effective`).
5. 🛑 **`approval_status` chưa `Approved` (`Unapproved Status Check`):** Trạng thái phê duyệt vẫn để `Draft`, `Pending Review` hoặc `Rejected` nhưng bị trà trộn vào CSV batch import.
6. 🛑 **`local_scope` không rõ (`Ambiguous Territorial Scope Check`):** Văn bản quy định hạn mức đất hoặc quy hoạch nhưng để `local_applicability` trống, gây rủi ro áp dụng nhầm địa bàn huyện/xã.
7. 🛑 **`risk_note` thiếu (`Missing Risk & Disclaimer Check`):** Không ghi nhận lời nhắc rủi ro, làm mất đi thông điệp cảnh báo vàng nhắc nhở chuyên viên tự rà soát văn bản gốc.
8. 🛑 **`active_candidate` sai (`Unauthorized Live Flag Check`):** Cột thứ 27 bị gán nhầm thành `true` thay vì `false`, gây nguy cơ hệ thống tự động kích hoạt hiệu lực ngay khi chạy script nạp.
9. 🛑 **Dữ liệu không phải sample (`Real Unapproved Data Leakage Check`):** Trong Phase 11D, phát hiện bản ghi không có tiền tố `SAMPLE-` mà là văn bản thật/thông tin nội bộ nhạy cảm chưa được người dùng cho phép hoặc phê duyệt. Bắt buộc loại bỏ ngay lập tức.

---
*Sổ Kiểm tra & Rà soát Bộ Dữ liệu Mẫu (Sample Review Register) được lập tự động từ Kế hoạch Phase 11D.*
