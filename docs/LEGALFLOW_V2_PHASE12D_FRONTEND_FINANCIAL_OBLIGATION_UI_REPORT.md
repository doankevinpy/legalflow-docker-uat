# BÁO CÁO KỸ THUẬT GIAI ĐOẠN 12D (PHASE 12D TECHNICAL REPORT)
**CHUYÊN ĐỀ: TRIỂN KHAI GIAO DIỆN NGƯỜI DÙNG MODULE HỖ TRỢ NGHĨA VỤ TÀI CHÍNH (FRONTEND FINANCIAL OBLIGATION UI IMPLEMENTATION)**

**Dự án:** LegalFlow - Hệ thống Quản lý & Giải quyết Thủ tục Hành chính Pháp lý thông minh  
**Phiên bản:** LegalFlow v2.0 (Phase 12D)  
**Ngày phát hành:** 12/07/2026  
**Thực hiện:** Đội ngũ Kỹ thuật & Chuyên gia AI Antigravity  
**Tình trạng:** Hoàn thành nghiệm thu kỹ thuật (Implementation & Build Verified)

---

## 1. MỤC TIÊU & BỐI CẢNH (EXECUTIVE SUMMARY & BACKGROUND)

Trong các thủ tục hành chính liên quan đến đất đai, tài sản, cấp Giấy chứng nhận quyền sử dụng đất (GCN), và chuyển nhượng, xác định và hoàn thành **Nghĩa vụ Tài chính (Financial Obligations)** là một bước bắt buộc và nhạy cảm.  
Trước giai đoạn Phase 12D, LegalFlow đã xây dựng thành công cơ sở hạ tầng Backend tại Phase 12A (Prisma schema, dịch vụ tính toán phí/lệ phí, kiểm soát rủi ro) và Phase 12C (RESTful API controllers, Audit trail, RBAC permissions). Tuy nhiên, người dùng (Cán bộ thụ lý `OFFICER`, Lãnh đạo `MANAGER`) chưa có giao diện tương tác trực tiếp, trực quan và an toàn trên Frontend để quản lý toàn diện quy trình này.

**Phase 12D** được thiết lập với mục tiêu xây dựng hệ sinh thái giao diện người dùng (Frontend UI Module) thuộc trang chi tiết hồ sơ `ProcedureCaseDetail.tsx`. Giao diện này không chỉ cung cấp các bảng biểu nhập liệu và chiết tính, mà quan trọng hơn là **hiện thực hóa các ràng buộc an toàn tuyệt đối (Strict Safety Constraints)** theo nguyên tắc **Human-in-the-Loop**, bảo đảm AI chỉ đóng vai trò hỗ trợ/dự toán, không bao giờ thay thế thẩm quyền của Cơ quan thuế nhà nước hoặc tự động phê duyệt hồ sơ.

---

## 2. NGUYÊN TẮC QUẢN TRỊ & RÀNG BUỘC KỸ THUẬT TUYỆT ĐỐI (STRICT SAFETY CONSTRAINTS)

Để ngăn ngừa rủi ro pháp lý và thất thoát tài chính nhà nước/công dân, Phase 12D tuân thủ nghiêm ngặt 6 nguyên tắc bất di bất dịch:

1. **Phạm vi can thiệp kỹ thuật tối thiểu (Minimal Technical Footprint):**  
   Chỉ chỉnh sửa code Frontend (`src/components/financial-obligations/`, `src/lib/`, `src/types/`, `src/pages/ProcedureCaseDetail.tsx`) và tài liệu. Tuyệt đối không sửa đổi Backend API, không thay đổi cấu trúc `schema.prisma`, và không tạo migration mới.

2. **Cảnh báo tính chất "DỰ KIẾN" bắt buộc (Mandatory Safety Banner):**  
   Trên giao diện chính của module luôn hiển thị băng rôn cảnh báo cố định với dòng chữ chuẩn hóa:  
   > *“BẢNG CHIẾT TÍNH DỰ KIẾN (CỦA HỆ THỐNG / AI) CHỈ CÓ TÍNH CHẤT THAM KHẢO, KHÔNG THAY THẾ THÔNG BÁO NỘP THUẾ CHÍNH THỨC CỦA CƠ QUAN THUẾ.”*

3. **Không thay thế thẩm quyền Cơ quan thuế (No Authority Override):**  
   Hệ thống không tự ý phát hành thông báo nộp thuế hay quyết định số tiền phải nộp chính thức. Mọi số liệu chính thức đều phải do Cán bộ nhập liệu từ Thông báo nộp thuế/Sách định thuế của Cơ quan thuế ban hành.

4. **Kiểm soát Hoàn thành nghiêm ngặt (Controlled Completion - Completion Blocker):**  
   Nút *“Xác nhận Hoàn thành Nghĩa vụ Tài chính (`Mark Completed`)”* phải **bị vô hiệu hóa (`disabled`) hoặc hiển thị thông báo chặn** nếu hồ sơ chưa đáp ứng đầy đủ Checklist 4 điều kiện bắt buộc:
   - Đã có Thông báo nộp thuế chính thức từ Cơ quan thuế (`TaxNoticeRecord`).
   - Đã tải lên và xác minh đầy đủ Chứng từ/Biên lai nộp tiền hợp lệ (`PaymentEvidenceRecord`).
   - Cán bộ thụ lý đã kiểm tra đối chiếu hồ sơ gốc và xác nhận hợp lệ (`OFFICER_VERIFIED`).
   - Lãnh đạo đã xem xét và phê duyệt (đối với hồ sơ rủi ro cao hoặc có miễn giảm tiền sử dụng đất - `MANAGER_VERIFIED`).

5. **Không tự động gửi thông báo bên ngoài (No External Auto-Messaging):**  
   Frontend UI chỉ hiển thị thông báo ngay tại giao diện. Tuyệt đối không tự động phát sinh các tác vụ gửi Email, SMS, hay tin nhắn Zalo/OTT ra bên ngoài mà không có lệnh thực thi rõ ràng từ người dùng.

6. **Minh bạch dấu vết kiểm toán (Complete Audit Trail Transparency):**  
   Mọi thao tác khởi tạo bảng chiết tính, gọi AI dự toán, cập nhật khoản mục, ghi nhận thông báo thuế, tải chứng từ, xác nhận của cán bộ/lãnh đạo đều được hiển thị chi tiết trong tab Nhật ký Kiểm toán (`Audit Trail Panel`), không cho phép xóa hay chỉnh sửa lịch sử.

---

## 3. KIẾN TRÚC & CÁC MODULE UI TRIỂN KHAI (FRONTEND ARCHITECTURE & COMPONENTS)

Toàn bộ kiến trúc Frontend mới được xây dựng theo mô hình Modular Component-Driven, tập trung trong thư mục `src/components/financial-obligations/`:

```
src/
├── types/
│   └── financial-obligation.ts          # Định nghĩa TypeScript contracts & Interfaces
├── lib/
│   └── financialObligationsApi.ts         # Client API Layer giao tiếp Backend
├── components/
│   └── financial-obligations/
│       ├── FinancialObligationSafetyBanner.tsx      # Băng rôn cảnh báo pháp lý AI & Cơ quan thuế
│       ├── FinancialObligationStatusCard.tsx        # Thẻ tổng quan trạng thái & Rủi ro
│       ├── MissingInfoChecklist.tsx                 # Checklist kiểm tra điều kiện mở khóa nút Hoàn thành
│       ├── FinancialObligationEstimatePanel.tsx     # Bảng chiết tính dự kiến (AI Draft + Manual Items)
│       ├── TaxNoticePanel.tsx                       # Panel ghi nhận Thông báo nộp thuế chính thức
│       ├── PaymentEvidencePanel.tsx                 # Panel tải chứng từ/biên lai nộp tiền
│       ├── OfficerVerificationPanel.tsx             # Panel đối chiếu hồ sơ gốc của Cán bộ
│       ├── ManagerVerificationPanel.tsx             # Panel phê duyệt rủi ro/miễn giảm của Lãnh đạo
│       ├── FinancialObligationAuditLogPanel.tsx     # Panel nhật ký kiểm toán 9 sự kiện pháp lý
│       └── FinancialObligationPanel.tsx             # Main Orchestrator Panel (Tích hợp vào Case Detail)
└── pages/
    └── ProcedureCaseDetail.tsx                      # Trang chi tiết hồ sơ thủ tục hành chính
```

### 3.1. Chi tiết chuyên môn từng Component

#### 1. `FinancialObligationSafetyBanner.tsx`
- **Thiết kế:** Box cảnh báo màu cam (`bg-amber-50 / border-amber-300 / text-amber-900`) với icon `AlertTriangle`.
- **Nội dung:** Khẳng định tính chất tham khảo của bảng chiết tính AI, nhắc nhở trách nhiệm đối chiếu hồ sơ gốc và quyết định cuối cùng của Cơ quan thuế.

#### 2. `FinancialObligationStatusCard.tsx`
- **Nhiệm vụ:** Trình bày cái nhìn trực quan về tiến trình hồ sơ qua các mốc `DRAFT -> AI_SUGGESTED -> OFFICER_REVIEWED -> MANAGER_REVIEWED -> COMPLETED`.
- **Chỉ số:** So sánh trực tiếp giữa `Tổng số tiền dự kiến (Estimated Amount)` và `Tổng số tiền chính thức (Tax Notice Amount)`. Hiển thị nhãn rủi ro cao (`High Risk`) nếu phát hiện yếu tố miễn giảm hoặc bất thường.

#### 3. `MissingInfoChecklist.tsx`
- **Nhiệm vụ:** Là công cụ dẫn đường trực quan giúp cán bộ nhận biết lý do vì sao hồ sơ chưa thể xác nhận hoàn thành.
- **Tiêu chí kiểm duyệt:**
  - `[✓/✕]` Thông báo thuế chính thức (Số thông báo, Ngày nhận).
  - `[✓/✕]` Chứng từ nộp tiền hợp lệ đủ số tiền nộp.
  - `[✓/✕]` Cán bộ xử lý đã thẩm định đối chiếu (`OFFICER_VERIFIED`).
  - `[✓/✕]` Phê duyệt của Lãnh đạo (`MANAGER_VERIFIED` nếu `isHighRisk`).

#### 4. `FinancialObligationEstimatePanel.tsx`
- **Nhiệm vụ:** Quản lý bảng chiết tính dự kiến ban đầu.
- **Tính năng AI:** Nút `AI Hỗ trợ Dự toán (`Generate Draft`)` cho phép gọi AI phân tích thông tin thửa đất/tài sản và đề xuất các khoản mục tiền sử dụng đất, lệ phí trước bạ, phí thẩm định.
- **Thao tác thủ công:** Modal thêm mới/sửa khoản mục với đầy đủ các loại (`LEGAL_FEE`, `REGISTRATION_TAX`, `LAND_USE_TAX`...) và trường giải trình `Căn cứ pháp lý (`Calculation Basis`)`.

#### 5. `TaxNoticePanel.tsx`
- **Nhiệm vụ:** Nơi ghi nhận dữ liệu chính thức từ Cơ quan thuế sau khi người dân/doanh nghiệp nhận được Thông báo nộp tiền.
- **Trường thông tin:** Số thông báo thuế (`noticeNumber`), Ngày ký (`issueDate`), Ngày người dân nhận (`receivedDate`), Tổng số tiền (`totalAmount`), Ghi chú và Mã file đính kèm (`fileAttachmentId`).

#### 6. `PaymentEvidencePanel.tsx`
- **Nhiệm vụ:** Nơi cập nhật minh chứng hoàn thành nghĩa vụ tài chính thực tế của công dân.
- **Trường thông tin:** Số chứng từ/Biên lai (`documentNumber`), Ngày nộp (`paymentDate`), Số tiền (`amount`), File scan chứng từ (`fileAttachmentId`).

#### 7. `OfficerVerificationPanel.tsx` & `ManagerVerificationPanel.tsx`
- **Thẩm quyền:** Phân tách rõ ràng giao diện theo thẩm quyền cán bộ và lãnh đạo.
- **Cán bộ (`Officer`):** Xác nhận đã đối chiếu bản gốc hoặc yêu cầu bổ sung thông tin (`INFO_REQUESTED`).
- **Lãnh đạo (`Manager`):** Phê duyệt hoặc từ chối đối với hồ sơ có mức độ rủi ro cao hoặc có xin miễn giảm. Nếu hồ sơ không thuộc diện rủi ro cao, panel hiển thị thông báo trạng thái `NOT_REQUIRED`.

#### 8. `FinancialObligationAuditLogPanel.tsx`
- **Nhiệm vụ:** Hiển thị danh sách dấu vết kiểm toán (`Audit Logs`) với icon và màu sắc đặc trưng cho từng sự kiện:
  - `ASSESSMENT_CREATED` (Màu xanh dương)
  - `AI_SUGGESTION_GENERATED` (Màu tím AI)
  - `ITEM_CREATED` / `ITEM_UPDATED` (Màu xám)
  - `TAX_NOTICE_UPLOADED` (Màu cam)
  - `PAYMENT_EVIDENCE_UPLOADED` (Màu ngọc lục bảo)
  - `OFFICER_VERIFIED` / `MANAGER_VERIFIED` (Màu xanh lá)
  - `COMPLETED` (Màu xanh đậm/Vàng kim)

#### 9. `FinancialObligationPanel.tsx` (Main Orchestrator)
- **Nhiệm vụ:** Điều phối toàn bộ dữ liệu, lắng nghe thay đổi trạng thái từ các panel con, và tính toán điều kiện khóa (`Checklist Logic`).
- **Xử lý lỗi chặn (`Completion Blocker`):** Khi người dùng nhấn Hoàn thành mà hồ sơ chưa đủ điều kiện, hệ thống chặn ngay lập tức, hiển thị alert lỗi đỏ giải thích rõ các điều kiện còn thiếu, bảo đảm tuân thủ quy tắc 4 (Controlled Completion).

---

## 4. KẾT QUẢ KIỂM TRA ĐẢM BẢO CHẤT LƯỢNG (QUALITY ASSURANCE & BUILD VERIFICATION)

Đội ngũ kỹ thuật đã thực hiện rà soát tĩnh (ESLint) và biên dịch kiểm tra cấu trúc toàn bộ dự án Frontend trên môi trường `legalflow-docker-uat`:

```bash
# 1. Kiểm tra lints chuyên sâu cho các file thuộc Phase 12D
$ npx eslint src/types/financial-obligation.ts src/lib/financialObligationsApi.ts src/components/financial-obligations/
> Output: 0 problems (0 errors, 0 warnings)

# 2. Biên dịch Production Build
$ npm run build
> tsc -b && vite build
vite v8.0.12 building client environment for production...
transforming...✓ 3189 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.47 kB │ gzip:   0.30 kB
dist/assets/index-CBETwsPE.css    114.55 kB │ gzip:  16.82 kB
dist/assets/index-dFden8np.js   1,582.55 kB │ gzip: 405.75 kB
✓ built in 1.66s
```

**Kết luận đánh giá kỹ thuật:**
- **Zero TypeScript Errors:** Toàn bộ code viết bằng TypeScript strict typing, không sử dụng `any` vô tổ chức trong các catch blocks hay event handlers.
- **Zero React Hooks Warnings:** Đã loại bỏ hoàn toàn hiện tượng gọi `setState` đồng bộ bên trong thân `useEffect` (`react-hooks/set-state-in-effect`), tối ưu hóa hiệu năng render.
- **Zero Backend Regressions:** Không có bất kỳ thay đổi nào tác động đến Backend API hay Prisma Database.

---

## 5. TỔNG KẾT & BƯỚC TIẾP THEO (CONCLUSION & NEXT STEPS)

Giai đoạn **Phase 12D** đã hoàn tất với độ chính xác cao nhất, mang đến cho người dùng LegalFlow một giao diện xử lý nghĩa vụ tài chính hiện đại, trực quan, minh bạch, và an toàn tuyệt đối về mặt pháp lý.

**Đề xuất lộ trình tiếp theo (`Phase 12E: E2E Verification & Integration Testing`):**
- Tiến hành chạy bộ kiểm thử toàn trình End-to-End (E2E Playwright / UAT Manual) kết nối giữa Frontend UI Phase 12D và Backend API Phase 12C.
- Kiểm chứng thực tế các kịch bản hồ sơ từ `DRAFT -> AI_SUGGESTED -> OFFICER_VERIFIED -> MANAGER_VERIFIED -> COMPLETED` trên môi trường kiểm thử thực tế.
