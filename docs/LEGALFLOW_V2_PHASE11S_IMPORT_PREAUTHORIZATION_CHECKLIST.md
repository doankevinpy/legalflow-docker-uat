# LEGALFLOW V2 - PHASE 11S
# IMPORT PRE-AUTHORIZATION CHECKLIST

## 1. Purpose

Tài liệu này là Bảng rà soát kiểm định Tiền cấp phép Nạp chốt chặn cuối cùng (`Import Pre-authorization Checklist`) được thiết lập tại Phase 11S trước thời điểm mở khóa cho phép chuyển sang giai đoạn thực thi nạp dữ liệu thật có kiểm soát (`Phase 11T: Controlled Real Legal Dataset Import Execution`).  
Checklist tiền cấp phép đóng vai trò là "Cửa kiểm soát an ninh tối hậu" (`Final Security Gateway`), rà soát nghiêm ngặt 19 hạng mục kiểm chứng bao trùm từ độ tin cậy của manifest đã khóa (`Locked Manifest Integrity`), độ tinh khôi của metadata, chữ ký Lãnh đạo Vụ cho đến các điều kiện tường lửa API (tài khoản `importer role`, từ khóa xác nhận `confirmation text`, lý do nạp `import reason`, sao lưu `pg_dump` và cờ `noAutoActive: true`).

## 2. Pre-authorization Checklist

Dưới đây là Bảng kiểm chứng 19 điều kiện tiền cấp phép nạp tối hậu Phase 11S, đối chiếu giữa riêng Lô mẫu số 01 (`BATCH-2024-001`) và tổng thể toàn bộ tập dữ liệu pháp lý thật:

| Check Item | Required Evidence | Confirmed: Yes / No / N/A | Decision: GO / WARNING / NO-GO | Notes |
| :--- | :--- | :---: | :---: | :--- |
| `final batch locked` | Tệp manifest của lô nạp cuối cùng (`manifest-batch-2024-001.json`) được niêm phong mã băm SHA256, không ai được chỉnh sửa. | `Yes` | ✅ **GO** (cho lô 01) / ⚠️ **WARNING** (cho tổng thể) | Lô 01 đã niêm phong SHA256; 4 văn bản luật khác tiếp tục theo dõi trong backlog. |
| `included records approved` | 100% bản ghi đưa vào Lô nạp cuối cùng đều có chữ ký `Approved` của Lãnh đạo Vụ Pháp chế. | `Yes` (cho lô 01) / `No` (cho tổng thể) | ✅ **GO** (cho lô 01) / 🛑 **NO-GO** (cho tổng thể) | Lô 01 đạt 100% chữ ký `Approved`; tổng thể 5 văn bản luật ban đầu chưa đạt 100%. |
| `excluded/deferred records documented` | Minh bạch rõ ràng lý do loại trừ (`Exclusion Reason`) hoặc hoãn nạp (`Deferral Reason`) cho các văn bản không đưa vào Lô 01. | `Yes` | ✅ **GO** | Bản ghi hết kỳ hạn (`REG-2024-004`) đã bóc tách vào Excluded; 3 bản ghi luật vào Deferred. |
| `no Critical blocker` | Khẳng định không còn bất kỳ khiếm khuyết hay rủi ro mức `Critical` nào đang mở trên lô ứng viên. | `Yes` | ✅ **GO** | Lô 01 sạch lỗi Critical 100%; không còn cản trở. |
| `no High unresolved blocker` | Khẳng định không còn khiếm khuyết hay rủi ro mức `High` nào đang mở trên lô ứng viên. | `Yes` | ✅ **GO** | Lô 01 không còn lỗi High; lỗi High của các văn bản luật khác được theo dõi trong backlog riêng. |
| `source verified` | URL nguồn dẫn tới Cổng TTĐT/Công báo hợp pháp (`.gov.vn`) và có mã HTTP status 200. | `Yes` | ✅ **GO** | Khẳng định tính xác thực pháp lý tối đa cho toàn văn quy trình SOP. |
| `legal status checked` | Khẳng định 100% bản ghi trong lô ứng viên có tình trạng hiệu lực là `Effective`, không còn văn bản `Unknown` hay `Expired`. | `Yes` | ✅ **GO** | Ngăn chặn tuyệt đối rủi ro nạp luật hết hạn hoặc chưa rõ hiệu lực. |
| `local scope checked` | Phân định rạch ròi phạm vi áp dụng theo cấp hành chính (`National` hoặc mã địa bàn `Province X`). | `Yes` | ✅ **GO** | Mã địa bàn `Province X` chuẩn hóa cho quy trình Một cửa địa phương. |
| `procedure mapping complete` | Khớp nối chính xác mã thủ tục hành chính trọng tâm (`TTHC-LAND-01..05`). | `Yes` | ✅ **GO** | Ánh xạ chuẩn xác vào thủ tục Đăng ký, cấp GCN lần đầu (`TTHC-LAND-01`). |
| `risk notes accepted` | Lãnh đạo Vụ chấp nhận nội dung lời nhắc rủi ro nghiệp vụ (`risk_note`) trên bản ghi. | `Yes` | ✅ **GO** | Chữ ký nghiệm thu trên trích đoạn SLA 10 ngày làm việc. |
| `reviewer approved` | Cán bộ rà soát nghiệp vụ ký xác nhận chịu trách nhiệm kỹ thuật (`Reviewed / Cleaned`) trên bản ghi. | `Yes` | ✅ **GO** | Rõ ràng trách nhiệm chuyên môn của nhân sự làm sạch (`SOP Officer D`). |
| `approver approved` | Lãnh đạo Vụ Pháp chế ký xác nhận phê duyệt `Approval Status: Approved` trên phiếu lô nạp. | `Yes` (cho lô 01) | ✅ **GO** (cho lô 01) | Chỉ cho phép thực thi nạp riêng đối với Lô 01 đã được ký duyệt chính thức. |
| `backup immediately before import required` | Cam kết bắt buộc chạy lệnh `pg_dump` tạo tệp `.sql` lưu trữ an toàn ngay trước thời điểm bấm nút nạp. | `Yes` | ✅ **GO** | Chốt chặn an toàn số 1 bảo vệ toàn vẹn DB production trước mọi rủi ro. |
| `rollback plan ready` | Kịch bản khôi phục (`DR Playbook`) và đội ngũ trực vận hành sẵn sàng khôi phục DB trong 5 phút. | `Yes` | ✅ **GO** | Đảm bảo khả năng phục hồi thần tốc nếu phát sinh sự cố bất ngờ. |
| `import reason prepared` | Chuẩn bị sẵn nội dung lý do nạp hợp lệ để nhập vào trường `Reason` khi gọi API backend. | `Yes` | ✅ **GO** | Đã chuẩn bị chuỗi lý do chuẩn mực lưu vết kiểm toán rõ ràng. |
| `confirmation text prepared` | Chuẩn bị chính xác chuỗi từ khóa xác nhận an toàn: `"I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION"`. | `Yes` | ✅ **GO** | Sẵn sàng nhập vào trường `Confirmation Text` để vượt qua tường lửa API. |
| `importer role verified` | Tài khoản thực thi nạp được kiểm chứng có phân quyền hợp lệ (`MANAGER` hoặc `ADMIN`), không dùng tài khoản thường. | `Yes` | ✅ **GO** | RBAC bảo đảm chỉ có nhân sự cấp cao mới được phép bấm nút nạp. |
| `no auto-active confirmed` | Khẳng định thi hành cờ `noAutoActive: true` sau nạp; việc kích hoạt version tách luồng riêng. | `Yes` | ✅ **GO** | DB bảo toàn nguyên trạng thái `ACTIVE` hiện hữu của hệ thống. |
| `active version approval separate` | Quy trình kích hoạt phiên bản (`Active Version`) được tách luồng thành 3 bước độc lập tại UI riêng biệt. | `Yes` | ✅ **GO** | Không được kích hoạt ngay sau nạp; phải có phiên họp phê duyệt riêng. |

## 3. Import Authorization Decision

Căn cứ vào kết quả đối chiếu trên Bảng rà soát Tiền cấp phép 19 tiêu chí (đối với tổng thể bộ dữ liệu 5 văn bản gốc ban đầu vẫn còn 4 văn bản đang trong backlog chờ chữ ký Lãnh đạo Vụ hoặc bị loại bỏ, tuy nhiên Lô dữ liệu ứng viên mẫu số 01 `BATCH-2024-001` chứa bản ghi SOP `REG-2024-005` đã hoàn tất 100% rà soát, sạch lỗi Critical/High, đã được khóa niêm phong SHA256 và có đầy đủ chữ ký Lãnh đạo Vụ Pháp chế), Lãnh đạo Dự án và Hội đồng Thẩm định chính thức ban hành Quyết định Cấp phép Tiền thực thi Nạp (`Import Authorization Decision`):

- **Quyết định đối với Tổng thể Bộ dữ liệu thật (5 văn bản gốc ban đầu):**  
  ### `NOT AUTHORIZED`
  *(TẬP DỮ LIỆU THẬT ĐẦY ĐỦ CHƯA CÓ LÔ CHUNG ĐƯỢC KHÓA VÀ PHÊ DUYỆT 100%; KHÔNG CẤP PHÉP NẠP HÀNG LOẠT TOÀN BỘ VÀ TIẾP TỤC RÀ SOÁT TRONG BACKLOG)*

- **Quyết định đối với riêng Lô mẫu số 01 (`BATCH-2024-001`):**  
  ### `AUTHORIZED WITH CONDITIONS`
  *(CẤP PHÉP CHUYỂN RIÊNG LÔ `BATCH-2024-001` SANG PHASE 11T ĐỂ THỰC THI NẠP CÓ KIỂM SOÁT VỚI ĐIỀU KIỆN TUÂN THỦ NGHIÊM NGẶT 4 TƯỜNG LỬA BẢO VỆ PRE/POST IMPORT)*

## 4. Required Import Confirmation

Để có thể thực thi thành công lệnh nạp (`Execute Import`) thông qua giao diện `LegalKnowledgeImportTab.tsx` hoặc API backend tại **Phase 11T**, Cán bộ thực thi (`Importer Role`) **BẮT BUỘC PHẢI NHẬP CHÍNH XÁC 100% (`EXACT MATCH`)** chuỗi từ khóa xác nhận an toàn sau vào trường `Confirmation Text` (nếu nhập sai dù chỉ 1 ký tự, tường lửa backend sẽ lập tức từ chối `400 Bad Request`):

```text
I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION
```

## 5. Required Import Reason

Cùng với từ khóa xác nhận trên, Cán bộ thực thi phải nhập nội dung lý do nạp hợp lệ và rõ ràng vào trường `Reason` nhằm lưu vết kiểm toán minh bạch trong `Audit Log` và Sổ đăng ký nạp:

```text
Controlled real legal dataset import execution after approved final batch lock (Phase 11S / Batch 01)
```

## 6. Next Recommended Phase

Căn cứ vào quyết định chốt chặn toàn cục **`NOT AUTHORIZED`** đối với tổng thể bộ dữ liệu thật, đồng thời mở khóa thực thi pilot **`AUTHORIZED WITH CONDITIONS`** đối với lô dữ liệu đã được khóa niêm phong mẫu số 01 (`BATCH-2024-001`), lộ trình tiếp theo được khuyến nghị triển khai linh hoạt theo 2 hướng song song:

- **Hướng 1 (Thực thi Pilot trên Lô đã khóa 01):**  
  ### `Phase 11T: Controlled Real Legal Dataset Import Execution`
  *(Thực thi nạp có kiểm soát chính thức cho lô `BATCH-2024-001` vào cơ sở dữ liệu `legalflow_prod` theo quy trình 4 lớp rào chắn: Sao lưu DB pre-import, Xác nhận từ khóa `Confirmation Text`, Nhập lý do `Reason` và Nghiệm thu sau nạp bảo đảm `noAutoActive: true`).*

- **Hướng 2 (Tiếp tục rà soát thẩm định cho Tổng thể Bộ dữ liệu - Vòng 4):**  
  ### `Phase 11T: Dataset Approval Follow-up Round 4`
  *(Tiếp tục rà soát, hoàn thiện hồ sơ trình ký Lãnh đạo Vụ Pháp chế đối với các khoảng trống thẩm quyền thuộc danh mục Luật Đất đai 2024 và các nghị định/quyết định địa phương trong backlog trước khi khóa và cấp phép các lô nạp tiếp theo `BATCH-2024-002`, `003`).*
