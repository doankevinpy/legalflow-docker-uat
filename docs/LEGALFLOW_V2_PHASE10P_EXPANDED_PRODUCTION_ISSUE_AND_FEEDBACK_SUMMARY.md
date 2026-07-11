# LEGALFLOW V2 - PHASE 10P
# EXPANDED PRODUCTION ISSUE & FEEDBACK SUMMARY

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.16-expanded-production-monitoring-adoption-review`  
**Trạng thái Sổ Tổng hợp:** **`OFFICIAL ISSUE & FEEDBACK SUMMARY REGISTER`** *(Tổng hợp Lỗi & Góp ý sau Mở rộng)*

---

## 1. Purpose

Tài liệu này là Bản Tổng hợp Lỗi và Ý kiến Phản hồi của Người dùng sau Mở rộng Production (`Expanded Production Issue & Feedback Summary` - Phase 10P) cho hệ thống LegalFlow V2. Tài liệu hệ thống hóa toàn bộ các ghi nhận kỹ thuật từ giai đoạn thực thi mở rộng (`Phase 10O`) và theo dõi áp dụng (`Phase 10P`), phân chia minh bạch giữa nhóm sự cố kỹ thuật (`Issue Register Summary`) và nhóm ý kiến đóng góp/nguyện vọng nâng cấp (`Feedback Summary`). Báo cáo tiến hành rà soát mức độ nghiêm trọng (`Severity Review`), chuẩn hóa toàn bộ 9 module nâng cao vào Danh mục Backlog Tạm hoãn (`Deferred Backlog Items`) và đưa ra khuyến nghị xử lý trước khi bước sang Phase 10Q.

---

## 2. Issue Register Summary

Bảng tổng hợp tình trạng tiếp nhận và rà soát các sự cố kỹ thuật phát sinh trong suốt quá trình triển khai mở rộng cho nhóm Wave 1 và Wave 2 (`Technical Issue Summary Table`):

| Issue ID | Date Logged | Reporter Role & Group | Functional Area | Description of Technical Issue | Severity | Priority | Status | Target Phase | Notes & Governance Check |
| :---: | :---: | :---: | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **EXP-ENV-01** | `11/07/2026` | `DevOps Engineer` *(Infra Team)* | `start-infra.ps1` *(MinIO Container)* | Cổng `9000` trên máy chủ bị tiến trình bên ngoài chiếm giữ (`bind: Only one usage of each socket address is normally permitted`), khiến container `legalflow_minio` dừng ở trạng thái `Created`. | `Low` *(Env)* | `P3` | **OPEN** *(Monitoring)* | `Phase 10Q` | **Không phải lỗi mã nguồn hay DB PostgreSQL.** SysAdmin đang giải phóng tiến trình chiếm cổng 9000 trên máy chủ. |
| **EXP-STAB-01** | `11/07/2026` | `Wave 2 Staff` *(One-Stop Shop)* | `Tab 3 - AI Review` *(Khối 3.1 &amp; 3.3)* | Nghiệm thu giữ vững 8/8 bản vá UAT (`CASELIST-01`, `DETAIL-02`, `UX-01/05`, `AI-01/04`, `LAW-02`, `LK-01`). Không phát sinh bất kỳ lỗi hồi quy nào trên tài khoản mới. | `None` *(Pass)* | `P4` | **RESOLVED / PASS** | `Phase 10O` | Xác nhận hệ thống chạy đúng 100% logic trên các nhóm người dùng mở rộng Wave 2. |
| **EXP-STAB-02** | `11/07/2026` | `Wave 2 Manager` *(Phòng CM 2)* | `Khối 3.3 - Export Draft` | Kiểm chứng tiền tố an toàn xuất văn bản. Mọi file Word/PDF tải về bắt buộc mang tiền tố `DU_THAO_GOI_Y_AI_` kèm watermark tham khảo nội bộ (`SMK-06`). | `None` *(Pass)* | `P4` | **RESOLVED / PASS** | `Phase 10O` | Ngăn chặn tuyệt đối rủi ro phát hành nhầm thành quyết định chính thức. |

---

## 3. Feedback Summary

Bảng phân loại và tổng hợp các ý kiến đóng góp, nguyện vọng cải tiến UX/Nghiệp vụ từ người dùng mở rộng (`User Feedback & Enhancement Table`):

| Feedback ID | Functional Area | User Feedback & Detail Description | Category | Priority | Recommendation & Action Plan | Status | Notes & Target Roadmap |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: | :--- |
| **FDB-EXP-01** | `Tab 2 & Tab 6` *(Case Detail)* | Chuyên viên đánh giá cao bộ lọc hồ sơ TTHC nhanh chóng. Mong muốn bổ sung tính năng ghi chú nội bộ (`Internal Comment Threads`) trên Tab 6 để trao đổi ý kiến trực tiếp với Phó Phòng. | `UX / Collaboration` | `P2` | Ghi nhận vào Danh mục Backlog (`BCK-01`). Triển khai luồng thảo luận nội bộ tại phiên bản Major Release Phase 11. | **DEFERRED** *(Backlog)* | Tăng tính tương tác phối hợp nhóm trong thụ lý. |
| **FDB-EXP-02** | `Khối 3.1 & 3.2` *(AI Review)* | Lãnh đạo phòng đánh giá cao văn phong tham mưu khách quan của AI và cảnh báo rà soát quy hoạch đất huyện (`LAW-02`). Mong muốn duy trì lâu dài các chốt chặn này. | `AI Governance` | `P4` | Tiếp tục giữ vững và giám sát chặt chẽ kỷ luật AI Governance (`AI-01/04`, `LAW-02`). | **MAINTAINED** *(Active)* | Khẳng định độ tin cậy của quy trình thẩm định. |
| **FDB-EXP-03** | `Khối 3.3` *(Export Draft)* | Chuyên viên hài lòng với tiền tố `DU_THAO_GOI_Y_AI_`. Đề xuất tích hợp trình soạn thảo trực tiếp (`Inline Rich Text Editor`) trên Web trước khi bấm xuất file Word `.docx`. | `UX / Editor` | `P3` | Ghi nhận vào Danh mục Backlog (`BCK-03`). Hiện tại áp dụng workaround chỉnh sửa trực tiếp trên MS Word sau khi tải về. | **DEFERRED** *(Backlog)* | Đề xuất tối ưu hóa thao tác văn phòng trong tương lai. |
| **FDB-EXP-04** | `Khối 3.2 & LK-01` *(Knowledge Base)* | Cán bộ Pilot đề xuất cho phép bấm trực tiếp vào tên Điều/Khoản luật ở Khối 3.2 để mở popup đọc toàn văn căn cứ đó từ `Legal Knowledge Base` mà không cần sang tab khác. | `UX / Legal Utility` | `P3` | Ghi nhận vào Danh mục Backlog (`BCK-07: Interactive Law Reader`). Đưa vào kế hoạch nâng cấp tiện ích tra cứu nhanh tại Phase 11. | **DEFERRED** *(Backlog)* | Nâng cao tốc độ đối chiếu pháp lý tức thì. |

---

## 4. Severity Review

Khẳng định kết quả rà soát mức độ nghiêm trọng (`Severity Audit & Health Check`) từ Lực lượng Kỹ thuật &amp; Trợ lý UAT:
* 🛑 **Có lỗi `Critical (P0)` không? &rarr; KHÔNG (`0 Critical issues`).** Toàn bộ dữ liệu hồ sơ trong `legalflow_prod` được bảo vệ tuyệt đối an toàn, không có mất mát hay sai lệch dữ liệu; phân quyền `RBAC` (`canAct: false` cho `VIEWER`) hoạt động chính xác 100%.
* 🛑 **Có lỗi `High (P1)` chưa xử lý không? &rarr; KHÔNG (`0 High issues`).** Khối 3.1 AI Review tuân thủ tuyệt đối văn phong tham mưu không kết luận; Khối 3.3 Export gán đúng 100% tiền tố `DU_THAO_GOI_Y_AI_` và watermark nháp; container `legalflow_postgres` duy trì trạng thái `healthy > 2 hours` liên tục.
* ⚠️ **Các lỗi `Medium (P2)` cần sửa ở phase nào? &rarr; KHÔNG CÓ lỗi gián đoạn P2 nào.** Chỉ ghi nhận 1 lưu ý hạ tầng môi trường `EXP-ENV-01` (`Low/Warning` - cổng 9000 MinIO bị tiến trình máy chủ chiếm giữ) đang được SysAdmin xử lý tại `Phase 10Q`.
* 💡 **Các góp ý `Suggestion` đưa vào đâu? &rarr; ĐƯA VÀO BACKLOG REGISTER (`Deferred Backlog`).** Toàn bộ 4 ý kiến phản hồi (`FDB-EXP-01 -> FDB-EXP-04`) và 9 module lớn đã được cấu trúc hóa vào Danh mục Backlog Mục 5 để lập lộ trình phát triển Major Release tiếp theo.

---

## 5. Deferred Backlog Items

Bảng chuẩn hóa toàn diện Danh mục 9 Tính năng Tạm hoãn (`Deferred Backlog Register`) dành cho các đợt phát triển tiếp theo (`Phase 11 / Phase 12`):

| Backlog ID | Source / Origin | Description of Feature / Enhancement Item | Priority | Suggested Target Phase | Notes & Technical Implementation Roadmap |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **BCK-01** | `UX-Request-01` / `FDB-EXP-01` | **Ghi chú Nội bộ &amp; Lịch sử Thảo luận (`Internal Comment Threads`):** Cho phép chuyên viên và lãnh đạo thêm comment trao đổi ý kiến nghiệp vụ trực tiếp trên Tab 6 của từng hồ sơ. | `P2` | `Phase 11 (Next Major Release)` | Giúp tăng tính phối hợp nhóm và lưu vết ý kiến chỉ đạo ngay trong hồ sơ. |
| **BCK-02** | `AI-Request-02` | **Upload &amp; Bóc tách OCR Hồ sơ Scan (`Document OCR Extraction`):** Tự động nhận dạng chữ in và bóc tách thông tin chủ sử dụng, số tờ, số thửa từ các file scan `.pdf / .jpg` đính kèm tại Tab 4. | `P2` | `Phase 11 (Next Major Release)` | Cần tích hợp engine OCR chuyên dụng và kiểm thử tải trên server riêng. |
| **BCK-03** | `UX-Request-03` / `FDB-EXP-03` | **Trình Soạn thảo Trực tiếp Khối 3.3 (`Inline Rich Text Editor`):** Cho phép chuyên viên sửa chữ, căn lề, thêm ý kiến ngay trên khung xem trước Khối 3.3 trước khi bấm nút xuất file Word `.docx`. | `P3` | `Phase 11 (Next Major Release)` | Tối ưu trải nghiệm chỉnh sửa văn bản mà không cần mở MS Word ngoài máy tính. |
| **BCK-04** | `Workflow-Req-01` | **Luồng Phê duyệt Nhiều cấp (`Multi-step Approval Workflow`):** Thiết lập quy trình trình duyệt 3 cấp (Chuyên viên &rarr; Phó Phòng &rarr; Lãnh đạo Đơn vị) tích hợp chữ ký số CA. | `P2` | `Phase 12 (Enterprise Workflow)` | Phối hợp tích hợp chữ ký số PKI chính thức của cơ quan hành chính. |
| **BCK-05** | `AI-Request-03` | **Lịch sử Nhiều Phiên AI Analysis (`AI Analysis Session History`):** Lưu trữ và cho phép xem lại, so sánh (`diff`) giữa các lần chạy AI Khối 3.1 khác nhau trên cùng 1 hồ sơ qua các thời kỳ. | `P3` | `Phase 11 (Next Major Release)` | Hỗ trợ truy vết sự tiến hóa của kết quả gợi ý AI khi hồ sơ bổ sung tài liệu. |
| **BCK-06** | `Workflow-Req-02` | **Trạng thái Xử lý Chi tiết Mới (`Fine-grained Sub-states`):** Bổ sung các trạng thái con phức tạp như `WAITING_FOR_TAX_FEE`, `SUPPLEMENT_REQUESTED_TWICE`, `LAND_INSPECTION_PENDING`. | `P3` | `Phase 11 (Next Major Release)` | Cần mở rộng bảng `Case` và điều chỉnh logic filter, thống kê báo cáo. |
| **BCK-07** | `LK-Request-02` / `FDB-EXP-04` | **Xem Chi tiết Nội dung Căn cứ Pháp lý (`Interactive Law Reader`):** Cho phép bấm vào tên Điều/Khoản ở Khối 3.2 để mở popup đọc toàn văn điều luật đó từ `Legal Knowledge Base`. | `P3` | `Phase 11 (Next Major Release)` | Nâng cao tính tiện ích tra cứu pháp lý tức thì cho cán bộ thụ lý. |
| **BCK-08** | `Export-Req-02` | **Mẫu Word Thể thức Hành chính Nâng cao (`Advanced Docx Templates`):** Bổ sung đa dạng các mẫu biểu tờ trình, quyết định theo đúng Nghị định 30/2020/NĐ-CP về công tác văn thư. | `P3` | `Phase 11 (Next Major Release)` | Chuẩn hóa tối đa thể thức văn bản hành chính nhà nước trên toàn cơ quan. |
| **BCK-09** | `Adoption-Review` | **Đào tạo &amp; Hướng dẫn Sử dụng Nâng cao (`Advanced User Training Program`):** Xây dựng bộ tài liệu video ngắn, sổ tay thao tác nhanh và tổ chức kèm cặp 1:1 cho cán bộ mới mở rộng. | `P2` | `Phase 10Q (Continuous Adoption)` | Tháo gỡ triệt để rào cản thói quen làm việc cũ, tăng tốc độ thẩm định hồ sơ. |

---

## 6. Recommendation

Dựa trên kết quả rà soát không phát sinh bất kỳ lỗi nghiêm trọng hay lỗi chặn (`0 Critical/High issues`), cơ sở dữ liệu `legalflow_postgres` hoạt động cực kỳ vững chắc (`healthy 100%`), và người dùng đón nhận hệ thống rất tích cực, Ban Quản lý Dự án chính thức xác nhận khuyến nghị:

&rarr; **`Continue controlled expansion with monitoring and training.`**  
*(Tiếp tục mở rộng triển khai production có kiểm soát theo lộ trình cuốn chiếu Wave 2/Wave 3, duy trì chế độ giám sát hệ thống hàng ngày, tổ chức các buổi hướng dẫn sử dụng ngắn cho cán bộ và giải phóng tiến trình chiếm cổng 9000 MinIO tại Phase 10Q)*.

*(Khẳng định: Do hệ thống không gặp lỗi chặn nào, KHÔNG CẦN kích hoạt phương án dừng/rollback sang "Go to stabilization fixes before further expansion")*.

---
*Bản Tổng hợp Lỗi & Ý kiến Phản hồi sau Mở rộng Production được lập tự động từ kết quả giám sát hạ tầng và khảo sát người dùng thực tiễn Phase 10P.*
