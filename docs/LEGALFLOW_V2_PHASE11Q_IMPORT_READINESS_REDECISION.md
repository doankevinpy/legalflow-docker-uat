# LEGALFLOW V2 - PHASE 11Q
# IMPORT READINESS RE-DECISION

## 1. Purpose

Tài liệu này ghi nhận Quyết định lại độ sẵn sàng trước nạp (`Import Readiness Re-decision`) của Lãnh đạo dự án, Hội đồng Quản trị Kỹ thuật và Lãnh đạo Vụ Pháp chế tại Phase 11Q sau khi thực hiện vòng theo dõi xử lý khiếm khuyết (`Issue Resolution`) và giải quyết các khoảng trống phê duyệt (`Approval Gap Follow-up`) từ Phase 11P.  
Quyết định lại đóng vai trò là "Chốt chặn xác nhận chặng cuối cùng" (`Ultimate Clearance Gateway`), rà soát sự tiến bộ thực tế giữa tình trạng trước đây (`Previous Status`) và tình trạng hiện tại (`Current Status`), qua đó tái khẳng định quyết định Go/No-Go trước khi chính thức chuyển sang giai đoạn thực thi nạp có kiểm soát (`Phase 11R: Controlled Real Legal Dataset Import Execution`).

## 2. Decision Context

Chuỗi lộ trình chuẩn bị và thẩm định cho tính năng quản trị nạp tri thức pháp lý của LegalFlow V2 đã trải qua 5 chặng kiểm soát kiên cố trước khi ra quyết định lại:
- **Phase 11M (`Real Legal Dataset Review & Go/No-Go`):** Đã tiếp nhận và rà soát bộ dữ liệu pháp lý thật ban đầu (`REG-2024-001` &rarr; `005`), phát hiện tình trạng chưa hoàn thiện metadata và văn bản quy hoạch hết kỳ hạn, ra quyết định chốt chặn: **`NO-GO UNTIL DATASET APPROVED`**.
- **Phase 11N (`Real Legal Dataset Cleanup & Approval`):** Đã thiết lập Khung làm sạch và phê duyệt toàn diện (`RACI Matrix`, 12-step workflow, Sổ theo dõi khiếm khuyết); bóc tách thành công văn bản quy hoạch hết hạn năm 2024 (`REG-2024-004`) và làm sạch, ký duyệt thành công Lô dữ liệu ứng viên đầu tiên (`BATCH-2024-001` chứa bản ghi SOP `REG-2024-005` đạt `Approved` 100%).
- **Phase 11O (`Approved Legal Dataset Batch Preparation`):** Đã rà soát và đóng gói Bảng tuyên bố lô dữ liệu (`Approved Import Batch Manifest`), lập Bảng kiểm tra độ sẵn sàng 20/20 tiêu chí và ra quyết định chốt chặn: **`NO-GO UNTIL APPROVED BATCH READY`** (đồng thời mở khóa pilot **`GO WITH CONDITIONS`** cho lô `BATCH-2024-001`).
- **Phase 11P (`Approved Dataset Completion & Re-review`):** Đã rà soát lại chuyên sâu từng bản ghi, lập Nhật ký xử lý khiếm khuyết (`Issue Resolution Log`) và đánh giá chốt chặn, tái khẳng định quyết định toàn cục **`NO-GO UNTIL ISSUES RESOLVED`** đối với tổng thể 5 văn bản gốc ban đầu (trong khi giữ nguyên quyết định mở khóa **`GO WITH CONDITIONS`** cho lô đã duyệt `BATCH-2024-001`).
- **Phase 11Q (Hiện tại - `Dataset Issue Resolution & Approval Follow-up`):** Là vòng theo dõi xử lý khuyết điểm và hoàn tất chữ ký Lãnh đạo (`Issue Follow-up Checkpoint`). Tại phase này, hệ thống kiểm toán sự chuyển dịch của các khoảng trống phê duyệt (`GAP-2024-01` &rarr; `05`), rà soát lại ma trận 11 yêu cầu kỹ thuật/pháp lý và ra Quyết định lại chốt chặn (`Re-decision`).  
- **Tuân thủ nguyên tắc tách biệt hành động (`No Import Execution in Phase 11Q`):** Khẳng định tuyệt đối **KHÔNG THỰC HIỆN IMPORT THẬT** trong Phase 11Q. Mọi thao tác nạp dữ liệu vào DB production bắt buộc phải được chuyển sang Phase 11R độc lập tiếp theo dưới sự kiểm soát của tường lửa 4 lớp.

## 3. Re-decision Matrix

| Requirement | Previous Status (Phase 11P) | Current Status (Phase 11Q) | Decision: GO / WARNING / NO-GO | Notes |
| :--- | :--- | :--- | :---: | :--- |
| `approved batch exists` | Đã có manifest cho Lô mẫu số 01 (`BATCH-2024-001` gồm `REG-2024-005`). | Lô mẫu số 01 giữ vững trạng thái `Approved Manifest Ready`; 4 văn bản khác tiếp tục theo dõi trong backlog. | ✅ **GO** (cho lô 01) / ⚠️ **WARNING** (cho tổng thể) | Lô 01 đã sẵn sàng; tổng thể tập dữ liệu 5 văn bản vẫn cần tiếp tục rà soát. |
| `Critical/High issues resolved` | Lô 01 sạch lỗi; các văn bản luật khác còn tồn đọng lỗi High/Medium (`ISS-2024-01..03`). | Lô 01 duy trì `0 Critical/High issues`; lỗi quy hoạch hết kỳ hạn (`REG-2024-004`) đã bị bóc tách (`Resolved/Rejected`). | ✅ **GO** | Lô ứng viên đạt chuẩn sạch hoàn toàn lỗi chặn nạp. |
| `metadata complete` | Bản ghi `REG-2024-005` đạt 100% đủ cột metadata. | Cả 4/4 bản ghi ứng viên (trừ văn bản bị loại) đều đã được điền đủ 29 cột metadata; kiểm chứng API `Validate CSV` PASS. | ✅ **GO** | Nguyên liệu dữ liệu đạt độ tinh khôi và độ sạch tối đa. |
| `legal status checked` | 100% bản ghi trong lô ứng viên 01 là `Effective`. | 100% bản ghi ứng viên duy trì cờ `Effective`; không có văn bản nào để trạng thái `Unknown` hay `Expired`. | ✅ **GO** | Chốt chặn pháp lý quan trọng nhất bảo đảm không nạp luật hết hạn. |
| `local scope checked` | Ghi nhận chuẩn mã `Province X` cho SOP cấp tỉnh Lô 01. | Bản ghi SOP Lô 01 khớp luồng Một cửa `Province X`; Quyết định hạn mức (`REG-2024-003`) đã được Sở TNMT đồng thuận mã địa bàn. | ✅ **GO** | Ngăn ngừa rủi ro áp dụng chéo địa bàn hoặc mập mờ ranh giới áp dụng. |
| `reviewer approved` | Cán bộ chuyên trách (`SOP Officer D`) đã ký xác nhận hợp lệ. | 100% các bản ghi trong danh sách theo dõi đều đã có chữ ký xác nhận thẩm định kỹ thuật `Reviewed / Cleaned` của Reviewer. | ✅ **GO** | Rõ ràng trách nhiệm cá nhân trong quá trình chuẩn hóa và làm sạch. |
| `approver approved` | Lãnh đạo Vụ Pháp chế đã ký phê duyệt Lô 01; chưa ký cho tổng thể 5 văn bản luật. | Lô 01 (`BATCH-2024-001`) giữ vững trạng thái `Approved` 100%; Lãnh đạo Vụ đang rà soát tiếp các nghị định thi hành trong backlog. | ✅ **GO** (cho lô 01) / 🛑 **NO-GO** (cho lô nạp toàn bộ) | Chỉ cho phép thực thi nạp trên các bản ghi đã có chữ ký Lãnh đạo Vụ. |
| `backup plan ready` | Playbook sao lưu `.sql` đã kiểm chứng tại Phase 11L (~951 KB); sẵn sàng. | Playbook sao lưu `pg_dump` trực chiến; sẵn sàng kích hoạt trước giờ G tại Phase 11R. | ✅ **GO** | Chốt chặn an toàn số 1 bảo vệ toàn vẹn DB production. |
| `rollback plan ready` | Kịch bản khôi phục (`DR Playbook`) sẵn sàng khôi phục DB trong 5 phút. | Kịch bản khôi phục từ tệp `.sql` dump sẵn sàng; đội ngũ kỹ thuật trực vận hành đã được phân công trực chiến. | ✅ **GO** | Đảm bảo khả năng phản ứng thần tốc nếu phát sinh sự cố bất ngờ. |
| `import tool ready` | API Backend (`validate` & `execute`) đạt 150/150 tests PASS, tường lửa nhạy bén. | API hoạt động ổn định 100%; tường lửa chặn thực thi thiếu rào chắn (thiếu backup, thiếu lý do, sai câu lệnh) hoạt động chuẩn xác. | ✅ **GO** | Khẳng định độ chín muồi và độ tin cậy tuyệt đối của phần mềm. |
| `no auto-active confirmed` | API trả về cờ `noAutoActive: true`; DB bảo toàn nguyên trạng thái `ACTIVE`. | Cờ `noAutoActive: true` được bảo đảm; quy trình kích hoạt version được tách biệt thành luồng 3 bước riêng tại Version UI. | ✅ **GO** | Ngăn chặn tuyệt đối việc tự động kích hoạt phiên bản trái phép. |

## 4. Decision Options

Hội đồng Quản trị Kỹ thuật và Lãnh đạo Dự án xem xét 4 phương án quyết định lại (`Re-decision Options`):
- **`GO TO CONTROLLED REAL IMPORT`**: Cho phép nạp ngay toàn bộ bộ dữ liệu pháp lý thật vào cơ sở dữ liệu do đã khắc phục xong 100% khiếm khuyết và có chữ ký Lãnh đạo.
- **`GO WITH CONDITIONS`**: Cho phép chuyển sang phase thực thi nạp nhưng kèm theo các điều kiện giới hạn (chỉ được phép nạp lô nhỏ đã được duyệt `Approved`, bắt buộc thực thi đầy đủ 4 rào chắn kỹ thuật).
- **`CONTINUE ISSUE RESOLUTION`**: Tạm dừng chuyển sang phase nạp thực tế; tiếp tục làm sạch, hoàn thiện thông tin siêu dữ liệu và thẩm định cho đến khi các văn bản trong backlog được Lãnh đạo phê duyệt hoàn tất.
- **`NO-GO`**: Từ chối nạp vĩnh viễn do chất lượng dữ liệu hoặc kiến trúc hệ thống không đạt tiêu chuẩn an toàn.

## 5. Recommended Decision

Căn cứ vào kết quả đối chiếu trên ma trận quyết định lại (đối với tổng thể bộ dữ liệu 5 văn bản gốc ban đầu vẫn còn 4 văn bản đang trong backlog chờ chữ ký Lãnh đạo Vụ hoặc bị loại bỏ, tuy nhiên Lô dữ liệu ứng viên mẫu số 01 `BATCH-2024-001` chứa bản ghi SOP `REG-2024-005` đã hoàn tất 100% rà soát, sạch lỗi Critical/High và có đầy đủ chữ ký Lãnh đạo Vụ Pháp chế), Lãnh đạo Dự án và Hội đồng Thẩm định chính thức ra Quyết định Lại Chốt chặn (`Recommended Re-decision`):

- **Quyết định toàn cục cho toàn bộ bộ dữ liệu:**  
  ### `CONTINUE ISSUE RESOLUTION`
  *(TẠM DỪNG NẠP HÀNG LOẠT TOÀN BỘ BỘ DỮ LIỆU THẬT; TIẾP TỤC THEO DÕI XỬ LÝ KHUYẾT ĐIỂM VÀ THU THẬP CHỮ KÝ PHÊ DUYỆT TRONG BACKLOG)*

- **Quyết định mở khóa thực thi Pilot cho Lô đã duyệt mẫu số 01 (`BATCH-2024-001`):**  
  ### `GO WITH CONDITIONS`
  *(CHO PHÉP CHUYỂN RIÊNG LÔ `BATCH-2024-001` SANG PHASE 11R ĐỂ THỰC THI NẠP CÓ KIỂM SOÁT VÀO DB PRODUCTION KÈM ĐIỀU KIỆN TRƯỚC VÀ SAU NẠP)*

## 6. Next Recommended Phase

Căn cứ quyết định lại toàn cục **`CONTINUE ISSUE RESOLUTION`** đối với tổng thể bộ dữ liệu thật, đồng thời mở khóa pilot **`GO WITH CONDITIONS`** đối với lô dữ liệu đã được duyệt mẫu số 01 (`BATCH-2024-001`), lộ trình tiếp theo được khuyến nghị triển khai linh hoạt theo 2 hướng song song:

- **Hướng 1 (Thực thi Pilot trên Lô đã duyệt 01):**  
  ### `Phase 11R: Controlled Real Legal Dataset Import Execution`
  *(Thực thi nạp có kiểm soát chính thức cho lô `BATCH-2024-001` vào cơ sở dữ liệu `legalflow_prod` theo quy trình 4 lớp rào chắn: Sao lưu DB pre-import, Xác nhận từ khóa `Confirmation Text`, Nhập lý do `Reason` và Nghiệm thu sau nạp bảo đảm `noAutoActive: true`).*

- **Hướng 2 (Tiếp tục rà soát thẩm định cho Tổng thể Bộ dữ liệu - Vòng 2):**  
  ### `Phase 11R: Dataset Approval Follow-up Round 2`
  *(Tiếp tục theo dõi, hoàn thiện hồ sơ trình ký Lãnh đạo Vụ Pháp chế đối với các khoảng trống thẩm quyền `GAP-2024-01..03` thuộc danh mục Luật Đất đai 2024 và các nghị định/quyết định địa phương trong backlog trước khi lập các lô nạp tiếp theo `BATCH-2024-002`, `003`).*
