# LEGALFLOW V2 - PHASE 11L
# APPROVED SAMPLE DATASET REVIEW

## 1. Purpose

Tài liệu này thẩm định chi tiết và rà soát kỹ thuật đối với bộ dữ liệu mẫu (`sample dataset`) trước khi đưa vào kiểm thử nghiệm thu người dùng có kiểm soát (`Controlled Import UAT`).  
Mục tiêu là xác nhận 100% các bản ghi đều sử dụng dữ liệu mô phỏng an toàn, không chứa thông tin mật hoặc văn bản pháp luật thực tế chưa được phê duyệt, và tuân thủ đầy đủ các chuẩn mực quản trị AI & Pháp lý của LegalFlow V2.

## 2. Source Dataset

- **Đường dẫn tệp nguồn:** `docs/LEGALFLOW_V2_PHASE11D_SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv`
- **Tổng số bản ghi rà soát:** 5 bản ghi (`SAMPLE-001` &rarr; `SAMPLE-005`)
- **Ngày rà soát:** 12/07/2026

## 3. Dataset Review Checklist

| Check | Expected Result | Actual Result | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| `all records use SAMPLE prefix` | Toàn bộ bản ghi có tiền tố `SAMPLE-` tại `source_id` và `document_number`. | 5/5 bản ghi (`SAMPLE-001` &rarr; `SAMPLE-005`, `SAMPLE-101/ND-CP` &rarr; `SAMPLE-105/TT-BTNMT`) đều mang tiền tố mô phỏng. | ✅ **PASS** | Ngăn chặn nhầm lẫn với dữ liệu pháp lý thật. |
| `no real legal document` | Không có bất kỳ văn bản pháp luật thực tế nào đang có hiệu lực thi hành thực tế ngoài xã hội. | 100% nội dung là giả định (`Sample National Land Law Decree Guidance`, ...). | ✅ **PASS** | An toàn tuyệt đối cho kiểm thử UAT. |
| `no secret/password/token` | Không chứa mật khẩu, API token, secret key hay dữ liệu cá nhân nhạy cảm (`PII`). | Đã kiểm tra toàn bộ 5 dòng và 29 cột, 0 secret/password/token/PII. | ✅ **PASS** | Tuân thủ tiêu chuẩn bảo mật hệ thống. |
| `required fields present` | Đầy đủ các cột bắt buộc theo cấu trúc CSV chuẩn (`source_id`, `document_title`, ...). | Có đủ 29 cột tiêu chuẩn trong phần header CSV. | ✅ **PASS** | Đảm bảo tính tương thích định dạng khi rà soát. |
| `source_id present` | Mỗi bản ghi có mã định danh `source_id` duy nhất và rõ ràng. | Có đủ 5 mã định danh: `SAMPLE-001` &rarr; `SAMPLE-005`. | ✅ **PASS** | Phục vụ truy vết định danh từng bản ghi. |
| `document_title present` | Mỗi bản ghi có tiêu đề văn bản `document_title` mô tả nội dung. | Có đủ 5 tiêu đề rõ ràng cho từng loại văn bản mô phỏng. | ✅ **PASS** | Giúp hiển thị trực quan trong bảng kết quả. |
| `legal_status present` | Cột `legal_status` xác định tình trạng hiệu lực mô phỏng (`Effective`, `Draft`, ...). | 5/5 bản ghi đều ghi nhận `Effective` (giả định cho test). | ✅ **PASS** | Kiểm chứng logic rà soát hiệu lực. |
| `approval_status present` | Cột `approval_status` xác định trạng thái phê duyệt nội bộ (`Approved`, ...). | 5/5 bản ghi đều đạt `Approved` (thẩm định mô phỏng). | ✅ **PASS** | Đảm bảo chỉ nạp các bản ghi đã qua phê duyệt. |
| `risk_note present` | Cột `risk_note` ghi rõ lưu ý rủi ro pháp lý/nghiệp vụ cho cán bộ thao tác. | 5/5 bản ghi có đầy đủ lưu ý rủi ro (`Sample risk note...`). | ✅ **PASS** | Nhắc nhở cán bộ kiểm tra kỹ trước khi dùng. |
| `active_candidate does not imply auto-active` | Cột `active_candidate` (đặt là `false`) khẳng định không tự động kích hoạt sang `ACTIVE`. | 5/5 bản ghi đều có `active_candidate: false`. | ✅ **PASS** | Ngăn ngừa việc thay thế phiên bản pháp luật trái quy trình. |

## 4. Record Review

| Record ID | Document Type | Sample-only Confirmed | Required Fields Complete | Risk Note Present | Approval Status | Legal Status | Decision | Notes |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **SAMPLE-001** | `Decision` | Yes (`SAMPLE-101/ND-CP`) | Yes (29/29 fields) | Yes (`Sample risk note...`) | `Approved` | `Effective` | ✅ **APPROVED** | Hướng dẫn Nghị định Đất đai Quốc gia mô phỏng. |
| **SAMPLE-002** | `Decision` | Yes (`SAMPLE-102/QD-UBND`) | Yes (29/29 fields) | Yes (`Sample risk note...`) | `Approved` | `Effective` | ✅ **APPROVED** | Quyết định hạn mức tách thửa địa phương mô phỏng. |
| **SAMPLE-003** | `Plan` | Yes (`SAMPLE-103/QD-UBND`) | Yes (29/29 fields) | Yes (`Sample risk note...`) | `Approved` | `Effective` | ✅ **APPROVED** | Quyết định phê duyệt kế hoạch sử dụng đất cấp Huyện mô phỏng. |
| **SAMPLE-004** | `SOP` | Yes (`SAMPLE-104/QD-UBND`) | Yes (29/29 fields) | Yes (`Sample risk note...`) | `Approved` | `Effective` | ✅ **APPROVED** | Quy trình nội bộ SOP xử lý hồ sơ TTHC mô phỏng. |
| **SAMPLE-005** | `AdministrativeTemplate` | Yes (`SAMPLE-105/TT-BTNMT`) | Yes (29/29 fields) | Yes (`Sample risk note...`) | `Approved` | `Effective` | ✅ **APPROVED** | Thông tư hướng dẫn biểu mẫu hành chính mô phỏng. |

## 5. Dataset Decision

Hội đồng Thẩm định Dữ liệu và Phụ trách Kỹ thuật Đề xuất Quyết định:  
### `APPROVED FOR CONTROLLED UAT`

**Lý do phê duyệt:**
1. Bộ dữ liệu `docs/LEGALFLOW_V2_PHASE11D_SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv` tuân thủ tuyệt đối 100% tiêu chí an toàn (10/10 checks PASS).
2. Toàn bộ 5 bản ghi (`SAMPLE-001` &rarr; `SAMPLE-005`) đều là dữ liệu mô phỏng, không chứa rủi ro gây nhầm lẫn hay làm sai lệch cơ sở dữ liệu thực tế.
3. Cấu trúc trường thông tin đầy đủ, đảm bảo kiểm thử chính xác các quy tắc chuẩn hóa `VAL-01` &rarr; `VAL-14` trên giao diện Legal Knowledge Import UI.

## 6. Safety Note

> [!IMPORTANT]
> **NGUYÊN TẮC AN TOÀN TUYỆT ĐỐI:**  
> Ngay cả khi bộ dữ liệu mẫu (`sample dataset`) này đã được phê duyệt (`APPROVED FOR CONTROLLED UAT`), việc import bộ dữ liệu này vào hệ thống **TƯỢNG TRƯNG CHO QUÁ TRÌNH KIỂM THỬ KỸ THUẬT VÀ HOÀN TOÀN KHÔNG ĐỒNG NGHĨA VỚI VIỆC KÍCH HOẠT PHIÊN BẢN PHÁP LÝ (`ACTIVE LEGAL VERSION`)**.  
> Cán bộ chuyên môn và người sử dụng cuối tuyệt đối không được sử dụng các bản ghi có tiền tố `SAMPLE-` làm căn cứ pháp lý chính thức trong trích dẫn hồ sơ, tham mưu hay giải quyết thủ tục hành chính thực tế cho công dân/doanh nghiệp.
