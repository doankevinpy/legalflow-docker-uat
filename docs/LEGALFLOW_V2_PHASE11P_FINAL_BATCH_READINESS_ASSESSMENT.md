# LEGALFLOW V2 - PHASE 11P
# FINAL BATCH READINESS ASSESSMENT

## 1. Purpose

Tài liệu này là Bảng Đánh giá độ sẵn sàng cuối cùng của lô dữ liệu (`Final Batch Readiness Assessment`) được thiết lập tại Phase 11P như một "Tuyên bố thẩm định chốt chặn" (`Final Audit Gateway`) của Lãnh đạo Vụ Pháp chế và Hội đồng Quản trị Kỹ thuật trước khi ra quyết định chuyển sang giai đoạn thực thi nạp chính thức (`Controlled Real Legal Dataset Import Execution`).  
Bảng đánh giá đối chiếu nghiêm ngặt 16 tiêu chí cốt lõi, bảo đảm mọi bất cập về siêu dữ liệu (`metadata`), nguồn gốc công báo, tình trạng hiệu lực và rào chắn kỹ thuật (sao lưu DB, không tự động active) đều đã được kiểm tra triệt để, ngăn chặn hoàn toàn rủi ro nạp dữ liệu rác hoặc làm tổn hại cơ sở dữ liệu production.

## 2. Readiness Summary

Dưới đây là tổng hợp đánh giá chốt chặn cho 16 tiêu chí độ sẵn sàng đối với Lô dữ liệu ứng viên mẫu số 01 (`BATCH-2024-001` gồm bản ghi SOP `REG-2024-005`) cũng như đánh giá thực trạng trên tổng thể tập dữ liệu pháp lý thật:

| Area | Required Result | Actual Result | Decision: GO / WARNING / NO-GO | Notes |
| :--- | :--- | :--- | :---: | :--- |
| `approved batch exists` | Có Bản tuyên bố lô dữ liệu đã phê duyệt (`Approved Import Batch Manifest`) hợp lệ đi kèm chữ ký xác nhận của Lãnh đạo Vụ Pháp chế. | Đã hoàn tất đóng gói và niêm phong manifest cho Lô mẫu số 01 (`BATCH-2024-001` chứa bản ghi SOP `REG-2024-005`). | ✅ **GO** (cho lô 01) / ⚠️ **WARNING** (cho tổng thể) | Lô mẫu số 01 đã sẵn sàng hoàn toàn; các văn bản luật khác đang tiếp tục thẩm định trong backlog. |
| `metadata complete` | Đầy đủ 29 cột thông tin siêu dữ liệu chuẩn hóa theo bộ quy tắc rà soát, không để `null` hay rỗng trên các trường bắt buộc. | Bản ghi `REG-2024-005` đạt 100% đầy đủ metadata chuẩn xác; đã kiểm chứng qua API Validate CSV. | ✅ **GO** | Nguyên liệu dữ liệu đạt độ tinh khôi và độ sạch tối đa. |
| `source verified` | URL nguồn dẫn tới Cổng TTĐT/Công báo hợp pháp của cơ quan nhà nước (`.gov.vn`) và có mã HTTP status 200. | 100% URL dẫn về Cổng TTĐT chính thức của UBND Tỉnh X (`sotnmt.tinhx.gov.vn`) và tệp MinIO hợp lệ. | ✅ **GO** | Khẳng định tính xác thực pháp lý, ngăn chặn nguồn trôi nổi. |
| `effective date checked` | Ngày có hiệu lực thi hành định dạng chuẩn ISO 8601 (`YYYY-MM-DD`), hợp lý và đúng mốc công bố. | Ghi nhận mốc `2024-09-15` chuẩn xác cho bản ghi SOP ứng viên, đối chiếu khớp văn bản gốc. | ✅ **GO** | Không có sai sót về thời điểm phát sinh hiệu lực. |
| `legal status checked` | Khẳng định tình trạng hiệu lực là `Effective`, loại bỏ tuyệt đối văn bản `Expired` hoặc `Unknown`. | 100% bản ghi trong lô ứng viên 01 đều là `Effective`; văn bản quy hoạch hết kỳ hạn (`REG-2024-004`) đã bị bóc tách khỏi manifest nạp. | ✅ **GO** | Chốt chặn pháp lý quan trọng nhất bảo đảm không nạp luật hết hạn. |
| `local scope checked` | Phân định rạch ròi phạm vi áp dụng theo cấp hành chính (`National` hoặc mã địa bàn `Province X`). | Ghi nhận chuẩn mã địa bàn `Province X` cho SOP cấp tỉnh; không ghi nhầm toàn quốc. | ✅ **GO** | Bảo đảm tính chính xác khi tra cứu phân cấp thẩm quyền Một cửa. |
| **`amendment/replacement checked`** | Khớp nối chính xác chuỗi quan hệ sửa đổi, bổ sung hoặc thay thế văn bản quy phạm cũ. | Bản ghi SOP ghi nhận rõ thay thế cho quy trình cũ theo Quyết định 500/QĐ-UBND của UBND Tỉnh X. | ✅ **GO** | Bảo toàn dòng chảy lịch sử pháp lý liền mạch. |
| `procedure mapping complete` | Khớp nối mã thủ tục hành chính đất đai trọng tâm từ `TTHC-LAND-01` đến `TTHC-LAND-05`. | Ánh xạ chuẩn xác vào chuyên đề `TTHC-LAND-01` (Đăng ký, cấp GCN quyền sử dụng đất lần đầu). | ✅ **GO** | Tích hợp sâu sát vào module nghiệp vụ Một cửa. |
| `reviewer approved` | Cán bộ rà soát nghiệp vụ ký xác nhận chịu trách nhiệm kỹ thuật (`Reviewed / Cleaned`) trên bản ghi. | Cán bộ chuyên trách (`SOP Officer D`) đã ký xác nhận hợp lệ trên Sổ rà soát lại. | ✅ **GO** | Rõ ràng trách nhiệm chuyên môn của nhân sự làm sạch. |
| `approver approved` | Lãnh đạo Vụ/Phòng Pháp chế ký xác nhận phê duyệt `Approval Status: Approved` trên phiếu lô nạp. | Lãnh đạo Vụ Pháp chế đã ký duyệt Lô mẫu số 01 (`BATCH-2024-001`); chưa ký cho toàn bộ 5 văn bản luật gốc ban đầu. | ✅ **GO** (cho lô 01) / 🛑 **NO-GO** (cho lô nạp toàn bộ) | Chỉ cho phép thực thi nạp trên các bản ghi đã có chữ ký Lãnh đạo Vụ. |
| `risk notes complete` | Có lời nhắc rủi ro nghiệp vụ (`risk_note`) chi tiết, tường minh cho cán bộ tra cứu. | Ghi nhận lời nhắc rõ ràng về định mức SLA 10 ngày làm việc và lưu ý vai trò tham khảo hỗ trợ của AI. | ✅ **GO** | Tăng cường nhận thức rủi ro nghiệp vụ cho cán bộ hành chính. |
| `no unresolved duplicates` | Không có dòng trùng lặp số ký hiệu hay nội dung trong tệp import hoặc đối chiếu với DB hiện hữu. | Đã quét đối chiếu tự động qua API `Validate CSV - Dry Run`, xác nhận `0 duplicates`. | ✅ **GO** | Đảm bảo không nạp trùng lặp rác vào DB production. |
| `no Critical/High issue` | Khẳng định không còn bất kỳ khiếm khuyết mức `Critical` hay `High` nào đang mở trên lô nạp ứng viên. | Tất cả khiếm khuyết Critical/High trên lô mẫu 01 đã được giải quyết (`Resolved`). Văn bản lỗi Critical `REG-2024-004` đã bị loại (`Rejected`). | ✅ **GO** | Lô nạp hoàn toàn sạch lỗi nghiêm trọng, đạt độ sẵn sàng tối đa. |
| `backup plan ready` | Kịch bản và quy trình sao lưu cơ sở dữ liệu (`pg_dump`) sẵn sàng chạy ngay trước giờ nạp. | Playbook sao lưu `.sql` đã kiểm chứng tại Phase 11L (~951 KB); sẵn sàng kích hoạt trước giờ G. | ✅ **GO** | Chốt chặn an toàn số 1 bảo vệ toàn vẹn DB production. |
| `rollback plan ready` | Kịch bản khôi phục (`DR Playbook`) và đội ngũ trực khôi phục sẵn sàng khôi phục DB về trạng thái cũ trong 5 phút. | Kịch bản khôi phục từ tệp `.sql` dump đã sẵn sàng; nhân sự trực vận hành đã được phân công trực chiến. | ✅ **GO** | Đảm bảo khả năng phục hồi thần tốc nếu phát sinh sự cố bất ngờ. |
| `no auto-active confirmed` | Khẳng định thi hành cờ `noAutoActive: true` sau nạp; việc kích hoạt version tách luồng riêng biệt. | API trả về cờ `noAutoActive: true`; DB bảo toàn nguyên trạng thái `ACTIVE` hiện hữu của hệ thống. | ✅ **GO** | Ngăn chặn tuyệt đối việc tự động kích hoạt phiên bản trái phép. |

## 3. Batch Status

Căn cứ vào kết quả thẩm định chốt chặn trên 16 tiêu chí (đối với tổng thể bộ dữ liệu 5 văn bản gốc ban đầu vẫn còn 4 văn bản đang tiếp tục làm sạch trong backlog hoặc bị loại bỏ, tuy nhiên Lô dữ liệu mẫu số 01 `BATCH-2024-001` chứa bản ghi SOP `REG-2024-005` đã hoàn tất 100% chuẩn hóa, sạch lỗi Critical/High và có đầy đủ chữ ký Lãnh đạo Vụ Pháp chế), Hội đồng Quản trị Kỹ thuật Khẳng định Phân loại Trạng thái Lô dữ liệu:

- **Trạng thái đối với Tổng thể Bộ dữ liệu thật:**  
  ### `FINAL BATCH NOT READY`
  *(TẬP DỮ LIỆU THẬT ĐẦY ĐỦ CHƯA SẴN SÀNG ĐỂ NẠP HÀNG LOẠT; TẠM DỪNG NẠP TOÀN BỘ VÀ TIẾP TỤC RÀ SOÁT HOÀN THIỆN TRONG BACKLOG)*

- **Trạng thái đối với riêng Lô mẫu số 01 (`BATCH-2024-001`):**  
  ### `FINAL BATCH READY WITH CONDITIONS`
  *(LÔ DỮ LIỆU MẪU SỐ 01 ĐÃ SẴN SÀNG ĐỂ THỰC THI NẠP CÓ KIỂM SOÁT TẠI PHASE 11Q VỚI ĐIỀU KIỆN TUÂN THỦ NGHIÊM NGẶT 7 TƯỜNG LỬA BẢO VỆ)*

## 4. Go / No-Go Decision

Từ phân loại trạng thái trên, Lãnh đạo dự án và Hội đồng Thẩm định chính thức ra Quyết định Chốt chặn (`Go / No-Go Decision`):

- **Quyết định toàn cục cho toàn bộ bộ dữ liệu:**  
  ### `NO-GO UNTIL ISSUES RESOLVED`
  *(TẠM DỪNG NẠP HÀNG LOẠT TOÀN BỘ BỘ DỮ LIỆU THẬT CHO ĐẾN KHI CÁC VĂN BẢN TRONG BACKLOG ĐƯỢC LÃNH ĐẠO PHÊ DUYỆT HOÀN TẤT)*

- **Quyết định mở khóa thực thi Pilot cho Lô đã duyệt mẫu số 01 (`BATCH-2024-001`):**  
  ### `GO WITH CONDITIONS`
  *(CHO PHÉP CHUYỂN RIÊNG LÔ `BATCH-2024-001` SANG PHASE 11Q ĐỂ THỰC THI NẠP CÓ KIỂM SOÁT VÀO DB PRODUCTION KÈM ĐIỀU KIỆN TRƯỚC VÀ SAU NẠP)*

## 5. Conditions If GO WITH CONDITIONS

Để có thể tiến hành thực thi nạp có kiểm soát đối với lô ứng viên mẫu số 01 (`BATCH-2024-001`) tại **Phase 11Q**, 7 điều kiện tiên quyết sau bắt buộc phải được hoàn thiện đầy đủ và có chữ ký nghiệm thu trước khi bấm nút Execute:

| Condition | Required Evidence | Owner | Must Complete Before | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **1. backup immediately before import** | Chạy lệnh `pg_dump` sinh tệp `.sql` mới nhất ngay trước giờ thực thi và lưu an toàn ngoài Git (`backups/`). | Ops Team (`ADMIN`) | Trước thời điểm bấm Execute tại Phase 11Q | Chốt chặn an toàn số 1 bảo vệ toàn vẹn DB production trước mọi sai sót. |
| **2. final batch file locked** | Tệp CSV/JSON của lô nạp (`BATCH-2024-001`) được niêm phong mã băm (`MD5/SHA256`), không ai được chỉnh sửa. | Technical Operator (`OPERATOR`) | Trước khi tải lên giao diện Import UI | Bảo đảm tính toàn vẹn tuyệt đối của tệp dữ liệu đầu vào. |
| **3. import reason prepared** | Chuẩn bị sẵn nội dung lý do nạp rõ ràng, ghi rõ số quyết định phê duyệt Lô 01 của Lãnh đạo Vụ Pháp chế. | Specialist A (`STAFF`) | Trước khi nhập vào form UI | Nhập vào trường `Reason` để lưu vết kiểm toán minh bạch. |
| **4. confirmation text prepared** | Chuẩn bị chuỗi từ khóa xác nhận an toàn chính xác: `"I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION"`. | Specialist A (`STAFF`) | Trước khi bấm nút Execute trên UI | Nhập đúng từ khóa vào trường `Confirmation Text` để vượt qua tường lửa API. |
| **5. importer role verified** | Tài khoản thực hiện thao tác nạp phải có quyền hạn hợp lệ (`MANAGER` hoặc `ADMIN`), tuyệt đối không dùng tài khoản thường. | ADMIN (`ADMIN`) | Trước khi đăng nhập thực thi nạp | Kiểm soát phân quyền RBAC chặt chẽ theo nguyên tắc an toàn. |
| **6. post-import verification checklist ready** | Chuẩn bị sẵn checklist kiểm chứng sau nạp (đối chiếu `totalRecords`, xác nhận cờ `noAutoActive: true` và kiểm tra log). | Ops Team + Legal Lead | Ngay trước thời điểm chạy lệnh | Kiểm toán nhanh trong vòng 15 phút sau khi lệnh nạp chạy xong. |
| **7. active version approval separate** | Khẳng định việc kích hoạt phiên bản (`Active Version`) sẽ được thực hiện qua luồng 3 bước riêng tại module Version UI (`Phase 8F-E`). | Project Owner (`ADMIN`/`MANAGER`) | Ngay sau khi hoàn tất kiểm tra sau nạp | Không được kích hoạt ngay sau nạp; phải có phiên họp phê duyệt riêng. |

## 6. Next Recommended Phase

Căn cứ vào quyết định chốt chặn toàn cục **`NO-GO UNTIL ISSUES RESOLVED`** đối với tổng thể bộ dữ liệu thật, đồng thời mở khóa thực thi pilot **`GO WITH CONDITIONS`** đối với lô dữ liệu đã được duyệt mẫu số 01 (`BATCH-2024-001`), lộ trình tiếp theo được khuyến nghị triển khai linh hoạt theo 2 hướng song song:

- **Hướng 1 (Thực thi Pilot trên Lô đã duyệt 01):**  
  ### `Phase 11Q: Controlled Real Legal Dataset Import Execution`
  *(Thực thi nạp có kiểm soát chính thức cho lô `BATCH-2024-001` vào cơ sở dữ liệu `legalflow_prod` theo quy trình 4 lớp rào chắn: Sao lưu DB pre-import, Xác nhận từ khóa `Confirmation Text`, Nhập lý do `Reason` và Nghiệm thu sau nạp bảo đảm `noAutoActive: true`).*

- **Hướng 2 (Tiếp tục xử lý khiếm khuyết cho Tổng thể Bộ dữ liệu):**  
  ### `Phase 11Q: Dataset Issue Resolution & Approval Follow-up`
  *(Tiếp tục làm sạch, hoàn thiện metadata và trình Lãnh đạo Vụ Pháp chế họp thẩm định ký duyệt đối với các văn bản luật trung ương và địa phương đang tồn đọng trong Sổ xử lý khiếm khuyết `Dataset Issue Resolution Log` trước khi lập các lô nạp tiếp theo `BATCH-2024-002`, `003`).*
