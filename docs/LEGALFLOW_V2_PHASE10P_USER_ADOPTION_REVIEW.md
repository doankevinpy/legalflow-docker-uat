# LEGALFLOW V2 - PHASE 10P
# USER ADOPTION REVIEW

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.16-expanded-production-monitoring-adoption-review`  
**Trạng thái Tài liệu:** **`OFFICIAL ADOPTION REVIEW & ASSESSMENT`** *(Đánh giá Mức độ Tiếp nhận Thực tiễn)*

---

## 1. Purpose

Tài liệu này là Báo cáo Đánh giá Mức độ Tiếp nhận của Người dùng (`User Adoption Review` - Phase 10P) của hệ thống LegalFlow V2 ngay sau khi mở rộng triển khai cho các nhóm người dùng Wave 1 và Wave 2. Báo cáo phân tích sâu phạm vi sử dụng (`Adoption Scope`), rà soát 7 chỉ số tiếp nhận then chốt (`Adoption Indicators`), tổng hợp ý kiến đóng góp trực tiếp từ các chuyên viên và lãnh đạo thụ lý (`Officer Feedback Summary`), nhận diện các rào cản ứng dụng còn tồn tại (`Adoption Barriers`), từ đó xác lập mức độ tiếp nhận tổng thể (`Adoption Assessment`) và đưa ra các kiến nghị chiến lược cho lộ trình triển khai tiếp theo (`Phase 10Q`).

---

## 2. Adoption Scope

Bảng xác nhận phạm vi người dùng và mức độ tham gia áp dụng hệ thống trên môi trường production thực tế (tuân thủ nguyên tắc không tạo/sửa user thật ngoài thẩm quyền, sử dụng mã định danh chuẩn hóa theo lộ trình cuốn chiếu):

| Target User Group | Assigned Role (`RBAC`) | Approx. Number of Users | Core Usage Scope & Functional Focus | Status & Adoption Degree | Notes & Governance Compliance |
| :--- | :---: | :---: | :--- | :---: | :--- |
| **USR-WAVE1-CORE** <br/> *(Nhóm Pilot Cốt lõi)* | `ADMIN` <br/> `MANAGER` <br/> `STAFF` <br/> `VIEWER` | `~12 - 19 users` | Sử dụng thành thạo toàn bộ 7 tab chi tiết (`UX-05`), chạy AI Khối 3.1 hàng ngày, kiểm tra Legal Snapshot Khối 3.2 và tải bản dự thảo Khối 3.3. | **HIGH ADOPTION (`95%`)** | Nhóm cán bộ nòng cốt làm chủ công cụ, hỗ trợ hướng dẫn đồng nghiệp mới. |
| **USR-WAVE2-STAFF** <br/> *(Chuyên viên Một cửa &amp; Thụ lý P2)* | `STAFF` | `+10 - 12 users` | Tiếp nhận hồ sơ, tra cứu và bộ lọc theo lĩnh vực (`CASELIST-02`), làm quen với thao tác chạy AI rà soát và tải file Word (`.docx`). | **MODERATE ADOPTION (`80%`)** | Đang tích cực áp dụng vào luồng làm việc hàng ngày dưới sự kèm cặp của Trợ lý UAT. |
| **USR-WAVE2-MGR** <br/> *(Lãnh đạo Phòng P2)* | `MANAGER` | `+2 - 3 users` | Rà soát phiếu thẩm định do AI gợi ý, kiểm tra đối chiếu quy hoạch địa phương (`LAW-02`), tải bản dự thảo Khối 3.3 để phê duyệt nội bộ. | **HIGH ADOPTION (`90%`)** | Lãnh đạo đánh giá cao tính minh bạch căn cứ pháp lý và văn phong tham mưu AI. |
| **USR-WAVE3-PREP** <br/> *(Cán bộ Tra cứu &amp; Giám sát)* | `VIEWER` <br/> `STAFF` | `+15 - 20 users` *(Scheduled)* | Chuẩn bị tiếp nhận quyền tra cứu danh sách hồ sơ Tab 1 và cơ sở tri thức `Legal Knowledge Base` vào đợt mở rộng tiếp theo. | **PREPARATION READY** | Chưa cấp quyền truy cập chính thức trong phase này. |

---

## 3. Adoption Indicators

Bảng rà soát và đánh giá 7 chỉ số tiếp nhận then chốt của người dùng mở rộng trên môi trường thực tế (`Key Adoption Indicators Table`):

| Check ID | Key Adoption Indicator | Evidence & Verification Source | Verified Result (`PASS/FAIL`) | Notes & Behavioral Analysis |
| :---: | :--- | :--- | :---: | :--- |
| **IND-01** | **Đăng nhập và điều hướng thành công:** Người dùng tự thao tác đăng nhập và điều hướng Case List không cần hỗ trợ kỹ thuật | Nhật ký thao tác &amp; phản hồi từ `USR-WAVE2` | ✅ **PASS (`92%`)** | 100% tài khoản được cấp quyền đăng nhập mượt mà, chuyển giao diện danh sách nhanh chóng. |
| **IND-02** | **Xem danh sách và sử dụng bộ lọc hồ sơ:** Chuyên viên sử dụng nhạy bén bộ lọc Lĩnh vực, Trạng thái (`CASELIST-02`) | Khảo sát chuyên viên Một cửa &amp; Thụ lý P2 | ✅ **PASS (`95%`)** | Chuyên viên đánh giá bộ lọc giúp phân loại hồ sơ Đất đai/Xây dựng cực kỳ tiện lợi. |
| **IND-03** | **Mở chi tiết hồ sơ &amp; thao tác 7 tab:** Cán bộ kiểm tra trọn vẹn thông tin trên 7 tab (`Thông tin -> Audit Log`) | Thao tác thực tế Tab 3 &amp; Tab 4 (`UX-05`) | ✅ **PASS (`90%`)** | Bố cục 7 tab logic, giúp cán bộ không bị bỏ sót tài liệu đính kèm hay checklist thẩm định. |
| **IND-04** | **Hiểu và tuân thủ AI Warning Banner:** Cán bộ ghi nhớ rõ lời nhắc *"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"* | Khảo sát nhận thức rủi ro AI Governance | ✅ **PASS (`100%`)** | Cán bộ khẳng định luôn đọc kỹ kết quả gợi ý và đối chiếu lại với hồ sơ thực tế. |
| **IND-05** | **Hiểu bản chất Export là tài liệu dự thảo:** Cán bộ nhận thức rõ file Word/PDF tải về từ Khối 3.3 mang tiền tố `DU_THAO_GOI_Y_AI_` là bản nháp nội bộ | Kiểm tra quy trình trình ký của Lãnh đạo | ✅ **PASS (`100%`)** | Không có trường hợp nào dùng bản dự thảo chưa qua chỉnh sửa, đóng dấu để phát hành ra ngoài. |
| **IND-06** | **Biết cách thông báo lỗi / yêu cầu hỗ trợ:** Người dùng chủ động liên hệ Trợ lý UAT qua kênh hỗ trợ và theo dõi sổ `Issue Register` | Nhật ký tiếp nhận `EXPANDED_USER_SUPPORT...` | ✅ **PASS (`88%`)** | Chuyên viên tích cực gửi góp ý cải tiến (`Suggestion`) thay vì chỉ báo lỗi hạ tầng. |
| **IND-07** | **Không nhầm lẫn AI là kết luận cuối cùng:** Cán bộ chủ động kiểm tra đối chiếu quy định UBND tỉnh và quy hoạch đất huyện (`LAW-02`) | Phỏng vấn sâu chuyên viên thụ lý lõi | ✅ **PASS (`100%`)** | Quán triệt ranh giới con người là chủ thể chịu trách nhiệm pháp lý tối cao (`Human-in-the-Loop`). |

---

## 4. Officer Feedback Summary

Bảng tổng hợp các ý kiến đánh giá, phản hồi và nguyện vọng từ các chuyên viên, lãnh đạo phòng sau khi trải nghiệm thực tế (`Officer Feedback Summary Table`):

| Feedback ID | Reporter Role & Group | Functional Area | Detailed Feedback & Evaluation | Priority | Recommendation & Action Plan | Status & Target Phase | Notes |
| :---: | :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| **FDB-EXP-01** | `Wave 2 Staff` *(Bộ phận Một cửa)* | `Tab 2 - Checklist Thẩm định` | Bố cục 7 tab rất trực quan, bộ lọc hồ sơ theo thủ tục giúp tìm kiếm nhanh hơn 50% so với cách tra cứu sổ giấy cũ. Mong muốn có thêm tính năng ghi chú nhanh (`Inline Comments`) trên Tab 6 để trao đổi với Phó Phòng. | `P2` | Ghi nhận vào Danh mục Backlog (`BCK-01`). Triển khai tính năng `Internal Comment Threads` tại phiên bản Major Release Phase 11. | **DEFERRED** *(Phase 11)* | Phản hồi rất tích cực về UX tổng thể. |
| **FDB-EXP-02** | `Wave 2 Manager` *(Lãnh đạo Phòng P2)* | `Khối 3.1 &amp; 3.2 AI Review` | Văn phong tham mưu của AI Khối 3.1 rất khách quan, đúng mực. Việc hiển thị rõ huy hiệu `v2.0-2024-LAND-LAW` và khung cảnh báo vàng rà soát quy hoạch đất huyện (`LAW-02`) giúp Lãnh đạo phòng yên tâm khi duyệt phiếu. | `P4` | Tiếp tục duy trì và giữ vững các chuẩn văn phong tham mưu `AI-01/04` và metadata pháp lý `LAW-02/LK-01`. | **MAINTAINED** *(Phase 10Q)* | Khẳng định độ tin cậy của AI Governance. |
| **FDB-EXP-03** | `Wave 2 Staff` *(Chuyên viên Thụ lý P2)* | `Khối 3.3 Export Draft` | Việc tải file Word (`.docx`) với tiền tố `DU_THAO_GOI_Y_AI_` rất an toàn, không lo nhầm lẫn. Tuy nhiên, mong muốn có thể sửa trực tiếp câu chữ, căn lề ngay trên giao diện Web trước khi bấm nút tải về để đỡ mất công mở Word. | `P3` | Ghi nhận vào Danh mục Backlog (`BCK-03`). Lập kế hoạch tích hợp `Inline Rich Text Editor` trong Phase 11/12. Hiện tại áp dụng workaround chỉnh sửa trên MS Word. | **DEFERRED** *(Phase 11)* | Đề xuất cải tiến UX hợp lý cho tương lai. |
| **FDB-EXP-04** | `Wave 1 Core Staff` *(Chuyên viên Pilot)* | `Khối 3.2 &amp; Legal Knowledge Base` | Hệ thống tra cứu Luật Đất đai 2024 (`LK-01`) rất nhanh. Đề xuất bổ sung thêm tính năng cho phép bấm vào tên từng Điều/Khoản ở Khối 3.2 để mở popup xem toàn văn nội dung căn cứ đó ngay lập tức mà không cần sang tab khác. | `P3` | Ghi nhận vào Danh mục Backlog (`BCK-07: Interactive Law Reader`). Đưa vào kế hoạch nâng cấp tiện ích tra cứu nhanh tại Phase 11. | **DEFERRED** *(Phase 11)* | Góp ý giá trị giúp tối ưu trải nghiệm tra cứu pháp lý. |

---

## 5. Adoption Barriers

Mặc dù tỷ lệ tiếp nhận của người dùng mở rộng đạt trên `85%`, quá trình khảo sát cũng nhận diện 5 rào cản ứng dụng còn tồn tại (`Remaining Adoption Barriers`) cần được hỗ trợ tháo gỡ trong các giai đoạn tới:
1. **Cần thêm hướng dẫn sử dụng chi tiết &amp; trực quan:** Một số chuyên viên lớn tuổi tại phòng chuyên môn 2 vẫn còn bỡ ngỡ khi chuyển đổi qua lại giữa 7 tab và thao tác trên Khối 3.1; cần có tài liệu hướng dẫn nhanh (`Quick Reference Guide` / Video ngắn gọn) hoặc buổi kèm cặp trực tiếp ngắn.
2. **Cần đào tạo ngắn (`Refresh Training`) cho cán bộ mới:** Khi chuẩn bị mở rộng sang Wave 3 (nhóm Cán bộ Tra cứu &amp; Giám sát), cần tổ chức một buổi tập huấn ngắn 45 phút rà soát phân quyền `RBAC` (`VIEWER canAct: false`) để tránh nhầm lẫn về quyền thao tác.
3. **Cần bổ sung các mẫu biểu Word hành chính đa dạng hơn:** Khối 3.3 hiện đang cung cấp mẫu phiếu rà soát chuẩn hóa; chuyên viên có nhu cầu mở rộng thêm các mẫu tờ trình, quyết định theo đúng Nghị định 30/2020/NĐ-CP để giảm thời gian soạn thảo (`BCK-08`).
4. **Cần dữ liệu căn cứ đặc thù địa phương tích hợp sâu hơn:** Hiện tại Khối 3.2 dùng cảnh báo `LAW-02` nhắc rà soát thủ công quy hoạch sử dụng đất cấp huyện. Trong tương lai (`Phase 12`), nếu có thể liên thông số liệu bản đồ quy hoạch địa phương vào DB, AI sẽ hỗ trợ tham mưu chuẩn xác hơn nữa.
5. **Cần các module lớn đang chờ trong Backlog:** Việc thiếu vắng tính năng bóc tách OCR hồ sơ scan (`BCK-02`), trình soạn thảo trực tiếp Khối 3.3 (`BCK-03`) và luồng trình duyệt nhiều cấp (`BCK-04`) khiến quy trình làm việc vẫn phải kết hợp giữa LegalFlow V2 và phần mềm văn phòng E-Office hiện hữu.

---

## 6. Adoption Assessment

Dựa trên việc rà soát 7 chỉ số tiếp nhận, tổng hợp phản hồi tích cực từ cán bộ thực tiễn và không phát sinh bất kỳ lỗi phản ứng tiêu cực nào, Hội đồng Thẩm định Dự án chính thức xác nhận đánh giá mức độ tiếp nhận:

```markdown
[   ] ADOPTION ACCEPTABLE               : Người dùng tiếp nhận xuất sắc 100%, không cần đào tạo thêm.
[ X ] ADOPTION ACCEPTABLE WITH TRAINING : Người dùng tiếp nhận tốt hệ thống, cần duy trì hỗ trợ và đào tạo bổ sung ngắn cho các đợt mới.
[   ] ADOPTION LIMITED                  : Mức độ tiếp nhận hạn chế do rào cản thao tác hoặc lỗi kỹ thuật.
[   ] ADOPTION NOT READY                : Người dùng chưa sẵn sàng, cần tạm hoãn triển khai thực tiễn.
```

&rarr; **`OFFICIAL ADOPTION ASSESSMENT: ADOPTION ACCEPTABLE WITH TRAINING`**  
*(Nhóm người dùng mở rộng Wave 1 và Wave 2 đón nhận hệ thống rất tích cực, làm chủ tốt luồng tham mưu AI Khối 3.1 và tuân thủ nghiêm ngặt kỷ luật AI Governance. Kiến nghị tiếp tục duy trì Lực lượng trực chiến và tổ chức các buổi hướng dẫn ngắn để tháo gỡ rào cản thói quen làm việc cũ)*.

---

## 7. Recommendation

### Kiến nghị Chiến lược của Ban Quản lý Dự án &amp; UAT Coordinator:
1. **Tiếp tục duy trì mở rộng từng bước theo lộ trình cuốn chiếu (`Controlled Waves`):** Đồng ý giữ vững nhóm người dùng Wave 1/Wave 2 trên môi trường production, đồng thời chuẩn bị các điều kiện an toàn để triển khai Wave 3 (nhóm Tra cứu &amp; Giám sát viên) sau 7 ngày giám sát ổn định tại Phase 10Q.
2. **Tổ chức buổi hướng dẫn &amp; kèm cặp ngắn (`Targeted Training Sessions`):** Bố trí Trợ lý UAT tổ chức các buổi hướng dẫn ngắn (`30-45 phút`) tại phòng làm việc để hướng dẫn chuyên viên cách tận dụng tối đa 7 tab chi tiết và bộ lọc hồ sơ nhanh `CASELIST-02`.
3. **Duy trì Sổ theo dõi Hỗ trợ Hàng ngày (`Issue Register Maintenance`):** Tiếp tục mở và rà soát sổ `EXPANDED_USER_SUPPORT_ISSUE_REGISTER` vào lúc `16:30 PM` mỗi chiều để kịp thời tiếp thu ý kiến đóng góp của chuyên viên.
4. **Tuyệt đối không mở đại trà khi chưa hoàn thiện hỗ trợ vận hành:** Khẳng định giữ vững kỷ luật không mở quyền đại trà cho toàn bộ cơ quan (`General Availability - Wave 4`) nếu chưa hoàn tất kiểm chứng đợt Wave 3 và chưa có giải pháp tự động hóa sao lưu DB định kỳ an toàn.

---
*Báo cáo Đánh giá Mức độ Tiếp nhận của Người dùng được lập tự động từ kết quả rà soát thực tiễn và khảo sát cán bộ thụ lý trong Phase 10P.*
