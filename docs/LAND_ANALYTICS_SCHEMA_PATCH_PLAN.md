# Kế hoạch Phase 10.0C: LandProfile Schema Patch Review

**Phase**: 10.0C — LandProfile Schema Patch Review  
**Status**: Planning & Patch Preparation (No actual migration executed)  
**Date**: 2026-06-02  
**Wording Standard Compliance**: Strictly using neutral terms like `risk indicator`, `dấu hiệu cần rà soát`, `chỉ báo bất thường`, `khuyến nghị kiểm tra`, `cần xác minh thêm`. Fully avoiding accusatory language.

---

## 1. Scope & Objectives (Phạm vi & Mục tiêu)

* **Mục tiêu chính:** Chuyển proposal mô hình dữ liệu đất đai thành patch thay đổi cụ thể trên tệp `schema.prisma`. Xem xét và kiểm duyệt kỹ lưỡng các Enums, cấu trúc model `LandProfile`, các chỉ mục (indexes), và thiết lập các preflight checks về backup sức khỏe trước khi chạy migration thật ở các phase sau.
* **Quy tắc an toàn:**
  * Chỉ chuẩn bị tài liệu kế hoạch và bản patch schema dự kiến.
  * Tuyệt đối không chạy lệnh `prisma migrate` hay sáp nhập thay đổi vào database thật trong Phase 10.0C hiện tại.
  * Không sửa đổi mã nguồn runtime backend/frontend, không chạy seed dữ liệu và không sử dụng dữ liệu thật của công dân.

---

## 2. Backup-Before-Migration Preflight (Kiểm tra an toàn bản sao lưu)

Để đảm bảo không có rủi ro mất dữ liệu khi chạy migration ở các phase sau, quy trình kiểm toán bản sao lưu (Preflight) bắt buộc phải được thực hiện thành công:

1. **Xác minh tính toàn vẹn bản backup gần nhất:**
   * Thư mục backup gần nhất trong `LegalFlow_ARTIFACTS/backups` phải chứa đầy đủ tệp trạng thái `status.success` và tệp checksum `manifest.sha256`.
2. **Kiểm tra sức khỏe bản backup qua kịch bản tự động:**
   * Thực thi script kiểm tra tính toàn vẹn:
     ```powershell
     powershell -ExecutionPolicy Bypass -File scripts/verify-latest-backup.ps1
     ```
     -> Kết quả trả về phải đạt trạng thái **`PASS`**.
   * Thực thi script kiểm tra lịch trình vận hành và tuổi đời backup:
     ```powershell
     powershell -ExecutionPolicy Bypass -File scripts/check-latest-backup-health.ps1
     ```
     -> Kết quả trả về phải **thành công (không báo FAIL, exit code = 0)**.
3. **Quyết định:** Nếu bất kỳ kiểm tra nào thất bại hoặc phát sinh cảnh báo, hệ thống bắt buộc phải thực hiện chạy một bản backup mới thành công, hoặc tạm dừng toàn bộ quy trình cho đến khi sự cố được khắc phục.

---

## 3. Schema Patch Proposal (Đề xuất bản Patch cho schema.prisma)

Dưới đây là chi tiết thay đổi dự kiến sẽ được thêm vào tệp `schema.prisma`:

### A. Danh sách các Enum mới thêm vào:
```prisma
enum LandProcedureType {
  CAP_GIAY_CHUNG_NHAN
  CHUYEN_MUC_DICH_SD
  TRANH_CHAP_DAT_DAI
  GIAO_DAT_CHO_THUE_DAT
  THU_HOI_DAT_BOI_THUONG
  KHAC
}

enum LandType {
  DAT_O_DO_THI
  DAT_O_NONG_THON
  DAT_TRONG_LUA
  DAT_TRONG_CAY_LAU_NAM
  DAT_RUNG_PHONG_HO
  DAT_SAN_XUAT_KINH_DOANH
  KHAC
}

enum PlanningStatus {
  TRONG_QUY_HOACH
  NGOAI_QUY_HOACH
  CAN_XAC_MINH_THEM
}

enum DisputeStatus {
  DANG_TRANH_CHAP
  KHONG_TRANH_CHAP
  CAN_XAC_MINH_THEM
}

enum OriginOfLandStatus {
  NHAN_CHUYEN_NHUONG
  DUOC_THUA_KE
  DUOC_TANG_CHO
  DAT_KHAI_HOANG
  NHA_NUOC_GIAO_DAT
  NHA_NUOC_CHO_THUE_DAT
  KHAC
}

enum DocumentCompleteness {
  DU_HO_SO
  THIEU_HO_SO
}

enum FinancialObligationStatus {
  HOAN_THANH
  CHUA_HOAN_THANH
  MIEN_GIAM
}

enum LandOutcome {
  CHAP_THUAN
  TU_CHOI
  CHUYEN_TRA
}

enum LandReasonCode {
  QUY_HOACH_XUNG_DOT
  TRANH_CHAP_CHUA_GIAI_QUYET
  THIEU_GIAY_TO_PHAP_LY
  CHUA_HOAN_THANH_NGHIA_VU_TAI_CHINH
  HO_SO_KHONG_HOP_LE
  KHAC
}

enum ComplaintType {
  KN
  TC
  PA
}

enum RiskReviewStatus {
  AN_TOAN
  CAN_RA_SOAT
  DA_XAC_MINH_BINH_THUONG
  DA_XU_LY_DIEU_CHINH
}
```

### B. Cấu trúc model `LandProfile` đề xuất:
```prisma
model LandProfile {
  id                        String                     @id @default(uuid())
  caseId                    String                     @unique
  case                      LegalCase                  @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  procedureType             LandProcedureType          @default(KHAC)
  landType                  LandType
  currentLandUseType        LandType
  requestedLandUseType      LandType?                  // Nullable (optional)
  area                      Float                      // Diện tích thửa đất (m²)
  neighborhood              Neighborhood               
  planningStatus            PlanningStatus             @default(NGOAI_QUY_HOACH)
  disputeStatus             DisputeStatus              @default(KHONG_TRANH_CHAP)
  originOfLandStatus        OriginOfLandStatus         @default(KHAC)
  documentCompleteness      DocumentCompleteness       @default(DU_HO_SO)
  financialObligationStatus FinancialObligationStatus  @default(HOAN_THANH)
  outcome                   LandOutcome?               // Nullable (optional) khi chưa CLOSED
  reasonCode                LandReasonCode?            // Nullable (optional)
  
  complaintFlag             Boolean                    @default(false)
  complaintType             ComplaintType?             // Nullable (optional), chỉ có giá trị khi complaintFlag = true
  
  processingDays            Int?                       // Nullable (optional), tính toán động sau khi đóng case
  overdueDays               Int?                       // Nullable (optional), tính toán động sau khi trễ hạn
  riskReviewStatus          RiskReviewStatus           @default(AN_TOAN)
  
  createdAt                 DateTime                   @default(now())
  updatedAt                 DateTime                   @updatedAt

  // Indexes đơn lẻ phục vụ thống kê
  @@index([procedureType])
  @@index([landType])
  @@index([neighborhood])
  @@index([outcome])
  @@index([reasonCode])
  @@index([complaintFlag])
  @@index([planningStatus])

  // Composite Indexes phục vụ truy vấn đối chiếu chéo
  @@index([procedureType, outcome])
  @@index([neighborhood, outcome])
  @@index([landType, outcome])
  @@index([complaintFlag, outcome])
}
```

### C. Mối quan hệ Optional trên `LegalCase`:
Bổ sung trường liên kết ngược optional vào model `LegalCase`:
```prisma
model LegalCase {
  // ... (giữ nguyên các trường cũ)
  
  landProfile LandProfile? // Quan hệ 1-1 optional, không phá dữ liệu cũ
}
```

---

## 4. Migration Safety & Rollback Plan (An toàn Migration & Hoàn tác)

### A. Phương án tạo Migration an toàn
* Trong phase tiếp theo khi thực thi, lệnh tạo migration sẽ được cấu hình chạy ở chế độ **`create-only`** để người dùng kiểm duyệt nội dung SQL trước khi ghi vào database thật:
  ```bash
  npx prisma migrate dev --name add_land_profile_model --create-only
  ```
* Việc tạo mối quan hệ optional và thiết lập các trường mới ở dạng nullable/optional hoặc có giá trị mặc định (`default`) đảm bảo không drop hay thay đổi bất kỳ dữ liệu cũ nào của các hồ sơ vụ việc (`LegalCase`) hay tài khoản (`User`) hiện hữu.

### B. Phương án Rollback (Hoàn tác)
* Không xóa case hiện có hoặc drop các cột dữ liệu cũ.
* Nếu migration xảy ra lỗi nghiêm trọng ảnh hưởng đến hệ thống, rollback sẽ được thực hiện bằng cách khôi phục cơ sở dữ liệu từ bản backup UAT đã được preflight thông qua trước đó.

---

## 5. Kế hoạch xác minh (Verification Plan)

Trước khi cho phép áp dụng thay đổi vào cơ sở dữ liệu UAT, các bước xác minh sau sẽ được thực thi dự kiến ở phase tiếp theo:

1. **Xác minh Prisma:**
   * Chạy lệnh `npx prisma validate` để kiểm tra tính nhất quán cú pháp của file `schema.prisma` sau patch.
   * Chạy `npx prisma generate` để đảm bảo sinh thành công Prisma Client.
2. **Build Test:**
   * Chạy lệnh build backend (`npm run build` hoặc tương đương) để kiểm tra không bị lỗi biên dịch kiểu TypeScript.
3. **No Seed / No Data Mutation:**
   * Cam kết không chạy seed dữ liệu mới, không thực hiện thay đổi hay ghi dữ liệu thực tế vào database nếu chưa có chỉ định phê duyệt từ phía người dùng.
4. **Secret & Security Scan:**
   * Quét bảo mật tài liệu để đảm bảo không rò rỉ bất kỳ thông tin nhạy cảm nào.
