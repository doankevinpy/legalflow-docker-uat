# LEGALFLOW V2 - PHASE 8F-E-D-F

# LEGAL VERSION GOVERNANCE SUMMARY

**Ngày phát hành:** 06/07/2026  
**Mô-đun:** Quản trị Phiên bản Pháp lý & Kiểm toán (Legal Knowledge Version Governance & Audit Track)  
**Trạng thái:** ĐÃ HOÀN THÀNH (100% Architecture & Documentation)  

---

## 1. Purpose

Tài liệu này tổng kết toàn diện kiến trúc **Quản trị Phiên bản Pháp lý (Legal Version Governance)** trong hệ thống LegalFlow V2. Kiến trúc được thiết kế nhằm giải quyết bài toán phức tạp trong quản lý sự thay đổi của pháp luật đất đai và thủ tục hành chính (TTHC), bảo đảm tính toàn vẹn, tính kiểm toán (auditability) và tính nhân sự can thiệp (Human-in-the-Loop) tuyệt đối.

Hệ thống LegalFlow V2 cung cấp nền tảng hỗ trợ trọn gói các năng lực quản trị:
- **Quản lý căn cứ pháp lý**: Tổ chức, định danh và kết nối mối quan hệ hiệu lực giữa các văn bản pháp luật (Luật, Nghị định, Thông tư, Quyết định).
- **Tạo version nháp (Draft Version Creation)**: Tự động khởi tạo phiên bản dự thảo cho Thủ tục hành chính, Prompt AI và Checklist dựa trên kết quả phân tích tác động pháp lý.
- **Chạy thử version nháp (Draft Simulation & Shadow Testing)**: Kiểm thử song song phiên bản nháp trên các hồ sơ TTHC thực tế mà không làm thay đổi dữ liệu chính thức.
- **Kích hoạt thủ công (Manual Activation)**: Chuyển đổi trạng thái hiệu lực từ bản nháp sang chính thức thông qua cơ chế phê duyệt nhiều bước nghiêm ngặt.
- **Kiểm chứng sau kích hoạt (Post-activation Verification)**: Thẩm định chỉ đọc (read-only) tình trạng CSDL ngay sau khi ban hành phiên bản mới.
- **Rollback thủ công (Manual Version Rollback)**: Hoàn tác nhanh chóng về phiên bản trước đó khi phát hiện sai sót pháp lý hoặc bất thường trong triển khai.
- **Kiểm chứng sau rollback (Post-rollback Verification)**: Hậu kiểm độc lập bảo đảm tính toàn vẹn dữ liệu sau thao tác hoàn tác.
- **Lưu trữ Audit Trail**: Ghi vết bất biến toàn bộ lịch sử rà soát, kiểm thử, kích hoạt và hoàn tác phục vụ thanh tra, kiểm tra pháp lý.

---

## 2. Governance Principles

Toàn bộ chuỗi tính năng Quản trị Phiên bản Pháp lý trong LegalFlow V2 được xây dựng trên 7 nguyên tắc tối cao:

1. **Human-in-the-Loop (Con người là trung tâm quyết định)**: Mọi quyết định thay đổi trạng thái pháp lý đều phải do cán bộ nghiệp vụ hoặc lãnh đạo có thẩm quyền phê duyệt và thực thi.
2. **AI chỉ hỗ trợ, không tự quyết định (AI Assistance Only)**: Trí tuệ nhân tạo đóng vai trò phân tích tác động, gợi ý sửa đổi và tổng hợp rủi ro; AI không có quyền thay thế ý chí pháp lý của con người.
3. **Không AI nào được tự cập nhật căn cứ pháp lý**: Không một tiến trình nền hay mô hình AI nào được phép tự động thêm mới, sửa đổi hay xóa bỏ văn bản pháp luật trong hệ thống.
4. **Không AI nào được tự kích hoạt version**: Việc chuyển đổi trạng thái `DRAFT` $\rightarrow$ `ACTIVE` tuyệt đối không được thực hiện tự động bởi AI dưới bất kỳ hình thức nào.
5. **Không AI nào được tự rollback**: Thao tác hoàn tác (`ACTIVE` $\leftrightarrow$ `REPLACED`) đòi hỏi thẩm định của lãnh đạo và không bao giờ tự động kích hoạt bởi AI.
6. **Cán bộ/lãnh đạo phải kiểm tra trước khi dùng**: Trước mỗi quyết định ban hành hay hoàn tác, người dùng bắt buộc phải xem xét các chỉ số phân tích, kết quả chạy thử (simulation) và đọc kỹ khuyến cáo an toàn.
7. **Cảnh báo pháp lý bắt buộc trên mọi kết quả AI**: Mọi giao diện, báo cáo phân tích và phiếu rà soát AI xuất ra đều phải in đậm lời nhắc nhở pháp lý chuẩn:
   > **⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA:** Căn cứ pháp lý hiển thị là phiên bản dữ liệu hệ thống ghi nhận tại thời điểm AI rà soát; cán bộ phải kiểm tra văn bản pháp luật hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ địa phương tại thời điểm xử lý hồ sơ.

---

## 3. Version Lifecycle

Vòng đời của một phiên bản tri thức pháp lý trong LegalFlow V2 trải qua 10 giai đoạn chuẩn hóa, khép kín và có thể truy xuất ngược hoàn toàn:

```
[1. Legal Update Detected/Created]
               │
               ▼
      [2. Impact Analysis]
               │
               ▼
     [3. Review Workflow] (START_REVIEW -> ADD_NOTE -> APPROVE_FOR_VERSIONING)
               │
               ▼
   [4. Draft Version Creation] (ProcedureTypeVersion, AiPromptVersion, ChecklistVersion: DRAFT)
               │
               ▼
[5. Draft Simulation / Shadow Testing] (Test on sample TTHC cases -> Risk flags & Diff summary)
               │
               ▼
     [6. Manual Activation] (4-step confirmation -> Atomic DB switch: DRAFT->ACTIVE, ACTIVE->REPLACED)
               │
               ▼
[7. Post-activation Verification] (Read-only audit: PASS/WARNING/FAIL -> Anti-duplication check)
               │
               ├────────────────────────────────────────┐
               │ (Normal Operation)                     │ (If error/issue detected)
               ▼                                        ▼
   [10. Audit Trail Retained]             [8. Manual Rollback If Needed] (4-step confirmation)
                                                        │
                                                        ▼
                                          [9. Post-rollback Verification] (Read-only audit: PASS/WARNING/FAIL)
                                                        │
                                                        ▼
                                          [10. Audit Trail Retained] (Immutable history preserved)
```

1. **Legal update detected / created**: Phát hiện hoặc nhập liệu văn bản pháp luật mới (Luật, Nghị định, Quyết định).
2. **Impact analysis**: AI phân tích tác động đến kho căn cứ, thủ tục, prompt, checklist và các hồ sơ đang xử lý.
3. **Review workflow**: Cán bộ/lãnh đạo thực hiện rà soát, trao đổi ý kiến và phê duyệt hướng xử lý.
4. **Draft version creation**: Hệ thống khởi tạo các bản nháp (`DRAFT`) cho thủ tục, prompt AI và checklist.
5. **Draft simulation / shadow testing**: Chạy thử nghiệm bản nháp trên hồ sơ mẫu, đánh giá điểm khác biệt và rủi ro.
6. **Manual activation**: Lãnh đạo thực hiện xác nhận 4 bước để kích hoạt chính thức phiên bản mới.
7. **Post-activation verification**: Hậu kiểm read-only xác minh tính đúng đắn của CSDL ngay sau kích hoạt.
8. **Manual rollback if needed**: Nếu phát hiện bất thường, Lãnh đạo thực hiện hoàn tác khẩn cấp về phiên bản trước đó.
9. **Post-rollback verification**: Hậu kiểm read-only xác minh phiên bản cũ đã phục hồi thành công và an toàn.
10. **Audit trail retained**: Toàn bộ nhật ký, ghi chú và các mảng lịch sử được lưu trữ vĩnh viễn phục vụ kiểm toán.

---

## 4. Versioned Objects

Hệ thống quản trị đồng bộ 7 nhóm đối tượng cốt lõi trong cơ sở dữ liệu (Prisma Schema):

1. **`ProcedureTypeVersion`**: Quản lý phiên bản cấu hình thủ tục hành chính (thời gian hiệu lực, căn cứ pháp lý áp dụng, tài liệu yêu cầu).
2. **`AiPromptVersion`**: Quản lý phiên bản system prompt của AI trợ lý tương ứng với từng thủ tục và giai đoạn pháp luật.
3. **`ChecklistVersion`**: Quản lý phiên bản danh mục thành phần hồ sơ và tiêu chí kiểm tra nghiệp vụ.
4. **`LegalDocument`**: Quản lý văn bản pháp luật nguồn (Mã số, cơ quan ban hành, ngày ban hành/hiệu lực, trạng thái hiệu lực).
5. **`LegalDocumentRelation`**: Quản lý mối quan hệ cấu trúc giữa các văn bản (`REPLACES`, `AMENDS`, `GUIDES`, `IMPLEMENTS`, `REFERENCES`, `SUPERSEDES`).
6. **`LegalUpdateLog`**: Nhật ký trung tâm theo dõi quá trình biến động chính sách, lưu trữ toàn bộ lịch sử workflow, simluation, activation và rollback.
7. **`ProcedureAiAnalysisLegalSnapshot`**: Bản chụp bất biến lưu vết chính xác cấu hình pháp lý (mã version của KB, Procedure, Prompt, Checklist) đã áp dụng cho từng lần AI thẩm tra hồ sơ TTHC.

---

## 5. Manual Activation Governance

Quy trình kích hoạt phiên bản thủ công (`Manual Activation`) được kiểm soát bởi các quy tắc quản trị nghiêm ngặt:

- **Điều kiện activation (Activation Conditions)**: Nhật ký cập nhật (`LegalUpdateLog`) phải đạt trạng thái `APPROVED` (Đã phê duyệt hướng xử lý) và đã tồn tại các phiên bản dự thảo (`draftVersions`).
- **Xác nhận nhiều bước (Multi-step Confirmation)**: Lãnh đạo phải vượt qua modal 4 bước kiểm tra (Xem version hiện hành $\rightarrow$ Xem version dự kiến kích hoạt $\rightarrow$ Nhập ghi chú chỉ đạo $\rightarrow$ Xác nhận bắt buộc).
- **Confirmation text**: Yêu cầu nhập chính xác chuỗi `ACTIVATE VERSION` hoặc `TOI XAC NHAN ACTIVATE VERSION` để loại bỏ rủi ro bấm nhầm.
- **Chỉ ADMIN/MANAGER**: Phân quyền RBAC tuyệt đối, chặn truy cập từ các vai trò `STAFF` và `VIEWER` từ tầng Guard backend đến UI frontend.
- **Giao dịch nguyên tử (Prisma `$transaction`)**: Chuyển đổi trạng thái đảm bảo tính nguyên tử - phiên bản `DRAFT` thành `ACTIVE` (`effectiveFrom = now()`), đồng thời phiên bản `ACTIVE` cũ chuyển thành `REPLACED` (`effectiveTo = now()`) trong cùng một giao dịch.
- **Audit trail**: Ghi nhận thời gian, người thực hiện, vai trò và ghi chú vào mảng `activationHistory` (JSON `notes`) và thêm sự kiện `ACTIVATE_DRAFT_VERSION` vào `workflowHistory`.
- **Không sửa hồ sơ TTHC**: Tuyệt đối không can thiệp vào bảng `administrative_procedure_cases`.
- **Không sửa AI analysis cũ**: Tuyệt đối không thay đổi dữ liệu trong bảng `procedure_ai_analyses`.
- **Không sửa legal snapshot cũ**: Tuyệt đối bảo toàn lịch sử trong bảng `procedure_ai_analysis_legal_snapshots`.

---

## 6. Post-activation Verification

Hệ thống cung cấp cơ chế hậu kiểm độc lập sau kích hoạt để thanh tra tính toàn vẹn hệ thống:

- **Endpoint**: `GET /api/legal-knowledge/update-logs/:id/activation-verification`
- **Tích chất Read-only**: Phương thức chỉ đọc dữ liệu, tuyệt đối không phát sinh lệnh sửa đổi hay ghi đè CSDL.
- **Trạng thái đánh giá (PASS / WARNING / FAIL)**:
  - **`PASS`**: 100% chỉ số đạt chuẩn, phiên bản mới đã ACTIVE, phiên bản cũ đã REPLACED, không có duplicate active version.
  - **`WARNING`**: CSDL đạt chuẩn an toàn lõi nhưng thiếu thông tin ghi nhận trong log notes (ví dụ: nhật ký cũ chưa ghi `activationHistory`).
  - **`FAIL`**: Phát hiện lỗi nghiêm trọng trong CSDL (như có duplicate ACTIVE version, version cũ chưa kết thúc hiệu lực, hoặc dữ liệu hồ sơ bị alteration).
- **Kiểm tra ACTIVE / REPLACED**: Xác minh chính xác trạng thái hiệu lực của từng cặp version trước và sau kích hoạt.
- **Duplicate ACTIVE check**: Rà soát quy tắc độc quyền (Anti-duplication rule) - bảo đảm tại một thời điểm chỉ có 01 bản `ACTIVE` trong cùng phạm vi thủ tục.
- **Audit trail & Data preservation**: Đếm số lượng hồ sơ TTHC và snapshot pháp lý, xác nhận 100% dữ liệu lịch sử được giữ nguyên nguyên trạng (`preserved`).

---

## 7. Manual Rollback Governance

Quy trình hoàn tác phiên bản thủ công (`Manual Version Rollback`) được thiết kế như một chốt an toàn khẩn cấp với các tiêu chuẩn khắt khe:

- **Rollback thủ công**: Không bao giờ diễn ra tự động. Chỉ kích hoạt dưới sự điều hành trực tiếp của con người.
- **Chỉ ADMIN/MANAGER**: Phân quyền RBAC mức cao nhất, bảo vệ hệ thống khỏi các can thiệp không đủ thẩm quyền.
- **`rollbackReason` bắt buộc**: Yêu cầu người thực hiện phải nhập lý do hoàn tác chi tiết (tối thiểu 10 ký tự) để phục vụ giải trình và lưu hồ sơ kiểm toán.
- **`confirmationText` bắt buộc**: Yêu cầu gõ chính xác chuỗi xác nhận `ROLLBACK VERSION` hoặc `TOI XAC NHAN ROLLBACK VERSION`.
- **Giao dịch nguyên tử (Prisma `$transaction`)**: Chuyển đổi trạng thái phiên bản hiện tại từ `ACTIVE` $\rightarrow$ `REPLACED` (`effectiveTo = now()`) và phục hồi phiên bản trước đó từ `REPLACED` $\rightarrow$ `ACTIVE` (`effectiveTo = null`) một cách đồng bộ.
- **`rollbackHistory` logging**: Ghi nhận chi tiết nguyên nhân, thời gian, người rollback vào mảng `rollbackHistory` trong trường `notes` của nhật ký.
- **Workflow action `ROLLBACK_VERSION`**: Thêm sự kiện hoàn tác vào dòng thời gian của `workflowHistory`.
- **Không xóa version**: Phiên bản bị hoàn tác không bị xóa khỏi hệ thống mà chuyển sang trạng thái `REPLACED` (lưu vết lịch sử sai sót).
- **Không sửa hồ sơ cũ**: Các hồ sơ TTHC đã và đang xử lý trong thời gian phiên bản lỗi có hiệu lực vẫn được bảo toàn nguyên trạng, không bị chỉnh sửa hay lùi trạng thái.

---

## 8. Post-rollback Verification

Hệ thống tích hợp bảng kiểm chứng sau hoàn tác nhằm thẩm định an toàn sau khi thực hiện rollback:

- **Endpoint**: `GET /api/legal-knowledge/update-logs/:id/rollback-verification`
- **Tích chất Read-only**: Thẩm định hoàn toàn chỉ đọc, không tạo ra bất kỳ phản ứng dây chuyền hay tác động lặp lại nào.
- **Trạng thái đánh giá (PASS / WARNING / FAIL)**: Phân cấp đánh giá tổng quan tương tự hậu kiểm kích hoạt, giúp Lãnh đạo nắm bắt ngay tình trạng sức khỏe CSDL.
- **Kiểm tra `rollbackHistory` & `ROLLBACK_VERSION`**: Xác nhận sự kiện hoàn tác đã được lưu vết đầy đủ trong nhật ký workflow và lịch sử rollback.
- **Restored ACTIVE vs Previous REPLACED**: Đối chiếu CSDL xác nhận phiên bản đích đã phục hồi hiệu lực (`ACTIVE`) và phiên bản sai sót đã bị thay thế (`REPLACED`).
- **No duplicate ACTIVE**: Rà soát quy tắc chống trùng lặp, bảo đảm chỉ có duy nhất 01 phiên bản ACTIVE tồn tại sau rollback.
- **Cases / AI / Snapshots preserved**: Xác nhận 100% hồ sơ TTHC, kết quả thẩm tra AI và legal snapshot trong quá khứ không bị ảnh hưởng hay thay đổi sau thời điểm rollback.

---

## 9. Audit Trail Model

Mô hình lưu trữ kiểm toán (Audit Trail Model) của LegalFlow V2 được thiết kế theo hướng **bổ sung tăng cường (Additive & Non-destructive)**. Toàn bộ chuỗi sự kiện được ghi vết mạch lạc bên trong trường `notes` (kiểu JSON) của bảng `LegalUpdateLog`:

1. **`workflowHistory`**: Mảng lưu trữ dòng thời gian các bước rà soát nghiệp vụ (`START_REVIEW`, `ADD_NOTE`, `REQUEST_MORE_INFO`, `APPROVE_FOR_VERSIONING`, `REJECT`, `CLOSE`, `ACTIVATE_DRAFT_VERSION`, `ROLLBACK_VERSION`).
2. **`simulations`**: Mảng lưu trữ kết quả chạy thử nghiệm bản nháp (Shadow Testing), bao gồm điểm tin cậy so sánh, danh sách khác biệt và rủi ro phát hiện trên hồ sơ mẫu.
3. **`draftVersions`**: Đối tượng ánh xạ mã ID của các phiên bản dự thảo (`ProcedureTypeVersion`, `AiPromptVersion`, `ChecklistVersion`) được khởi tạo từ nhật ký.
4. **`activationHistory`**: Mảng lưu vết các lần kích hoạt phiên bản (thời gian, người kích hoạt, vai trò, ghi chú chỉ đạo, danh sách version cũ/mới).
5. **`rollbackHistory`**: Mảng lưu vết các lần hoàn tác phiên bản (thời gian, người hoàn tác, vai trò, lý do hoàn tác, danh sách version khôi phục/bị thay thế).
6. **`verification response`**: Cấu trúc phản hồi chuẩn hóa của API kiểm chứng, sẵn sàng cho việc xuất báo cáo thanh tra hoặc lưu trữ hồ sơ kiểm toán số.

---

## 10. Safety Boundary

Để bảo đảm tính tuân thủ pháp luật và giữ vững trách nhiệm công vụ, hệ thống LegalFlow V2 thiết lập **Đường ranh giới an toàn tuyệt đối (Absolute Safety Boundary)**. Hệ thống và trí tuệ nhân tạo **TUYỆT ĐỐI KHÔNG TỰ ĐỘNG**:

1. **Không tự ký văn bản**: AI không có chữ ký số và không được quyền ký duyệt bất kỳ tài liệu pháp lý hay phiếu rà soát nào.
2. **Không tự gửi văn bản**: Không tự động phát hành hay gửi công văn, quyết định đến người dân hay cơ quan liên quan khi chưa có lệnh của cán bộ.
3. **Không tự thay đổi trạng thái hồ sơ**: Không tự động chuyển hồ sơ TTHC từ `PROCESSING` sang `APPROVED` hay `REJECTED`.
4. **Không tự phân công cán bộ**: Việc thụ lý và phân công hồ sơ (`assignedToId`) là thẩm quyền quản lý của con người.
5. **Không tự cấp giấy chứng nhận**: AI không quyết định việc cấp Giấy chứng nhận quyền sử dụng đất hay quyết định cho phép chuyển mục đích sử dụng đất.
6. **Không tự thay đổi kết quả thẩm tra AI cũ**: Các bản rà soát AI trong quá khứ (`ProcedureAiAnalysis`) là bằng chứng lịch sử bất biến, không bị tự động tính toán lại hay sửa đổi khi luật thay đổi.
7. **Không tự thay đổi legal snapshot cũ**: Bản chụp căn cứ pháp lý (`ProcedureAiAnalysisLegalSnapshot`) tại thời điểm thẩm tra hồ sơ được bảo vệ nguyên vẹn vĩnh viễn.
8. **Không tự kết luận thay cán bộ**: Mọi ý kiến AI chỉ là gợi ý tham khảo; kết luận pháp lý cuối cùng trên hồ sơ luôn là kết luận và trách nhiệm của cán bộ nghiệp vụ thụ lý.

---

## 11. Operational Checklist

Dành cho Cán bộ nghiệp vụ và Lãnh đạo (`ADMIN` / `MANAGER`) trước khi thực hiện các quyết định ban hành (Activation) hoặc hoàn tác (Rollback):

```
[ ] 1. Kiểm tra văn bản pháp lý: Xác minh văn bản luật mới/mục tiêu đã được nhập đúng số hiệu, ngày ban hành và hiệu lực trong hệ thống.
[ ] 2. Kiểm tra tác động: Đọc kỹ báo cáo Phân tích tác động AI (Impact Analysis), chú ý danh sách thủ tục và hồ sơ đang xử lý bị ảnh hưởng.
[ ] 3. Chạy simulation: Thực hiện chạy thử bản nháp (Shadow Testing) trên ít nhất 05 hồ sơ TTHC mẫu để kiểm chứng chất lượng prompt và checklist mới.
[ ] 4. Đọc warning: Rà soát toàn bộ các cờ rủi ro (Risk flags) và khuyến cáo an toàn từ hệ thống trên modal xác nhận.
[ ] 5. Xác nhận đúng version: Kiểm tra chéo mã ID và tiêu đề của phiên bản chuẩn bị kích hoạt hoặc khôi phục.
[ ] 6. Nhập lý do / ghi chú: Nhập ghi chú chỉ đạo rõ ràng (khi kích hoạt) hoặc lý do hoàn tác chi tiết (tối thiểu 10 ký tự khi rollback).
[ ] 7. Nhập confirmation text: Gõ chính xác chuỗi xác nhận bắt buộc (`ACTIVATE VERSION` hoặc `ROLLBACK VERSION`).
[ ] 8. Chạy hậu kiểm: Ngay sau khi thực hiện, bấm nút "Kiểm tra sau kích hoạt" hoặc "Kiểm tra sau rollback" để thẩm định huy hiệu `✔ PASS`.
[ ] 9. Lưu audit trail: Xác nhận sự kiện đã được ghi nhận vào Lịch sử rà soát / Workflow trên nhật ký hệ thống.
```

---

## 12. Remaining Limitations

Mặc dù kiến trúc Quản trị Phiên bản Pháp lý của LegalFlow V2 đã đạt độ hoàn thiện cao, hệ thống vẫn ghi nhận một số giới hạn thực tế trong phạm vi triển khai hiện tại:

1. **Chưa có tự động cập nhật pháp luật**: Hệ thống chưa tự động cào dữ liệu (scraping) hay tự động nhận diện văn bản pháp luật mới ban hành; việc input văn bản và kích hoạt quy trình tác động vẫn do cán bộ khởi xướng.
2. **Chưa tích hợp nguồn pháp luật chính thức online**: Chưa có kết nối API trực tiếp thời gian thực với Cơ sở dữ liệu Quốc gia về Văn bản Pháp luật (chinhphu.vn / thuvienphapluat.vn); dữ liệu pháp lý hiện tại được quản lý trong kho tri thức nội bộ của hệ thống.
3. **Verification phụ thuộc metadata đã lưu**: Chức năng kiểm chứng sau kích hoạt/rollback phụ thuộc vào độ đầy đủ của cấu trúc JSON trong trường `notes`. Với các nhật ký siêu cũ được tạo trước Phase 8F, kết quả kiểm chứng có thể trả về `WARNING` do thiếu lịch sử metadata.
4. **Rollback thật cần log phù hợp**: Để thực hiện rollback một version, nhật ký cập nhật tương ứng phải đang ở trạng thái `APPROVED` và đã có liên kết với phiên bản từng kích hoạt.
5. **Cán bộ vẫn phải kiểm tra pháp lý thủ công**: Dù hệ thống mô phỏng và kiểm chứng tự động, trách nhiệm thẩm định sự phù hợp của quy định pháp luật với từng hồ sơ thực tế vẫn thuộc về cán bộ thụ lý theo quy định của pháp luật.

---

## 13. Recommended Next Phase

Để tiếp tục hoàn thiện hệ thống, đưa LegalFlow V2 tiến gần hơn tới trạng thái sẵn sàng triển khai thực tế trên diện rộng (Production Readiness), đề xuất định hướng các giai đoạn tiếp theo:

### Lựa chọn 1: `Phase 8F-E-D-G: Legal Version Governance UAT Checklist & Training Guide`
- Xây dựng bộ tài liệu kịch bản kiểm thử nghiệm thu người dùng (UAT Checklist) chuyên sâu cho chuỗi Quản trị Phiên bản Pháp lý.
- Soạn thảo tài liệu hướng dẫn đào tạo (Training Guide) và video/slide bài giảng cho cán bộ địa phương (cách xử lý khi có luật mới, cách chạy simulation, quy trình phê duyệt và hoàn tác an toàn).

### Lựa chọn 2: `Phase 9A: TTHC AI Governance UAT & Hardening`
- Mở rộng rà soát an toàn và kiểm thử UAT tổng thể cho toàn bộ các mô-đun AI thẩm tra hồ sơ TTHC (Cấp GCN lần đầu & Chuyển mục đích sử dụng đất).
- Thực hiện gia cố bảo mật (Security Hardening), tối ưu hóa hiệu năng truy vấn CSDL dưới tải lớn và kiểm tra khả năng phục hồi sau thảm họa (Disaster Recovery / Backup Drill) cho kho tri thức pháp lý.

---
*Tài liệu này được tổng hợp và ban hành tự động bởi hệ thống Antigravity AI Coding Assistant trong khuôn khổ hoàn thành Phase 8F-E-D-F.*
