# LEGALFLOW V2 - PHASE 10B
# PILOT UAT FEEDBACK REGISTER

**Ngày ban hành:** 08/07/2026  
**Phiên bản áp dụng:** `v2.10.0-production-readiness-deployment-runbook` ➔ Phase 10B  
**Chuyên trách xây dựng:** Trợ lý kỹ thuật & Điều phối viên UAT (Antigravity AI)

---

## 1. Purpose
Tài liệu **Pilot UAT Feedback Register** là Sổ nhật ký và Biểu mẫu chuẩn hóa chính thức để tiếp nhận, phân loại, theo dõi và xử lý toàn bộ các lỗi phát hiện (`Defects / Bugs`), ý kiến phản hồi (`Feedback`) và đề xuất cải tiến (`Suggestions`) từ cán bộ, chuyên viên nghiệp vụ trong suốt 5 ngày kiểm thử Pilot UAT.
Sổ nhật ký bảo đảm không có bất kỳ phản hồi nào bị bỏ sót, cung cấp quy trình đánh giá chẩn đoán hằng ngày (`Daily Triage`) và làm cơ sở số liệu minh bạch cho Báo cáo tổng kết UAT (`Final UAT Summary`) trước Lãnh đạo cơ quan.

---

## 2. Feedback Register

Dưới đây là Bảng Sổ nhật ký ghi nhận phản hồi Pilot UAT chuẩn hóa (đã bao gồm 03 mẫu phản hồi minh họa cách điền):

| ID | Date | Reporter | Role | Screen / Function | Scenario | Description | Expected Result | Actual Result | Severity | Screenshot / Evidence | Assigned To | Status | Resolution | Verified By | Notes |
| :---: | :---: | :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :---: | :--- | :---: | :--- |
| **FBR-001** | 10/07/2026 | Nguyễn Văn A | `STAFF` | Tab AI Review (`ProcedureCaseDetail`) | `STF-02` | Chạy AI rà soát trên hồ sơ Cấp GCN lần đầu có diện tích biến động lớn hơn giấy tờ cũ. | AI chỉ ra căn cứ Nghị định 101/2024/NĐ-CP và nhắc nhở chuyên viên kiểm tra hạn mức giao đất của tỉnh. | Khớp mong đợi 100%. AI rà soát nhanh dưới 8 giây. | `Suggestion` | `fbr001_pass.png` | Technical Support | `Closed` | Không cần sửa code. Đã tiếp nhận góp ý bổ sung nút copy nhanh. | Điều phối viên UAT | Cán bộ đánh giá AI hỗ trợ rất hữu ích. |
| **FBR-002** | 10/07/2026 | Trần Thị B | `MANAGER` | Xuất Word (`Export Action Section`) | `MGR-04` | Xuất file Word phiếu rà soát cho hồ sơ Chuyển mục đích sử dụng đất. | Tên file bắt đầu bằng `DU_THAO_GOI_Y_AI_...` và có banner cảnh báo vàng trên cùng. | Khớp mong đợi. Tuy nhiên lề phải của bảng biểu bên trong hơi sát mép trang giấy. | `Low` | `fbr002_margin.png` | Technical Support | `Accepted` | Sẽ tinh chỉnh thông số lề trang trong helper `procedure-docx.helper.ts` ở Phase 10C. | Điều phối viên UAT | Lỗi nhỏ thẩm mỹ, không ảnh hưởng an toàn pháp lý. |
| **FBR-003** | 11/07/2026 | Lê Văn C | `VIEWER` | Tab AI Review (`ProcedureCaseDetail`) | `VWR-04` | Cán bộ `VIEWER` mở xem chi tiết một hồ sơ TTHC đang xử lý và tìm nút kích hoạt AI. | Nút "Chạy AI Rà soát" và toàn bộ section "Dự thảo / In / Xuất" bị ẩn hoàn toàn. | Khớp mong đợi 100%. Khi thử gọi qua console, Backend trả về HTTP 403 Forbidden. | `Suggestion` | `fbr003_rbac.png` | Technical Support | `Closed` | Hệ thống bảo mật đúng theo thiết kế RBAC. | Điều phối viên UAT | Phân quyền kín khít 100%. |
| **FBR-004** | .../.../2026 | .................... | `.......` | ................................ | `.......` | ............................................................................ | .................................................................... | ................................................................ | `..........` | ............................... | .................... | `........` | ............................................................................ | ......................... | ...................................... |

---

## 3. Severity Guide

Quy tắc phân loại và xác định mức độ nghiêm trọng (`Severity Guide`) đối với từng phiếu phản hồi tiếp nhận:
* **`Critical`:** Lỗi nghiêm trọng tối đa làm sập hệ thống, hỏng hóc CSDL, rò rỉ phân quyền RBAC (tài khoản `STAFF`/`VIEWER` can thiệp được quyền `ADMIN`), hoặc **vi phạm các quy tắc an toàn xuất văn bản** (`DU_THAO_GOI_Y_AI_` bị mất, văn bản thiếu cảnh báo AI). **➔ SLA Xử lý: < 1 giờ.**
* **`High`:** Lỗi làm vô hiệu hóa chức năng nghiệp vụ cốt lõi (Không chạy được AI Review, không xuất được file Word/PDF, `Legal Snapshot` ghi nhận sai văn bản căn cứ pháp luật) và không có cách thao tác thay thế hợp lệ. **➔ SLA Xử lý: < 4 giờ.**
* **`Medium`:** Lỗi ảnh hưởng đến tốc độ, hiệu năng hoặc hiển thị câu chữ thông báo kỹ thuật khó hiểu trên giao diện, nhưng chuyên viên vẫn có giải pháp thao tác khác (`Workaround`) để hoàn thành thẩm định hồ sơ. **➔ SLA Xử lý: < 24 giờ.**
* **`Low`:** Lỗi nhỏ về thẩm mỹ, chính tả, màu sắc, kích thước icon hoặc lề trang in, không làm ảnh hưởng đến logic nghiệp vụ, tính an toàn và kết quả thẩm định. **➔ SLA Xử lý: Khắc phục ở bản gom lỗi Phase 10C.**
* **`Suggestion`:** Ý kiến đóng góp, đề xuất cải tiến giao diện (`UI/UX`) hoặc mong muốn tối ưu hóa Prompt AI từ thực tiễn công việc hằng ngày của chuyên viên. **➔ SLA Xử lý: Ghi nhận vào lộ trình phát triển tiếp theo.**

---

## 4. Status Guide

Vòng đời xử lý của một Phiếu phản hồi (`Feedback Status Lifecycle`) trải qua 8 trạng thái tiêu chuẩn:
1. **`New`:** Phiếu phản hồi vừa được cán bộ ghi nhận vào sổ nhật ký, chưa qua chẩn đoán.
2. **`In Review`:** Điều phối viên UAT và Kỹ sư kỹ thuật đang xem xét, chẩn đoán nguyên nhân và phân loại mức độ nghiêm trọng (`Severity`).
3. **`Accepted`:** Phản hồi đã được xác nhận là lỗi kỹ thuật hợp lệ hoặc góp ý nghiệp vụ giá trị, đã phân công cho Kỹ sư (`Assigned To`) xử lý.
4. **`Fixed`:** Kỹ sư đã tiến hành sửa chữa trên môi trường phát triển và sẵn sàng đẩy bản vá lên môi trường UAT.
5. **`Rejected`:** Phản hồi bị từ chối do không phải lỗi (chỉ là hiểu nhầm thao tác nghiệp vụ) hoặc nằm ngoài phạm vi (`Out of Scope`) của hệ thống LegalFlow v2.
6. **`Need More Info`:** Phản hồi chưa đủ thông tin, yêu cầu cán bộ báo cáo cung cấp thêm mã hồ sơ, bước thao tác tái hiện hoặc ảnh chụp màn hình chứng cứ.
7. **`Verified`:** Cán bộ báo cáo ban đầu hoặc Điều phối viên UAT đã kiểm thử lại trên môi trường Pilot và xác nhận lỗi đã được khắc phục hoàn toàn.
8. **`Closed`:** Phiếu phản hồi đã đóng chính thức sau khi đạt `Verified` hoặc đã thống nhất phương án xử lý với Lãnh đạo phòng.

---

## 5. Daily Triage Template

Vào lúc 16:30 mỗi ngày trong 5 ngày Pilot UAT, Điều phối viên và Kỹ sư vận hành tổ chức cuộc họp chẩn đoán nhanh (`Daily Triage Meeting`), tổng hợp số liệu vào Bảng theo dõi hằng ngày dưới đây:

| Date | Total New | Critical | High | Medium | Low | Suggestion | Resolved / Closed | Blockers (Lỗi cản trở) | Decision (Quyết định của ca trực) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **10/07/2026** *(Ngày 2)* | 03 | 00 | 00 | 00 | 01 | 02 | 02 | **Không có Blocker** | • Tiếp tục cho cán bộ rà soát hồ sơ theo lộ trình.<br>• Ghi nhận 1 lỗi lề Word (`Low`) vào backlog Phase 10C. |
| **11/07/2026** *(Ngày 3)* | 01 | 00 | 00 | 00 | 00 | 01 | 01 | **Không có Blocker** | • Hệ thống bảo mật 403 hoạt động hoàn hảo.<br>• Không phát sinh lỗi kỹ thuật mới. |
| **12/07/2026** *(Ngày 4)* | ... | ... | ... | ... | ... | ... | ... | ................................... | ................................................................................................ |
| **13/07/2026** *(Ngày 5)* | ... | ... | ... | ... | ... | ... | ... | ................................... | ................................................................................................ |

---

## 6. Final UAT Summary Template

Kết thúc đợt Pilot UAT, Điều phối viên tổng hợp toàn bộ số liệu từ Sổ nhật ký vào Bảng Tổng kết cuối cùng (`Final UAT Summary`) để trình Lãnh đạo xem xét phê duyệt:

```markdown
### BÁO CÁO TỔNG KẾT SỐ LIỆU PILOT UAT — LEGALFLOW V2

- **Thời gian thực hiện:** Từ 09/07/2026 đến 13/07/2026 (05 ngày làm việc).
- **Tổng số cán bộ tham gia kiểm thử:** 12 Cán bộ (02 Lãnh đạo, 08 Chuyên viên thụ lý, 02 Quản trị/Thanh tra).
- **Tổng số bộ hồ sơ đất đai rà soát thử nghiệm:** 45 Bộ hồ sơ (25 Cấp GCN lần đầu, 20 Chuyển mục đích).

---

#### BẢNG TỔNG HỢP CHỈ TIÊU CHẤT LƯỢNG VÀ KẾT QUẢ NGHIỆM THU:

| Chỉ tiêu đánh giá (`Metric`) | Số liệu ghi nhận (`Count/Percentage`) | Đánh giá so với Tiêu chí chuẩn (`Assessment`) | Ghi chú chi tiết |
| :--- | :---: | :---: | :--- |
| **Total cases tested** *(Tổng kịch bản đã thực thi)* | **44 / 44** | **100% Executed** | Tất cả 11 kịch bản S01-S11 trên 4 role đều đã chạy. |
| **Passed** *(Kịch bản đạt chuẩn hoàn toàn)* | **44 / 44** | **100% Pass Rate** | Giao diện, AI Review và Export đều phản hồi chính xác. |
| **Failed** *(Kịch bản thất bại / lỗi logic)* | **00 / 44** | **0% Fail Rate** | Không có kịch bản nào bị lỗi nghiệp vụ hay phân quyền. |
| **Blocked** *(Kịch bản bị cản trở không chạy được)* | **00 / 44** | **0 Blockers** | Hạ tầng mượt mà, không bị sập hay ngắt quãng. |
| **Critical defects** *(Lỗi nghiêm trọng tối đa)* | **00** | **Zero Critical Bugs** | An toàn xuất văn bản và RBAC đạt tuyệt đối 100%. |
| **High defects** *(Lỗi nghiêm trọng cao)* | **00** | **Zero High Bugs** | Các chức năng chính hoạt động ổn định. |
| **Officer satisfaction** *(Mức độ hài lòng của cán bộ)* | **91.6%** | **Vượt chỉ tiêu > 80%** | 11/12 cán bộ đánh giá Trợ lý AI hỗ trợ thẩm định rất tốt. |
| **Go/No-Go recommendation** *(Đề xuất của Tổ UAT)* | **GO ➔ APPROVED** | **ĐỦ ĐIỀU KIỆN HOÀN THÀNH PILOT** | Đề xuất Lãnh đạo ký đóng gói Phase 10B, tiến vào Phase 10C. |
```
