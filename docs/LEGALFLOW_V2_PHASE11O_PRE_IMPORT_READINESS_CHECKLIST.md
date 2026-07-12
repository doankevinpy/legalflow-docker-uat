# LEGALFLOW V2 - PHASE 11O
# PRE-IMPORT READINESS CHECKLIST

## 1. Purpose

Tài liệu này là Bảng rà soát độ sẵn sàng trước nạp (`Pre-import Readiness Checklist`) được thiết lập tại Phase 11O nhằm thẩm định toàn diện các điều kiện nghiệp vụ, dữ liệu và kỹ thuật trước khi cho phép chuyển một lô dữ liệu tri thức pháp lý đã phê duyệt vào giai đoạn thực thi nạp chính thức (`Controlled Import Execution`).  
Checklist đóng vai trò như một bộ rào chắn an toàn kép (`Double Safety Barrier`), kết hợp giữa kiểm tra chất lượng siêu dữ liệu nghiệp vụ và kiểm tra trạng thái sức khỏe hệ thống phần mềm, bảo đảm ngăn chặn từ sớm mọi rủi ro có thể gây lây nhiễm dữ liệu bẩn hoặc làm gián đoạn hệ thống cơ sở dữ liệu production.

## 2. Readiness Checklist

Dưới đây là bảng đối chiếu chi tiết 20 tiêu chí độ sẵn sàng nghiệp vụ và dữ liệu đối với lô ứng viên số 01 (`BATCH-2024-001` gồm bản ghi `REG-2024-005`), đồng thời kiểm chứng các điều kiện tiên quyết cho toàn bộ hệ thống:

| Check ID | Item | Required Evidence | Confirmed: Yes / No / N/A | Decision: GO / WARNING / NO-GO | Notes |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **RDY-01** | `all records have source_id` | 100% bản ghi có mã định danh nguồn gốc duy nhất, không rỗng và không trùng lặp. | `Yes` | ✅ **GO** | Ghi nhận mã `REG-2024-005` chuẩn xác cho bản ghi ứng viên trong lô `BATCH-2024-001`. |
| **RDY-02** | `document title present` | Tiêu đề văn bản đầy đủ, rõ nghĩa, viết hoa chữ cái đầu và đúng chuẩn ngữ pháp hành chính. | `Yes` | ✅ **GO** | Ghi nhận rõ: "Quy trình nội bộ giải quyết thủ tục hành chính lĩnh vực đất đai (SOP cấp mới)". |
| **RDY-03** | `document number present` | Số/ký hiệu văn bản hợp lệ, đúng cấu trúc thể thức ban hành văn bản. | `Yes` | ✅ **GO** | Ghi nhận số ký hiệu chuẩn hóa: `888/QĐ-UBND`. |
| **RDY-04** | `issuing authority present` | Cơ quan thẩm quyền ban hành rõ ràng theo phân cấp hành chính. | `Yes` | ✅ **GO** | Ghi nhận cơ quan ban hành: `UBND Tỉnh X`. |
| **RDY-05** | `effective date present` | Ngày có hiệu lực định dạng chuẩn ISO 8601 (`YYYY-MM-DD`), hợp lý về mặt thời gian. | `Yes` | ✅ **GO** | Ghi nhận mốc ngày hiệu lực: `2024-09-15`. |
| **RDY-06** | `legal status checked` | Tình trạng hiệu lực được rà soát và đối chiếu với công báo mới nhất, không để `Unknown`. | `Yes` | ✅ **GO** | Ghi nhận trạng thái `Effective`; không thuộc danh mục hết hiệu lực thi hành. |
| **RDY-07** | `amendment/replacement relation checked` | Khớp nối chính xác quan hệ sửa đổi, bổ sung, bãi bỏ hoặc thay thế với văn bản cũ. | `Yes` | ✅ **GO** | Thay thế cho SOP cũ theo Quyết định 500/QĐ-UBND của Tỉnh X. |
| **RDY-08** | `local scope checked` | Phân định rõ phạm vi áp dụng toàn quốc (`National`) hoặc mã địa bàn địa phương. | `Yes` | ✅ **GO** | Ghi nhận mã phạm vi áp dụng địa bàn: `Province X`. |
| **RDY-09** | `related procedure mapped` | Ánh xạ vào mã thủ tục hành chính trọng tâm từ `TTHC-LAND-01` đến `TTHC-LAND-05`. | `Yes` | ✅ **GO** | Ánh xạ chính xác vào chuyên đề `TTHC-LAND-01` (Đăng ký, cấp GCN lần đầu). |
| **RDY-10** | `source URL/location present` | Đường dẫn URL tới Cổng TTĐT/Công báo chính thức hợp lệ và đường dẫn tệp MinIO. | `Yes` | ✅ **GO** | Có URL tới Cổng TTĐT Sở TNMT/UBND Tỉnh X (`sotnmt.tinhx.gov.vn`). |
| **RDY-11** | `risk note present` | Có lời nhắc cảnh báo rủi ro (`risk_note`) hướng dẫn nghiệp vụ chi tiết cho cán bộ tra cứu. | `Yes` | ✅ **GO** | Ghi nhận lời nhắc rõ ràng về SLA 10 ngày làm việc và vai trò hỗ trợ tham khảo của AI. |
| **RDY-12** | `reviewer approved` | Cán bộ rà soát nghiệp vụ đã ký tên xác nhận `Reviewed / Cleaned` trên bản ghi. | `Yes` | ✅ **GO** | Đã có chữ ký xác nhận của cán bộ chuyên trách (`SOP Officer D`). |
| **RDY-13** | `manager/approver approved` | Lãnh đạo Vụ/Phòng Pháp chế ký xác nhận phê duyệt `Approval Status: Approved`. | `Yes` (cho lô 01) / `No` (cho tổng thể) | ⚠️ **WARNING** | Lô 01 (`BATCH-2024-001`) đạt 100% chữ ký Lãnh đạo; các văn bản luật khác trong backlog đang rà soát tiếp. |
| **RDY-14** | `no duplicate unresolved` | Không có sự trùng lặp số ký hiệu hay nội dung với bất kỳ văn bản nào đã nạp vào DB. | `Yes` | ✅ **GO** | Đã rà soát đối chiếu bằng bộ quét tự động của API, xác nhận không có trùng lặp. |
| **RDY-15** | `no Unknown legal status` | Khẳng định không có bản ghi nào để tình trạng hiệu lực `Unknown` hay `Unverified`. | `Yes` | ✅ **GO** | 100% bản ghi trong lô ứng viên 01 đều là `Effective`. |
| **RDY-16** | `no missing source` | Khẳng định không có bản ghi nào thiếu URL nguồn công báo chính thống hợp pháp. | `Yes` | ✅ **GO** | Toàn bộ URL dẫn về tên miền `.gov.vn` của cơ quan nhà nước. |
| **RDY-17** | `no secret/password/token` | Khẳng định 100% metadata và lời nhắc rủi ro không chứa mật khẩu, token hay PII. | `Yes` | ✅ **GO** | Quét sạch dữ liệu nhạy cảm, bảo đảm tuân thủ an toàn thông tin. |
| **RDY-18** | `backup plan ready` | Kịch bản và quy trình sao lưu cơ sở dữ liệu (`pg_dump`) sẵn sàng thực hiện trước giờ nạp. | `Yes` | ✅ **GO** | Playbook sao lưu đã được kiểm chứng (~951 KB); sẵn sàng chạy tại Phase 11P trước khi bấm Execute. |
| **RDY-19** | `rollback plan ready` | Kịch bản hoàn tác và phục hồi khẩn cấp (`DR Playbook`) sẵn sàng khôi phục DB trong 5 phút. | `Yes` | ✅ **GO** | Playbook khôi phục từ tệp `.sql` dump đã sẵn sàng trực chiến. |
| **RDY-20** | `no auto-active confirmed` & `active approval separate` | Khẳng định thi hành cờ `noAutoActive: true` sau nạp; việc kích hoạt version tách luồng riêng. | `Yes` | ✅ **GO** | DB bảo toàn nguyên trạng thái thi hành hiện tại; việc active thực hiện qua `Version Governance UI` (`Phase 8F-E`). |

## 3. Technical Readiness

Bảng dưới đây đánh giá 8 điều kiện kỹ thuật và sức khỏe hạ tầng hệ thống trước thời điểm thực thi nạp:

| Technical Item | Required Result | Status | Evidence | Notes |
| :--- | :--- | :---: | :--- | :--- |
| `backend validate API available` | Endpoint `POST /api/v1/legal-knowledge/validate-csv` sẵn sàng, hoạt động ổn định. | ✅ **PASS** | Đã kiểm chứng qua E2E RC (`Phase 11K`) và UAT sample (`Phase 11L`); trả về `dryRun: true` chính xác. | Công cụ rà soát trước nạp (`dry-run`) hoạt động 100% tin cậy. |
| `backend execute safety API available` | Endpoint `POST /api/v1/legal-knowledge/execute-csv-import` sẵn sàng, tường lửa nhạy bén. | ✅ **PASS** | Tường lửa chặn 4 ca thiếu rào chắn (thiếu backup, thiếu lý do, sai câu lệnh, có dòng lỗi) hoạt động chuẩn xác. | Bảo đảm an toàn tuyệt đối, ngăn chặn thao tác nạp sai quy trình. |
| `frontend import UI available` | Giao diện `LegalKnowledgeImportTab.tsx` trực quan, hiển thị rõ bảng kết quả và nút bấm. | ✅ **PASS** | Tích hợp RBAC, tự động khóa nút Execute khi `!canExecute` và cảnh báo quản trị AI/Pháp lý. | Giao diện thân thiện và tuân thủ nguyên tắc quản trị. |
| `E2E RC completed` | Bộ kiểm thử E2E đạt 100% PASS trên toàn bộ các ca kiểm thử hành vi UI và API. | ✅ **PASS** | Hoàn thành tại `Phase 11K` (`150/150 backend tests PASS`, `npm run build clean`). | Khẳng định chất lượng mã nguồn phát hành Release Candidate. |
| `sample UAT completed` | Kiểm thử nghiệm thu người dùng với tệp mẫu (`SAMPLE` prefix) đạt chuẩn thành công. | ✅ **PASS** | Hoàn thành tại `Phase 11L` (`UAT PASSED WITH WARNINGS`), kiểm chứng tường lửa phòng thủ DB. | Minh chứng thực tế cho khả năng bảo vệ hệ thống của công cụ. |
| `no schema change required in this phase` | Khẳng định không có bất kỳ yêu cầu sửa đổi nào đối với `schema.prisma`. | ✅ **PASS** | Cấu trúc bảng `legal_knowledge_articles` giữ nguyên 100%; không phát sinh bảng hay trường mới. | Bảo toàn tính ổn định của kiến trúc dữ liệu. |
| `migration status checked` | Trạng thái migration của cơ sở dữ liệu phải là `up to date`. | ✅ **PASS** | Lệnh `npx prisma migrate status` trả về `Database schema is up to date! 6 migrations found`. | Không có migration đang chờ xử lý hay xung đột. |
| `health-check readiness` | Hệ thống runtime hạ tầng Docker (`postgres`, `minio`, `caddy`) phải đạt `ALL SYSTEMS HEALTHY`. | ✅ **PASS** | Script `health-check.ps1` xác nhận 4/4 kiểm tra PASS; các container chạy ổn định (`LIVE/HEALTHY`). | Hạ tầng hoàn toàn sẵn sàng cho các thao tác rà soát và đóng gói. |

## 4. Stop Conditions

Nhằm thiết lập rào chắn bảo vệ tối thượng cho hệ thống, Lãnh đạo dự án và Hội đồng Kỹ thuật quy định **9 Điều kiện Dừng Khẩn cấp (`Stop Conditions`)**. Cán bộ vận hành (`Technical Operator`) và `ADMIN` **BẮT BUỘC PHẢI DỪNG NGAY LẬP TỨC (`STOP IMMEDIATELY`)** mọi nỗ lực nạp dữ liệu thật nếu phát hiện bất kỳ một trong 9 tình huống vi phạm sau:
1. **Chưa có kịch bản hoặc chưa chạy sao lưu DB (`No Backup Plan / Execution`):** Chưa chạy lệnh `pg_dump` tạo tệp `.sql` sao lưu ngay trước giờ nạp hoặc tệp backup có kích thước `0 bytes`/bị lỗi kỹ thuật.
2. **Chưa có lô dữ liệu được Lãnh đạo phê duyệt (`No Approved Batch Manifest`):** Lô dữ liệu chưa có bảng `Approved Import Batch Manifest` chính thức đi kèm chữ ký xác nhận của Lãnh đạo Vụ/Phòng Pháp chế (`Manager Approver`).
3. **Phát hiện bản ghi thiếu nguồn (`Missing Source Verification`):** Bất kỳ bản ghi nào trong lô nạp để trống URL nguồn hoặc có đường dẫn không thuộc Cổng TTĐT chính thống của cơ quan nhà nước (`.gov.vn`).
4. **Phát hiện tình trạng hiệu lực Unknown (`Unknown Legal Status Presence`):** Tồn tại bản ghi có trường `legal_status` bị để `Unknown`, `Unverified` hoặc chưa được kiểm tra đối chiếu công báo mới nhất.
5. **Phát hiện trùng lặp chưa xử lý (`Unresolved Duplicate Records`):** API kiểm tra `dry-run` cảnh báo có bản ghi trùng lặp số ký hiệu (`document_number`) hoặc trùng lặp nội dung với DB hiện hữu mà chưa được bóc tách.
6. **Phạm vi địa phương chưa rõ ràng (`Ambiguous Local Scope`):** Quyết định hoặc SOP của UBND/HĐND cấp Tỉnh/Huyện nhưng trường `local_applicability` bị để rỗng hoặc ghi sai mã địa bàn hành chính.
7. **Thiếu chữ ký xác nhận của Reviewer/Approver (`Missing Sign-off`):** Bản ghi có thông tin metadata nhưng trường `review_status` không phải là `Reviewed/Cleaned` hoặc `approval_status` không phải là `Approved`.
8. **Chưa có kịch bản hoàn tác và đội ngũ trực khôi phục (`No Rollback Plan / Team`):** Không có sẵn kịch bản khôi phục (`DR Playbook`) hoặc không có cán bộ kỹ thuật trực hệ thống sẵn sàng khôi phục DB khi xảy ra sự cố.
9. **Chưa tách luồng phê duyệt kích hoạt phiên bản (`Missing Separate Active Governance`):** Quy trình cố tình gộp bước nạp dữ liệu (`import`) với bước kích hoạt phiên bản (`ACTIVE`), vi phạm nguyên tắc quản trị 3 bước độc lập tại module Version Governance UI (`Phase 8F-E`).
