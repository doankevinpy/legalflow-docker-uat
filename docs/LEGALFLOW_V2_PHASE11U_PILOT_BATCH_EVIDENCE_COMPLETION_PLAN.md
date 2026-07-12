# LEGALFLOW V2 - PHASE 11U
# PILOT BATCH EVIDENCE COMPLETION PLAN

## 1. Purpose

Kế hoạch Hoàn thiện Bằng chứng Lô Pilot (`Pilot Batch Evidence Completion Plan`) được thiết lập tại Phase 11U nhằm hướng dẫn chi tiết quy trình bổ sung, chuẩn hóa và tiếp nhận các tài liệu, tệp dữ liệu thực tế và chữ ký xác nhận hợp pháp đối với Lô dữ liệu ứng viên mẫu số 01 (`BATCH-2024-001`).  
Mục tiêu cốt lõi của kế hoạch là khắc phục triệt để các kết luận không đạt tại Cổng kiểm định bằng chứng Phase 11T (`NO-GO - EVIDENCE INSUFFICIENT`), qua đó chuyển dịch hệ thống từ trạng thái "chỉ có hồ sơ giấy do AI gợi ý" (`AI-suggested markdown documentation only`) sang trạng thái "sở hữu đầy đủ bằng chứng vật lý thực tế" (`Full Physical Evidence Ready`) trước khi Hội đồng thẩm định xem xét mở khóa thực thi nạp (`Controlled Real Legal Dataset Import Execution`).

## 2. Baseline

- **Previous tag:** `v2.11.20-controlled-pilot-import-evidence-gate-no-go`
- **Proposed tag:** `v2.11.21-pilot-batch-evidence-completion`
- **Root path:** `C:\Users\Admin\legalflow-docker-uat`
- **Backend path:** `C:\Users\Admin\legalflow-docker-uat\legalflow-backend`
- **Ngày lập kế hoạch:** 12/07/2026

## 3. Analysis of Phase 11T NO-GO Decision

Phán quyết `NO-GO - EVIDENCE INSUFFICIENT` tại Phase 11T xuất phát từ 4 bất cập bằng chứng vật lý thực tế sau (`Core Reasons for Phase 11T NO-GO`):
1. **Chưa xác minh được file batch thật cho `BATCH-2024-001` (`Physical Batch File Missing`):** Toàn bộ kho chứa mã nguồn (`Repository`) không tồn tại bất kỳ tệp dữ liệu thực tế nào chứa bản ghi `REG-2024-005` được niêm phong để nạp.
2. **Chưa thấy file thật `manifest-batch-2024-001.json` (`Manifest File Missing`):** Tệp cấu trúc manifest quy định thông tin tổng hợp Lô 01 hoàn toàn chưa được tạo ra trên ổ đĩa.
3. **Chưa thấy file CSV/JSON thật của batch (`Data Manifest Missing`):** Chỉ tồn tại tệp CSV mẫu 5 dòng Phase 11D (`LEGALFLOW_V2_PHASE11D_SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv`), không phản ánh đúng cấu trúc đã khóa của riêng Lô 01.
4. **SHA256 đã ghi trước đó là hash rỗng (`Zero-byte Empty Hash`):** Mã băm `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` ghi nhận trên tài liệu Phase 11S là mã băm SHA256 chuẩn của một chuỗi rỗng `""` hoặc tệp 0 bytes.
5. **Chưa đủ bằng chứng approval thật (`Missing Physical Approval Linking`):** Chữ ký trên hồ sơ giấy chưa có đối tượng tệp dữ liệu vật lý và mã băm thực tế để khớp nối niêm phong.

## 4. Evidence Needing Completion & Scope Limitation

- **Phạm vi áp dụng (`Strict Scope Limitation`):**  
  Quy trình hoàn thiện bằng chứng tại Phase 11U **chỉ áp dụng duy nhất đối với Lô ứng viên Pilot `BATCH-2024-001`** (gồm bản ghi Quy trình nội bộ TTHC đất đai `REG-2024-005` - SOP `888/QĐ-UBND` Tỉnh X). 4 bản ghi văn bản luật còn lại thuộc bộ dữ liệu ban đầu (`REG-2024-001..004`) tiếp tục duy trì trạng thái hoãn nạp (`Deferred`) hoặc loại trừ (`Excluded`).
- **Các bằng chứng cần hoàn thiện (`Required Evidence Completion Items`):**  
  1. Tiếp nhận tệp dữ liệu chính thức `manifest-batch-2024-001.json` và `BATCH-2024-001.csv/.json` từ cơ quan/người dùng có thẩm quyền.  
  2. Sinh mã băm SHA256 thực tế hợp lệ từ chính tệp manifest vừa tiếp nhận.  
  3. Thu thập phiếu ký xác nhận phê duyệt bằng văn bản (`Approval Sign-off`) ghi rõ mã băm SHA256 mới.  
  4. Thực thi kiểm định `dry-run` validation đối với tệp dữ liệu thực tế.

## 5. Absolute Safety & Zero Import Principle

> [!WARNING]
> **NGUYÊN TẮC KHÔNG NẠP DỮ LIỆU TRONG PHASE 11U (`ZERO IMPORT EXECUTION IN PHASE 11U`):**  
> Phase 11U là giai đoạn chuẩn bị và thu thập tài liệu bằng chứng (`Evidence Completion & Artifact Preparation Only`), **TUYỆT ĐỐI KHÔNG THỰC HIỆN BẤT KỲ LỆNH IMPORT HAY GHI CƠ SỞ DỮ LIỆU PRODUCTION NÀO (`ABSOLUTE NO IMPORT PRINCIPLE`)**.  
> Việc thực thi nạp thật chỉ được phép đánh giá và thi hành tại Phase 11V sau khi toàn bộ bằng chứng đã được người dùng/cơ quan hành chính nhà nước cung cấp đầy đủ và thẩm định hợp pháp.

## 6. Mandatory Blocking Statements & Stop Conditions

Để bảo đảm tính nghiêm minh của hệ thống quản trị dữ liệu pháp lý, Hội đồng Quản trị Kỹ thuật ban hành 4 lời khẳng định khóa nạp bắt buộc (`Mandatory Blocking Statements`) và các Điều kiện Dừng Khẩn cấp (`Stop Conditions`):

1. **Nếu không có file batch thật, không được import (`If no real batch file exists, import is strictly blocked`).**  
   Hệ thống không chấp nhận bất kỳ sự giả lập hay tự tạo tệp batch giả (`No self-invented batch files`) từ phía AI hay kỹ thuật viên.
2. **Nếu không có SHA256 thật, không được import (`If no real SHA256 exists, import is strictly blocked`).**  
   Mọi nỗ lực nạp dữ liệu với mã băm rỗng (`e3b0c...`) hoặc mã băm không khớp tệp thực tế sẽ bị tường lửa backend chặn đứng lập tức.
3. **Nếu không có approval evidence thật, không được import (`If no real approval evidence exists, import is strictly blocked`).**  
   Chữ ký rà soát chuyên môn (`Reviewer`) và Lãnh đạo Vụ (`Approver`) phải được xác nhận thực tế trên văn bản hoặc chữ ký số hợp pháp.
4. **Nếu chỉ có tài liệu `.md` do AI tạo, chưa đủ điều kiện import (`If only AI-generated .md docs exist, conditions are NOT met for import`).**  
   Các tài liệu markdown quy trình do AI gợi ý chỉ có giá trị làm khung quản trị (`Governance Framework`); không thể thay thế cho dữ liệu gốc và sự phê duyệt của con người.

**Điều kiện Dừng Khẩn cấp (`Stop Conditions`):**  
Cán bộ vận hành (`Operator`) và Quản trị viên (`ADMIN`) phải lập tức dừng mọi thao tác chuyển phase nếu phát hiện: tệp dữ liệu không có nhãn/nguồn gốc rõ ràng, vi phạm cấu trúc schema, phát hiện credential/PII trong tệp bằng chứng, hoặc xuất hiện bất kỳ hành vi cố ý nạp chui vào DB khi chưa hoàn tất Sổ tồn đọng Phase 11U.
