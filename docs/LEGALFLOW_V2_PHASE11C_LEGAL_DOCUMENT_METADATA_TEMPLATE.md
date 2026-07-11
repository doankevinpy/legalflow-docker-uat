# LEGALFLOW V2 - PHASE 11C
# LEGAL DOCUMENT METADATA TEMPLATE

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11C Standard`  
**Ngày ban hành Template:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL LEGAL DOCUMENT METADATA TEMPLATE`** *(Biểu mẫu Quy chuẩn Thuộc tính Dữ liệu Văn bản/Căn cứ Pháp lý)*

---

## 1. Purpose

Tài liệu này là Biểu mẫu Quy chuẩn Thuộc tính Dữ liệu Văn bản/Căn cứ Pháp lý (`Legal Document Metadata Template` - Phase 11C) của hệ thống LegalFlow V2. Biểu mẫu định nghĩa chuẩn xác 29 trường thông tin thuộc tính (`29 Mandatory & Optional Metadata Fields`) cần phải thu thập, chuẩn hóa và rà soát cho mỗi văn bản quy phạm pháp luật, quyết định địa phương, bản đồ quy hoạch hoặc bộ quy trình nội bộ trước khi nạp vào bảng `LegalKnowledge` (Khối 3.2). Template quy định rõ kiểu dữ liệu, quy tắc ràng buộc kiểm chứng (`Validation Rule`), danh mục trạng thái kiểm duyệt (`Required Status Values`), trạng thái hiệu lực (`Legal Status Values`) và các cảnh báo an toàn (`Safety Notes`) nhằm bảo đảm dữ liệu nạp vào hệ thống đạt 100% độ sạch, nhất quán và minh bạch pháp lý.

---

## 2. Metadata Template

Bảng định nghĩa quy chuẩn 29 trường thuộc tính metadata của bản ghi tri thức pháp lý (`29-Point Legal Document Metadata Schema Table`):

| Field Name (`Metadata Schema`) | Required? (`Yes/No`) | Data Type (`Type`) | Description & Semantic Definition | Concrete Example (`Sample Value`) | Validation Rule (`Constraint`) | Notes & UI/AI Utilization |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **1. `source_id`** | `YES` | `String` | Mã định danh duy nhất của nguồn văn bản theo Sổ Đăng ký Nguồn (`Source Register`). | `SRC-LOC-2026-001` | Phải duy nhất, theo định dạng `SRC-XXX-YYYY-NNN`. | Liên kết trực tiếp với hồ sơ rà soát thủ công Phase 11B. |
| **2. `document_title`** | `YES` | `String` | Tên/Trích yếu đầy đủ, chính xác theo bản gốc của văn bản ban hành. | Quyết định ban hành Quy định hạn mức giao đất, công nhận QSDĐ trên địa bàn tỉnh X | Phải có độ dài từ 10 đến 500 ký tự, không chứa ký tự điều khiển lỗi. | Hiển thị làm tiêu đề chính trên thanh tìm kiếm Khối 3.2. |
| **3. `document_number`** | `YES` | `String` | Số và ký hiệu chuẩn của văn bản pháp quy hoặc quyết định hành chính. | `25/2024/QĐ-UBND` | Phải duy nhất (`Unique Check`), đúng cú pháp số/năm/ký-hiệu. | Dùng để tra cứu nhanh và trích dẫn vào file Word Khối 3.3. |
| **4. `issuing_authority`** | `YES` | `String` | Tên đầy đủ của cơ quan có thẩm quyền ban hành văn bản. | Ủy ban nhân dân tỉnh X / Bộ Tài nguyên và Môi trường | Must not be empty. | Phân loại cấp thẩm quyền Trung ương vs. Địa phương. |
| **5. `document_type`** | `YES` | `String` | Loại văn bản pháp lý (Quyết định, Kế hoạch, Quy hoạch, Quy trình nội bộ, Biểu mẫu...). | `Decision` *(Quyết định)* | Phải thuộc danh mục chuẩn trong `Document Type Guide`. | Hỗ trợ bộ lọc loại văn bản trong giao diện `Knowledge`. |
| **6. `issue_date`** | `YES` | `Date / String` | Ngày, tháng, năm ban hành văn bản chính thức trên giấy. | `2024-09-15` | Phải theo định dạng chuẩn ISO `YYYY-MM-DD`. | Sắp xếp trình tự thời gian ban hành của thư viện luật. |
| **7. `effective_date`** | `YES` | `Date / String` | Ngày, tháng, năm chính thức bắt đầu có hiệu lực thi hành theo luật định. | `2024-10-01` | `YYYY-MM-DD`, `effective_date >= issue_date`. | Căn cứ cốt lõi để AI Khối 3.1 rà soát thời điểm nộp hồ sơ. |
| **8. `expiry_date`** | `OPTIONAL` | `Date / String` | Ngày văn bản hết hiệu lực hoặc bị bãi bỏ (`YYYY-MM-DD` hoặc `NULL`). | `2025-10-01` *(hoặc để trống nếu còn hiệu lực)* | Nếu có, phải theo ISO `YYYY-MM-DD` và `> effective_date`. | Hệ thống tự động cảnh báo cờ `EXPIRED` khi qua mốc thời gian này. |
| **9. `legal_status`** | `YES` | `String` | Tình trạng hiệu lực pháp lý của văn bản tại thời điểm đánh giá. | `Effective` *(Còn hiệu lực)* | Phải thuộc danh mục chuẩn `Legal Status Values` (Mục 4). | Chỉ nạp văn bản `Effective` vào luồng chuẩn bị Active Khối 3.2. |
| **10. `local_scope`** | `YES` | `String` | Cấp độ phạm vi ban hành của văn bản (`National` vs. `Local`). | `Local` *(Địa phương)* | Giá trị cho phép: `National`, `Local`. | Phân chia rõ quy định chung toàn quốc và quy định tỉnh. |
| **11. `related_procedure`** | `YES` | `String / Array` | Mã hoặc tên các thủ tục hành chính chịu sự điều chỉnh trực tiếp của văn bản. | `TTHC-LAND-01, TTHC-LAND-05` | Must match valid procedure codes in `CASELIST-02`. | Ánh xạ chính xác căn cứ vào đúng thủ tục khi AI Khối 3.1 review. |
| **12. `procedure_group`** | `YES` | `String` | Nhóm lĩnh vực thủ tục lớn (`Land` - Đất đai hoặc `Construction` - Xây dựng). | `Land` | Giá trị cho phép: `Land`, `Construction`, `General`. | Hỗ trợ phân nhóm trên menu tra cứu Khối 3.2. |
| **13. `legal_topic`** | `YES` | `String` | Chủ đề pháp lý chuyên sâu (Hạn mức tách thửa, Giá đất, Bồi thường GPMB...). | `Land Subdivision Limits` *(Hạn mức tách thửa)* | Must not be empty. | Giúp AI Khối 3.1 gom nhóm các điều khoản liên quan chủ đề. |
| **14. `article_clause_reference`** | `OPTIONAL` | `String` | Điều, khoản, điểm số cụ thể quy định trực tiếp nội dung tra cứu nếu tách chi tiết. | `Điều 5, Khoản 2` | Free text gọn ràng, chính xác theo bản gốc. | Giúp cán bộ đọc thẳng vào điều khoản cần đối chiếu. |
| **15. `summary`** | `YES` | `String` | Tóm tắt cô đọng các điều khoản lõi ảnh hưởng trực tiếp đến kết quả thẩm định TTHC. | Quy định hạn mức tách thửa đất ở tối thiểu là 40m2 tại đô thị... | Must not be empty, tối đa 2000 ký tự. | Hiển thị ngay trên giao diện `Knowledge` để cán bộ đọc nhanh. |
| **16. `full_text_location`** | `YES` | `String` | Vị trí lưu trữ file toàn văn nội bộ (`.pdf/.doc`) trong hệ thống kho/MinIO. | `minio://legal-docs/25_2024_QD_UBND.pdf` | Must be a valid internal path/URI (`minio://...` or `file://...`). | Bằng chứng tra cứu trực tiếp cho chuyên viên thẩm định. |
| **17. `source_url`** | `YES` | `String` | Đường dẫn URL chính thống trên Công báo tỉnh hoặc cổng thông tin điện tử UBND tỉnh. | `https://congbothongtin.tinhX.gov.vn/...` | Must be a valid `http://` or `https://` URL. | Bằng chứng xác thực nguồn gốc hợp pháp (`Audit Trail`). |
| **18. `amends_document`** | `OPTIONAL` | `String` | Số hiệu văn bản bị văn bản này sửa đổi, bổ sung một số điều (nếu có). | `12/2020/QĐ-UBND` | Nếu có, phải là số hiệu văn bản hợp lệ đã tồn tại trong DB/Sổ. | Xây dựng chuỗi truy vết lịch sử biến động pháp lý (`Legal Lineage`). |
| **19. `replaces_document`** | `OPTIONAL` | `String` | Số hiệu văn bản cũ bị văn bản này bãi bỏ và thay thế toàn bộ (nếu có). | `15/2018/QĐ-UBND` | Nếu có, phải ghi chính xác số hiệu văn bản cũ bị bãi bỏ. | Giúp hệ thống chuyển cờ văn bản cũ sang `SUPERSEDED`. |
| **20. `replaced_by_document`** | `OPTIONAL` | `String` | Số hiệu văn bản mới ban hành sau này thay thế cho văn bản hiện tại (nếu có). | `NULL` *(hoặc số QĐ mới nếu bản ghi đã cũ)* | Nếu có, chỉ định rõ văn bản kế nhiệm. | Hỗ trợ quản lý chuỗi vòng đời văn bản pháp quy. |
| **21. `local_applicability`** | `YES` | `String` | Địa bàn hành chính cấp huyện/xã áp dụng cụ thể (nếu có giới hạn riêng biệt). | `Toàn tỉnh X` / `riêng Huyện A, Thành phố B` | Must not be empty. Ghi `Toàn tỉnh` hoặc tên huyện/xã rõ ràng. | Ngăn chặn áp dụng nhầm hạn mức tách thửa giữa các khu vực. |
| **22. `planning_land_use_relevance`** | `OPTIONAL` | `String` | Ghi rõ mối liên hệ hoặc chỉ đạo áp dụng đối với Quy hoạch / Kế hoạch SDĐ (`LAW-02`). | `Yêu cầu đối chiếu bản đồ quy hoạch SDĐ Huyện A năm 2026` | Nếu là văn bản về chuyển mục đích/tách thửa, bắt buộc ghi chú. | Nhắc nhở cán bộ tuân thủ chốt chặn rà soát bản đồ quy hoạch. |
| **23. `internal_process_relevance`** | `OPTIONAL` | `String` | Ghi rõ liên quan đến bộ quy trình giải quyết TTHC nội bộ (`Internal SOPs`). | `Quy định bước thẩm định tại P2 tối đa 5 ngày làm việc` | Ghi chú các mốc thời gian hay yêu cầu phối hợp Một cửa - P2. | Hỗ trợ chuẩn hóa luân chuyển hồ sơ đúng hạn. |
| **24. `reviewer`** | `YES` | `String` | Tài khoản/Họ tên Cán bộ Pháp chế thẩm định dữ liệu. | `nguyenvana.legal` | Must not be empty. | Ghi nhận trách nhiệm rà soát con người trước khi số hóa. |
| **25. `approval_status`** | `YES` | `String` | Trạng thái phê duyệt của bản ghi trong quy trình quản trị (`Approved` / `Reviewed`...). | `Approved` | Must be strictly `Approved` for valid import batch inclusion. | **Chỉ những bản ghi `Approved` mới đủ điều kiện cho ADMIN nạp.** |
| **26. `approval_date`** | `YES` | `Date / String` | Ngày Lãnh đạo Phòng (`MANAGER`) ký quyết định phê duyệt bản ghi (`YYYY-MM-DD`). | `2026-07-11` | `YYYY-MM-DD`, `approval_date >= issue_date`. | Ghi vết thời gian thẩm quyền xác nhận hồ sơ. |
| **27. `active_candidate`** | `YES` | `Boolean` | Cờ xác định bản ghi sẵn sàng để kích hoạt hay chỉ là dữ liệu nháp/chờ (`true / false`). | `false` | Must be boolean (`true` or `false`). Mặc định import là `false`. | Trong giai đoạn nạp dữ liệu, tuyệt đối khóa ở `false`. |
| **28. `risk_note`** | `OPTIONAL` | `String` | Ghi chú các rủi ro, ngoại lệ, điều khoản chuyển tiếp phức tạp cần chuyên viên chú ý. | `Lưu ý điều khoản chuyển tiếp tại Điều 15 đối với hồ sơ nộp trước 01/08/2024` | Free text. | Hiển thị cảnh báo vàng (`Warning Alert`) trên Khối 3.1 &amp; Khối 3.2. |
| **29. `import_note`** | `OPTIONAL` | `String` | Ghi chú kỹ thuật của Quản trị viên (`ADMIN`) trong quá trình chuẩn bị import CSV. | `Prepared for Phase 11D dry-run batch #01` | Technical note for DBA tracking. | Giám sát lịch sử chuẩn bị nạp dữ liệu từ file CSV mẫu. |

---

## 3. Required Status Values

Danh mục chuẩn 9 giá trị cho trường `approval_status` (`Approval Status Classification Guide`) nhằm phân định rõ tiến trình thẩm định con người:
1. **`Draft` *(Nháp):*** Bản ghi mới tạo ban đầu trên Sổ Đăng ký, chưa kiểm chứng đầy đủ metadata. `[NO IMPORT / NO AI ACCESS]`
2. **`Pending Review` *(Chờ rà soát):*** Đã nhập xong metadata, đang gửi cho Cán bộ Pháp chế (`Legal Reviewer`) kiểm tra. `[NO IMPORT]`
3. **`Reviewed` *(Đã rà soát):*** Cán bộ Pháp chế đã rà soát xong, xác nhận `PASS` trên Validation Checklist, chờ Lãnh đạo duyệt. `[NO IMPORT]`
4. **`Approved` *(Đã phê duyệt):*** Lãnh đạo Phòng (`MANAGER Approver`) đã ký xác nhận phê duyệt. **`[ELIGIBLE FOR CSV IMPORT BATCH]`**
5. **`Rejected` *(Từ chối):*** Bản ghi bị từ chối do sai nguồn, hết hiệu lực hoặc mâu thuẫn pháp luật. `[PERMANENTLY EXCLUDED]`
6. **`Active Candidate` *(Chờ kích hoạt):*** Bản ghi đã nạp thành công vào DB (`import complete`), đang chờ Hội đồng ra quyết định kích hoạt. `[STAGED ON DB / active: false]`
7. **`Active` *(Đang có hiệu lực thi hành):*** Bản ghi chính thức có hiệu lực (`active: true`), hiển thị trên Khối 3.2 và được AI Khối 3.1 sử dụng làm căn cứ tham mưu. `[LIVE]`
8. **`Superseded` *(Đã bị thay thế):*** Bản ghi cũ đã bị văn bản ban hành sau thay thế, lưu vết với cờ `SUPERSEDED`. `[ARCHIVED IN LINEAGE]`
9. **`Archived` *(Đã lưu trữ / Hết hiệu lực):*** Bản ghi đã hết hiệu lực pháp lý toàn bộ (`status: EXPIRED`). `[EXCLUDED FROM ACTIVE REVIEW]`

---

## 4. Legal Status Values

Danh mục chuẩn 6 giá trị cho trường `legal_status` (`Legal Validity Classification Guide`) để xác định đúng hiệu lực thi hành của văn bản:
1. **`Effective` *(Đang có hiệu lực thi hành):*** Văn bản đã qua ngày `effective_date` và chưa đến ngày `expiry_date`, đang áp dụng hợp pháp trên thực tế.
2. **`Not Yet Effective` *(Chưa có hiệu lực):*** Văn bản đã ban hành (`issue_date`) nhưng mốc `effective_date` nằm ở tương lai (ví dụ ban hành tháng 9, hiệu lực tháng 10).
3. **`Expired` *(Hết hiệu lực toàn bộ):*** Văn bản đã hết hiệu lực do qua thời hạn áp dụng (`expiry_date`) hoặc bị Quyết định bãi bỏ rõ ràng.
4. **`Superseded` *(Bị thay thế bởi văn bản mới):*** Văn bản bị bãi bỏ toàn bộ và thay thế bởi một Nghị định/Quyết định mới hơn ban hành sau đó.
5. **`Partially Effective` *(Hết hiệu lực một phần):*** Một số điều khoản của văn bản đã bị sửa đổi, bãi bỏ bởi văn bản mới, các điều khoản khác vẫn áp dụng bình thường.
6. **`Unknown / Needs Review` *(Chưa rõ hiệu lực / Cần xác minh):*** Bản ghi chưa rõ mốc thời gian thi hành hoặc đang có tranh cãi pháp lý về hiệu lực thi hành. **`[ZERO ACTIVE MANDATE]`**

---

## 5. Safety Notes

Dưới đây là **Đoạn Lời nhắc An toàn Quản trị Dữ liệu Bất khả xâm phạm (`Mandatory Template Safety Notes`)** được quán triệt cho toàn bộ Cán bộ Thẩm định và Quản trị viên:

> [!IMPORTANT]
> **QUY TẮC AN TOÀN TUYỆT ĐỐI KHI SỬ DỤNG TEMPLATE METADATA (PHASE 11C):**
> 1. 🛑 **KHÔNG DÙNG TRẠNG THÁI `Unknown / Needs Review` ĐỂ ACTIVE:** Tuyệt đối không cho phép import hay kích hoạt (`active: true`) bất kỳ bản ghi nào có trạng thái `legal_status = Unknown / Needs Review` hoặc `approval_status != Approved`.
> 2. 🛑 **KHÔNG TỰ KHẲNG ĐỊNH VĂN BẢN CÒN HIỆU LỰC NẾU CHƯA CÓ NGƯỜI DUYỆT:** Cán bộ kỹ thuật và AI tuyệt đối không tự ý gán nhãn `Effective` cho một tài liệu nếu thiếu chữ ký rà soát của Cán bộ Pháp chế (`reviewer`) và Lãnh đạo Phòng (`approval_status`).
> 3. 🛑 **KHÔNG IMPORT VĂN BẢN CHƯA CÓ NGUỒN RÕ:** Bất kỳ bản ghi nào thiếu URL Công báo chính thống (`source_url`) hoặc thiếu đường dẫn file toàn văn nội bộ (`full_text_location`) kiên quyết bị loại bỏ ngay từ bước lập template.
> 4. ✅ **CÁN BỘ VẪN PHẢI KIỂM TRA CĂN CỨ PHÁP LÝ TẠI THỜI ĐIỂM XỬ LÝ HỒ SƠ:** Khẳng định tối thượng: Hệ thống LegalFlow V2 chỉ là công cụ hỗ trợ tra cứu và tham mưu. Cán bộ thụ lý P2, Chuyên viên Một cửa và Lãnh đạo Cơ quan chịu trách nhiệm cao nhất và duy nhất trong việc đối chiếu hiệu lực thực tế của văn bản trước khi ký duyệt hồ sơ TTHC (`Human-in-the-Loop Mandatory`).

---
*Biểu mẫu Quy chuẩn Thuộc tính Dữ liệu Văn bản (Metadata Template) được lập tự động chuẩn hóa từ Kế hoạch Phase 11C.*
