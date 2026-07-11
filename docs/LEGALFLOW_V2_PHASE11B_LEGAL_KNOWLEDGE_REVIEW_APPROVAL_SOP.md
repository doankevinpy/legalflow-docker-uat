# LEGALFLOW V2 - PHASE 11B
# LEGAL KNOWLEDGE REVIEW & APPROVAL SOP

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11B Standard`  
**Ngày ban hành SOP Rà soát & Phê duyệt:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL LEGAL KNOWLEDGE REVIEW & APPROVAL SOP`** *(Quy trình Thao tác chuẩn về Rà soát & Phê duyệt Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Quy trình Thao tác chuẩn về Rà soát, Phê duyệt và Nạp Dữ liệu Pháp lý (`Legal Knowledge Review & Approval SOP` - Phase 11B) của hệ thống LegalFlow V2. Quy trình được ban hành nhằm thiết lập cơ chế kiểm duyệt nhiều lớp, phân định rõ thẩm quyền trách nhiệm của từng vai trò con người (`Roles and Responsibilities`), chuẩn hóa 12 bước thẩm định (`Review Workflow`), quy định bảng kiểm duyệt (`Approval Checklist`), xác lập tiêu chí từ chối nghiêm ngặt (`Rejection Criteria`), đồng thời siết chặt kỷ luật kích hoạt (`Activation Rules`) và khôi phục (`Rollback Rules`) văn bản pháp lý. Mục tiêu tối thượng của SOP là bảo đảm 100% căn cứ trong Khối 3.2 (`v2.0-2024-LAND-LAW`) và dữ liệu địa phương đều chính xác, hợp pháp, tuyệt đối ngăn chặn việc AI tự duyệt hay áp dụng sai căn cứ hết hiệu lực.

---

## 2. Roles and Responsibilities

Bảng phân định thẩm quyền, trách nhiệm và giới hạn hành vi rõ ràng cho 6 chủ thể tham gia quy trình rà soát tri thức pháp lý (`Roles, Responsibilities & Boundary Table`):

| Role Name | Primary Responsibility (`Core Duty`) | Allowed Actions (`Permission`) | Prohibited Actions (`Strict Prohibition`) | Notes & Governance Safeguard |
| :--- | :--- | :--- | :--- | :--- |
| **1. Source Collector** <br/> *(Cán bộ Thu thập)* | Tìm kiếm, tổng hợp văn bản pháp luật trung ương, quyết định UBND tỉnh, quy hoạch đất huyện và nhập vào Sổ Đăng ký (`Source Register`). | • Nhập metadata ban đầu.<br/>• Đính kèm file gốc (`.pdf/.doc`).<br/>• Cập nhật trạng thái `New` -> `Source Verified`. | 🛑 Không được tự chuyển trạng thái sang `Approved` hay `Active`.<br/>🛑 Không được tự sửa đổi câu chữ bản gốc. | Đảm bảo thu thập đúng nguồn chính thống từ Công báo hoặc cổng điện tử. |
| **2. Legal / Procedure Reviewer** <br/> *(Cán bộ Thẩm định)* | Kiểm tra tính xác thực của file gốc, kiểm chứng ngày hiệu lực, quan hệ sửa đổi/bổ sung, phạm vi áp dụng và thủ tục liên quan. | • Đánh giá `PASS/FAIL` trên Validation Checklist.<br/>• Chuyển trạng thái `Reviewed` hoặc `Rejected`. | 🛑 Không được tự ký duyệt nạp vào DB (`MANAGER Approver`).<br/>🛑 Không được bỏ qua rà soát quy hoạch đất (`LAW-02`). | Chốt chặn chuyên môn đầu tiên bảo đảm chất lượng dữ liệu tri thức. |
| **3. Manager Approver** <br/> *(Lãnh đạo Phê duyệt)* | Chịu trách nhiệm tối cao về tính hợp pháp, hợp lý và sự cần thiết của việc bổ sung căn cứ mới vào hệ thống production. | • Ký xác nhận phê duyệt (`Approved for Legal Knowledge`).<br/>• Yêu cầu `ADMIN` chuẩn bị nạp DB. | 🛑 Không ký duyệt nếu phiếu checklist thiếu chữ ký của `Legal Reviewer`.<br/>🛑 Không tự ý thao tác lệnh SQL trên DB. | Quyết định cao nhất của con người trước khi số hóa tri thức pháp lý. |
| **4. ADMIN** <br/> *(Quản trị viên Hệ thống)* | Thực hiện nạp dữ liệu (`Ingestion`) từ danh sách `Approved` vào bảng `LegalKnowledge` trên DB, quản lý cấu hình phiên bản. | • Nạp bản ghi sang trạng thái `Active Candidate`.<br/>• Kích hoạt (`active: true`) khi có lệnh Lãnh đạo.<br/>• Thực hiện Rollback khi có văn bản bãi bỏ. | 🛑 **Không tự ý active version pháp lý nếu chưa có chữ ký duyệt của MANAGER.**<br/>🛑 Không tự sửa content văn bản trên DB. | Tuân thủ tuyệt đối kỷ luật quản trị cơ sở dữ liệu (`DBA Safeguards`). |
| **5. Technical Operator** <br/> *(Kỹ sư Vận hành)* | Giám sát sức khỏe hạ tầng, kiểm tra container `docker ps`, theo dõi dung lượng backup và log hoạt động tra cứu Khối 3.2. | • Chạy `health-check.ps1`.<br/>• Kiểm tra backup `pg_dump` an toàn ngoài Git.<br/>• Ghi nhận lỗi báo cáo `Issue Register`. | 🛑 **Không tự ý reset hoặc restore database (`Zero DB Reset`).**<br/>🛑 Không commit file backup `.sql` vào Git. | Bảo đảm môi trường kỹ thuật vận hành mượt mà cho Khối 3.1 &amp; Khối 3.2. |
| **6. AI System (`Khối 3.1 & Khối 3.2`)** | Trợ lý số hỗ trợ tổng hợp thông tin, trích xuất dữ liệu, phân loại văn bản và gợi ý rà soát hồ sơ TTHC. | • Hỗ trợ tóm tắt trích yếu văn bản nếu được người dùng yêu cầu.<br/>• Tra cứu ánh xạ tiêu chí hồ sơ theo đúng DB Khối 3.2. | 🛑 **KHÔNG ĐƯỢC TỰ DUYỆT (`Zero Auto-Approval`).**<br/>🛑 **KHÔNG ĐƯỢC TỰ ACTIVE (`Zero Auto-Activation`).**<br/>🛑 **KHÔNG ĐƯỢC TỰ KHẲNG ĐỊNH HIỆU LỰC HAY ĐẦY ĐỦ TUYỆT ĐỐI.** | AI chỉ là công cụ gợi ý; ranh giới phán quyết hoàn toàn thuộc về con người. |

---

## 3. Review Workflow

Quy trình 12 bước rà soát, thẩm định, phê duyệt và kích hoạt một căn cứ pháp lý mới vào hệ thống LegalFlow V2 (`Standardized 12-Step Legal Knowledge Review & Approval Workflow`):
1. **Bước 1: Thu thập văn bản (`Source Collection`):** `Source Collector` tải file gốc từ Công báo tỉnh/cổng UBND tỉnh, nhập thông tin vào Sổ Đăng ký Nguồn (`Source Register`).
2. **Bước 2: Kiểm tra nguồn (`Source Verification`):** `Legal Reviewer` kiểm chứng URL gốc, xác minh chữ ký số và con dấu đỏ trên file `.pdf`, chuyển sang `Source Verified`.
3. **Bước 3: Kiểm tra metadata (`Metadata Check`):** `Legal Reviewer` đối chiếu 15 trường thông tin (số hiệu, cơ quan ban hành, tên văn bản) với bản gốc.
4. **Bước 4: Kiểm tra hiệu lực (`Validity Check`):** Rà soát ngày ban hành, ngày hiệu lực và ngày hết hiệu lực thi hành (`Effective Date Checked`).
5. **Bước 5: Kiểm tra văn bản sửa đổi / bổ sung / thay thế (`Amendment Check`):** Tra cứu rõ văn bản mới này thay thế, bãi bỏ hay sửa đổi điều khoản nào của văn bản cũ, điền vào `amendmentRelation`.
6. **Bước 6: Kiểm tra phạm vi địa phương (`Local Scope Check`):** Ghi rõ nhãn `scope: LOCAL` và địa bàn áp dụng (`localApplicability` - Toàn tỉnh hay riêng cấp huyện).
7. **Bước 7: Kiểm tra liên quan thủ tục (`Procedure Mapping Check`):** Ánh xạ chính xác văn bản với mã hồ sơ TTHC (`TTHC-LAND-01...`) để AI Khối 3.1 gọi đúng khi review.
8. **Bước 8: Reviewer xác nhận (`Validation Sign-off`):** `Legal Reviewer` hoàn thiện Bảng kiểm dữ liệu (`Validation Checklist`), ký nháy xác nhận đạt chuẩn và chuyển sang trạng thái `Reviewed`.
9. **Bước 9: Manager / Approver phê duyệt (`Manager Approval`):** `MANAGER Approver` rà soát hồ sơ kiểm tra, ký văn bản phê duyệt chính thức (`Approved for Legal Knowledge`).
10. **Bước 10: ADMIN cập nhật Legal Knowledge theo quy trình (`Controlled Ingestion`):** `ADMIN` chạy script nạp dữ liệu từ danh sách `Approved` vào bảng DB, đặt trạng thái ban đầu là `Active Candidate` (`active: false`).
11. **Bước 11: Kiểm tra Active Version (`Strict Controlled Activation`):** Sau khi nạp thành công và kiểm thử trên môi trường staging/diễn tập, `ADMIN` thực hiện lệnh kích hoạt (`active: true`) theo đúng quyết định của Lãnh đạo Đơn vị.
12. **Bước 12: Ghi nhận Audit / Log (`Audit Trail Recording`):** Hệ thống tự động lưu vết toàn bộ lịch sử thao tác (`Audit Log`): ai đề xuất, ai thẩm định, ai phê duyệt, ai kích hoạt vào thời điểm nào để phục vụ kiểm tra pháp lý về sau.

---

## 4. Approval Checklist

Bảng kiểm duyệt bắt buộc dành cho Lãnh đạo Đơn vị (`Manager Approver`) trước khi ký duyệt quyết định bổ sung căn cứ pháp lý vào Khối 3.2 (`Manager Approval Checklist Table`):

| Check Item (`Checklist Criteria`) | Required Evidence (`Mandatory Proof`) | Confirmed (`Yes/No/NA`) | Reviewer / Approver | Notes & Governance Evaluation |
| :--- | :--- | :---: | :--- | :--- |
| **1. Nguồn chính thống (`Authentic Source`)** | Link URL Công báo tỉnh hoặc file scan gốc có dấu đỏ của UBND tỉnh/Sở TN&MT. | `[ ✅ YES ]` | `Legal Reviewer` | Đã xác minh file không bị chỉnh sửa hay làm giả. |
| **2. Hiệu lực pháp lý (`Legal Validity`)** | Xác nhận văn bản đang còn hiệu lực thi hành tại thời điểm rà soát (`Effective Checked`). | `[ ✅ YES ]` | `Legal Reviewer` | Không nạp văn bản đã hết hiệu lực vào luồng Active. |
| **3. Phạm vi áp dụng (`Territorial Scope`)** | Xác định đúng cấp độ `LOCAL` và địa bàn hành chính (Toàn tỉnh / cấp huyện). | `[ ✅ YES ]` | `Legal Reviewer` | Ngăn chặn áp dụng nhầm quy định hạn mức giữa các huyện. |
| **4. Quan hệ sửa đổi / thay thế (`Amendment Lineage`)** | Ghi rõ số hiệu văn bản cũ bị bãi bỏ hoặc sửa đổi để hệ thống gắn cờ `SUPERSEDED`. | `[ ✅ YES ]` | `Legal Reviewer` | Chuỗi truy vết lịch sử pháp lý rõ ràng. |
| **5. Liên quan thủ tục (`Procedure Mapping`)** | Danh sách mã thủ tục TTHC liên quan (`TTHC-LAND-01`, `TTHC-LAND-05`...). | `[ ✅ YES ]` | `Procedure Lead` | AI Khối 3.1 gọi đúng căn cứ khi thẩm định hồ sơ. |
| **6. Trích yếu chính (`Accurate Summary`)** | Tên văn bản và tóm tắt nội dung chính phản ánh đúng toàn văn điều khoản. | `[ ✅ YES ]` | `Legal Reviewer` | Hiển thị chuẩn xác trên thanh tra cứu `Knowledge`. |
| **7. Cảnh báo giới hạn (`Human Disclaimer`)** | Giữ nguyên thông điệp nhắc nhở cán bộ tự kiểm tra thực tế, không ỷ lại tuyệt đối. | `[ ✅ YES ]` | `MANAGER Approver` | Chốt chặn then chốt bảo vệ an toàn pháp lý (`LAW-02`). |
| **8. Chữ ký Người duyệt (`Approver Sign-off`)** | Chữ ký xác nhận và ngày phê duyệt của Lãnh đạo Phòng P2 / Pháp chế trên phiếu. | `[ ✅ YES ]` | `MANAGER Approver` | Trách nhiệm giải trình pháp lý cá nhân rõ ràng. |

---

## 5. Rejection Criteria

Các tiêu chí kiên quyết từ chối (`Mandatory Rejection Criteria`). Cán bộ thẩm định (`Legal Reviewer`) và Lãnh đạo Phòng (`MANAGER`) **bắt buộc phải loại bỏ ngay lập tức (`Rejected`)** không đưa vào `Legal Knowledge Base` nếu phát hiện văn bản vi phạm một trong 7 trường hợp sau:
1. 🛑 **Không rõ nguồn gốc (`Unverified Source`):** Tài liệu thu thập từ các trang web cá nhân, diễn đàn luật tự do, bản photo không có dấu cơ quan hoặc không có link Công báo chính thức.
2. 🛑 **Không xác định hiệu lực (`Unknown Validity`):** Dự thảo văn bản đang lấy ý kiến, hoặc văn bản đã ban hành nhưng chưa có điều khoản quy định rõ ngày có hiệu lực thi hành.
3. 🛑 **Có dấu hiệu hết hiệu lực (`Expired / Abrogated`):** Văn bản đã bị Quyết định mới của UBND tỉnh hoặc Nghị định mới của Chính phủ bãi bỏ toàn bộ hoặc một phần, nhưng người đề xuất chưa làm rõ văn bản thay thế.
4. 🛑 **Không rõ địa bàn áp dụng (`Ambiguous Territorial Scope`):** Văn bản quy định hạn mức tách thửa hoặc đơn giá bồi thường không ghi rõ áp dụng cho khu vực đô thị hay nông thôn, thuộc huyện nào.
5. 🛑 **Không liên quan thủ tục (`Irrelevant to LegalFlow Procedures`):** Các văn bản nội bộ về công tác nhân sự, tài chính công đoàn hay xử phạt hành chính giao thông không liên quan đến rà soát TTHC Đất đai / Xây dựng.
6. 🛑 **Chưa có người duyệt (`Missing Reviewer Signature`):** Phiếu đề xuất chưa có chữ ký thẩm định và kết quả rà soát của Cán bộ Pháp chế (`Legal Reviewer`).
7. 🛑 **Có mâu thuẫn với văn bản cấp trên mà chưa xử lý (`Legal Conflict`):** Quy định của UBND tỉnh/huyện có điều khoản mâu thuẫn trực tiếp với Luật Đất đai 2024 hoặc Nghị định 102/2024/NĐ-CP của Chính phủ mà chưa có hướng dẫn tháo gỡ của Sở/Bộ.

---

## 6. Activation Rules

Quy tắc kỷ luật thép khi kích hoạt phiên bản luật và căn cứ tri thức trên hệ thống production (`Strict Version Activation Rules`):
1. **Chỉ ADMIN / MANAGER theo quyền mới được Active:** Chỉ những tài khoản có thẩm quyền tối cao `ADMIN` (kỹ thuật) hoặc `MANAGER` (nghiệp vụ) mới được phép thực hiện lệnh kích hoạt (`active: true`) nếu hệ thống hỗ trợ trên giao diện hoặc qua script quản trị chuẩn.
2. **Không Active nếu chưa đủ Review (`No Activation Without Approval`):** Tuyệt đối không kích hoạt bất kỳ bản ghi nào đang ở trạng thái `Draft`, `Pending Review` hay `Needs More Information`.
3. **KHÔNG ACTIVE TỰ ĐỘNG (`Zero Auto-Activation`):** Hệ thống được lập trình khóa cứng việc tự động kích hoạt phiên bản luật khi chạy qua script migration hay khi nạp dữ liệu. Mọi thao tác kích hoạt phải là thao tác thủ công có ý thức của con người.
4. **Phải có lý do Active (`Documented Rationale`):** Khi kích hoạt một phiên bản hoặc căn cứ mới, `ADMIN` phải ghi rõ lý do vào nhật ký (ví dụ: *Kích hoạt theo Quyết định số 25/2024/QĐ-UBND ngày 15/09/2024 thay thế QĐ cũ số 12/2020*).
5. **Phải có kế hoạch Rollback (`Prepared Rollback Plan`):** Trước khi bấm kích hoạt, `ADMIN` phải kiểm tra sẵn phương án khôi phục về phiên bản luật trước đó trong vòng 15 phút nếu phát hiện sai sót sau deployment.
6. **Phải có Audit Trail (`Mandatory Audit Logging`):** Mọi thao tác kích hoạt đều phải được ghi lại trong `Audit Log` trên DB (ghi rõ `timestamp`, `userId`, `oldVersion -> newVersion`) để không thể chối bỏ.

---

## 7. Rollback Rules

Quy tắc xử lý và khôi phục khi phát hiện căn cứ pháp lý bị sai lệch hoặc bãi bỏ (`Strict Legal Knowledge Rollback Rules`):
1. **Rollback chỉ khi phát hiện lỗi dữ liệu nghiêm trọng (`Emergency Triggers`):** Lệnh khôi phục (`Rollback Version` / chuyển trạng thái `EXPIRED`) chỉ được thực thi khi phát hiện: văn bản nạp vào bị sai nguồn, sai hiệu lực, áp dụng nhầm địa bàn hoặc có quyết định đình chỉ thi hành khẩn cấp từ UBND tỉnh.
2. **Rollback phải ghi lý do (`Mandatory Rollback Reason`):** `ADMIN` không được gỡ bỏ căn cứ âm thầm. Bắt buộc phải lập Phiếu ghi nhận Rollback, nêu rõ lý do bãi bỏ và có chữ ký đồng ý của Lãnh đạo Phòng (`MANAGER`).
3. **Không xóa dấu vết lịch sử (`Zero History Deletion`):** Thao tác Rollback trên Legal Knowledge **không phải là lệnh `DELETE FROM LegalKnowledge`**. Hệ thống bảo toàn bản ghi đó bằng cách chuyển trạng thái sang `status: SUPERSEDED` hoặc `status: EXPIRED` (`Soft Abrogation`), giữ nguyên dấu vết kiểm toán để tra cứu hồ sơ cũ.
4. **Phải thông báo người dùng nếu ảnh hưởng AI Review (`Immediate User Notification`):** Ngay sau khi thực hiện Rollback một căn cứ luật lõi trên Khối 3.2, `Technical Operator` và `UAT Coordinator` phải thông báo khẩn cấp cho toàn bộ Chuyên viên thụ lý (`STAFF`) và Văn một cửa (`VIEWER`) để anh em rà soát lại các hồ sơ đang xử lý dở dang trong ngày.

---
*Quy trình Rà soát & Phê duyệt Tri thức Pháp lý (Review SOP) được lập tự động chuẩn hóa từ Phase 11B Plan.*
