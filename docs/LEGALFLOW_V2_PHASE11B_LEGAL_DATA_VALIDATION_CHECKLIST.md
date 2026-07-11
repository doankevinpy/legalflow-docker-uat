# LEGALFLOW V2 - PHASE 11B
# LEGAL DATA VALIDATION CHECKLIST

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11B Standard`  
**Ngày ban hành Bảng kiểm:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL LEGAL DATA VALIDATION CHECKLIST TEMPLATE`** *(Biểu mẫu Checklist Thẩm định & Xác thực Dữ liệu Pháp lý)*

---

## 1. Purpose

Tài liệu này là Biểu mẫu Bảng kiểm Thẩm định và Xác thực Dữ liệu Pháp lý (`Legal Data Validation Checklist` - Phase 11B) của hệ thống LegalFlow V2. Biểu mẫu được thiết lập làm công cụ làm việc bắt buộc dành cho Cán bộ Thẩm định Pháp chế (`Legal Reviewer`) và Lãnh đạo Phòng (`MANAGER`) khi kiểm tra một văn bản quy phạm pháp luật, quyết định địa phương, hoặc bản đồ quy hoạch trước khi phê duyệt nạp vào cơ sở tri thức `Legal Knowledge Base` (`LK-01`). Bảng kiểm chuẩn hóa 12 tiêu chí kiểm chứng chung (`Validation Checklist`), thiết lập 8 tiêu chí kiểm tra chuyên sâu dành riêng cho Quy hoạch / Kế hoạch sử dụng đất (`Local Planning Checklist`), quy định 4 mức phán quyết thẩm định (`Validation Decision`) và ghi nhớ thông điệp an toàn bất khả xâm phạm (`Safety Note`).

---

## 2. Validation Checklist

Bảng kiểm tra 12 tiêu chí chuẩn xác cho mọi văn bản pháp quy đề xuất nạp vào hệ thống (`Standardized 12-Point Legal Data Validation Table` - *Lưu ý: Đánh dấu `PASS / WARNING / FAIL / NA` vào cột kết quả khi thẩm định thực tế*):

| Check ID | Validation Item (`Verification Criteria`) | Required Evidence (`Proof Mandate`) | Result (`PASS/WARN/FAIL/NA`) | Reviewer (`Sign-off`) | Notes & Audit Remarks |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **VAL-01** | **Nguồn văn bản rõ ràng (`Authenticity`)** | Link Công báo tỉnh, cổng thông tin điện tử UBND tỉnh hoặc bản scan gốc có dấu đỏ lưu tại Văn thư. | `[   ] PASS` | `Legal Reviewer` | Không chấp nhận tài liệu trôi nổi chưa qua xác thực. |
| **VAL-02** | **Đúng cơ quan ban hành (`Issuing Authority`)** | Tên cơ quan (`issuingAuthority`) khớp chính xác trên file gốc (UBND tỉnh, Bộ TN&MT, HĐND tỉnh). | `[   ] PASS` | `Legal Reviewer` | Phân loại chuẩn xác thẩm quyền Trung ương hay Địa phương. |
| **VAL-03** | **Có số / ký hiệu chuẩn (`Document Number`)** | Số hiệu văn bản (`docNumber`) rõ ràng, đúng cú pháp hành chính (`25/2024/QĐ-UBND`). | `[   ] PASS` | `Legal Reviewer` | Phục vụ ánh xạ trích dẫn vào file dự thảo Word Khối 3.3. |
| **VAL-04** | **Có ngày ban hành (`Issue Date`)** | Trường `issueDate` ghi đúng theo ngày tháng năm ký ban hành trên văn bản gốc (`YYYY-MM-DD`). | `[   ] PASS` | `Legal Reviewer` | Xác định trình tự thời gian ban hành của căn cứ luật. |
| **VAL-05** | **Có ngày hiệu lực (`Effective Date`)** | Trường `effectiveDate` ghi chính xác mốc thời gian bắt đầu thi hành luật (`YYYY-MM-DD`). | `[   ] PASS` | `Legal Reviewer` | Căn cứ cốt lõi để AI Khối 3.1 rà soát hồ sơ nộp đúng thời kỳ. |
| **VAL-06** | **Tình trạng hiệu lực đã kiểm tra (`Status Audited`)** | Xác nhận rõ văn bản đang `ACTIVE`, `PENDING` hay đã `EXPIRED` thông qua kiểm tra tình trạng thi hành. | `[   ] PASS` | `Legal Reviewer` | Ngăn chặn tuyệt đối việc nạp văn bản đã bị bãi bỏ vào DB. |
| **VAL-07** | **Văn bản sửa đổi / bổ sung / thay thế đã kiểm tra** | Ghi rõ vào `amendmentRelation` số hiệu của văn bản cũ bị văn bản này bãi bỏ hoặc sửa đổi điều khoản. | `[   ] PASS` | `Legal Reviewer` | Chuỗi truy vết lịch sử pháp lý (`Legal Lineage`) minh bạch. |
| **VAL-08** | **Phạm vi áp dụng địa phương đã kiểm tra (`Scope`)** | Ghi nhãn `scope: LOCAL` và chỉ định địa bàn áp dụng (`localApplicability` - Toàn tỉnh hay cấp huyện). | `[   ] PASS` | `Legal Reviewer` | Ngăn chặn áp dụng nhầm quy định hạn mức giữa các huyện/xã. |
| **VAL-09** | **Liên quan thủ tục đã xác định (`Procedure Mapped`)** | Danh sách mã thủ tục (`relatedProcedure`) được ánh xạ đúng với loại hồ sơ TTHC (`TTHC-LAND-01...`). | `[   ] PASS` | `Procedure Lead` | Bảo đảm AI gọi đúng căn cứ khi rà soát từng loại hồ sơ. |
| **VAL-10** | **Trích yếu chính đã ghi (`Accurate Summary`)** | Trường `title` và tóm tắt phản ánh trung thực, đầy đủ toàn văn nội dung quy định của văn bản. | `[   ] PASS` | `Legal Reviewer` | Giúp chuyên viên dễ dàng tra cứu nhanh trên menu `Knowledge`. |
| **VAL-11** | **Rủi ro / giới hạn đã ghi (`Disclaimer Logged`)** | Ghi rõ các hạn chế hoặc trường hợp chuyển tiếp đặc thù vào trường `notes` để nhắc nhở chuyên viên. | `[   ] PASS` | `Legal Reviewer` | Cảnh báo cán bộ lưu ý các tình huống ngoại lệ tại địa bàn. |
| **VAL-12** | **Reviewer đã xác nhận (`Validation Sign-off`)** | Cán bộ pháp chế trực tiếp thẩm định đã ký tên và ghi rõ ngày hoàn tất kiểm tra trên bảng này. | `[   ] PASS` | `Legal Reviewer` | Trách nhiệm giải trình pháp lý cá nhân rõ ràng. |

---

## 3. Local Planning / Land Use Checklist

Bảng kiểm tra chuyên sâu 8 tiêu chí đặc thù dành riêng cho việc rà soát và thẩm định **Quy hoạch / Kế hoạch Sử dụng đất Cấp huyện (`Land Use Plans & Master Plans Validation Table` - Khối `LAW-02`)**:

| Planning Check ID | Special Validation Item (`Land Use Criteria`) | Required Technical & Legal Evidence | Result (`PASS/WARN/FAIL/NA`) | Specialist Sign-off | Notes & Governance Check |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **VAL-PLN-01** | **Tên quy hoạch / kế hoạch chính xác** | Ghi đúng tên Đồ án quy hoạch chung hoặc Kế hoạch sử dụng đất hàng năm cấp huyện được phê duyệt. | `[   ] PASS` | `Land Specialist` | Căn cứ pháp lý then chốt cho thủ tục chuyển mục đích SDĐ. |
| **VAL-PLN-02** | **Kỳ quy hoạch / kế hoạch hợp lệ (`Timeframe`)** | Ghi rõ thời kỳ 10 năm (`2021-2030`) hoặc năm kế hoạch (`năm 2026`). Khẳng định chưa hết hạn kỳ kế hoạch. | `[   ] PASS` | `Land Specialist` | Tuyệt đối không dùng Kế hoạch sử dụng đất đã hết hạn năm cũ. |
| **VAL-PLN-03** | **Địa bàn áp dụng chính xác (`Territorial Boundary`)** | Xác định đúng phạm vi hành chính (Huyện A, Thành phố B hoặc khu chức năng đô thị cụ thể). | `[   ] PASS` | `Land Specialist` | Khóa chặt ranh giới địa lý, không cho AI gợi ý trái địa bàn. |
| **VAL-PLN-04** | **Cơ quan phê duyệt đúng thẩm quyền (`Approver`)** | Khẳng định Quyết định phê duyệt do UBND tỉnh ban hành (hoặc UBND huyện theo đúng ủy quyền pháp luật). | `[   ] PASS` | `Land Specialist` | Bảo đảm tính hợp pháp tuyệt đối của bản đồ quy hoạch. |
| **VAL-PLN-05** | **Thời điểm hiệu lực &amp; công bố rõ ràng** | Ghi rõ ngày bắt đầu có hiệu lực thi hành và ngày công bố công khai theo quy định Luật Đất đai 2024. | `[   ] PASS` | `Land Specialist` | Căn cứ để tính thời điểm tiếp nhận hồ sơ đủ điều kiện. |
| **VAL-PLN-06** | **Nguồn kiểm tra chính thống (`Map Source`)** | Quyết định phê duyệt kèm theo bản đồ số hóa tỷ lệ `1/25.000` hoặc `1/10.000` từ Sở TN&MT/Phòng TN&MT. | `[   ] PASS` | `Land Specialist` | Đảm bảo tính nhất quán giữa số liệu quyết định và bản đồ. |
| **VAL-PLN-07** | **Liên quan thửa đất / khu vực cụ thể (`Zoning Link`)** | Xác định rõ các chỉ tiêu quy hoạch (đất ở đô thị `ODT`, đất ở nông thôn `ONT`, đất nông nghiệp `LUK`). | `[   ] PASS` | `Land Specialist` | Hỗ trợ chuyên viên đối chiếu mã mục đích sử dụng đất trên sổ đỏ. |
| **VAL-PLN-08** | **Cảnh báo cán bộ kiểm tra bản đồ / hồ sơ gốc** | **BẮT BUỘC GHI NHẬN LỜI NHẮC:** *"Hệ thống chỉ lưu quyết định tổng thể. Cán bộ bắt buộc rà soát thủ công vị trí tọa độ thửa đất trên bản đồ quy hoạch E-Office trước khi kết luận!"* | `[   ] PASS` | `Land Specialist` | Khẳng định 100% tuân thủ chốt chặn an toàn `LAW-02`. |

---

## 4. Validation Decision

Dựa trên kết quả đánh giá 12 tiêu chí chung (`VAL-01 -> VAL-12`) và 8 tiêu chí quy hoạch (`VAL-PLN-01 -> 08`), Cán bộ Thẩm định và Lãnh đạo Phòng đưa ra **1 trong 4 phán quyết thẩm định (`Official Validation Decision Options`)**:

* `[   ]` **`1. Approved for Legal Knowledge` *(Phê duyệt đưa vào Cơ sở Tri thức):*** Toàn bộ 100% tiêu chí đạt `[PASS]`. Dữ liệu chính xác, hợp pháp, sẵn sàng cho `ADMIN` nạp vào Khối 3.2 (`Active Candidate`).
* `[   ]` **`2. Approved with Warning` *(Phê duyệt kèm theo Cảnh báo đặc biệt):*** Các tiêu chí pháp lý đạt `[PASS]`, nhưng văn bản có tính chất chuyển tiếp phức tạp hoặc sắp có Nghị định mới thay thế. Cho phép nạp nhưng buộc gắn cờ cảnh báo vàng (`Warning Flag`) trên giao diện Tab 3.
* `[   ]` **`3. Needs More Information` *(Yêu cầu bổ sung thông tin/hồ sơ):*** Một số tiêu chí bị `[WARN / NA]` do thiếu phụ lục bản đồ quy hoạch hoặc chưa rõ ngày có hiệu lực. Trả hồ sơ lại cho `Source Collector` bổ sung trước khi rà soát lại.
* `[   ]` **`4. Rejected` *(Kiên quyết từ chối nạp DB):*** Phát hiện có tiêu chí bị `[FAIL]` (nguồn không xác thực, văn bản đã hết hiệu lực, hoặc mâu thuẫn luật trung ương). Loại bỏ vĩnh viễn khỏi danh sách làm giàu tri thức.

---

### Chữ ký Phán quyết Thẩm định Dữ liệu:

* **CÁN BỘ THẨM ĐỊNH PHÁP CHẾ / NGHIỆP VỤ (`Legal Reviewer / Land Specialist`):**  
  *(Ký xác nhận rà soát và ghi rõ họ tên)*  
  <br/><br/>
  ___________________________________________  
  *Ngày thẩm định: `[  /  / 2026 ]`*

* **LÃNH ĐẠO PHÒNG PHÊ DUYỆT (`MANAGER Approver`):**  
  *(Ký đồng ý phán quyết và ghi rõ họ tên)*  
  <br/><br/>
  ___________________________________________  
  *Ngày phê duyệt: `[  /  / 2026 ]`*

---

## 5. Safety Note

Dưới đây là **Đoạn Lời nhắc An toàn Bất khả xâm phạm (`Required Safety Note Mandate`)** được in đậm dưới mỗi phiếu thẩm định dữ liệu:

> [!IMPORTANT]
> **THÔNG ĐIỆP AN TOÀN PHÁP LÝ TỐI THƯỢNG DÀNH CHO CÁN BỘ THỤ LÝ (LEGALFLOW V2):**
> 
> *Ngay cả khi văn bản pháp luật, quyết định quy định của UBND tỉnh hay bản đồ quy hoạch sử dụng đất cấp huyện đã được thẩm định `Approved for Legal Knowledge` và nạp thành công vào cơ sở tri thức Khối 3.2 (`v2.0-2024-LAND-LAW`), **Cán bộ thụ lý P2, Chuyên viên Một cửa và Lãnh đạo Phòng vẫn bắt buộc phải tự rà soát, kiểm tra văn bản pháp luật hiện hành, văn bản địa phương, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ tại chính thời điểm xử lý hồ sơ**. Hệ thống AI Khối 3.1 chỉ làm nhiệm vụ tham mưu gợi ý sơ bộ, tuyệt đối không có tư cách thay thế thẩm quyền rà soát và phán quyết công tâm của con người.*

---
*Checklist Thẩm định & Xác thực Dữ liệu Pháp lý (Validation Checklist) được lập tự động từ kết quả chuẩn hóa Phase 11B.*
