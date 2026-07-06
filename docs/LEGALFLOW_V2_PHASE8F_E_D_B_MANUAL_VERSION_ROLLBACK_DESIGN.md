# LEGALFLOW V2 - PHASE 8F-E-D-B

# MANUAL VERSION ROLLBACK DESIGN

**Phiên bản:** v1.0  
**Ngày lập:** 06/07/2026  
**Trạng thái:** Thiết kế kiến trúc (Design Only - No Implementation)  
**Phạm vi:** Nền tảng thiết kế cơ chế khôi phục thủ công phiên bản tri thức pháp lý (Law, Decree, Procedure Type, AI Prompt, Checklist) trong hệ thống LegalFlow v2.

---

## 1. Purpose

Tài liệu này định nghĩa kiến trúc và quy trình kỹ thuật cho cơ chế **Manual Version Rollback** (Khôi phục/Hạ cấp thủ công phiên bản tri thức pháp lý) trong hệ thống LegalFlow v2.

Trong quá trình quản trị và vận hành tri thức pháp lý, có thể xảy ra các tình huống nghiệp vụ:
1. **Kích hoạt nhầm phiên bản:** Cán bộ quản lý kích hoạt một phiên bản cấu hình thủ tục hành chính (`ProcedureTypeVersion`), system prompt rà soát AI (`AiPromptVersion`), hoặc checklist thẩm định (`ChecklistVersion`) chưa hoàn thiện hoặc chưa đến ngày có hiệu lực thực tế.
2. **Phát hiện bất cập sau kích hoạt:** Phiên bản mới đã kích hoạt (`ACTIVE`) bị phát hiện có sai sót nghiệp vụ nghiêm trọng hoặc gây lệch lạc trong kết quả rà soát hồ sơ của AI, cần khôi phục khẩn cấp về phiên bản ổn định trước đó.

**Mục tiêu cốt lõi của thiết kế Rollback:**
- Cung cấp cơ chế an toàn tuyệt đối để khôi phục trạng thái phiên bản trước đó (`REPLACED` -> `ACTIVE`) và hạ cấp phiên bản hiện tại (`ACTIVE` -> `REPLACED`).
- **Không xóa dữ liệu lịch sử:** Tuyệt đối không sử dụng lệnh xóa (`DELETE`) đối với bất kỳ bản ghi phiên bản nào, bảo toàn toàn vẹn lịch sử tiến hóa tri thức pháp lý.
- **Đảm bảo tính truy xuất ngược (Auditability):** Mọi hành động rollback phải được ghi nhận chi tiết vết kiểm toán (ai làm, thời gian nào, vì lý do gì, từ bản nào về bản nào).

---

## 2. Safety Principles

Cơ chế Manual Version Rollback được thiết kế tuân thủ nghiêm ngặt 9 nguyên tắc an toàn bất khả xâm phạm sau:

1. **Human-in-the-Loop (Con người kiểm soát tối cao):** Mọi quyết định khôi phục phiên bản pháp lý đều bắt buộc phải do con người (cán bộ có thẩm quyền) chủ động ra quyết định, rà soát tác động và xác nhận thực thi.
2. **Chỉ ADMIN/MANAGER:** Chỉ tài khoản được phân quyền Quản trị viên hệ thống (`ADMIN`) hoặc Lãnh đạo/Quản lý nghiệp vụ (`MANAGER`) mới có quyền truy cập và kích hoạt quy trình rollback. Cán bộ nghiệp vụ (`STAFF`) và người xem (`VIEWER`) tuyệt đối không có quyền thao tác.
3. **Không AI tự rollback:** Hệ thống AI trợ lý và các luồng tự động hóa tuyệt đối không có quyền tự ý khôi phục, hạ cấp hay thay đổi trạng thái của bất kỳ phiên bản văn bản hay cấu hình pháp lý nào.
4. **Không tự động rollback:** Không có bất kỳ tác vụ ngầm (cron job, background task) hay trigger tự động nào tự ý thực hiện rollback dựa trên lỗi hệ thống hay cảnh báo. Rollback là hành động quản trị thủ công 100%.
5. **Không xóa version:** Quy trình rollback không làm mất đi phiên bản vừa bị hạ cấp. Phiên bản đó chỉ chuyển trạng thái từ `ACTIVE` sang `REPLACED` (hoặc `DEPRECATED`), giữ nguyên nội dung cấu hình để phục vụ tra cứu hoặc chỉnh sửa cho các lần sau.
6. **Không sửa hồ sơ TTHC:** Thao tác rollback tuyệt đối không làm tác động, thay đổi hay chỉnh sửa bất kỳ thông tin, trạng thái, bước xử lý, tài liệu đính kèm hay phân công của các hồ sơ thủ tục hành chính (`AdministrativeProcedureCase`) đang có trong hệ thống.
7. **Không sửa kết quả AI cũ:** Không ghi đè, xóa, hay tính toán lại các kết quả rà soát AI (`ProcedureAiAnalysis`) đã thực hiện trước đó.
8. **Không sửa legal snapshot cũ:** Nguyên tắc bất biến của `ProcedureAiAnalysisLegalSnapshot`. Hồ sơ TTHC cũ đã gắn liền với bản chụp cấu hình pháp lý nào tại thời điểm rà soát thì vĩnh viễn bảo lưu cấu hình đó, không bị ảnh hưởng bởi việc rollback luật/thủ tục trong hiện tại hay tương lai.
9. **Mọi thao tác rollback phải có lý do và audit trail:** Người thực hiện bắt buộc phải nhập lý do nghiệp vụ rõ ràng (tối thiểu 20 ký tự) và thực hiện xác nhận chữ ký số/văn bản. Toàn bộ thông tin được ghi vào nhật ký kiểm toán không thể chỉnh sửa hay xóa bỏ.

---

## 3. Rollback Scope

Để đảm bảo an toàn toàn vẹn cơ sở dữ liệu và cách ly rủi ro, phạm vi tác động của cơ chế Rollback được giới hạn rõ ràng:

### 3.1. Các bảng version ĐƯỢC PHÉP tác động (In-Scope for Rollback)
Quy trình rollback chỉ được phép thay đổi trạng thái (`status`) và thời gian hiệu lực (`effectiveFrom`, `effectiveTo`) của 3 bảng quản lý phiên bản cấu hình nghiệp vụ sau:
* **`ProcedureTypeVersion`**: Quản lý phiên bản thủ tục hành chính theo từng giai đoạn pháp lý.
* **`AiPromptVersion`**: Quản lý phiên bản cấu hình system prompt của AI trợ lý tương ứng với thủ tục.
* **`ChecklistVersion`**: Quản lý phiên bản checklist kiểm tra thành phần hồ sơ và chỉ tiêu thẩm định.

*(Lưu ý: Đối với bảng `LegalDocument` - Văn bản pháp lý gốc, rollback không đổi trạng thái của luật/nghị định, mà chỉ tác động đến các bản version cấu hình thủ tục/prompt/checklist ánh xạ tới luật đó).*

### 3.2. Các dữ liệu TUYỆT ĐỐI KHÔNG ĐƯỢC tác động (Out-of-Scope / Immutable)
Quy trình rollback bị nghiêm cấm chạm tới hoặc làm thay đổi các vùng dữ liệu sau:
* **`AdministrativeProcedureCase`**: Toàn bộ dữ liệu hồ sơ thủ tục hành chính, bao gồm thông tin chủ sử dụng đất, thửa đất, tiến độ thụ lý.
* **`ProcedureAiAnalysis`**: Các báo cáo phân tích tác động, kết quả thẩm định AI đã tạo cho hồ sơ.
* **`ProcedureAiAnalysisLegalSnapshot`**: Các bản chụp tri thức pháp lý (đã đóng băng văn bản luật, prompt, checklist tại thời điểm AI chạy rà soát).
* **Trạng thái hồ sơ & Phân công:** Các tiến trình luân chuyển bước xử lý, cán bộ thụ lý hồ sơ.
* **Tài liệu đã xuất:** Các văn bản pháp lý, giấy chứng nhận, thông báo bổ sung/từ chối đã tạo hoặc ký số trong các bước thủ tục trước đó.

---

## 4. Rollback Conditions

Để một yêu cầu Rollback được hệ thống chấp nhận thực thi, toàn bộ các điều kiện tiên quyết sau phải được thỏa mãn đồng thời:

1. **Trạng thái nhật ký (`reviewStatus`):** Bản ghi nhật ký cập nhật (`LegalUpdateLog`) đang thao tác phải có trạng thái **`APPROVED`** (Đã phê duyệt). Không áp dụng rollback cho nhật ký `DRAFT`, `PENDING_REVIEW`, `IN_REVIEW`, hay `REJECTED`.
2. **Lịch sử kích hoạt (`activationHistory`):** Nhật ký phải từng được chạy quy trình kích hoạt thành công (trường `notes.activationHistory` tồn tại và có ít nhất 1 bản ghi lịch sử kích hoạt).
3. **Xác định rõ phiên bản đang `ACTIVE`:** Trong cùng phạm vi thủ tục (`procedureTypeId`) và loại cấu hình (`versionType`), hệ thống phải tìm thấy chính xác 01 phiên bản đang có trạng thái `status: 'ACTIVE'`.
4. **Xác định rõ phiên bản trước đó (`REPLACED`):** Hệ thống phải định danh được phiên bản liền kề trước đó vừa bị thay thế trong lần kích hoạt gần nhất (đang có trạng thái `status: 'REPLACED'`). Nếu không tồn tại bản `REPLACED` hợp lệ (ví dụ: đây là phiên bản v1.0 đầu tiên của hệ thống), lệnh rollback bị từ chối.
5. **Không có xung đột phiên bản (No Duplicate ACTIVE Versions):** Trước khi rollback, hệ thống tự động chạy rà soát. Nếu phát hiện tồn tại lớn hơn 1 bản ghi `ACTIVE` trong cùng phạm vi (lỗi dữ liệu cũ), hệ thống chặn rollback và yêu cầu xử lý chuẩn hóa dữ liệu trước.
6. **Thẩm quyền người dùng (`User Role`):** Tài khoản thực hiện lời gọi API phải có vai trò `ADMIN` hoặc `MANAGER`.
7. **Lý do khôi phục (Rollback Reason):** Người dùng bắt buộc phải điền văn bản giải trình lý do rollback, độ dài tối thiểu **20 ký tự**, mô tả chi tiết nguyên nhân hạ cấp phiên bản.
8. **Câu xác nhận bắt buộc (Mandatory Confirmation Phrase):** Để tránh bấm nhầm, người dùng phải gõ chính xác chuỗi ký tự xác nhận bắt buộc bằng chữ in hoa vào ô xác thực:
   - Chuỗi chuẩn tiếng Anh: **`ROLLBACK VERSION`**
   - Hoặc chuỗi chuẩn tiếng Việt không dấu: **`TOI XAC NHAN ROLLBACK VERSION`**

---

## 5. Multi-step Confirmation Design

Để đảm bảo nguyên tắc Human-in-the-Loop và kiểm soát rủi ro ở mức cao nhất, giao diện người dùng (UI) được thiết kế với quy trình xác nhận 4 bước tuần tự (Multi-step Rollback Modal):

```
+-------------------------------------------------------------------------------+
|                      BƯỚC 1: KIỂM TRA PHIÊN BẢN HIỆN TẠI                        |
|  - Hiển thị Version đang ACTIVE (ví dụ: v1.1 - Kích hoạt ngày 05/07/2026)    |
|  - Hiển thị người kích hoạt & tóm tắt thay đổi của version v1.1               |
+-------------------------------------------------------------------------------+
                                       ↓
+-------------------------------------------------------------------------------+
|                    BƯỚC 2: RÀ SOÁT PHIÊN BẢN DỰ KIẾN KHÔI PHỤC                  |
|  - Hiển thị Version trước đó đang REPLACED (ví dụ: v1.0 - Ngày 01/01/2026)     |
|  - Đối chiếu nội dung cấu hình, căn cứ pháp lý áp dụng của v1.0               |
+-------------------------------------------------------------------------------+
                                       ↓
+-------------------------------------------------------------------------------+
|                 BƯỚC 3: CAM KẾT GIỚI HẠN & TÁC ĐỘNG PHÁP LÝ                   |
|  - ⚠️ Cảnh báo đỏ: Rollback chỉ áp dụng cho hồ sơ mới tạo SAU thời điểm này.  |
|  - Cam kết: Hồ sơ TTHC cũ & kết quả rà soát AI cũ ĐƯỢC BẢO LƯU NGUYÊN VẸN.    |
+-------------------------------------------------------------------------------+
                                       ↓
+-------------------------------------------------------------------------------+
|                 BƯỚC 4: XÁC NHẬN LÝ DO & GÕ CHUỖI BẮT BUỘC                    |
|  - Nhập lý do rollback (>= 20 ký tự).                                         |
|  - Gõ chính xác: "ROLLBACK VERSION" hoặc "TOI XAC NHAN ROLLBACK VERSION".     |
|  [Hủy bỏ]                                          [Xác nhận Rollback (Khóa)] |
+-------------------------------------------------------------------------------+
```

### Chi tiết hành vi các bước:
- **Bước 1 (Current Active Version Inspection):** Người dùng rà soát lại chính xác phiên bản nào sắp bị hạ cấp. Hệ thống cảnh báo nếu phiên bản này mới được kích hoạt gần đây.
- **Bước 2 (Target Replaced Version Review):** Người dùng kiểm tra thông số của phiên bản sẽ được phục hồi. Đảm bảo bản v1.0 cũ đáp ứng đúng yêu cầu xử lý hồ sơ hiện tại.
- **Bước 3 (Impact & Boundary Acknowledgement):** Người dùng phải tích chọn checkbox cam kết: *"Tôi hiểu rằng thao tác này không làm thay đổi kết quả AI hay trạng thái của các hồ sơ thủ tục hành chính đã tiếp nhận trước đó."*
- **Bước 4 (Reason & Mandatory Phrase Verification):** Nút **"Xác nhận Rollback"** ở trạng thái disabled (mờ) cho đến khi ô lý do đạt >= 20 ký tự và ô ký tự khớp hoàn toàn chuỗi `ROLLBACK VERSION` hoặc `TOI XAC NHAN ROLLBACK VERSION`.

---

## 6. Backend Design Proposal

*(Lưu ý: Mục này chỉ thiết kế đặc tả kiến trúc kỹ thuật cho việc triển khai mã nguồn ở Phase sau. KHÔNG viết hay chỉnh sửa code backend trong Phase 8F-E-D-B hiện tại).*

### 6.1. Endpoint API dự kiến
- **URL:** `POST /api/legal-knowledge/update-logs/:id/rollback-version`
- **Authentication:** JWT Auth Guard (`@UseGuards(JwtAuthGuard, RolesGuard)`)
- **Authorization:** Role-Based Access Control (`@Roles(Role.ADMIN, Role.MANAGER)`)

### 6.2. DTO Đặc tả dữ liệu đầu vào (`RollbackActivatedVersionDto`)
```ts
export class RollbackActivatedVersionDto {
  @IsString({ message: 'Lý do rollback phải là chuỗi văn bản' })
  @MinLength(20, { message: 'Lý do rollback phải dài tối thiểu 20 ký tự' })
  rollbackReason: string;

  @IsString({ message: 'Câu xác nhận phải là chuỗi văn bản' })
  @Matches(/^(ROLLBACK VERSION|TOI XAC NHAN ROLLBACK VERSION)$/, {
    message: 'Câu xác nhận không chính xác. Vui lòng nhập ROLLBACK VERSION hoặc TOI XAC NHAN ROLLBACK VERSION',
  })
  confirmationText: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID phiên bản mục tiêu phải là UUID hợp lệ' })
  targetVersionId?: string; // Tùy chọn chỉ định version đích, nếu không truyền sẽ lấy bản REPLACED gần nhất
}
```

### 6.3. Service Method Thiết kế (`LegalKnowledgeService.rollbackActivatedVersion`)
- **Chữ ký hàm:** `async rollbackActivatedVersion(logId: string, dto: RollbackActivatedVersionDto, user: User)`
- **Quy trình kiểm tra nghiệp vụ (Validation Phase):**
  1. Truy vấn `LegalUpdateLog` theo `logId`. Ném lỗi `404 Not Found` nếu không tồn tại.
  2. Kiểm tra `log.reviewStatus === 'APPROVED'`. Nếu khác, ném lỗi `400 Bad Request` ("Chỉ có thể rollback nhật ký đã phê duyệt").
  3. Phân tích `log.notes`, kiểm tra sự tồn tại của `activationHistory`. Nếu trống, ném lỗi `400 Bad Request` ("Nhật ký chưa từng được kích hoạt").
  4. Gọi hàm rà soát tiêu chí kiểm chứng (tương đương logic `getActivationVerification`). Nếu phát hiện duplicate active versions, ném lỗi `409 Conflict`.

### 6.4. Nguyên tắc Transaction An toàn (Prisma Interactive Transaction `$transaction`)
Toàn bộ thao tác thay đổi cơ sở dữ liệu phải được bọc trong một Prisma Transaction với mức độ cách ly hợp lý nhằm đảm bảo tính Nguyên tử (Atomicity - ACID):

```ts
// MÔ TẢ PSEUDO-CODE TRANSACTION CHO PHASE TRIỂN KHAI SAU:
await this.prisma.$transaction(async (tx) => {
  // 1. Tìm phiên bản ACTIVE hiện tại gắn với nhật ký
  const currentActiveVersion = await tx.procedureTypeVersion.findFirst({
    where: { procedureTypeId: targetProcedureId, status: 'ACTIVE' }
  });
  if (!currentActiveVersion) throw new BadRequestException('Không tìm thấy phiên bản ACTIVE hiện tại');

  // 2. Tìm phiên bản REPLACED liền kề trước đó (hoặc theo targetVersionId)
  const previousReplacedVersion = await tx.procedureTypeVersion.findFirst({
    where: { 
      procedureTypeId: targetProcedureId, 
      status: 'REPLACED',
      id: dto.targetVersionId || undefined 
    },
    orderBy: { updatedAt: 'desc' }
  });
  if (!previousReplacedVersion) throw new BadRequestException('Không tìm thấy phiên bản trước đó để khôi phục');

  // 3. Hạ cấp phiên bản hiện tại từ ACTIVE -> REPLACED (Chốt ngày kết thúc hiệu lực)
  const now = new Date();
  await tx.procedureTypeVersion.update({
    where: { id: currentActiveVersion.id },
    data: { 
      status: 'REPLACED',
      effectiveTo: now
    }
  });

  // 4. Khôi phục phiên bản cũ từ REPLACED -> ACTIVE (Mở lại hiệu lực)
  await tx.procedureTypeVersion.update({
    where: { id: previousReplacedVersion.id },
    data: { 
      status: 'ACTIVE',
      effectiveTo: null // Hoặc thời hạn mới theo quy định
    }
  });

  // 5. Cập nhật nhật ký LegalUpdateLog.notes (Thêm rollbackHistory và workflowHistory)
  const updatedNotes = appendRollbackAuditTrail(log.notes, {
    rolledBackAt: now.toISOString(),
    rolledBackBy: { userId: user.id, username: user.username, role: user.role },
    reason: dto.rollbackReason,
    fromVersion: currentActiveVersion.versionNumber,
    toVersion: previousReplacedVersion.versionNumber,
    confirmationText: dto.confirmationText
  });

  await tx.legalUpdateLog.update({
    where: { id: logId },
    data: { notes: JSON.stringify(updatedNotes) }
  });
});
// TUYỆT ĐỐI KHÔNG CHỈNH SỬA BẢNG AdministrativeProcedureCase HAY ProcedureAiAnalysis
```

---

## 7. Frontend Design Proposal

*(Lưu ý: Mục này chỉ định hướng thiết kế giao diện UI/UX cho Phase sau. KHÔNG chỉnh sửa code JSX/React trong Phase 8F-E-D-B hiện tại).*

### 7.1. Điều kiện hiển thị Nút "Rollback version"
- **Vị trí:** Đặt trong khối **"Kiểm chứng sau kích hoạt (Read-only Audit Dashboard)"** bên trong Modal chi tiết `LegalUpdateLog` (Modal 7), ngay cạnh hoặc phía dưới nút "Kiểm tra sau kích hoạt".
- **Quyền truy cập (Role-based Visibility):**
  ```tsx
  const canShowRollbackButton = (userRole === 'ADMIN' || userRole === 'MANAGER') && 
                                selectedLogForDetail?.reviewStatus === 'APPROVED' &&
                                hasActivationHistory;
  ```
- **Ràng buộc phụ thuộc Verification State:**
  - Nút "Rollback version" mặc định bị **vô hiệu hóa (disabled)** hoặc ẩn nếu cán bộ chưa bấm nút "Kiểm tra sau kích hoạt" (`activation-verification`).
  - Sau khi chạy API kiểm chứng:
    - Nếu `overallStatus === 'PASS'` hoặc `'WARNING'`: Nút Rollback sáng lên (enabled), sẵn sàng cho phép thẩm định hạ cấp.
    - Nếu `overallStatus === 'FAIL'` (lỗi nghiêm trọng, xung đột version): Nút Rollback tiếp tục bị khóa (disabled) kèm tooltip: *"Không thể thực hiện rollback do phát hiện lỗi toàn vẹn dữ liệu. Vui lòng liên hệ quản trị viên."*

### 7.2. Thiết kế Thành phần Giao diện Modal Rollback
- **Huy hiệu & Màu sắc cảnh báo:** Sử dụng tone màu đỏ/hổ phách (Amber/Red) để phân biệt rõ với các nút thao tác thông thường. Nút bấm có icon `RotateCcw` hoặc `History`.
- **Thành phần Modal (UI Components):**
  1. **Header:** `[⚠️ Khôi phục phiên bản trước đó - Rollback Version]`
  2. **Banner cảnh báo đỏ:** Khung `Alert` màu đỏ mô tả rõ nguyên tắc không hồi tố đối với các hồ sơ cũ.
  3. **Bảng so sánh (Comparison Table):**
     | Thông số | Phiên bản hiện tại (Sắp hạ cấp) | Phiên bản khôi phục (Sắp áp dụng) |
     | :--- | :--- | :--- |
     | **Version Number** | `v1.1` (ACTIVE) | `v1.0` (REPLACED -> ACTIVE) |
     | **Ngày hiệu lực** | `05/07/2026 - Nay` | `01/01/2026 - Mở lại` |
     | **Tóm tắt cấu hình**| Bổ sung quy định mới theo Nghị định 102 | Cấu hình gốc Luật Đất đai 2024 |
  4. **Textarea Lý do:** `[ Nhập lý do nghiệp vụ cho việc rollback (tối thiểu 20 ký tự)... ]`
  5. **Input Xác nhận:** `[ Nhập "ROLLBACK VERSION" để xác nhận... ]`
  6. **Footer Action Buttons:** Nút `Hủy bỏ` (màu xám) và Nút `Xác nhận Rollback` (màu đỏ, hiển thị trạng thái loading spinner khi đang gọi API).

---

## 8. Audit Trail Design

Để bảo đảm tính minh bạch và tuân thủ các quy định kiểm toán hệ thống thông tin nhà nước, mọi hành động rollback được ghi nhận vĩnh viễn vào cấu trúc JSON bên trong trường `notes` của bảng `LegalUpdateLog`.

### Cấu trúc JSON chuẩn trong `LegalUpdateLog.notes`:
```json
{
  "activationHistory": [
    {
      "activatedAt": "2026-07-05T10:00:00.000Z",
      "activatedBy": {
        "userId": "usr-mgr-002",
        "username": "truongphong_datdai",
        "role": "MANAGER"
      },
      "procedureTypeVersion": { "id": "ver-proc-v1-1", "versionNumber": "v1.1" },
      "aiPromptVersion": { "id": "ver-prm-v1-1", "versionNumber": "v1.1" },
      "checklistVersion": { "id": "ver-chk-v1-1", "versionNumber": "v1.1" }
    }
  ],
  "workflowHistory": [
    {
      "action": "ACTIVATE_VERSION",
      "timestamp": "2026-07-05T10:00:00.000Z",
      "actor": "truongphong_datdai",
      "comment": "Kích hoạt đồng bộ bộ tiêu chí rà soát mới"
    },
    {
      "action": "ROLLBACK_VERSION",
      "timestamp": "2026-07-06T15:30:00.000Z",
      "actor": "admin_hethong",
      "comment": "Phát hiện sai sót trong cấu trúc thời gian thực hiện thủ tục tại phiên bản v1.1, cần khôi phục v1.0 để rà soát lại."
    }
  ],
  "rollbackHistory": [
    {
      "rolledBackAt": "2026-07-06T15:30:00.000Z",
      "rolledBackBy": {
        "userId": "usr-admin-001",
        "username": "admin_hethong",
        "role": "ADMIN"
      },
      "reason": "Phát hiện sai sót trong cấu trúc thời gian thực hiện thủ tục tại phiên bản v1.1, cần khôi phục v1.0 để rà soát lại.",
      "fromVersion": {
        "id": "ver-proc-v1-1",
        "versionNumber": "v1.1",
        "statusBefore": "ACTIVE",
        "statusAfter": "REPLACED",
        "effectiveToClosedAt": "2026-07-06T15:30:00.000Z"
      },
      "toVersion": {
        "id": "ver-proc-v1-0",
        "versionNumber": "v1.0",
        "statusBefore": "REPLACED",
        "statusAfter": "ACTIVE",
        "effectiveToReopenedAt": null
      },
      "affectedVersionType": "PROCEDURE_TYPE_VERSION",
      "confirmationText": "TOI XAC NHAN ROLLBACK VERSION",
      "postRollbackVerificationStatus": "PASS"
    }
  ]
}
```

**Đặc điểm kiểm toán:**
- Mảng `rollbackHistory` có tính chất **Additive Only (Chỉ thêm mới)**. Nếu một nhật ký trải qua nhiều lần rollback/kích hoạt lại trong vòng đời, toàn bộ các lần thao tác đều được lưu nối tiếp theo dòng thời gian.
- Dữ liệu này được đọc ra và hiển thị trong khối Read-only Audit Dashboard để Lãnh đạo có thể xem lại toàn bộ lịch sử thăng/giáng phiên bản của nhật ký.

---

## 9. Risk Analysis

Bảng tổng hợp phân tích 6 rủi ro trọng yếu khi thiết kế và vận hành tính năng Rollback, kèm theo các biện pháp giảm thiểu (Mitigation Measures) bắt buộc:

| STT | Rủi ro nhận diện (Identified Risk) | Mức độ | Nguyên nhân tiềm ẩn | Biện pháp giảm thiểu bắt buộc (Mitigation) |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Rollback nhầm version**<br>*(Accidental Rollback)* | **Cao** | Cán bộ thao tác do mệt mỏi hoặc thiếu chú ý, bấm nhầm nút rollback trên giao diện mà không đọc kỹ thông tin. | - Bắt buộc hiển thị Modal xác nhận 4 bước (Multi-step confirmation).<br>- Bắt buộc nhập chuỗi xác nhận `ROLLBACK VERSION` hoặc `TOI XAC NHAN ROLLBACK VERSION` mới mở khóa nút thực thi.<br>- Chỉ cho phép ADMIN/MANAGER thao tác. |
| **2** | **Duplicate ACTIVE versions**<br>*(Xung đột phiên bản active)* | **Nghiêm trọng** | Lỗi đường truyền, race condition hoặc lỗi dữ liệu cũ khiến sau khi rollback, cả version cũ và mới đều ở trạng thái `ACTIVE`. | - Bọc toàn bộ logic trong **Prisma Interactive Transaction (`$transaction`)** với khóa bản ghi.<br>- Bắt buộc chạy API `activation-verification` trước và sau khi rollback để kiểm chứng tiêu chí `noDuplicateActiveVersions`. |
| **3** | **Không tìm thấy previous version**<br>*(Missing Replaced Version)* | **Trung bình** | Phiên bản hiện tại là bản đầu tiên (v1.0) của hệ thống, chưa từng có phiên bản nào trước đó bị thay thế. | - Kiểm tra ràng buộc trong Service trước khi thực thi.<br>- Nếu query `findFirst({ where: { status: 'REPLACED' } })` trả về null, từ chối giao dịch với lỗi `400 Bad Request`: *"Không tồn tại phiên bản trước đó để khôi phục"*. |
| **4** | **Hồ sơ cũ bị ảnh hưởng**<br>*(Historical Case Corruption)* | **Nghiêm trọng** | Hiểu lầm kiến trúc hoặc lỗi code khiến lệnh rollback cập nhật lại cả căn cứ pháp lý của các hồ sơ TTHC đang thụ lý hoặc đã hoàn thành. | - Tuân thủ tuyệt đối nguyên tắc cách ly dữ liệu.<br>- Bảng `ProcedureAiAnalysisLegalSnapshot` lưu bản cứng (deep copy/snapshot reference) của luật tại thời điểm rà soát, hoàn toàn độc lập với trạng thái `ACTIVE` hay `REPLACED` của bảng version hiện tại. |
| **5** | **Người dùng hiểu nhầm phạm vi Rollback**<br>*(User Misconception)* | **Trung bình** | Cán bộ nghiệp vụ cho rằng khi rollback version luật về v1.0 thì các hồ sơ đã lỡ rà soát theo v1.1 sẽ tự động thay đổi kết quả thẩm định. | - Ghi chú cảnh báo đỏ nổi bật trên Modal Rollback và trong Hướng dẫn sử dụng: *"Rollback chỉ có hiệu lực với các hồ sơ tiếp nhận MỚI từ thời điểm này. Không thay đổi kết quả của hồ sơ cũ"*. |
| **6** | **Mất dấu vết kiểm toán**<br>*(Audit Trail Loss)* | **Cao** | Lỗi ghi đè JSON trong trường `notes` của `LegalUpdateLog` làm mất lịch sử kích hoạt (`activationHistory`) hoặc lịch sử rà soát cũ. | - Sử dụng hàm helper append JSON an toàn (tương tự `parseLogNotes`), đọc toàn bộ object `notes`, thêm phần tử mới vào mảng `rollbackHistory` và ghi lại.<br>- Viết unit test kiểm chứng không bị mất dữ liệu cũ khi ghi rollback log. |

---

## 10. Acceptance Criteria for Future Implementation

Khi Lãnh đạo ra lệnh triển khai viết mã nguồn (coding) cho Phase 8F-E-D-B ở các giai đoạn sau, bộ tiêu chí nghiệm thu (Acceptance Criteria - AC) sau đây bắt buộc phải được đáp ứng 100%:

1. **Backend Unit Tests Pass (100% Coverage cho luồng Rollback):**
   - Viết test suite mới trong `legal-knowledge.service.spec.ts` và `legal-knowledge.controller.spec.ts`.
   - Kiểm thử thành công kịch bản rollback hợp lệ (trạng thái chuyển đổi đúng, `effectiveTo` được cập nhật).
   - Kiểm thử từ chối khi user là `STAFF` hoặc `VIEWER` (lỗi `403 Forbidden`).
   - Kiểm thử từ chối khi sai câu xác nhận `confirmationText` (lỗi `400 Bad Request`).
   - Kiểm thử từ chối khi nhật ký không ở trạng thái `APPROVED` (lỗi `400 Bad Request`).
   - Kiểm thử từ chối khi không có bản `REPLACED` để khôi phục (lỗi `400 Bad Request`).
   - Kiểm thử đảm bảo tính nguyên tử (transaction rollback khi có exception).
2. **Production Build Pass:**
   - Lệnh `npm run build` tại `legalflow-backend` hoàn tất 0 lỗi TypeScript.
   - Lệnh `npm run build` tại root frontend hoàn tất 0 lỗi Vite/TypeScript.
3. **Không tạo Migration mới:**
   - Không được phép sửa `schema.prisma`.
   - Lệnh `npx prisma migrate status` phải báo cáo `Database schema is up to date!`.
4. **Bảo toàn tuyệt đối dữ liệu hồ sơ TTHC:**
   - Tổng số bản ghi và nội dung trong các bảng `AdministrativeProcedureCase`, `ProcedureAiAnalysis`, `ProcedureAiAnalysisLegalSnapshot` trước và sau khi chạy test rollback phải giống nhau 100%.
5. **Giao diện Multi-step Confirmation UI:**
   - Modal rollback hiển thị chuẩn 4 bước thẩm định.
   - Nút xác nhận bị khóa nếu nhập thiếu lý do hoặc sai câu lệnh xác nhận.
6. **Kiểm chứng tự động sau Rollback (Post-rollback Verification):**
   - Ngay sau khi API rollback trả về `200 OK`, frontend tự động kích hoạt gọi lại API `getActivationVerification(id)`.
   - Khối Read-only Audit Dashboard phải lập tức cập nhật trạng thái mới (`overallStatus: 'PASS'`), xác nhận phiên bản cũ đã được phục hồi thành công và không có xung đột.

---

## 11. Out of Scope

Định danh danh sách các hạng mục **KHÔNG NẰM TRONG PHẠM VI** của tài liệu thiết kế Phase 8F-E-D-B hiện tại (chỉ thiết kế, không triển khai):

1. ❌ **Không viết code Backend:** Không chỉnh sửa, bổ sung bất kỳ dòng code nào trong `legalflow-backend/src/legal-knowledge/` (không thêm endpoint controller, không viết service rollback).
2. ❌ **Không viết code Frontend:** Không chỉnh sửa trang `LegalKnowledgePage.tsx`, không thêm Modal Rollback, không sửa API client `src/lib/legalKnowledgeApi.ts`.
3. ❌ **Không sửa đổi Database Schema:** Không chạm vào `legalflow-backend/prisma/schema.prisma`.
4. ❌ **Không tạo Migration:** Không sinh ra bất kỳ file migration mới nào trong `prisma/migrations/`.
5. ❌ **Không sửa cấu hình Môi trường:** Không chỉnh sửa file `.env`, `.env.production`, hay `docker-compose.yml`.
6. ❌ **Không thay đổi trạng thái dữ liệu thực tế:** Không chạy lệnh rollback hay làm thay đổi bất kỳ bản ghi version nào trong cơ sở dữ liệu hiện tại của hệ thống.
7. ❌ **Không tự ý Commit hay Tag:** Không thực hiện bất kỳ lệnh `git commit`, `git tag`, hay `git push` nào thay cho Lãnh đạo.

---
**[HẾT TÀI LIỆU THIẾT KẾ PHASE 8F-E-D-B]**
