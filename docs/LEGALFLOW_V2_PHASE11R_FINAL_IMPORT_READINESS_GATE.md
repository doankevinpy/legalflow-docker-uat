# LEGALFLOW V2 - PHASE 11R
# FINAL IMPORT READINESS GATE

## 1. Purpose

Tài liệu này là Bảng rà soát Cổng độ sẵn sàng nạp chốt chặn tối hậu (`Final Import Readiness Gate`) được thiết lập tại Phase 11R như một "Quyết định chốt chặn cuối cùng" (`Ultimate Readiness Clearance`) của Lãnh đạo Vụ Pháp chế và Hội đồng Quản trị Kỹ thuật trước khi chính thức chuyển sang giai đoạn thực thi nạp dữ liệu pháp lý thật có kiểm soát (`Phase 11S: Controlled Real Legal Dataset Import Execution`).  
Cổng chốt chặn đối chiếu nghiêm ngặt 17 tiêu chí toàn diện bao trùm cả metadata, xác thực nguồn công báo, tình trạng hiệu lực, chữ ký phê duyệt và các rào chắn kỹ thuật (sao lưu DB, không tự động active). Mọi quyết định đi tiếp (`GO`) hoặc dừng lại (`NO-GO`) tại cổng này có tính chất phán quyết cao nhất đối với sự an toàn của cơ sở dữ liệu production.

## 2. Gate Criteria

Dưới đây là bảng đối chiếu 17 tiêu chí chốt chặn tại Cổng độ sẵn sàng nạp tối hậu Phase 11R, đánh giá thực trạng trên cả riêng Lô ứng viên mẫu số 01 (`BATCH-2024-001`) và tổng thể toàn bộ tập dữ liệu pháp lý thật:

| Gate Item | Required Result | Actual Result | Decision: GO / WARNING / NO-GO | Notes |
| :--- | :--- | :--- | :---: | :--- |
| `approved final batch exists` | Có tệp manifest hợp lệ cho Lô cuối cùng (`Locked Batch Manifest`) kèm chữ ký phê duyệt hợp pháp. | Đã niêm phong manifest cho Lô mẫu số 01 (`BATCH-2024-001` gồm `REG-2024-005`). | ✅ **GO** (cho lô 01) / ⚠️ **WARNING** (cho tổng thể) | Lô 01 đã sẵn sàng hoàn toàn; 4 văn bản luật khác tiếp tục theo dõi trong backlog. |
| `metadata complete` | Đầy đủ 29 cột thông tin siêu dữ liệu chuẩn hóa, không để trống trên các trường bắt buộc (`amends_document`...). | Bản ghi `REG-2024-005` đạt 100% đầy đủ metadata chuẩn xác; đã kiểm chứng qua API Validate CSV. | ✅ **GO** | Nguyên liệu dữ liệu đạt độ tinh khôi và độ sạch tối đa. |
| `source verified` | URL nguồn dẫn tới Cổng TTĐT/Công báo hợp pháp (`.gov.vn`) và có mã HTTP status 200. | 100% URL dẫn về Cổng TTĐT chính thức của UBND Tỉnh X (`sotnmt.tinhx.gov.vn`) và tệp MinIO hợp lệ. | ✅ **GO** | Khẳng định tính xác thực pháp lý, ngăn chặn nguồn trôi nổi. |
| `legal status checked` | Khẳng định tình trạng hiệu lực là `Effective`, loại bỏ tuyệt đối văn bản `Expired` hoặc `Unknown`. | 100% bản ghi trong lô ứng viên 01 đều là `Effective`; văn bản quy hoạch hết kỳ hạn (`REG-2024-004`) đã bị loại. | ✅ **GO** | Chốt chặn pháp lý quan trọng nhất bảo đảm không nạp luật hết hạn. |
| `amendment/replacement checked` | Khớp nối chính xác chuỗi quan hệ sửa đổi, bổ sung hoặc thay thế văn bản quy phạm cũ. | Bản ghi SOP ghi nhận rõ thay thế cho quy trình cũ theo Quyết định 500/QĐ-UBND của UBND Tỉnh X. | ✅ **GO** | Bảo toàn dòng chảy lịch sử pháp lý liền mạch. |
| `local scope checked` | Phân định rạch ròi phạm vi áp dụng theo cấp hành chính (`National` hoặc mã địa bàn `Province X`). | Ghi nhận chuẩn mã địa bàn `Province X` cho SOP cấp tỉnh; không ghi nhầm toàn quốc. | ✅ **GO** | Bảo đảm tính chính xác khi tra cứu phân cấp thẩm quyền Một cửa. |
| `procedure mapping complete` | Khớp nối mã thủ tục hành chính đất đai trọng tâm từ `TTHC-LAND-01` đến `TTHC-LAND-05`. | Ánh xạ chuẩn xác vào chuyên đề `TTHC-LAND-01` (Đăng ký, cấp GCN quyền sử dụng đất lần đầu). | ✅ **GO** | Tích hợp sâu sát vào module nghiệp vụ Một cửa. |
| `reviewer approved` | Cán bộ rà soát nghiệp vụ ký xác nhận chịu trách nhiệm kỹ thuật (`Reviewed / Cleaned`) trên bản ghi. | Cán bộ chuyên trách (`SOP Officer D`) đã ký xác nhận hợp lệ trên Sổ rà soát vòng 2. | ✅ **GO** | Rõ ràng trách nhiệm chuyên môn của nhân sự làm sạch. |
| `approver approved` | Lãnh đạo Vụ/Phòng Pháp chế ký xác nhận phê duyệt `Approval Status: Approved` trên phiếu lô nạp. | Lãnh đạo Vụ Pháp chế đã ký duyệt Lô mẫu số 01 (`BATCH-2024-001`); chưa ký cho toàn bộ 5 văn bản luật gốc ban đầu. | ✅ **GO** (cho lô 01) / 🛑 **NO-GO** (cho lô nạp toàn bộ) | Chỉ cho phép thực thi nạp trên các bản ghi đã có chữ ký Lãnh đạo Vụ. |
| `no Critical issue` | Khẳng định không còn bất kỳ khiếm khuyết mức `Critical` nào đang mở trên lô nạp ứng viên. | Lô 01 sạch lỗi Critical 100%; bản ghi lỗi quy hoạch hết kỳ hạn (`REG-2024-004`) đã bị loại trừ vĩnh viễn. | ✅ **GO** | Lô nạp đạt độ sạch tuyệt đối về lỗi vi phạm nghiêm trọng. |
| `no High unresolved issue` | Khẳng định không còn khiếm khuyết mức `High` (thiếu chữ ký, trùng lặp) đang mở trên lô ứng viên. | Tất cả lỗi High trên lô mẫu 01 đã được giải quyết (`Resolved`). Lỗi High của các văn bản luật khác được lập sổ riêng. | ✅ **GO** | Lô nạp hoàn toàn đạt độ sẵn sàng tối đa, không còn cản trở. |
| `backup plan ready` | Kịch bản và quy trình sao lưu cơ sở dữ liệu (`pg_dump`) sẵn sàng chạy ngay trước giờ nạp. | Playbook sao lưu `scripts/db-backup.ps1` sẵn sàng (~951 KB); sẵn sàng kích hoạt trước giờ G tại Phase 11S. | ✅ **GO** | Chốt chặn an toàn số 1 bảo vệ toàn vẹn DB production. |
| `rollback plan ready` | Kịch bản khôi phục (`DR Playbook`) và đội ngũ trực khôi phục sẵn sàng phục hồi DB trong 5 phút. | Kịch bản khôi phục từ tệp `.sql` dump đã sẵn sàng; nhân sự trực vận hành đã được phân công trực chiến. | ✅ **GO** | Đảm bảo khả năng phục hồi thần tốc nếu phát sinh sự cố bất ngờ. |
| `import tool ready` | API Backend (`validate` & `execute`) đạt 150/150 tests PASS, tường lửa API nhạy bén. | API hoạt động ổn định 100%; tường lửa chặn thực thi thiếu rào chắn (thiếu backup, thiếu lý do) hoạt động chuẩn xác. | ✅ **GO** | Khẳng định độ chín muồi và độ tin cậy tuyệt đối của phần mềm. |
| `UI ready` | Giao diện `LegalKnowledgeImportTab.tsx` tích hợp đầy đủ hiển thị tiến trình, preview và validation diff. | Giao diện hoạt động mượt mà 100%, kết nối API chính xác qua port 5173 và backend port 3000. | ✅ **GO** | Sẵn sàng cho thao tác điều khiển đồ họa trực quan, an toàn. |
| `no auto-active confirmed` | Khẳng định thi hành cờ `noAutoActive: true` sau nạp; việc kích hoạt version tách luồng riêng. | API trả về cờ `noAutoActive: true`; DB bảo toàn nguyên trạng thái `ACTIVE` hiện hữu của hệ thống. | ✅ **GO** | Ngăn chặn tuyệt đối việc tự động kích hoạt phiên bản trái phép. |
| `active approval separate` | Quy trình kích hoạt phiên bản (`Active Version`) được tách luồng thành 3 bước độc lập tại UI riêng. | Module `Version Governance UI` (`Phase 8F-E`) sẵn sàng tiếp nhận kiểm soát sau khi lệnh nạp xong. | ✅ **GO** | Không được kích hoạt ngay sau nạp; phải có phiên họp phê duyệt riêng. |

## 3. Gate Decision Options

Hội đồng Quản trị Kỹ thuật và Lãnh đạo Vụ Pháp chế xem xét 4 phương án quyết định chốt chặn (`Gate Decision Options`):
- **`GO TO CONTROLLED REAL IMPORT`**: Cho phép nạp ngay toàn bộ bộ dữ liệu pháp lý thật vào cơ sở dữ liệu do đã đáp ứng đủ 100% tiêu chí thẩm định, sạch lỗi và có trọn vẹn chữ ký.
- **`GO WITH CONDITIONS`**: Cho phép chuyển sang phase thực thi nạp nhưng kèm theo các điều kiện giới hạn (chỉ được phép nạp lô nhỏ đã được duyệt `Approved`, bắt buộc thực thi đầy đủ 8 rào chắn kỹ thuật trước và sau nạp).
- **`NO-GO - CONTINUE DATASET APPROVAL`**: Tạm dừng chuyển sang phase nạp thực tế; tiếp tục làm sạch, hoàn thiện thông tin siêu dữ liệu và rà soát thẩm định cho đến khi các văn bản trong backlog được Lãnh đạo phê duyệt hoàn tất.
- **`NO-GO - BLOCKED`**: Từ chối nạp vĩnh viễn do phát hiện lỗi vi phạm nghiêm trọng về tính hợp pháp của dữ liệu hoặc lỗ hổng kỹ thuật hệ thống.

## 4. Recommended Decision

Căn cứ vào kết quả đối chiếu trên Ma trận Cổng chốt chặn tối hậu 17 tiêu chí (đối với tổng thể bộ dữ liệu 5 văn bản gốc ban đầu vẫn còn 4 văn bản đang trong backlog chờ chữ ký Lãnh đạo Vụ hoặc bị loại bỏ, tuy nhiên Lô dữ liệu ứng viên mẫu số 01 `BATCH-2024-001` chứa bản ghi SOP `REG-2024-005` đã hoàn tất 100% rà soát, sạch lỗi Critical/High và có đầy đủ chữ ký Lãnh đạo Vụ Pháp chế), Lãnh đạo Dự án và Hội đồng Thẩm định chính thức ban hành Quyết định Cổng tối hậu (`Recommended Gate Decision`):

- **Quyết định toàn cục cho toàn bộ bộ dữ liệu (Bulk Import of All 5 Records):**  
  ### `NO-GO - CONTINUE DATASET APPROVAL`
  *(TẬP DỮ LIỆU THẬT ĐẦY ĐỦ CHƯA ĐẠT ĐỦ ĐIỀU KIỆN ĐỂ NẠP HÀNG LOẠT; TẠM DỪNG NẠP TOÀN BỘ VÀ TIẾP TỤC RÀ SOÁT HOÀN THIỆN TRONG BACKLOG)*

- **Quyết định mở khóa thực thi Pilot cho Lô đã duyệt mẫu số 01 (`BATCH-2024-001`):**  
  ### `GO WITH CONDITIONS`
  *(CHO PHÉP CHUYỂN RIÊNG LÔ `BATCH-2024-001` SANG PHASE 11S ĐỂ THỰC THI NẠP CÓ KIỂM SOÁT VÀO DB PRODUCTION KÈM ĐIỀU KIỆN TRƯỚC VÀ SAU NẠP)*

## 5. Required Conditions Before Import Execution

Để có thể tiến hành thực thi nạp có kiểm soát đối với lô đã được duyệt mẫu số 01 (`BATCH-2024-001`) tại **Phase 11S**, 8 điều kiện tiên quyết sau bắt buộc phải được hoàn thiện đầy đủ và có chữ ký nghiệm thu trước khi bấm nút Execute:

| Condition | Required Evidence | Owner | Must Complete Before | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **1. backup immediately before import** | Chạy lệnh `pg_dump` sinh tệp `.sql` mới nhất ngay trước giờ thực thi và lưu an toàn ngoài Git (`backups/`). | Ops Team (`ADMIN`) | Trước thời điểm bấm Execute tại Phase 11S | Chốt chặn an toàn số 1 bảo vệ toàn vẹn DB production trước mọi rủi ro. |
| **2. final batch file locked** | Tệp CSV/JSON của lô nạp (`BATCH-2024-001`) được niêm phong mã băm (`MD5/SHA256`), không ai được chỉnh sửa. | Technical Operator (`OPERATOR`) | Trước khi tải lên giao diện Import UI | Bảo đảm tính toàn vẹn tuyệt đối của tệp dữ liệu đầu vào. |
| **3. importer role verified** | Tài khoản thực hiện thao tác nạp phải có quyền hạn hợp lệ (`MANAGER` hoặc `ADMIN`), tuyệt đối không dùng tài khoản thường. | ADMIN (`ADMIN`) | Trước khi đăng nhập thực thi nạp | Kiểm soát phân quyền RBAC chặt chẽ theo nguyên tắc an toàn. |
| **4. reason prepared** | Chuẩn bị sẵn nội dung lý do nạp rõ ràng, ghi rõ số Quyết định phê duyệt Lô 01 của Lãnh đạo Vụ Pháp chế. | Specialist A (`STAFF`) | Trước khi nhập vào form UI | Nhập vào trường `Reason` để lưu vết kiểm toán minh bạch. |
| **5. confirmation text prepared** | Chuẩn bị chuỗi từ khóa xác nhận an toàn chính xác: `"I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION"`. | Specialist A (`STAFF`) | Trước khi bấm nút Execute trên UI | Nhập đúng từ khóa vào trường `Confirmation Text` để vượt qua tường lửa API. |
| **6. post-import verification ready** | Chuẩn bị sẵn checklist kiểm chứng sau nạp (đối chiếu `totalRecords`, xác nhận cờ `noAutoActive: true` và kiểm tra log). | Ops Team + Legal Lead | Ngay trước thời điểm chạy lệnh | Kiểm toán nhanh trong vòng 15 phút sau khi lệnh nạp chạy xong. |
| **7. active version approval separate** | Khẳng định việc kích hoạt phiên bản (`Active Version`) sẽ được thực hiện qua luồng 3 bước riêng tại module Version UI (`Phase 8F-E`). | Project Owner (`ADMIN`/`MANAGER`) | Ngay sau khi hoàn tất kiểm tra sau nạp | Không được kích hoạt ngay sau nạp; phải có phiên họp phê duyệt riêng. |
| **8. rollback plan accepted** | Lãnh đạo Kỹ thuật xác nhận Kịch bản khôi phục khẩn cấp (`DR Playbook`) sẵn sàng chạy phục hồi DB trong 5 phút nếu lỗi. | Ops Team (`ADMIN`) | Trước khi bấm nút Execute tại Phase 11S | Đảm bảo khả năng phục hồi thần tốc nếu phát sinh sự cố bất ngờ. |

## 6. Next Recommended Phase

Căn cứ vào quyết định chốt chặn toàn cục **`NO-GO - CONTINUE DATASET APPROVAL`** đối với tổng thể bộ dữ liệu thật, đồng thời mở khóa thực thi pilot **`GO WITH CONDITIONS`** đối với lô dữ liệu đã được duyệt mẫu số 01 (`BATCH-2024-001`), lộ trình tiếp theo được khuyến nghị triển khai linh hoạt theo 2 hướng song song:

- **Hướng 1 (Thực thi Pilot trên Lô đã duyệt 01):**  
  ### `Phase 11S: Controlled Real Legal Dataset Import Execution`
  *(Thực thi nạp có kiểm soát chính thức cho lô `BATCH-2024-001` vào cơ sở dữ liệu `legalflow_prod` theo quy trình 4 lớp rào chắn: Sao lưu DB pre-import, Xác nhận từ khóa `Confirmation Text`, Nhập lý do `Reason` và Nghiệm thu sau nạp bảo đảm `noAutoActive: true`).*

- **Hướng 2 (Tiếp tục rà soát thẩm định cho Tổng thể Bộ dữ liệu - Vòng 3):**  
  ### `Phase 11S: Dataset Approval Follow-up Round 3`
  *(Tiếp tục rà soát, hoàn thiện hồ sơ trình ký Lãnh đạo Vụ Pháp chế đối với các khoảng trống thẩm quyền `GAP-2024-01..03` thuộc danh mục Luật Đất đai 2024 và các nghị định/quyết định địa phương trong backlog trước khi lập các lô nạp tiếp theo `BATCH-2024-002`, `003`).*
