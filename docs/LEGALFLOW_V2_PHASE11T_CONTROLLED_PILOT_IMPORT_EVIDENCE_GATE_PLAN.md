# LEGALFLOW V2 - PHASE 11T
# CONTROLLED PILOT IMPORT EVIDENCE GATE PLAN

## 1. Purpose

Kế hoạch Cổng kiểm định bằng chứng trước nạp Pilot có kiểm soát (`Controlled Pilot Import Evidence Gate Plan`) được thiết lập tại Phase 11T nhằm thực hiện kiểm toán độc lập, rà soát thực tế (`Physical Evidence Audit`) đối với toàn bộ các tệp dữ liệu, mã băm SHA256 và bằng chứng phê duyệt cho Lô dữ liệu ứng viên mẫu số 01 (`BATCH-2024-001`) trước thời điểm mở khóa thực thi lệnh nạp (`Controlled Real Legal Dataset Import Execution`).  
Cổng kiểm định bằng chứng đóng vai trò là tường lửa thực tế tối hậu (`Physical Verification Gateway`), ngăn chặn triệt để hiện tượng "phê duyệt trên giấy nhưng thiếu tệp dữ liệu thực tế" (`Paper Approval without Physical Batch Manifest`), qua đó bảo đảm sự trung thực, toàn vẹn tuyệt đối và tính hợp pháp cho cơ sở dữ liệu `legalflow_prod`.

## 2. Baseline

- **Previous tag:** `v2.11.19-dataset-approval-followup-round3-final-batch-lock`
- **Proposed tag:** `v2.11.20-controlled-pilot-import-evidence-gate-no-go`
- **Root path:** `C:\Users\Admin\legalflow-docker-uat`
- **Backend path:** `C:\Users\Admin\legalflow-docker-uat\legalflow-backend`
- **Ngày lập kế hoạch:** 12/07/2026

## 3. Global Dataset vs. Pilot Batch Scope

Quy trình thẩm định bằng chứng Phase 11T phân định rạch ròi lý do không nạp toàn bộ bộ dữ liệu và lý do chỉ tập trung kiểm chứng riêng đối với Lô mẫu số 01 (`BATCH-2024-001`):

- **Vì sao không được nạp toàn bộ bộ dữ liệu thật (`Why Global Dataset Import is NOT AUTHORIZED`):**  
  Tổng thể danh mục 5 văn bản gốc ban đầu của hệ thống (`REG-2024-001..005`) chưa đạt đủ điều kiện pháp lý để nạp hàng loạt. Trong đó, bản ghi `REG-2024-004` (Quyết định KHSDĐ Huyện A) đã hết thời kỳ quy hoạch 2024 nên bị loại trừ vĩnh viễn (`Rejected / Excluded`); 3 bản ghi luật và nghị định/quyết định (`REG-2024-001..003`) đang trong trạng thái hoãn nạp (`Deferred to Later Batch`) để chờ bổ sung công văn phối hợp ranh giới Một cửa và chữ ký `Approved` chính thức từ Lãnh đạo Vụ Pháp chế. Do đó, phán quyết toàn cục đối với tổng thể bộ dữ liệu duy trì tuyệt đối là `NOT AUTHORIZED`.

- **Vì sao chỉ xem xét riêng Lô ứng viên Pilot `BATCH-2024-001` (`Why Only Pilot BATCH-2024-001 is Evaluated`):**  
  Tại Phase 11S, Lô dữ liệu ứng viên mẫu số 01 (`BATCH-2024-001`) chứa riêng bản ghi Quy trình nội bộ TTHC đất đai (`REG-2024-005` - SOP `888/QĐ-UBND`) đã hoàn tất 100% rà soát siêu dữ liệu, đạt chuẩn `Cleaned`, có đủ chữ ký `Reviewer` & `Approver` trên hồ sơ giấy và được nghiệm thu với trạng thái `AUTHORIZED WITH CONDITIONS`. Vì vậy, Phase 11T tập trung toàn bộ nguồn lực kiểm chứng vật lý thực tế xem tệp manifest đầu vào của Lô 01 đã thực sự tồn tại trong kho lưu trữ (`Repository`) hay chưa trước khi cho phép kích hoạt lệnh nạp.

## 4. Mandatory Pre-conditions Before Pilot Import

Để Lô dữ liệu Pilot `BATCH-2024-001` vượt qua Cổng kiểm định bằng chứng Phase 11T và bước sang thi hành nạp thật tại DB production, 6 điều kiện thực tế bắt buộc sau phải đạt 100% `PASS`:
1. **Sự tồn tại vật lý của tệp Manifest (`Physical Manifest File Existence`):** Tệp `manifest-batch-2024-001.json` (hoặc tệp `BATCH-2024-001.csv/.json`) thực sự tồn tại trong working tree và có nội dung dữ liệu hợp lệ.
2. **Tính chính xác và đầy đủ của bản ghi (`Record Integrity Check`):** Bản ghi `REG-2024-005` (SOP Tỉnh X) có mặt đầy đủ trong tệp manifest với trọn vẹn 29 cột siêu dữ liệu chuẩn hóa.
3. **Mã băm SHA256 thực tế hợp lệ (`Valid Physical SHA256 Check`):** Mã băm SHA256 tính toán thực tế từ tệp manifest phải khớp đúng với mã băm đã niêm phong; **TUYỆT ĐỐI KHÔNG ĐƯỢC LÀ MÃ BĂM CỦA TỆP RỖNG** (`Empty-file hash`).
4. **Bằng chứng nguồn xác thực (`Source Evidence Check`):** URL dẫn tới Cổng TTĐT chính thức (`.gov.vn`) và tệp toàn văn MinIO hoạt động chính xác.
5. **Bằng chứng phê duyệt gắn liền mã băm (`Hash-linked Approval Check`):** Phiếu phê duyệt của `Reviewer` và Lãnh đạo Vụ `Approver` phải xác nhận đúng mã băm SHA256 thực tế của tệp manifest, không phê duyệt khống.
6. **Sẵn sàng tường lửa bảo vệ 4 lớp (`4-Layer Safeguard Readiness`):** Kịch bản sao lưu `pg_dump` pre-import, nội dung `Reason`, từ khóa `Confirmation Text` và quy trình nghiệm thu sau nạp bảo đảm `noAutoActive: true` sẵn sàng trực chiến.

## 5. Stop Conditions & Mandatory NO-GO Principle

> [!CAUTION]
> **NGUYÊN TẮC KHÓA NẠP TUYỆT ĐỐI (MANDATORY NO-GO PRINCIPLE):**  
> Hội đồng Quản trị Kỹ thuật và Lãnh đạo Vụ Pháp chế khẳng định: **THIẾU TỆP BATCH THẬT HOẶC MÃ BĂM LÀ TỆP RỖNG THÌ ĐỒNG NGHĨA VỚI PHÁN QUYẾT NO-GO NGAY LẬP TỨC (`MISSING ACTUAL BATCH FILE OR EMPTY HASH = MANDATORY NO-GO`).**  
> Hệ thống **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP THỰC THI NẠP (`NO IMPORT EXECUTION`)** nếu rơi vào bất kỳ điều kiện dừng khẩn cấp (`Stop Conditions`) nào dưới đây:
> 1. **Khuyết tệp dữ liệu thật (`Missing Actual Manifest File`):** Không tìm thấy tệp `manifest-batch-2024-001.json` hoặc tệp lô dữ liệu CSV/JSON thật trong kho chứa mã nguồn (`Repository`).
> 2. **Mã băm rỗng (`Empty Hash Detection`):** Mã băm SHA256 niêm phong là `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` (mã băm chuẩn của chuỗi rỗng `""` hoặc tệp 0 bytes).
> 3. **Phê duyệt khống hoặc giả lập AI (`Fake / AI-invented Evidence`):** Bằng chứng chữ ký hoặc biên bản phê duyệt bị giả lập bởi AI mà không có hồ sơ ký duyệt thực tế của cơ quan hành chính nhà nước có thẩm quyền.
> 4. **Trạng thái hiệu lực chưa đối chiếu (`Unverified Legal Status`):** Bản ghi để tình trạng `Unknown`, `Unverified` hoặc đã hết thời kỳ áp dụng (`Expired`).
> 5. **Tường lửa kỹ thuật chưa đáp ứng (`Safeguard Failure`):** Thiếu kịch bản sao lưu `pg_dump`, thiếu kịch bản phục hồi khẩn cấp 5 phút (`DR Playbook`) hoặc API không bảo đảm cờ `noAutoActive: true`.
