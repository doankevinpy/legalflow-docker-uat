# LEGALFLOW V2 - PHASE 11B
# LEGAL KNOWLEDGE DATA ENRICHMENT PLAN

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.11.0-user-training-sop-operational-adoption` -> `Phase 11B Standard`  
**Ngày ban hành Kế hoạch:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL LEGAL KNOWLEDGE DATA ENRICHMENT PLAN`** *(Kế hoạch & Quy chế Làm giàu Cơ sở Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Kế hoạch Làm giàu Dữ liệu Cơ sở Tri thức Pháp lý (`Legal Knowledge Data Enrichment Plan` - Phase 11B) của hệ thống LegalFlow V2. Kế hoạch được thiết lập ngay sau khi ban hành quy trình chuẩn hóa đào tạo người dùng (`Phase 11A SOP`) nhằm quản trị và làm giàu căn cứ dữ liệu phục vụ Trợ lý AI rà soát hồ sơ TTHC Khối 3.1 (`AI Review Khối 3.1`) và tra cứu Khối 3.2 (`Legal Snapshot Khối 3.2`). Đặc biệt, kế hoạch tập trung chuẩn hóa quy trình tiếp nhận, tra cứu và phân loại **nguồn pháp lý địa phương (`Local Regulations`), quy hoạch/kế hoạch sử dụng đất cấp huyện (`Land Use Plans`) và bộ quy trình nội bộ TTHC (`Internal SOPs`)** của UBND tỉnh, đồng thời xác lập ranh giới quản trị nguồn nghiêm ngặt để AI không bao giờ tự khẳng định căn cứ dữ liệu là đầy đủ tuyệt đối.

---

## 2. Background

Trong quá trình triển khai kiểm thử chấp nhận người dùng thực tế (`Pilot UAT - Phase 10B -> 10F`) và mở rộng vận hành production có kiểm soát (`Phase 10O -> Phase 10P`), các Chuyên viên thụ lý P2 và Lãnh đạo Phòng đã nhiều lần đóng góp ý kiến thiết thực:
* **Khung luật trung ương là chưa đủ cho thụ lý thực tế:** Khối 3.2 hiện đang tích hợp tốt khung pháp luật trung ương (`v2.0-2024-LAND-LAW` gồm Luật Đất đai 2024 và các Nghị định hướng dẫn). Tuy nhiên, kết quả chấp thuận hay từ chối một hồ sơ thủ tục hành chính đất đai tại địa phương bị chi phối mạnh mẽ và trực tiếp bởi 3 quy định đặc thù do chính quyền địa phương ban hành: Quy định UBND tỉnh, Quy hoạch sử dụng đất cấp huyện và Bộ quy trình giải quyết TTHC nội bộ.
* **Lời nhắc rà soát thủ công `LAW-02` hoạt động hiệu quả nhưng cần hỗ trợ sâu hơn:** Hệ thống hiện đang hiển thị khung viền vàng cảnh báo `LAW-02` buộc cán bộ đối chiếu thủ công bản đồ quy hoạch ngoài phần mềm E-Office. Để giảm tải thời gian tra cứu phân tán, hệ thống cần có cơ chế làm giàu dữ liệu địa phương (`Data Enrichment`) vào thư viện `Legal Knowledge Base` (`LK-01`).
* **Hệ thống chỉ là gợi ý tham mưu, tuyệt đối không làm thay rà soát con người:** Bất kỳ văn bản pháp quy mới nào trước khi đưa vào hệ thống đều có nguy cơ sai lệch, hết hiệu lực hoặc bị sửa đổi, bổ sung bởi văn bản mới. Do đó, việc làm giàu cơ sở tri thức **bắt buộc phải đi kèm một Quy trình Quản trị Nguồn pháp lý nhiều bước (`Review & Approval Governance`)** để ngăn chặn tuyệt đối tình trạng sử dụng căn cứ sai, văn bản hết hiệu lực hoặc chưa qua kiểm duyệt chính thức.

---

## 3. Data Enrichment Scope

Bảng phân loại, xác định phạm vi 8 nhóm dữ liệu pháp lý và nghiệp vụ thuộc diện làm giàu tri thức trong Phase 11B (`Legal Knowledge Enrichment Scope Table`):

| Data Group | Description & Scope Definition | Concrete Example & Legal Citation | Assigned Owner (`RBAC`) | Target Priority | Governance Notes & Safety Check |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **1. Văn bản Pháp luật Trung ương** | Các Luật, Nghị định, Thông tư hướng dẫn thi hành do Quốc hội, Chính phủ và Bộ TN&MT/Bộ Xây dựng ban hành. | Luật Đất đai 2024 (`31/2024/QH15`), Nghị định `102/2024/NĐ-CP` về quy định chi tiết thi hành Luật Đất đai. | `Legal Reviewer` / `ADMIN` | `P0` *(Lõi hiện hữu)* | Là khung chuẩn toàn quốc Khối 3.2, phải kiểm tra liên tục tình trạng sửa đổi, bổ sung. |
| **2. Văn bản Địa phương** | Các Quyết định, Quy định ban hành kèm theo do UBND tỉnh ban hành về hạn mức, bảng giá, điều kiện tách thửa. | Quyết định `XX/2024/QĐ-UBND` của UBND tỉnh về hạn mức giao đất, điều kiện tách/hợp thửa đất trên địa bàn. | `Procedure Reviewer` / `MANAGER` | **`P1` *(Khẩn cấp)*** | Giải quyết trực tiếp điểm nghẽn tham mưu thực tế cho chuyên viên P2 (`BL-001`). |
| **3. Quy hoạch / Kế hoạch Sử dụng đất** | Bản đồ, quyết định phê duyệt quy hoạch sử dụng đất thời kỳ 2021-2030 và kế hoạch sử dụng đất hàng năm cấp huyện. | Quyết định `YY/QĐ-UBND` về việc phê duyệt Kế hoạch sử dụng đất năm 2026 của Huyện/Thành phố thuộc tỉnh. | `Land Use Specialist` / `MANAGER` | **`P1` *(Khẩn cấp)*** | Căn cứ thẩm định chuyển mục đích sử dụng đất, tách thửa và cấp GCN lần đầu (`LAW-02`). |
| **4. Quy trình Nội bộ TTHC** | Quyết định công bố Quy trình nội bộ giải quyết TTHC lĩnh vực Đất đai/Xây dựng tại Trung tâm Phục vụ Hành chính công. | Quyết định số `ZZ/QĐ-UBND` công bố quy trình giải quyết hồ sơ "Chuyển nhượng quyền sử dụng đất" (10 ngày làm việc). | `Procedure Reviewer` / `STAFF Lead` | **`P1` *(Khẩn cấp)*** | Chuẩn hóa mốc thời gian luân chuyển hồ sơ giữa Một cửa, Phòng P2 và VP Đăng ký Đất đai. |
| **5. Biểu mẫu Hành chính** | Các mẫu đơn, tờ khai, mẫu quyết định chuẩn theo Bộ TTHC và Nghị định 30/2020/NĐ-CP. | Mẫu Đơn đăng ký biến động đất đai (`Mẫu số 11/ĐK`), Mẫu Phiếu thẩm định hồ sơ TTHC chuẩn cơ quan hành chính. | `Document Clerk` / `MANAGER` | `P2` | Phục vụ trực tiếp việc chuẩn hóa Thể thức Export Khối 3.3 tại `Phase 11C` (`BL-002`). |
| **6. Hướng dẫn Nghiệp vụ** | Các Công văn đôn đốc, tháo gỡ vướng mắc nghiệp vụ, hướng dẫn chi tiết từng tình huống thụ lý phức tạp của Sở TN&MT. | Công văn số `1234/STNMT-QLĐĐ` về việc hướng dẫn rà soát điều kiện tiếp giáp đường giao thông khi tách thửa. | `Legal Reviewer` / `STAFF Lead` | `P2` | Giúp AI Khối 3.1 hiểu sâu hơn thói quen thẩm định và các tiêu chí linh hoạt tại tỉnh. |
| **7. Văn bản Hết hiệu lực / Cần cảnh báo** | Danh mục các văn bản cũ đã bị bãi bỏ hoặc thay thế để hệ thống phát cảnh báo ngăn chặn chuyên viên áp dụng nhầm. | Luật Đất đai 2013 (`45/2013/QH13`), Quyết định cũ về tách thửa đã bị bãi bỏ kể từ ngày `01/08/2024`. | `Legal Reviewer` / `ADMIN` | `P1` *(Bắt buộc)* | Hệ thống tự động gán cờ `status: EXPIRED` và hiển thị thẻ đỏ cảnh báo trên UI. |
| **8. Văn bản Sửa đổi, Bổ sung, Thay thế** | Các văn bản ban hành sau nhằm sửa đổi một vài điều khoản hoặc bãi bỏ một phần văn bản trước đó. | Nghị định sửa đổi, bổ sung một số điều của các Nghị định quy định chi tiết thi hành Luật Đất đai. | `Legal Reviewer` / `ADMIN` | `P1` *(Bắt buộc)* | Thiết lập mối quan hệ ánh xạ (`amendment/replacement relation`) giữa văn bản gốc và mới. |

---

## 4. Out of Scope

Nhằm bảo đảm tính toàn vẹn của hệ thống production và tuân thủ kỷ luật quản trị AI (`AI Governance Safeguards`), Kế hoạch Phase 11B thiết lập 5 ranh giới tuyệt đối **NẰM NGOÀI PHẠM VI (`Out of Scope Strict Mandates`)**:
1. 🛑 **Không tự động cập nhật văn bản pháp luật không qua kiểm duyệt (`Zero Auto-Scraping / Auto-Ingestion`):** Hệ thống không tự động cào (*scrape*) hay đồng bộ dữ liệu văn bản pháp luật từ các trang web bên ngoài hay cổng thông tin điện tử mà không có sự rà soát thủ công của con người.
2. 🛑 **Không tự khẳng định dữ liệu là đầy đủ tuyệt đối (`No Absolute Completeness Claim`):** Trợ lý AI Khối 3.1 và cơ sở tri thức Khối 3.2 tuyệt đối không được phép đưa ra tuyên bố "Hệ thống đã bao phủ 100% mọi căn cứ pháp luật và quy hoạch mới nhất của nhà nước". Luôn phải duy trì lời nhắc cán bộ tự đối chiếu thực tế.
3. 🛑 **Không tự active version pháp lý (`No Auto-Activation`):** Việc phê duyệt một bản ghi hay bộ dữ liệu mới không làm hệ thống tự động thay đổi huy hiệu hiệu lực đang hoạt động (`active: true`) trên DB. Quyền kích hoạt version pháp lý thuộc về thao tác kiểm duyệt nhiều bước của Lãnh đạo Đơn vị và ADMIN.
4. 🛑 **Không tự dùng dữ liệu chưa kiểm tra cho quyết định chính thức (`Zero Unverified Usage`):** Các văn bản đang ở trạng thái nháp (`Draft` / `Pending Review`) tuyệt đối không được đưa vào luồng phân tích của AI Khối 3.1 hay hiển thị trên Khối 3.2 của hồ sơ thụ lý.
5. 🛑 **Không thay thế cán bộ pháp chế / nghiệp vụ (`No Human Replacement`):** Việc số hóa và làm giàu dữ liệu chỉ là công cụ tra cứu hỗ trợ. Chuyên viên thụ lý P2, cán bộ pháp chế và Lãnh đạo Phòng vẫn là thẩm quyền duy nhất đánh giá tính hợp pháp, hợp lệ của từng hồ sơ cụ thể.

---

## 5. Source Collection Workflow

Quy trình 9 bước thu thập, kiểm chứng, phê duyệt và làm giàu nguồn dữ liệu pháp lý vào hệ thống LegalFlow V2 (`Standardized 9-Step Legal Knowledge Collection & Ingestion Workflow`):
1. **Bước 1: Đề xuất nguồn văn bản (`Source Proposal`):** Cán bộ thụ lý hoặc chuyên viên rà soát (`Source Collector`) lập danh sách đề xuất bổ sung các văn bản mới ban hành, quyết định của UBND tỉnh hoặc bản đồ quy hoạch cấp huyện vào Sổ Đăng ký Nguồn (`Source Register`).
2. **Bước 2: Ghi nhận Metadata (`Metadata Recording`):** Ghi nhận đầy đủ các thông tin thuộc tính cơ bản: số hiệu văn bản, cơ quan ban hành, ngày ban hành, ngày có hiệu lực, phạm vi áp dụng.
3. **Bước 3: Kiểm tra Nguồn chính thống (`Source Authenticity Verification`):** Đối chiếu văn bản đề xuất với bản gốc lưu tại Văn thư cơ quan, Công báo tỉnh hoặc Cổng thông tin điện tử chính thức của UBND tỉnh/Sở TN&MT để khẳng định tính chính xác tuyệt đối của câu chữ.
4. **Bước 4: Kiểm tra Hiệu lực (`Validity & Effective Date Verification`):** Kiểm tra tình trạng hiệu lực pháp lý của văn bản (Còn hiệu lực, Chưa có hiệu lực, Hết hiệu lực một phần hay Hết hiệu lực toàn bộ).
5. **Bước 5: Kiểm tra Văn bản Sửa đổi / Bổ sung / Thay thế (`Amendment & Replacement Audit`):** Rà soát xem điều khoản nào trong văn bản đề xuất đã thay thế cho văn bản cũ nào trước đây, ghi rõ mối liên hệ ánh xạ (`Supersedes / Amended by`).
6. **Bước 6: Kiểm tra Phạm vi áp dụng Địa phương (`Local Scope & Territorial Audit`):** Xác định chính xác văn bản áp dụng chung cho toàn tỉnh hay chỉ áp dụng riêng cho một Huyện/Thành phố/Thị xã, hoặc chỉ giới hạn cho một thủ tục đặc thù.
7. **Bước 7: Người phụ trách nghiệp vụ / pháp lý xác nhận (`Reviewer Verification Sign-off`):** Cán bộ pháp chế (`Legal Reviewer`) rà soát toàn bộ kết quả bước 1 -> 6, ký xác nhận vào phiếu rà soát (`Validation Checklist`) và chuyển lên Lãnh đạo Phòng.
8. **Bước 8: Đưa vào Danh sách Chờ cập nhật Legal Knowledge (`Pending Ingestion Candidate`):** Lãnh đạo Phòng (`MANAGER`) phê duyệt đề xuất, chuyển dữ liệu sang trạng thái chờ cập nhật chuẩn hóa vào cơ sở tri thức (`Active Candidate`).
9. **Bước 9: Chỉ Active khi đã qua quy trình duyệt (`Strict Controlled Activation`):** Quản trị viên hệ thống (`ADMIN`) thực hiện nạp dữ liệu và cấu hình phiên bản luật, **chỉ kích hoạt hiệu lực (`active: true`) sau khi có quyết định chính thức** từ Hội đồng Thẩm định Dự án (`Phase 11C/11D`).

---

## 6. Metadata Requirements

Bảng quy chuẩn chuẩn hóa 15 trường thông tin thuộc tính bắt buộc (`Metadata Requirements Table`) cho mọi bản ghi văn bản/quy định đưa vào cơ sở tri thức Legal Knowledge:

| Field Name (`Metadata Schema`) | Required? (`Yes/No`) | Detailed Description & Data Quality Standard | Concrete Example (`Sample Value`) | Notes & UI/AI Utilization |
| :--- | :---: | :--- | :--- | :--- |
| **1. `title`** *(Tên/Trích yếu văn bản)* | `YES` | Tên đầy đủ, chính xác theo đúng bản gốc văn bản được ban hành. | Quyết định ban hành Quy định về hạn mức giao đất, điều kiện tách thửa đất trên địa bàn tỉnh X. | Hiển thị làm tiêu đề chính trên thanh tìm kiếm Khối 3.2 và menu `Knowledge`. |
| **2. `documentNumber`** *(Số hiệu)* | `YES` | Ký hiệu chuẩn của văn bản quy phạm pháp luật hoặc quyết định hành chính. | `25/2024/QĐ-UBND` | Dùng để tra cứu nhanh, trích dẫn vào bản dự thảo Word Khối 3.3. |
| **3. `issuingAuthority`** *(Cơ quan ban hành)* | `YES` | Tên đầy đủ của cơ quan có thẩm quyền ban hành văn bản. | Ủy ban nhân dân tỉnh X / Bộ Tài nguyên và Môi trường | Xác định cấp thẩm quyền (Trung ương vs. Địa phương). |
| **4. `issueDate`** *(Ngày ban hành)* | `YES` | Ngày, tháng, năm ban hành ghi trên văn bản (`YYYY-MM-DD`). | `2024-09-15` | Sắp xếp trình tự thời gian ban hành của thư viện luật. |
| **5. `effectiveDate`** *(Ngày hiệu lực)* | `YES` | Ngày, tháng, năm chính thức bắt đầu có hiệu lực thi hành (`YYYY-MM-DD`). | `2024-10-01` | Căn cứ để AI rà soát xem hồ sơ nộp vào ngày đó áp dụng luật nào. |
| **6. `expiryDate`** *(Ngày hết hiệu lực)* | `OPTIONAL` | Ngày văn bản hết hiệu lực hoặc bị bãi bỏ (`YYYY-MM-DD` hoặc `NULL`). | `2025-10-01` *(hoặc `NULL` nếu còn hiệu lực)* | Hệ thống tự động chuyển cờ sang `EXPIRED` khi qua mốc thời gian này. |
| **7. `status`** *(Tình trạng hiệu lực)* | `YES` | Trạng thái pháp lý chuẩn hóa: `ACTIVE` / `EXPIRED` / `PENDING` / `SUPERSEDED`. | `ACTIVE` *(Còn hiệu lực thi hành)* | Thẻ màu huy hiệu (Xanh = Active, Đỏ = Expired) trên giao diện `Knowledge`. |
| **8. `scope`** *(Phạm vi cấp độ)* | `YES` | Cấp độ ban hành: `NATIONAL` (Trung ương) hoặc `LOCAL` (Địa phương). | `LOCAL` | Giúp bộ lọc tra cứu Khối 3.2 phân tách rõ quy định tỉnh và luật chung. |
| **9. `relatedProcedure`** *(Thủ tục liên quan)* | `YES` | Mã hoặc tên các thủ tục hành chính chịu sự điều chỉnh trực tiếp của văn bản. | `TTHC-LAND-01` *(Chuyển nhượng QSDĐ)*, `TTHC-LAND-05` *(Tách thửa)* | Ánh xạ chính xác văn bản vào đúng loại hồ sơ TTHC khi AI review rà soát. |
| **10. `sourceUrl` / `storageLocation`** *(Nguồn lưu trữ)* | `YES` | Đường dẫn URL chính thống hoặc vị trí lưu trữ file gốc (`.pdf/.doc`) trong nội bộ. | `https://congbothongtin.tinhX.gov.vn/...` hoặc `minio://legal-docs/25_2024_QD_UBND.pdf` | Bằng chứng gốc để cán bộ rà soát bấm mở kiểm chứng tức thì (`Audit Trail`). |
| **11. `localApplicability`** *(Địa bàn áp dụng)* | `YES` | Tên đơn vị hành chính cấp huyện/xã áp dụng (nếu có giới hạn riêng biệt). | Toàn tỉnh X / riêng Huyện A và Thành phố B | Ngăn chặn AI gợi ý nhầm quy định hạn mức của Huyện A cho đất ở Huyện B. |
| **12. `amendmentRelation`** *(Quan hệ sửa đổi)* | `OPTIONAL` | Ghi rõ số hiệu văn bản mà tài liệu này sửa đổi, bổ sung hoặc thay thế. | `Thay thế Quyết định số 12/2020/QĐ-UBND ngày 10/05/2020` | Giúp hệ thống tạo chuỗi truy vết lịch sử biến động pháp lý (`Legal Lineage`). |
| **13. `reviewer`** *(Người rà soát)* | `YES` | Tài khoản/Họ tên cán bộ pháp chế trực tiếp kiểm tra và thẩm định dữ liệu. | `nguyenvana.legal` *(Chuyên viên Thẩm định Pháp chế)* | Ghi nhận trách nhiệm rà soát con người trước khi đưa vào hệ thống. |
| **14. `approvalStatus`** *(Trạng thái duyệt)* | `YES` | Trạng thái quy trình: `DRAFT` / `REVIEWED` / `APPROVED` / `ACTIVE_CANDIDATE`. | `APPROVED` | Chỉ những bản ghi `APPROVED` mới đủ điều kiện cho ADMIN nạp vào Khối 3.2. |
| **15. `notes`** *(Ghi chú quản trị)* | `OPTIONAL` | Các lưu ý đặc biệt, cảnh báo rủi ro hoặc chỉ dẫn áp dụng linh hoạt cho chuyên viên. | *Lưu ý: Hạn mức tách thửa đất ở tại các xã ven đô có điều khoản chuyển tiếp tại Điều 15.* | Hiển thị trong tooltip nhắc nhở ngay trên màn hình thụ lý Khối 3.1. |

---

## 7. Quality Rules

Bảng tiêu chuẩn và quy tắc bảo đảm chất lượng dữ liệu tri thức pháp lý (`Legal Knowledge Data Quality Rules`):
1. **Không nhập văn bản không rõ nguồn gốc (`Zero Anonymous Sources`):** Tuyệt đối loại bỏ mọi tài liệu trôi nổi trên mạng xã hội, bản photo không có dấu đỏ hoặc văn bản không ghi rõ cơ quan ban hành chính thức.
2. **Không nhập văn bản chưa xác định hiệu lực (`Zero Unverified Validity`):** Nếu một dự thảo văn bản hoặc văn bản chưa rõ thời điểm bắt đầu/kết thúc hiệu lực thi hành, tài liệu đó bị từ chối nhập vào danh mục active.
3. **Phải ghi chú rõ ràng nếu văn bản có thể đã bị sửa đổi / thay thế (`Mandatory Amendment Flag`):** Đối với các văn bản gốc ban hành từ nhiều năm trước, bắt buộc phải tra cứu và ghi đầy đủ danh sách Nghị định/Quyết định sửa đổi vào trường `amendmentRelation`.
4. **Phải ghi rõ nếu là văn bản địa phương (`Mandatory Local Scope Tagging`):** Gắn nhãn `scope: LOCAL` và chỉ định tên UBND tỉnh trong `issuingAuthority` để tránh nhầm lẫn với quy định của các địa phương khác.
5. **Phải ghi rõ nếu chỉ áp dụng cho một địa bàn hay thủ tục nhất định (`Strict Territorial Mapping`):** Nếu một bản kế hoạch sử dụng đất chỉ có hiệu lực cho Huyện A năm 2026, trường `localApplicability` phải khóa chặt ở Huyện A; tuyệt đối không để mặc định toàn tỉnh.
6. **Phải giữ nguyên thông điệp cảnh báo cán bộ kiểm tra lại (`Mandatory Human Verification Disclaimer`):** Trong metadata ghi chú và giao diện hiển thị Khối 3.2, bắt buộc phải hiển thị vĩnh viễn lời nhắc: *"Căn cứ này chỉ mang tính tham khảo tại thời điểm số hóa. Cán bộ thụ lý bắt buộc đối chiếu văn bản gốc và tình trạng hiệu lực thực tế trước khi tham mưu quyết định."*

---

## 8. Prioritized Enrichment Roadmap

Ma trận lộ trình ưu tiên triển khai làm giàu dữ liệu cơ sở tri thức Legal Knowledge trong Phase 11 (`Prioritized Legal Enrichment Roadmap Table`):

| Priority Level | Data Group & Scope Area | Concrete Rationale & Operational Need | Expected System & Officer Benefit | Suggested Target Phase | Notes & Action Readiness |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **`P1` *(Khẩn cấp - số 1)*** | **Văn bản Địa phương &amp; Quy hoạch / Kế hoạch Sử dụng đất** | Là 3 căn cứ quyết định trực tiếp việc chấp thuận hay từ chối hồ sơ Đất đai tại địa phương (`LAW-02`). | Chuyên viên P2 có ngay quy định UBND tỉnh và hạn mức tách thửa chuẩn ngay trong Khối 3.2, giảm tra cứu thủ công. | **`Phase 11B -> Phase 11C`** | Cần ưu tiên thu thập Quyết định UBND tỉnh và QĐ phê duyệt Kế hoạch sử dụng đất cấp huyện (`BL-001`). |
| **`P1` *(Khẩn cấp - số 1)*** | **Quy trình Nội bộ TTHC UBND tỉnh ban hành** | Định hình thời gian chuẩn và quy trình luân chuyển hồ sơ giữa Một cửa, P2 và VP Đăng ký Đất đai. | AI Khối 3.1 tự động cảnh báo chính xác mốc thời hạn xử lý từng bước, ngăn chặn chậm trễ hồ sơ. | **`Phase 11B -> Phase 11C`** | Chuẩn hóa mốc thời gian vào metadata liên quan thủ tục (`relatedProcedure`). |
| **`P2` *(Quan trọng)*** | **Biểu mẫu Hành chính &amp; Mẫu Phiếu thẩm định chuẩn** | Nhu cầu chuẩn hóa thể thức văn bản hành chính theo Nghị định 30/2020/NĐ-CP của tổ văn thư và lãnh đạo (`BL-002`). | Khối 3.3 xuất file Word `.docx` chuẩn thể thức, chuyên viên chỉ cần điền kết quả chuyên môn, giảm thời gian chỉnh sửa câu chữ lề trang. | **`Phase 11C`** | Sẽ ánh xạ trực tiếp vào `export-service` trong các đợt phát hành chuyên sâu. |
| **`P2` *(Quan trọng)*** | **Hướng dẫn Nghiệp vụ &amp; Công văn tháo gỡ vướng mắc** | Xử lý các hồ sơ có tình huống phức tạp (đất xen kẹt, đường tự mở, tranh chấp ranh giới). | Trợ lý AI Khối 3.1 đưa ra lời khuyên linh hoạt sát với thực tiễn chỉ đạo của Sở TN&MT địa phương. | **`Phase 11D`** | Tích hợp vào thư viện tri thức tra cứu nâng cao (`Interactive Law Reader`). |
| **`P3` *(Nâng cao)*** | **Tài liệu Đào tạo, FAQ &amp; Câu hỏi Thường gặp SOP** | Hỗ trợ cán bộ mới tiếp nhận ca làm việc và các cán bộ Một cửa tự ôn tập quy trình thao tác. | Cán bộ tự tra cứu giải đáp thắc mắc ngay trên menu `Knowledge` mà không cần gọi kỹ sư trực. | **`Phase 11E`** | Hoàn thiện hệ sinh thái tự đào tạo và hỗ trợ cán bộ (`Self-Service Ops`). |

---

## 9. Safety Confirmation

Tôi xác nhận và tái khẳng định việc tuân thủ tuyệt đối **5 Chốt chặn An toàn Bất khả xâm phạm (`5 Inviolable Governance Safeguards`)** trong suốt quá trình lập kế hoạch và làm giàu tri thức pháp lý:
1. ✅ **AI KHÔNG TỰ KẾT LUẬN CĂN CỨ LÀ ĐẦY ĐỦ TUYỆT ĐỐI:** Khẳng định Trợ lý AI Khối 3.1 và cơ sở tri thức Khối 3.2 không bao giờ phát ngôn thay thế con người hay tự nhận định dữ liệu hệ thống là hoàn hảo 100%.
2. ✅ **CÁN BỘ PHẢI KIỂM TRA PHÁP LÝ HIỆN HÀNH (`v2.0-2024-LAND-LAW`):** Cán bộ thụ lý chịu trách nhiệm kiểm tra hiệu lực văn bản luật trung ương, chủ động rà soát Nghị định mới sửa đổi, bổ sung.
3. ✅ **CÁN BỘ PHẢI KIỂM TRA CĂN CỨ ĐỊA PHƯƠNG (`Local Regulations`):** Cán bộ bắt buộc kiểm chứng các quyết định, quy định hiện hành do UBND tỉnh ban hành tại thời điểm thẩm định hồ sơ.
4. ✅ **CÁN BỘ PHẢI KIỂM TRA QUY HOẠCH / KẾ HOẠCH SỬ DỤNG ĐẤT (`Land Use Plans - LAW-02`):** Cán bộ bắt buộc rà soát thủ công bản đồ quy hoạch, kế hoạch sử dụng đất cấp huyện trên E-Office và hồ sơ gốc trước khi ký duyệt.
5. ✅ **CÁN BỘ PHẢI KIỂM TRA QUY TRÌNH NỘI BỘ (`Internal SOPs`):** Cán bộ tuân thủ nghiêm ngặt thời hạn thụ lý và thẩm quyền phê duyệt hồ sơ theo đúng bộ thủ tục hành chính nội bộ của cơ quan.

---
*Kế hoạch Làm giàu Dữ liệu Cơ sở Tri thức Pháp lý (Phase 11B Plan) được lập tự động từ yêu cầu rà soát và Sổ Backlog Phase 10Q.*
