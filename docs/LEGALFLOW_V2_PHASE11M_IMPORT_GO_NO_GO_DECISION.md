# LEGALFLOW V2 - PHASE 11M
# REAL LEGAL DATASET IMPORT GO / NO-GO DECISION

## 1. Purpose

Tài liệu này ghi nhận quyết định chính thức (`Go / No-Go Decision`) của Lãnh đạo dự án và Hội đồng Quản trị Kỹ thuật LegalFlow V2 về việc có cho phép chuyển sang giai đoạn thực thi nạp dữ liệu tri thức pháp lý thật (`Controlled Real Legal Dataset Import Execution`) hay không.  
Quyết định được ra dựa trên sự tổng hợp kết quả của chuỗi 12 phase chuẩn bị kỹ thuật và mức độ hoàn thiện, tính xác thực của bộ dữ liệu nguồn được rà soát tại Phase 11M.

## 2. Decision Context

Chuỗi lộ trình chuẩn bị cho tính năng quản trị và nạp tri thức pháp lý của LegalFlow V2 đã trải qua các bước tiến vững chắc:
- **Phase 11B (`Data Enrichment Governance`):** Đã thiết lập khung quản trị làm giàu dữ liệu và quy trình kiểm soát chất lượng tri thức nội bộ.
- **Phase 11C (`Template Mapping Pack`):** Đã hoàn thiện bộ công cụ ánh xạ mẫu định dạng dữ liệu vào cấu trúc chuẩn hóa.
- **Phase 11D - 11E (`Dry-Run Sample & Technical Spec`):** Đã thực thi kiểm thử rà soát mô phỏng thành công trên tệp mẫu và xây dựng đặc tả kỹ thuật rà soát.
- **Phase 11F - 11G (`Design Safety Spec & Planning`):** Đã thiết lập đặc tả an toàn kiến trúc tường lửa 8 lớp và kế hoạch triển khai công cụ nạp.
- **Phase 11H - 11I (`Backend Validate & Execute Safety API`):** Đã xây dựng hoàn chỉnh API kiểm chứng rà soát (`validateCsvImport`) và API thực thi an toàn (`executeCsvImport`) kèm cơ chế chặn kép và cờ bảo vệ (`noDatabaseWrite`, `noAutoActive`).
- **Phase 11J (`Frontend Legal Knowledge Import UI`):** Đã ra mắt giao diện thao tác trực quan, tích hợp RBAC và hiển thị cảnh báo quản trị AI/Pháp lý.
- **Phase 11K (`Import UI E2E Test & RC`):** Đã rà soát E2E toàn diện 14 ca kiểm thử, đạt 150/150 backend tests PASS và phát hành Release Candidate.
- **Phase 11L (`Controlled Import UAT with Sample Dataset`):** Đã nghiệm thu thành công UAT trên bộ dữ liệu mẫu (`SAMPLE` prefix), kiểm chứng hoạt động nhạy bén của các tường lửa chặn thực thi.
- **Phase 11M (Hiện tại - `Real Legal Dataset Review & Go/No-Go`):** Là điểm chốt chặn quyết định (`Checkpoint Decision`) nơi hệ thống đối mặt với bộ dữ liệu pháp lý thật thực tế để ra quyết định cho phép import thực hay tiếp tục rà soát.

## 3. Go / No-Go Checklist

| Requirement | Required Evidence | Actual Status | Decision: GO / WARNING / NO-GO | Notes |
| :--- | :--- | :--- | :---: | :--- |
| `real dataset source verified` | Nguồn văn bản pháp lý thật đã được xác thực 100% từ công báo/cổng TTĐT. | Các bản ghi đăng ký mẫu đạt `Source Verified`, nhưng bộ dữ liệu thật đầy đủ chưa thu thập đủ 100%. | ⚠️ **WARNING** | Cần tiếp tục mở rộng và xác thực toàn bộ tập nguồn. |
| `metadata complete` | Đầy đủ 29 cột thông tin chuẩn hóa theo cấu trúc rà soát. | 5 bản ghi mẫu đạt đủ cột; cần bảo đảm khi nạp hàng trăm văn bản thật đều đạt 100% đủ cột. | ⚠️ **WARNING** | Cần kiểm tra tự động trước mỗi lô nạp. |
| `legal status checked` | Tình trạng hiệu lực được rà soát và đối chiếu mốc thời gian áp dụng. | Phát hiện Kế hoạch SDĐ 2024 (`REG-2024-004`) đã hết hạn áp dụng. | 🛑 **NO-GO** | Không được phép nạp các văn bản quy hoạch/kế hoạch đã hết thời kỳ vào DB mới. |
| `amendment/replacement checked` | Rõ ràng chuỗi quan hệ sửa đổi, thay thế và bãi bỏ văn bản cũ. | Đã ghi nhận quan hệ thay thế cho Luật Đất đai 2013 và NĐ 43/2014. | ✅ **GO** | Đảm bảo tính liên tục của lịch sử pháp lý. |
| **`local scope checked`** | Phân định chính xác văn bản toàn quốc hay phạm vi cấp Tỉnh/Huyện. | Các văn bản địa phương tỉnh X được gán mã phạm vi chuẩn xác. | ✅ **GO** | Ngăn chặn áp dụng nhầm quy định địa phương. |
| `related procedure mapped` | Ánh xạ vào đúng mã thủ tục `TTHC-LAND-01` &rarr; `05`. | Đã ánh xạ chính xác theo phạm vi điều chỉnh nghiệp vụ. | ✅ **GO** | Phục vụ truy xuất trong module One-Stop Shop. |
| `reviewer approved` | Cán bộ nghiệp vụ phụ trách đã ký duyệt xác nhận (`Reviewed / Approved`). | Hiện tại mới có 1/5 bản ghi đạt `Approved`; 3 bản ghi đang `Pending Review`, 1 bị `Rejected`. | 🛑 **NO-GO** | Bắt buộc phải có 100% bản ghi đạt `Approved` trong lô nạp. |
| `manager/approver approved` | Lãnh đạo Vụ/Phòng Pháp chế ký duyệt văn bản cho phép import. | Chưa có biên bản phê duyệt chính thức cho toàn bộ tập dữ liệu thật. | 🛑 **NO-GO** | Quyết định nạp dữ liệu thật phải có chữ ký Lãnh đạo. |
| `backup plan ready` | Kế hoạch và quy trình sao lưu DB (`pg_dump`) sẵn sàng thực hiện. | Quy trình đã được kiểm chứng thành công trong Phase 11L (~951 KB backup). | ✅ **GO** | Sẵn sàng tạo backup ngay trước thời điểm bấm Execute. |
| `import tool ready` | Công cụ Import UI và Backend API đạt 150/150 tests PASS, 4/4 health checks PASS. | Hệ thống ổn định, tường lửa 8 lớp hoạt động nhạy bén 100%. | ✅ **GO** | Công cụ kỹ thuật đã hoàn toàn chín muồi cho rà soát. |
| `no auto-active confirmed` | Xác nhận cờ `noAutoActive: true` được bảo đảm trên toàn hệ thống. | API trả về cờ `noAutoActive: true`; DB giữ nguyên trạng thái `ACTIVE` hiện hữu. | ✅ **GO** | Ngăn ngừa rủi ro thay thế văn bản pháp luật trái quy trình. |
| `rollback plan ready` | Kịch bản hoàn tác về `LAND_KB_V1_2026` sẵn sàng kích hoạt nếu xảy ra sự cố. | Playbook khôi phục từ tệp `.sql` dump đã sẵn sàng. | ✅ **GO** | Đảm bảo khả năng phục hồi tức thì trong vòng 5 phút. |
| `audit trail limitation understood` | Nhận thức rõ hiện tại API chặn ghi thực tế (`EXECUTE_BLOCKED_SCHEMA_SUPPORT_REQUIRED`) cho tới khi có staging table. | Cán bộ và Lãnh đạo đã thấu hiểu cơ chế phòng thủ chủ động của hệ thống. | ✅ **GO** | Đảm bảo không ghi nhầm vào DB khi chưa có bảng staging. |

## 4. Decision Options

Hội đồng Quản trị Kỹ thuật và Phụ trách Dự án xem xét 4 phương án quyết định:
- **`GO TO CONTROLLED REAL DATA IMPORT`**: Cho phép nạp ngay bộ dữ liệu thật vào hệ thống do đã qua thẩm định 100% hoàn chỉnh.
- **`GO WITH CONDITIONS`**: Cho phép nạp bộ dữ liệu thật với các điều kiện kèm theo (chỉ nạp các lô nhỏ đã được duyệt `Approved`, loại bỏ văn bản hết hiệu lực).
- **`NO-GO UNTIL DATASET APPROVED`**: Tạm dừng chuyển sang phase nạp thực tế; tiếp tục rà soát, làm sạch và thẩm định cho đến khi bộ dữ liệu thật được phê duyệt hoàn tất bởi Lãnh đạo Vụ/Phòng Pháp chế.
- **`NO-GO`**: Từ chối nạp vĩnh viễn do chất lượng dữ liệu hoặc kiến trúc hệ thống không đạt tiêu chuẩn an toàn.

## 5. Recommended Decision

Căn cứ tình trạng thực tế của danh mục nguồn (`Source Register REG-2024-001` &rarr; `005`) với tỷ lệ bản ghi đạt `Approved` mới ở mức 1/5 và sự tồn tại của văn bản quy hoạch đã hết kỳ hạn, Hội đồng Quản trị Kỹ thuật Đề xuất Quyết định:

### `NO-GO UNTIL DATASET APPROVED`
*(TẠM DỪNG NẠP DỮ LIỆU THẬT CHO ĐẾN KHI BỘ DỮ LIỆU PHÁP LÝ THẬT ĐƯỢC THẨM ĐỊNH VÀ PHÊ DUYỆT HOÀN TẤT)*

**Lý do ra quyết định NO-GO:**
1. **Dữ liệu thật chưa qua thẩm định trọn vẹn:** Việc nạp một tập dữ liệu pháp lý chỉ mới có 20% bản ghi được phê duyệt (`Approved`) và còn chứa bản ghi quy hoạch đã hết hạn áp dụng kịch bản năm 2024 (`REG-2024-004`) tiềm ẩn rủi ro nghiêm trọng làm bẩn cơ sở dữ liệu và gây nhầm lẫn trong thẩm định hồ sơ TTHC thực tế.
2. **Tuân thủ kỷ luật quản trị AI và Pháp lý:** Quyết định `NO-GO` thể hiện sự vững vàng trong quản trị rủi ro, khẳng định nguyên tắc *“thà chậm mà chắc”*, bảo đảm chỉ những tri thức pháp lý đã được con người rà soát 100% mới được đưa vào hệ thống.

## 6. Conditions Before Any Real Import

Để có thể chuyển đổi quyết định từ `NO-GO` sang `GO TO CONTROLLED REAL DATA IMPORT` tại các giai đoạn tiếp theo, 9 điều kiện tiên quyết sau bắt buộc phải được hoàn thiện đầy đủ:

| Condition | Required Evidence | Owner | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **1. backup ngay trước import** | Tệp sao lưu `.sql` mới nhất sinh ra từ `pg_dump` ngay trước giờ thực thi và lưu an toàn ngoài Git. | Ops Team (`ADMIN`) | ⏳ **PENDING** | Thực hiện trước khi bấm Execute. |
| **2. dữ liệu thật đã approved** | Biên bản phê duyệt 100% bản ghi trong lô dữ liệu thật đạt `Approval Status: Approved` từ Lãnh đạo Vụ Pháp chế. | Legal Lead (`MANAGER`) | ⏳ **PENDING** | Chế tài bắt buộc số 1 để mở khóa GO. |
| **3. import batch đã review** | Kết quả chạy `Validate CSV - Dry Run` trên lô dữ liệu thật trả về `0 rejected`, `0 errors`. | Specialist (`STAFF`) | ⏳ **PENDING** | Rà soát trên UI trước khi nạp. |
| **4. execute confirmation text** | Người nhập liệu gõ chính xác chuỗi `"I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION"` trên giao diện. | Specialist (`STAFF`) | ⏳ **PENDING** | Xác nhận tường minh nguyên tắc quản trị. |
| **5. reason** | Nhập lý do nạp rõ ràng, có ghi kèm số công văn hoặc quyết định phê duyệt lô dữ liệu của cơ quan thẩm quyền. | Specialist (`STAFF`) | ⏳ **PENDING** | Lưu vết kiểm toán minh bạch. |
| **6. no auto-active** | Xác nhận cờ `noAutoActive: true` được thi hành tuyệt đối, không làm biến đổi các văn bản đang áp dụng. | Backend Service | ⏳ **PENDING** | Bảo vệ tính ổn định của DB. |
| **7. active version approval riêng** | Phiếu phê duyệt kích hoạt phiên bản qua module `Version Governance UI` (`Phase 8F-E`) trong một quy trình 3 bước độc lập. | Project Owner (`ADMIN`/`MANAGER`) | ⏳ **PENDING** | Thực hiện sau khi nạp và kiểm tra dữ liệu trong DB. |
| **8. rollback plan** | Kịch bản hoàn tác nhanh (`Disaster Recovery Playbook`) cùng đội ngũ trực chiến sẵn sàng khôi phục DB trong 5 phút. | Ops Team + Legal Team | ⏳ **PENDING** | Sẵn sàng khôi phục nếu phát sinh lỗi nghiêm trọng. |
| **9. post-import verification** | Kiểm tra đối chiếu số bản ghi đã nạp, số bản ghi bỏ qua và tình trạng hiển thị chính xác trên tra cứu tri thức. | Legal Lead + Ops Team | ⏳ **PENDING** | Nghiệm thu lô dữ liệu sau nạp. |

## 7. Next Recommended Phase

Căn cứ vào quyết định **`NO-GO UNTIL DATASET APPROVED`**, giai đoạn tiếp theo được khuyến nghị triển khai là:

### `Phase 11N: Real Legal Dataset Cleanup & Approval`
*(Rà soát, Làm sạch, Cập nhật metadata và Thẩm định Phê duyệt toàn diện Bộ dữ liệu Tri thức Pháp lý thật trước khi đề xuất xem xét lại quyết định Import Go/No-Go).*
