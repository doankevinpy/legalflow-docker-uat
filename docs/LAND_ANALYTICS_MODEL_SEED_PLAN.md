# Kế hoạch Phase 10.0B: Land Analytics Data Model & Mock Seed

**Phase**: 10.0B — Land Analytics Data Model & Mock Seed  
**Status**: Planning & Design Phase (No source code modifications or migrations executed)  
**Date**: 2026-06-02  
**Wording Standard Compliance**: Strictly using neutral terms like `risk indicator`, `dấu hiệu cần rà soát`, `chỉ báo bất thường`, `khuyến nghị kiểm tra`, `cần xác minh thêm`. Fully avoiding accusatory language.

---

## 1. Prisma Schema Proposal (Đề xuất cấu trúc dữ liệu)

Để hỗ trợ phân tích chuyên sâu mà không làm ảnh hưởng đến cấu trúc bảng vụ việc chung (`LegalCase`), đề xuất thiết lập bảng phụ `LandProfile` liên kết `1-to-1` (optional) với `LegalCase`.

### A. Nguyên tắc an toàn schema:
* **Không phá dữ liệu cũ:** Bảng phụ `LandProfile` liên kết optional với `LegalCase`.
* **Mối quan hệ Optional:** Các hồ sơ vụ việc cũ hoặc thuộc lĩnh vực khác không bắt buộc phải có `LandProfile`.
* **Khả năng backfill:** Dữ liệu hiện có vẫn hoạt động bình thường sau migration, cho phép backfill dữ liệu đất đai dần dần nếu cần.
* **Không thay đổi logic case hiện tại:** Mọi nghiệp vụ của `LegalCase` hiện có không bị thay đổi logic xử lý trong phase này.

### B. Bảng LandProfile Đề xuất
```prisma
model LandProfile {
  id                        String                     @id @default(uuid())
  caseId                    String                     @unique
  case                      LegalCase                  @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  procedureType             LandProcedureType          @default(KHAC)
  landType                  LandType
  currentLandUseType        LandType
  requestedLandUseType      LandType?                  // Nullable đối với hồ sơ không phải xin chuyển đổi mục đích sử dụng
  area                      Float                      // Diện tích thửa đất (m²)
  neighborhood              Neighborhood               // Tham chiếu từ enum Neighborhood có sẵn
  planningStatus            PlanningStatus             @default(NGOAI_QUY_HOACH)
  disputeStatus             DisputeStatus              @default(KHONG_TRANH_CHAP)
  originOfLandStatus        OriginOfLandStatus         @default(KHAC)
  documentCompleteness      DocumentCompleteness       @default(DU_HO_SO)
  financialObligationStatus FinancialObligationStatus  @default(HOAN_THANH)
  outcome                   LandOutcome?               // Nullable khi hồ sơ chưa CLOSED
  reasonCode                LandReasonCode?            // Mã lý do khi outcome là TU_CHOI hoặc CHUYEN_TRA
  
  complaintFlag             Boolean                    @default(false)
  complaintType             ComplaintType?             // Chỉ có giá trị nếu complaintFlag = true
  
  processingDays            Int?                       // Số ngày xử lý thực tế (derived)
  overdueDays               Int?                       // Số ngày trễ hạn (derived)
  riskReviewStatus          RiskReviewStatus           @default(AN_TOAN) // Trạng thái rà soát rủi ro của hồ sơ
  
  createdAt                 DateTime                   @default(now())
  updatedAt                 DateTime                   @updatedAt
}
```

---

## 2. Enum Proposal (Danh sách 11 Enums đề xuất)

Để chuẩn hóa dữ liệu đầu vào và phục vụ phân tích đất đai, chúng tôi đề xuất bổ sung **11 enums mới** sau (chỉ đề xuất thiết kế, chưa viết mã nguồn):

1. **`LandProcedureType` (Loại thủ tục đất đai):**
   * *Mục đích:* Phân loại các thủ tục hành chính liên quan tới đất đai để đánh giá và so sánh theo từng nhóm nghiệp vụ.
   * *Các giá trị:* `CAP_GIAY_CHUNG_NHAN` (Cấp GCN QSDĐ lần đầu), `CHUYEN_MUC_DICH_SD` (Chuyển mục đích sử dụng đất), `TRANH_CHAP_DAT_DAI` (Giải quyết tranh chấp đất đai), `GIAO_DAT_CHO_THUE_DAT` (Giao đất, cho thuê đất), `THU_HOI_DAT_BOI_THUONG` (Thu hồi đất và bồi thường), `KHAC`.
2. **`LandType` (Loại đất):**
   * *Mục đích:* Phân loại thửa đất theo quy định của Luật Đất đai để phục vụ thống kê tỷ lệ chấp thuận/chuyển mục đích.
   * *Các giá trị:* `DAT_O_DO_THI`, `DAT_O_NONG_THON`, `DAT_TRONG_LUA`, `DAT_TRONG_CAY_LAU_NAM`, `DAT_RUNG_PHONG_HO`, `DAT_SAN_XUAT_KINH_DOANH`, `KHAC`.
3. **`PlanningStatus` (Tình trạng quy hoạch thửa đất):**
   * *Mục đích:* Xác định thửa đất có nằm trong vùng quy hoạch hay không để làm căn cứ chạy chỉ báo rà soát.
   * *Các giá trị:* `TRONG_QUY_HOACH`, `NGOAI_QUY_HOACH`, `CAN_XAC_MINH_THEM`.
4. **`DisputeStatus` (Tình trạng tranh chấp thửa đất):**
   * *Mục đích:* Ghi nhận trạng thái tranh chấp thực tế làm cơ sở kiểm tra tính nhất quán trong xử lý hồ sơ hành chính.
   * *Các giá trị:* `DANG_TRANH_CHAP`, `KHONG_TRANH_CHAP`, `CAN_XAC_MINH_THEM`.
5. **`OriginOfLandStatus` (Nguồn gốc sử dụng đất):**
   * *Mục đích:* Thống kê nguồn gốc sử dụng đất ban đầu của thửa đất.
   * *Các giá trị:* `NHAN_CHUYEN_NHUONG` (Nhận chuyển nhượng/mua bán), `DUOC_THUA_KE`, `DUOC_TANG_CHO`, `DAT_KHAI_HOANG`, `NHA_NUOC_GIAO_DAT`, `NHA_NUOC_CHO_THUE_DAT`, `KHAC`.
6. **`DocumentCompleteness` (Độ hoàn thiện hồ sơ đầu vào):**
   * *Mục đích:* Đánh giá tính đầy đủ của hồ sơ khi nộp, làm dữ liệu nền đối chiếu với các hồ sơ bị chuyển trả.
   * *Các giá trị:* `DU_HO_SO`, `THIEU_HO_SO`.
7. **`FinancialObligationStatus` (Trạng thái thực hiện nghĩa vụ tài chính):**
   * *Mục đích:* Xác nhận công dân đã hoàn thành nghĩa vụ thuế đất hay chưa trước khi hồ sơ được phê duyệt.
   * *Các giá trị:* `HOAN_THANH`, `CHUA_HOAN_THANH`, `MIEN_GIAM`.
8. **`LandOutcome` (Kết quả giải quyết hồ sơ đất đai):**
   * *Mục đích:* Theo dõi kết quả xử lý cuối cùng (chấp thuận, từ chối hoặc trả lại bổ sung) làm cơ sở phân tích chính.
   * *Các giá trị:* `CHAP_THUAN`, `TU_CHOI`, `CHUYEN_TRA`.
9. **`LandReasonCode` (Mã lý do từ chối hoặc chuyển trả):**
   * *Mục đích:* Phân loại các lý do phổ biến gây ách tắc hồ sơ phục vụ mục tiêu cải tiến quy trình.
   * *Các giá trị:* `QUY_HOACH_XUNG_DOT`, `TRANH_CHAP_CHUA_GIAI_QUYET`, `THIEU_GIAY_TO_PHAP_LY`, `CHUA_HOAN_THANH_NGHIA_VU_TAI_CHINH`, `HO_SO_KHONG_HOP_LE`, `KHAC`.
10. **`ComplaintType` (Loại đơn thư khiếu nại, phản ánh liên quan):**
    * *Mục đích:* Lưu trữ loại khiếu nại, tố cáo hoặc phản ánh phát sinh liên đới của hồ sơ đất đai gốc.
    * *Các giá trị:* `KN` (Khiếu nại), `TC` (Tố cáo), `PA` (Phản ánh).
11. **`RiskReviewStatus` (Trạng thái rà soát các chỉ báo bất thường):**
    * *Mục đích:* Ghi nhận trạng thái rà soát kiểm tra chất lượng của Admin/Manager đối với hồ sơ phát sinh dấu hiệu cần rà soát.
    * *Các giá trị:* `AN_TOAN` (Không phát hiện chỉ báo bất thường), `CAN_RA_SOAT` (Phát hiện chỉ báo bất thường, khuyến nghị kiểm tra), `DA_XAC_MINH_BINH_THUONG` (Đã rà soát và xác định quy trình bình thường), `DA_XU_LY_DIEU_CHINH` (Đã cập nhật/điều chỉnh quy trình sau rà soát).

---

## 3. Index Proposal (Đề xuất Indexes)

Đề xuất thiết lập các chỉ mục nhằm tối ưu hóa hiệu năng truy vấn cho các API Analytics và Dashboard:

### A. Indexes đơn lẻ:
* Unique Index: `caseId` (Tự động thiết lập theo quan hệ 1-1).
* Index đơn lẻ: `procedureType`, `landType`, `neighborhood`, `outcome`, `reasonCode`, `complaintFlag`, `planningStatus`.

### B. Composite Indexes (Chỉ mục kết hợp):
* `(procedureType, outcome)` -> Tối ưu hóa phân tích tỷ lệ giải quyết theo từng loại thủ tục.
* `(neighborhood, outcome)` -> Tối ưu hóa so sánh tỷ lệ giải quyết giữa các địa bàn khu phố.
* `(landType, outcome)` -> Tối ưu hóa phân tích kết quả chấp thuận/từ chối theo nhóm loại đất.
* `(complaintFlag, outcome)` -> Phân tích mối tương quan giữa hồ sơ khiếu nại phát sinh và kết quả giải quyết đất đai.

### C. Phân tích cán bộ thụ lý (Join Strategy):
Để thực hiện phân tích hiệu suất cán bộ thụ lý (`assignedToId` từ bảng `LegalCase`) đối chiếu với kết quả giải quyết (`outcome` từ bảng `LandProfile`), hệ thống đề xuất **Join Strategy** thay vì nhân bản thêm trường cán bộ thụ lý sang bảng `LandProfile` để tránh trùng lặp dữ liệu không cần thiết.
* **Giải pháp thực thi:** Tạo index đơn trên trường `LegalCase.assignedToId` và index đơn trên trường `LandProfile.outcome`. Hệ quản trị cơ sở dữ liệu (PostgreSQL) sẽ tự động tối ưu hóa hiệu năng của câu lệnh `JOIN` thông qua các chỉ mục đơn lẻ này khi thực hiện thống kê chéo.

---

## 4. Migration Safety (Đảm bảo an toàn dữ liệu)

1. **Chính sách Backup trước khi thực thi (Backup-Before-Migration Policy):**
   * Trước khi chạy bất kỳ câu lệnh migration thật nào ở phase sau, hệ thống bắt buộc phải kiểm tra và xác nhận có bản sao lưu (backup) thành công gần nhất.
   * Điều kiện để tiến hành migration:
     * Thư mục backup gần nhất có chứa tệp `status.success`.
     * Tệp checksum `manifest.sha256` trùng khớp.
     * Chạy script `verify-latest-backup.ps1` trả về kết quả `PASS`.
     * Chạy script `check-latest-backup-health.ps1` trả về kết quả thành công (không báo `FAIL` / exit code 0).
   * **Nếu bất kỳ kiểm tra nào thất bại:** Lập tức dừng quá trình migration để đảm bảo an toàn.
2. **Nguyên tắc thiết kế an toàn:**
   * Chỉ thêm bảng mới `LandProfile` và các enum mới, tuyệt đối không chỉnh sửa hoặc xóa trực tiếp bất kỳ dữ liệu cũ nào của bảng `LegalCase` hay các bảng nghiệp vụ khác.
   * Quan hệ optional giúp bảo vệ tính toàn vẹn của dữ liệu cũ, không làm gián đoạn các tính năng hiện tại của hệ thống.
3. **Chiến lược hoàn tác (Rollback Strategy):**
   * Không drop dữ liệu cũ và không xóa các vụ việc `LegalCase` hiện có.
   * Nếu migration gặp lỗi nghiêm trọng, thực hiện khôi phục (restore) toàn bộ cơ sở dữ liệu từ bản backup đã được xác minh trước đó để đưa hệ thống về trạng thái ổn định trước khi chạy lệnh.

---

## 5. Mock Seed Strategy (Chiến lược tạo dữ liệu giả lập)

Đề xuất sinh từ **50 đến 100 hồ sơ giả lập** cho lĩnh vực đất đai (`field: DAT_DAI`) phục vụ cho chạy thử nghiệm và demo, hoàn toàn không dùng dữ liệu thật.

### A. Tỷ lệ phân bổ nghiệp vụ (An toàn cho Demo)
* **60% Resolved/Approved (Giải quyết thành công):** 
  * Hồ sơ có kết quả `outcome: CHAP_THUAN`.
  * Nghĩa vụ tài chính `financialObligationStatus: HOAN_THANH` hoặc `MIEN_GIAM`.
  * Thời gian giải quyết hợp lệ (`processingDays` < 30 ngày, `overdueDays` = 0).
* **25% Returned/Ineligible (Từ chối / Chuyển trả bổ sung):**
  * Kết quả `outcome: TU_CHOI` hoặc `CHUYEN_TRA`.
  * Bắt buộc phải được gán kèm mã lý do cụ thể trong `reasonCode` (Ví dụ: `THIEU_GIAY_TO_PHAP_LY`, `QUY_HOACH_XUNG_DOT`, `TRANH_CHAP_CHUA_GIAI_QUYET`).
* **10% Pending/Supplement (Đang xử lý / Chờ bổ sung):**
  * Trạng thái hồ sơ `status: NEW` hoặc `IN_PROGRESS`.
  * Trường `outcome` và `reasonCode` bắt buộc để `null`.
* **5% Complaint/Appeal Related (Phát sinh khiếu nại, phản ánh đi kèm):**
  * Các hồ sơ đất đai có `complaintFlag: true` và được gắn kèm loại đơn thư (`complaintType: KN` hoặc `PA`).
  * *Ranh giới an toàn:* Tên công dân luôn dùng tên giả lập (Ví dụ: `Công dân giả định A`), thông tin liên hệ/số điện thoại dùng các ký tự masking (Ví dụ: `090****xxx`), không liên đới tới cán bộ thật ngoài đời, nội dung phản ánh khách quan mang tính mô tả thủ tục, không chứa các tình tiết tố cáo vi phạm pháp luật cá nhân.

### B. Tham chiếu dữ liệu hiện có
* **Cán bộ xử lý:** Gán ngẫu nhiên cho các tài khoản cán bộ có sẵn trong core seed (`manager@legalflow.local`, `staff@legalflow.local`).
* **Người tạo:** Gán cho tài khoản quản trị (`admin@legalflow.local`).
* **Địa bàn:** Sử dụng các khu phố giả lập đã có sẵn (`KP1`, `KP2`, `KP3`, `KP4`, `KP5`).

---

## 6. Ràng buộc Chất lượng Dữ liệu (Data Quality Constraints)

Để đảm bảo tính toàn vẹn của dữ liệu phân tích, Seed script và backend logic phải áp dụng các ràng buộc chất lượng nghiêm ngặt sau:

1. **Ràng buộc mã lý do (Reason Code Constraint):**
   * Nếu `outcome` của LandProfile là `TU_CHOI` hoặc `CHUYEN_TRA`, trường `reasonCode` **không được phép để trống (null/empty)**.
2. **Ràng buộc đơn thư đi kèm (Complaint Flag & Type Constraint):**
   * `complaintType` chỉ được phép có giá trị (KN, TC, PA) nếu `complaintFlag` được thiết lập là `true`. 
   * Nếu `complaintFlag: false`, trường `complaintType` bắt buộc phải là `null`.
3. **Tính toán thời gian xử lý (Computed Time Fields):**
   * `processingDays` và `overdueDays` phải được tính toán tự động dựa trên ngày tiếp nhận (`receivedDate`), ngày đóng hồ sơ (`updatedAt` khi chuyển trạng thái sang `CLOSED`) và hạn trả hồ sơ (`deadline`).
4. **Không tạo chỉ báo bất thường khi thiếu dữ liệu nền:**
   * Hệ thống sẽ kiểm tra sự tồn tại của các trường thông tin quy hoạch, tranh chấp trước khi kích hoạt quy tắc chỉ báo rủi ro, tránh gây ra cảnh báo giả (false alarm).
5. **Wording Standard Disclaimer:**
   * Mọi số liệu thống kê hoặc chỉ số trên risk dashboard chỉ đóng vai trò là "chỉ báo bất thường / dấu hiệu cần rà soát" nhằm tối ưu hóa quy trình làm việc, hoàn toàn không được dùng để kết luận sai phạm cá nhân, tiêu cực của cán bộ thụ lý.

---

## 7. Kế hoạch xác minh dự kiến cho Phase sau (Verification Plan)

Trước khi thực thi thay đổi cơ sở dữ liệu thật, các bước xác minh sau sẽ được thực hiện trên môi trường phát triển local:

1. **Xác minh Prisma Schema:**
   * Chạy lệnh dry-run `npx prisma validate` để kiểm tra tính hợp lệ của schema mới.
   * Chạy `npx prisma generate` để đảm bảo sinh thành công Prisma Client và các TypeScript types đi kèm mà không gặp lỗi biên dịch.
2. **Migration Dry-run:**
   * Kiểm tra mã lệnh SQL được sinh ra bởi migration trước khi apply vào cơ sở dữ liệu thật.
3. **Dry-run Mock Seed:**
   * Phát triển seed script hỗ trợ cờ dry-run (Ví dụ: `npm run seed -- --dry-run`). Khi chạy dry-run, script sẽ sinh dữ liệu trong bộ nhớ, tính toán tỷ lệ phần trăm phân bổ và in thống kê chi tiết ra màn hình console để kiểm chứng thuật toán mà không ghi dữ liệu thực sự vào cơ sở dữ liệu.
4. **Quét an toàn thông tin (Secret & PII Scan):**
   * Thực thi kiểm tra bảo mật để đảm bảo seed script hoàn toàn sử dụng dữ liệu giả lập, không bị lọt thông tin nhạy cảm của dự án (DATABASE_URL, tokens) hoặc thông tin cá nhân của người dân thực tế.
5. **Build & Test Integration:**
   * Chạy lệnh build backend/frontend để xác minh không có lỗi TypeScript biên dịch.
   * Thực thi bộ E2E/RBAC test tự động sau khi tích hợp giao diện UI/API để đảm bảo an toàn truy cập dữ liệu.
