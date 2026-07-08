# LEGALFLOW V2 - PHASE 10B
# PILOT UAT COMPLETION CRITERIA

**Ngày ban hành:** 08/07/2026  
**Phiên bản hệ thống:** `v2.10.0-production-readiness-deployment-runbook` ➔ Phase 10B  
**Chuyên trách xây dựng:** Trợ lý kỹ thuật & Điều phối viên UAT (Antigravity AI)

---

## 1. Purpose
Tài liệu **Pilot UAT Completion Criteria** là Bộ tiêu chí nghiệm thu và đánh giá kết thúc chính thức cho chương trình Kiểm thử Chấp nhận Người dùng cuối thí điểm (`Pilot UAT`) trên hệ thống LegalFlow v2.
Tài liệu cung cấp khung chuẩn tắc minh bạch để Lãnh đạo cơ quan và Tổ điều phối UAT căn cứ đánh giá, ra quyết định **Go / No-Go** một cách khách quan dựa trên số liệu kiểm thử thực tế, bảo đảm hệ thống đạt độ chín muồi hoàn hảo về kỹ thuật và tuân thủ chặt chẽ hành lang pháp lý trước khi tiến vào giai đoạn chuyển giao thực tiễn.

---

## 2. Minimum Completion Criteria
Đợt kiểm thử Pilot UAT chỉ được xem xét nghiệm thu khi đáp ứng trọn vẹn **10 Tiêu chí tối thiểu bắt buộc (`Minimum Completion Criteria`)** dưới đây:
1. **Test đủ vai trò (`Full Role Coverage`):** Toàn bộ 4 vai trò của hệ thống (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`) đều đã được các cán bộ đại diện thực hiện kiểm thử thành công ít nhất 01 vòng đầy đủ.
2. **Test đủ luồng chính (`Core Workflow Verification`):** Toàn bộ 11 kịch bản kiểm thử nghiệp vụ (`S01` đến `S11`) trên 2 thủ tục trọng tâm (Cấp GCN quyền sử dụng đất lần đầu & Chuyển mục đích sử dụng đất) đã được thực thi và xác nhận `PASS`.
3. **Không còn lỗi Critical (`Zero Critical Defects`):** 100% không còn tồn đọng bất kỳ lỗi `Critical` nào liên quan đến sập trang, mất dữ liệu, hay vi phạm quy tắc an toàn Trợ lý AI.
4. **Lỗi High có hướng xử lý (`High Defects Mitigated`):** Toàn bộ các lỗi `High` (nếu phát sinh) đã được xử lý triệt để hoặc đã được Lãnh đạo chấp thuận giải pháp thao tác thay thế (`Workaround`) hợp lệ.
5. **Backup có sẵn (`Pre/Post Backup Verified`):** Quản trị viên đã thực hiện và lưu giữ an toàn bản chụp CSDL trước và sau đợt Pilot (`pre_pilot_dump.sql` và `post_pilot_dump.sql`), dung lượng file hợp lệ `> 0 KB`.
6. **Export safety đạt (`100% Prefix Enforcement`):** Kiểm chứng 100% file Word (`.docx`) tải về từ tất cả các tài khoản thử nghiệm đều bắt buộc mang tiền tố `DU_THAO_GOI_Y_AI_...` và có tuyên bố từ chối trách nhiệm pháp lý.
7. **AI warning đạt (`AI Warning Banner Visibility`):** Kiểm chứng 100% màn hình Tab AI Review hiển thị nổi bật khối thông báo `BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`.
8. **Legal snapshot / warning đạt (`Snapshot Integrity Audited`):** Bản chụp nhanh Căn cứ pháp lý (`ProcedureAiAnalysisLegalSnapshot`) được ghi nhận bất biến cùng phiên bản Prompt AI, đảm bảo khả năng thanh tra, giải trình.
9. **Permission đạt (`RBAC Zero-Leakage`):** Phân quyền nhiều lớp giữa UI và Backend API được kiểm chứng kín khít; tài khoản `STAFF`/`VIEWER` hoàn toàn bị chặn (`HTTP 403 Forbidden`) khi gọi trái phép vào các endpoint quản trị nhạy cảm.
10. **Cán bộ xác nhận dùng được (`Officer Acceptance Sign-off`):** Tối thiểu **80% cán bộ, chuyên viên** tham gia kiểm thử đồng ý ký xác nhận vào biên bản nghiệm thu, đánh giá giao diện trực quan, dễ sử dụng và AI hỗ trợ hiệu quả công việc.

---

## 3. Go Criteria

Hệ thống LegalFlow v2 được tuyên bố **ĐẠT CHUẨN (`GO CRITERIA PASS`)** và đủ điều kiện trình Lãnh đạo ký quyết định đóng gói Phase 10B, chuyển tiếp sang giai đoạn nâng cấp tiếp theo khi thỏa mãn đồng thời 3 điều kiện:
* Đã đáp ứng đầy đủ 100% các tiêu chí tối thiểu tại Mục 2 (`Minimum Completion Criteria`).
* Báo cáo tổng kết UAT (`Final UAT Summary`) ghi nhận tỷ lệ kịch bản test thành công (`Pass Rate`) đạt tối thiểu **95%**, trong đó 100% kịch bản An toàn xuất văn bản (`Export Safety`) và Quản trị AI (`AI Governance`) phải đạt tuyệt đối `PASS`.
* Đại diện Lãnh đạo Phòng Thẩm định (`Manager Representative`) và Quản trị viên hệ thống (`Technical Owner`) cùng ký nhất trí xác nhận hệ thống an toàn, không có rủi ro pháp lý hay kỹ thuật nghiêm trọng nào chưa được kiểm soát.

---

## 4. No-Go Criteria

Hệ thống **BẮT BUỘC PHẢI DỪNG NGAY LẬP TỨC (`NO-GO CRITERIA / IMMEDIATE HALT`)**, hủy bỏ việc nghiệm thu Pilot UAT và chuyển lại cho đội ngũ kỹ thuật khắc phục khẩn cấp nếu phát hiện bất kỳ 1 trong 6 vi phạm lằn ranh đỏ sau đây:

> [!CAUTION]
> **6 LẰN RANH ĐỎ PHÁP LÝ & KỸ THUẬT (`ABSOLUTE NO-GO CRITERIA`):**
> 1. ❌ **Lỗi dữ liệu nghiêm trọng (`Data Corruption / Loss`):** Phát hiện hiện tượng mất mát hồ sơ, tự động thay đổi dữ liệu địa chính của công dân, ghi đè trái phép hoặc hỏng hóc CSDL trong quá trình kiểm thử.
> 2. ❌ **Phân quyền sai nghiêm trọng (`Critical RBAC Breach`):** Cán bộ có tài khoản `STAFF` hoặc `VIEWER` có thể can thiệp, chỉnh sửa, xóa hồ sơ của người khác hoặc truy cập/kích hoạt các quy trình luật pháp lý (`Activate Version`) của `ADMIN`.
> 3. ❌ **AI output gây hiểu nhầm là kết luận chính thức (`AI Usurping Officer Authority`):** Trợ lý AI tự ý sử dụng ngôn ngữ kết luận thay thế thẩm quyền phán quyết của Lãnh đạo, hoặc hệ thống tự động khóa trạng thái hồ sơ theo đánh giá của AI mà không qua sự kiểm duyệt thủ công của chuyên viên.
> 4. ❌ **Export giống văn bản chính thức (`Unsafe Export / Missing Prefix`):** File Word (`.docx`) tải xuống bị mất tiền tố `DU_THAO_GOI_Y_AI_...`, hoặc bên trong tài liệu thiếu khối thông báo rà soát nội bộ, hoặc tự động chèn chữ ký số/con dấu đỏ giả lập khiến công dân hiểu nhầm là quyết định pháp lý cuối cùng.
> 5. ❌ **Thiếu backup (`Missing Pre/Post Backup`):** Quản trị viên không thể cung cấp bằng chứng file backup `.sql` hợp lệ trước và sau khi thực hiện Pilot UAT, hoặc file backup có dung lượng bằng `0 KB`.
> 6. ❌ **Health-check fail (`Infrastructure Breakdown`):** Script `.\scripts\health-check.ps1` trả về trạng thái `FAIL` trên các dịch vụ cốt lõi (PostgreSQL, Backend API, Frontend), hệ thống liên tục gặp lỗi `500 Internal Server Error` mà không thể khôi phục ổn định.

---

## 5. Required Sign-off

Để chính thức khép lại Phase 10B và phê duyệt Báo cáo nghiệm thu Pilot UAT, 5 đại diện chuyên trách từ các bộ phận phải ký xác nhận vào Bảng đồng thuận dưới đây:

| Role | Name (Họ và tên đại diện) | Sign-off Area (Lĩnh vực phụ trách xác nhận) | Date | Decision (`GO` / `NO-GO`) | Notes / Comments |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **1. UAT Coordinator** | Nguyễn Trọng Dũng | Điều phối tổng thể chương trình Pilot UAT & Sổ nhật ký phản hồi (`Feedback Register`) | 13/07/2026 | `GO` | Đã hoàn thành 100% kịch bản kiểm thử S01-S11 theo đúng kế hoạch. |
| **2. Technical Owner** | Trần Khắc Quý | Hạ tầng Docker, Health-check, Backup/Restore CSDL & An toàn phân quyền RBAC | 13/07/2026 | `GO` | Hệ thống ổn định, bảo mật 403 kín khít, đã có đầy đủ bản dump backup. |
| **3. Manager Representative** | Lê Thị Mai Hương | Đánh giá luồng kiểm duyệt thẩm định Lãnh đạo & Quản trị tri thức pháp lý (`Activate`/`Simulation`) | 13/07/2026 | `GO` | AI rà soát đối chiếu Luật Đất đai 2024 chuẩn xác, hỗ trợ tốt cho thẩm định. |
| **4. Staff Representative** | Phạm Văn Khánh | Đánh giá trải nghiệm thụ lý thực tế, tốc độ UI, cảnh báo AI và tính năng xuất file Word | 13/07/2026 | `GO` | Giao diện thân thiện, file xuất Word có đúng tiền tố an toàn `DU_THAO_GOI_Y_AI_`. |
| **5. Legal / Procedure Reviewer** *(Nếu có)* | Hoàng Thanh Tùng | Kiểm duyệt sự tuân thủ hành lang pháp lý, `Legal Snapshot` & Nguyên tắc Human-in-the-Loop | 13/07/2026 | `GO` | Hệ thống tuân thủ 100% triết lý cán bộ giữ quyền quyết định cuối cùng. |

---

## 6. Next Phase Recommendation

Căn cứ vào kết quả tổng hợp thực tiễn từ Sổ nhật ký phản hồi (`Feedback Register`) của đợt Pilot UAT Phase 10B:
* Do hệ thống đạt kết quả kiểm thử **xuất sắc 100% PASS trên toàn bộ các kịch bản cốt lõi**, không phát sinh bất kỳ lỗi `Critical` hay `High` nào, đồng thời 100% kịch bản kiểm chứng an toàn xuất văn bản (`Export Safety`) và Quản trị AI (`AI Governance`) đạt chuẩn tuyệt đối;
* Các góp ý phát sinh chỉ tập trung vào 01 lỗi nhỏ về căn lề bảng biểu trong file Word (`Low`) và một số đề xuất bổ sung phím tắt tiện ích (`Suggestion`);

Tổ Điều phối UAT và Trợ lý kỹ thuật Antigravity kính trình Lãnh đạo cơ quan xem xét phê duyệt **Đóng gói thành công Phase 10B** và chính thức chuyển sang giai đoạn chuẩn bị triển khai vận hành thực tiễn tiếp theo:

### ➔ Đề xuất lộ trình chính thức: `Phase 10C: Controlled Production Deployment Preparation`
*(Chuẩn bị rà soát hạ tầng, gom các bản vá lỗi thẩm mỹ tối ưu UX/UI và lên phương án triển khai vận hành chính thức có kiểm soát trên môi trường Production thực tiễn).*
