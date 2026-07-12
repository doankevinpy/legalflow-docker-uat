# LEGALFLOW V2 - PHASE 11O
# IMPORT EXECUTION GO / NO-GO

## 1. Purpose

Tài liệu này ghi nhận Quyết định chính thức trước thời điểm thực thi nạp (`Import Execution Go / No-Go Decision`) của Lãnh đạo dự án và Hội đồng Quản trị Kỹ thuật LegalFlow V2 về việc có cho phép chuyển lô dữ liệu tri thức pháp lý đã phê duyệt sang giai đoạn thực thi nạp có kiểm soát (`Phase 11P: Controlled Real Legal Dataset Import Execution`) hay không.  
Quyết định được tổng hợp từ ma trận rà soát độ sẵn sàng tại Phase 11O, bảo đảm hệ thống tuân thủ nghiêm ngặt nguyên tắc tách biệt hành động: Phase 11O chỉ làm nhiệm vụ chuẩn bị và đóng băng danh sách lô dữ liệu, trong khi việc bấm nút thực thi nạp kỹ thuật phải được vận hành tại một giai đoạn độc lập tiếp theo (`Phase 11P`) dưới sự kiểm soát của tường lửa 4 lớp.

## 2. Decision Context

Chuỗi lộ trình chuẩn bị cho tính năng quản trị và nạp tri thức pháp lý của LegalFlow V2 đã tiến đến giai đoạn rà soát chốt chặn cuối cùng trước khi nạp dữ liệu thật:
- **Phase 11M (`Real Legal Dataset Review & Go/No-Go`):** Đã tiếp nhận và rà soát bộ dữ liệu pháp lý thật ban đầu (`REG-2024-001` &rarr; `005`), phát hiện tình trạng chưa hoàn thiện metadata và văn bản quy hoạch hết thời kỳ, ra quyết định chốt chặn: **`NO-GO UNTIL DATASET APPROVED`**.
- **Phase 11N (`Real Legal Dataset Cleanup & Approval`):** Đã thiết lập Khung làm sạch và phê duyệt toàn diện (`RACI Matrix`, 12-step workflow, Sổ theo dõi khiếm khuyết); bóc tách thành công văn bản quy hoạch hết hạn năm 2024 (`REG-2024-004`) và làm sạch, ký duyệt thành công Lô dữ liệu ứng viên đầu tiên (`BATCH-2024-001` chứa bản ghi SOP `REG-2024-005` đạt `Approved` 100%).
- **Phase 11O (Hiện tại - `Approved Legal Dataset Batch Preparation`):** Là giai đoạn chuẩn bị kỹ thuật và rà soát đối chiếu (`Batch Preparation Checkpoint`). Tại phase này, hệ thống thực hiện kiểm tra độ đầy đủ của 29 cột metadata, đối chiếu nguồn công báo, xác nhận chữ ký của Lãnh đạo, lập Bảng rà soát độ sẵn sàng 20/20 tiêu chí (`Pre-import Readiness Checklist`) và ra quyết định Go/No-Go.  
- **Tuân thủ nguyên tắc độc lập (`Separation of Phase Execution`):** Khẳng định tuyệt đối **KHÔNG THỰC HIỆN IMPORT THẬT** trong Phase 11O. Mọi hành động nạp dữ liệu vào cơ sở dữ liệu production bắt buộc phải được chuyển sang Phase 11P riêng biệt.

## 3. Go / No-Go Matrix

| Requirement | Required Evidence | Actual Status | Decision: GO / WARNING / NO-GO | Notes |
| :--- | :--- | :--- | :---: | :--- |
| `approved batch exists` | Có bản tuyên bố manifest lô dữ liệu hợp lệ (`Approved Import Batch Manifest`) kèm chữ ký của Lãnh đạo Vụ. | Đã đóng băng manifest cho lô ứng viên mẫu số 01 (`BATCH-2024-001` gồm bản ghi `REG-2024-005`). | ✅ **GO** (cho lô 01) / ⚠️ **WARNING** (cho tổng thể) | Lô 01 đã đủ điều kiện; các văn bản luật trung ương và địa phương khác đang tiếp tục làm sạch trong backlog. |
| `metadata complete` | Đầy đủ 29 cột thông tin siêu dữ liệu chuẩn hóa, không có trường bắt buộc nào để `null` hay rỗng. | Bản ghi trong lô `BATCH-2024-001` đạt 100% đủ cột metadata; đã rà soát qua API rà soát. | ✅ **GO** | Khẳng định độ sạch của nguyên liệu dữ liệu trước khi nạp. |
| `reviewer approved` | Cán bộ rà soát nghiệp vụ ký xác nhận `Reviewed / Cleaned` trên từng bản ghi trong lô. | Cán bộ chuyên trách (`SOP Officer D`) đã ký xác nhận hợp lệ trên bản ghi `REG-2024-005`. | ✅ **GO** | Rõ ràng trách nhiệm cá nhân trong quá trình chuẩn hóa. |
| `approver approved` | Lãnh đạo Vụ/Phòng Pháp chế ký xác nhận `Approval Status: Approved` trên phiếu thẩm định lô nạp. | Lãnh đạo Vụ Pháp chế đã ký phê duyệt lô mẫu số 01; chưa có chữ ký cho toàn bộ tập dữ liệu thật 5 văn bản. | ✅ **GO** (cho lô 01) / 🛑 **NO-GO** (cho lô nạp toàn bộ) | Chỉ được phép thực thi nạp trên các bản ghi đã có chữ ký Lãnh đạo Vụ. |
| `backup plan ready` | Kịch bản sao lưu (`pg_dump`) và công cụ kiểm tra kích thước backup sẵn sàng chạy ngay trước giờ nạp. | Playbook sao lưu `.sql` đã kiểm chứng tại Phase 11L (~951 KB); sẵn sàng kích hoạt trước khi bấm Execute. | ✅ **GO** | Chốt chặn an toàn số 1 bảo vệ toàn vẹn DB production. |
| `rollback plan ready` | Kịch bản khôi phục (`DR Playbook`) và đội ngũ trực chiến sẵn sàng khôi phục DB về trạng thái cũ trong 5 phút. | Kịch bản khôi phục từ tệp `.sql` dump đã sẵn sàng; đội ngũ kỹ thuật trực vận hành đã được phân công. | ✅ **GO** | Khả năng phản ứng khẩn cấp nếu xảy ra sự cố không mong muốn. |
| `import tool ready` | Công cụ Backend API (`validate` & `execute`) đạt 150/150 tests PASS, hoạt động nhạy bén. | API hoạt động ổn định 100%; tường lửa chặn thực thi thiếu rào chắn hoạt động chuẩn xác. | ✅ **GO** | Khẳng định độ chín muồi và tin cậy của phần mềm. |
| `UI ready` | Giao diện `LegalKnowledgeImportTab.tsx` trực quan, tích hợp RBAC và hiển thị đầy đủ cảnh báo. | Giao diện đã phát hành Release Candidate (`Phase 11K`), tự động khóa nút Execute khi có lỗi CSV. | ✅ **GO** | Trải nghiệm người dùng an toàn và tuân thủ nguyên tắc quản trị. |
| `validation ready` | Lệnh rà soát mô phỏng `Validate CSV - Dry Run` trả về `0 rejected`, `0 errors`, `dryRun: true`. | Đã chạy rà soát thành công trên tệp dữ liệu mẫu; sẵn sàng rà soát lại trên lô thật trước khi nạp. | ✅ **GO** | Đảm bảo không nạp mù văn bản có lỗi cú pháp. |
| `execute safety ready` | Tường lửa API thi hành đủ 4 rào chắn: kiểm tra `backupConfirmed`, `reason`, `confirmationText`, `!canExecute`. | API trả về lỗi chặn chuẩn xác nếu thiếu bất kỳ tham số an toàn nào. | ✅ **GO** | Rào chắn bảo vệ DB phòng ngừa tai nạn thao tác. |
| `no auto-active` | Xác nhận cờ `noAutoActive: true` được thi hành tuyệt đối, không làm biến đổi các luật đang thi hành. | API trả về `noAutoActive: true`; DB bảo toàn nguyên trạng thái `ACTIVE` hiện hữu của hệ thống. | ✅ **GO** | Ngăn ngừa rủi ro tự động thay thế luật trái thẩm quyền. |
| `active version separate` | Quy trình kích hoạt phiên bản (`Active Version`) được tách biệt thành luồng 3 bước độc lập tại UI riêng. | Module `Version Governance UI` (`Phase 8F-E`) sẵn sàng tiếp nhận xử lý sau khi nạp thành công. | ✅ **GO** | Chốt chặn an toàn quản trị cao nhất đối với tri thức pháp lý. |

## 4. Decision Options

Hội đồng Quản trị Kỹ thuật và Lãnh đạo Dự án xem xét 4 phương án quyết định:
- **`GO TO CONTROLLED IMPORT EXECUTION`**: Cho phép nạp ngay toàn bộ bộ dữ liệu pháp lý thật vào cơ sở dữ liệu do đã qua thẩm định 100% hoàn chỉnh.
- **`GO WITH CONDITIONS`**: Cho phép chuyển sang phase thực thi nạp nhưng kèm theo các điều kiện giới hạn (chỉ được phép nạp lô nhỏ đã được duyệt `Approved`, bắt buộc thực thi đầy đủ 4 rào chắn kỹ thuật).
- **`NO-GO UNTIL APPROVED BATCH READY`**: Tạm dừng chuyển sang phase nạp thực tế; tiếp tục làm sạch, hoàn thiện thông tin siêu dữ liệu và thẩm định cho đến khi có một lô dữ liệu thật được Lãnh đạo phê duyệt hoàn tất.
- **`NO-GO`**: Từ chối nạp vĩnh viễn do chất lượng dữ liệu hoặc kiến trúc hệ thống không đạt tiêu chuẩn an toàn.

## 5. Recommended Decision

Căn cứ vào tình trạng thực tế của bộ dữ liệu pháp lý thật (toàn bộ danh mục 5 văn bản gốc ban đầu chưa được phê duyệt 100% để nạp hàng loạt, tuy nhiên hệ thống đã bóc tách và làm sạch thành công Lô dữ liệu mẫu số 01 `BATCH-2024-001` gồm bản ghi SOP `REG-2024-005` đạt chuẩn `Approved` 100%), Hội đồng Quản trị Kỹ thuật Đề xuất Quyết định:

### `NO-GO UNTIL APPROVED BATCH READY`
*(TẠM DỪNG NẠP HÀNG LOẠT TOÀN BỘ BỘ DỮ LIỆU THẬT CHO ĐẾN KHI DANH MỤC TRONG BACKLOG ĐƯỢC LÃNH ĐẠO PHÊ DUYỆT HOÀN TẤT)*

*(Lưu ý khuyến nghị thực thi phạm vi hẹp cho lô đã duyệt: Riêng đối với lô ứng viên mẫu số 01 (`BATCH-2024-001` chứa duy nhất bản ghi SOP `REG-2024-005`), do đã có Bản tuyên bố lô dữ liệu (`Approved Import Batch Manifest`) và Lời cam kết phê duyệt của Lãnh đạo Vụ Pháp chế, Hội đồng đề xuất mức quyết định mở khóa riêng cho lô này là: **`GO WITH CONDITIONS`** - Cho phép chuyển lô `BATCH-2024-001` sang Phase 11P để thực thi nạp có kiểm soát, với điều kiện tuân thủ nghiêm ngặt 8 điều kiện chốt chặn kỹ thuật dưới đây).*

## 6. Conditions Before Phase 11P

Để có thể tiến hành thực thi nạp có kiểm soát đối với bất kỳ lô dữ liệu nào (bao gồm lô `BATCH-2024-001`) tại **Phase 11P**, 8 điều kiện tiên quyết sau bắt buộc phải được hoàn thiện đầy đủ và xác nhận trước khi bấm nút Execute:

| Condition | Required Evidence | Owner | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **1. backup immediately before import** | Chạy lệnh `pg_dump` sinh tệp `.sql` mới nhất ngay trước giờ thực thi và lưu an toàn ngoài Git. | Ops Team (`ADMIN`) | ⏳ **PENDING** | Thực hiện ngay trước thời điểm bấm Execute tại Phase 11P. |
| **2. final batch file locked** | Tệp CSV/JSON của lô nạp (`BATCH-2024-001`) được niêm phong mã băm (`MD5/SHA256`), không ai được sửa chữa. | Technical Operator (`OPERATOR`) | ⏳ **PENDING** | Bảo đảm tính toàn vẹn tuyệt đối của tệp dữ liệu đầu vào. |
| **3. reason prepared** | Chuẩn bị sẵn nội dung lý do nạp rõ ràng, ghi rõ số công văn/quyết định phê duyệt của Lãnh đạo Vụ Pháp chế. | Specialist A (`STAFF`) | ⏳ **PENDING** | Nhập vào trường `Reason` để lưu vết kiểm toán minh bạch. |
| **4. confirmation text prepared** | Chuẩn bị chuỗi từ khóa xác nhận an toàn chính xác: `"I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION"`. | Specialist A (`STAFF`) | ⏳ **PENDING** | Nhập vào trường `Confirmation Text` trên giao diện UI. |
| **5. importer role confirmed** | Tài khoản thực hiện thao tác nạp phải có quyền hạn hợp lệ (`MANAGER` hoặc `ADMIN`), không dùng tài khoản thường. | ADMIN (`ADMIN`) | ⏳ **PENDING** | Kiểm soát phân quyền RBAC chặt chẽ. |
| **6. post-import verification checklist ready** | Chuẩn bị sẵn checklist nghiệm thu sau nạp (đối chiếu `totalRecords`, xác nhận cờ `noAutoActive: true`). | Ops Team + Legal Lead | ⏳ **PENDING** | Kiểm toán nhanh trong vòng 15 phút sau khi lệnh chạy xong. |
| **7. active version approval separate** | Khẳng định việc kích hoạt phiên bản (`Active Version`) sẽ được thực hiện qua luồng 3 bước riêng tại module Version UI. | Project Owner (`ADMIN`/`MANAGER`) | ⏳ **PENDING** | Không được kích hoạt ngay sau nạp. |
| **8. rollback plan approved** | Lãnh đạo Kỹ thuật xác nhận Kịch bản khôi phục khẩn cấp (`DR Playbook`) sẵn sàng chạy nếu phát sinh lỗi. | Ops Team (`ADMIN`) | ⏳ **PENDING** | Đảm bảo khả năng phục hồi hệ thống về trạng thái cũ trong 5 phút. |

## 7. Next Recommended Phase

Căn cứ vào quyết định chốt chặn toàn cục **`NO-GO UNTIL APPROVED BATCH READY`** đối với tổng thể bộ dữ liệu thật, đồng thời mở khóa thực thi **`GO WITH CONDITIONS`** đối với lô dữ liệu đã được duyệt mẫu số 01 (`BATCH-2024-001`), lộ trình tiếp theo được khuyến nghị triển khai linh hoạt theo 2 hướng:

- **Hướng 1 (Thực thi Pilot trên Lô đã duyệt 01):**  
  ### `Phase 11P: Controlled Real Legal Dataset Import Execution`
  *(Thực thi nạp có kiểm soát chính thức cho lô `BATCH-2024-001` vào cơ sở dữ liệu `legalflow_prod` theo quy trình 4 lớp rào chắn: Sao lưu DB pre-import, Xác nhận từ khóa `Confirmation Text`, Nhập lý do `Reason` và Nghiệm thu sau nạp bảo đảm `noAutoActive: true`).*

- **Hướng 2 (Tiếp tục rà soát cho Tổng thể Bộ dữ liệu thật):**  
  ### `Phase 11P: Approved Dataset Completion & Re-review`
  *(Tiếp tục làm sạch, hoàn thiện metadata và thẩm định phê duyệt đối với các văn bản luật trung ương và địa phương đang tồn đọng trong Sổ làm sạch `Dataset Cleanup Register` Phase 11N trước khi lập các lô nạp tiếp theo `BATCH-2024-002`, `003`).*
