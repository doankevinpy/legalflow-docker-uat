# LEGALFLOW V2 - PHASE 11C
# SAMPLE IMPORT CSV TEMPLATE

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11C Standard`  
**Ngày ban hành Template:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL SAMPLE IMPORT CSV TEMPLATE`** *(Biểu mẫu Định dạng CSV Tham khảo cho Nạp Dữ liệu Tri thức)*

---

## 1. Purpose

Tài liệu này là Biểu mẫu Định dạng CSV Tham khảo (`Sample Import CSV Template` - Phase 11C) của hệ thống LegalFlow V2. Tài liệu cung cấp chính xác cấu trúc dòng tiêu đề chuẩn (`29-Column CSV Header`) và một dòng dữ liệu ví dụ giả lập (`Sample Row`) theo đúng 29 trường thuộc tính đã ban hành tại `LEGAL_DOCUMENT_METADATA_TEMPLATE.md` và `LEGAL_KNOWLEDGE_FIELD_MAPPING_SPEC.md`. Biểu mẫu được thiết lập phục vụ công tác chuẩn hóa dữ liệu, kiểm thử mô phỏng (`Dry-Run`) và làm mẫu cho các kỹ sư dữ liệu/quản trị viên khi chuẩn bị các batch file CSV chuẩn trước khi tiến hành nạp vào cơ sở dữ liệu (`LegalKnowledge` / Khối 3.2) trong Phase 11D. Tài liệu nhấn mạnh và quán triệt các lưu ý an toàn (`Important Notes`): đây chỉ là dữ liệu giả lập tham khảo, tuyệt đối không chứa thông tin nhạy cảm và không kích hoạt hiệu lực tự động.

---

## 2. CSV Header

Dưới đây là khối mã chuỗi tiêu đề CSV chuẩn hóa đầy đủ 29 trường thuộc tính (`Standardized 29-Column CSV Header`):

```csv
source_id,document_title,document_number,issuing_authority,document_type,issue_date,effective_date,expiry_date,legal_status,local_scope,related_procedure,procedure_group,legal_topic,article_clause_reference,summary,full_text_location,source_url,amends_document,replaces_document,replaced_by_document,local_applicability,planning_land_use_relevance,internal_process_relevance,reviewer,approval_status,approval_date,active_candidate,risk_note,import_note
```

---

## 3. Example Row

Dưới đây là 1 dòng bản ghi ví dụ giả lập hoàn toàn (`Simulated Sample Row`), tuân thủ định dạng 29 trường thuộc tính trên, ghi rõ ràng là dữ liệu mẫu (`SAMPLE-001`), không sử dụng văn bản thật và không tác động đến cơ sở dữ liệu production:

```csv
SAMPLE-001,Sample Local Decision,SAMPLE-123/QD-UBND,Sample Authority,Decision,2026-01-01,2026-01-15,,Effective,Sample Ward,Sample Procedure,Land,Land Procedure,Article X Clause Y,Sample summary only,Internal storage path,https://example.local/sample,,,,Sample local applicability note,Requires officer to check land use planning,Relevant to internal checklist,Sample Reviewer,Approved,2026-01-20,false,Sample risk note,Sample import note
```

---

## 4. Important Notes

Quản trị viên (`ADMIN`), Cán bộ Thẩm định và Kỹ sư Dữ liệu khi sử dụng biểu mẫu CSV này bắt buộc phải tuân thủ nghiêm ngặt **5 Lưu ý An toàn Vận hành (`5 Mandatory CSV Governance Notes`)**:
1. ℹ️ **Đây là template tham khảo (`Reference Template Only`):** File mẫu này được tạo ra với mục đích định dạng cấu trúc kỹ thuật (`Schema Verification`) và minh họa cách sắp xếp 29 cột. Nó không phải là một file dữ liệu chạy trực tiếp trên hệ thống production.
2. 🛑 **Không phải dữ liệu thật (`Zero Real Data Usage`):** Dòng ví dụ (`SAMPLE-001`) hoàn toàn là dữ liệu giả lập (`dummy data`). Tuyệt đối không nạp dòng mẫu này vào bảng `LegalKnowledge` trên cơ sở dữ liệu thực tế để tránh làm ô nhiễm tri thức Khối 3.2.
3. 🛑 **Không commit dữ liệu nhạy cảm (`No Sensitive Data Commit`):** Khi các cán bộ chuẩn bị các batch file CSV thật trong tương lai, tuyệt đối không commit các file CSV chứa thông tin bảo mật nội bộ, token, mật khẩu hay dữ liệu cá nhân nhạy cảm lên kho lưu trữ Git (`Zero Secret / Sensitive Data Leakage`).
4. 🛑 **Không đưa văn bản chưa duyệt vào import (`Zero Unapproved Data Inclusion`):** Khi điền dữ liệu thật vào cấu trúc CSV này, Cán bộ Pháp chế và Quản trị viên chỉ được phép đưa các bản ghi có trạng thái `approval_status = Approved` (đã có chữ ký của Lãnh đạo Phòng). Kiên quyết loại bỏ mọi dòng có trạng thái `Draft`, `Pending Review` hoặc `Rejected`.
5. 🛑 **Không active tự động (`Zero Auto-Activation Mandate`):** Cột thứ 27 (`active_candidate`) trong mọi file CSV chuẩn bị import luôn phải được khóa ở giá trị `false`. Sau khi chạy nạp CSV vào DB ở Phase 11D, bản ghi chỉ nằm ở trạng thái chờ (`Staged Candidate`). Việc kích hoạt hiệu lực pháp lý (`active: true`) thuộc về quy trình rà soát và quyết định độc lập của Lãnh đạo Cơ quan.

---
*Biểu mẫu Định dạng CSV Tham khảo (Sample Import CSV Template) được lập tự động từ Kế hoạch Phase 11C.*
