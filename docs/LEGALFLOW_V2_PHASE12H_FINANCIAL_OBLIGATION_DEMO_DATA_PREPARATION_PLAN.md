# Kế Hoạch Chuẩn Bị Dữ Liệu Kiểm Thử Mẫu (Demo Data Preparation Plan) - Giai Đoạn 12H
## Phase 12H: Financial Obligation Demo Data Preparation Plan

> [!IMPORTANT]
> **TÍNH CHẤT GIAI ĐOẠN 12H (DOCS-ONLY PREPARATION PLAN):**
> Phase 12H tập trung hoàn toàn vào việc thiết kế và lập kế hoạch chuẩn bị bộ dữ liệu giả lập an toàn (Safe Simulated Demo Data) cho 8 kịch bản kiểm thử mẫu thuộc phân hệ "Hỗ trợ nghĩa vụ tài chính".
> Giai đoạn này tuân thủ tuyệt đối nguyên tắc **KHÔNG SEED DATABASE**, **KHÔNG TẠO HỒ SƠ THẬT TRONG DB**, **KHÔNG SỬA CODE** và **KHÔNG TẠO MIGRATION/SCHEMA**. Toàn bộ dữ liệu thiết kế đều phải được gắn nhãn cảnh báo **`DEMO ONLY - NOT REAL CITIZEN DATA`**.

---

## 1. Mục Đích (Purpose)
* **Xây dựng bộ đặc tả dữ liệu an toàn:** Thiết kế chi tiết cấu trúc dữ liệu mô phỏng cho 8 hồ sơ kiểm thử (`FO-UAT-01` đến `FO-UAT-08`), đảm bảo không sử dụng bất kỳ thông tin cá nhân thực tế nào của công dân (tên, CCCD, địa chỉ, số thửa thật).
* **Tháo gỡ điểm nghẽn UAT (Unblock UAT Execution):** Chuẩn bị sẵn sàng bộ dữ liệu chuẩn hóa để phục vụ đợt nạp thử nghiệm (Dry-run Seeding) tại Phase 12I, giúp Kiểm thử viên có thể thao tác tương tác trực tiếp trên giao diện.
* **Thiết lập hàng rào bảo vệ (Guardrails & Privacy Rules):** Quy định rõ ràng các ranh giới an toàn, cấm tuyệt đối việc sử dụng dữ liệu thực của công dân hoặc tính toán số tiền mang tính chất pháp lý chính thức.

---

## 2. Đường Cơ Sở Hệ Thống (Baseline Check)
* **Git Repository:** `C:\Users\Admin\legalflow-docker-uat`
* **Current Branch:** `main`
* **Latest Tag (Phase 12G Baseline):** `v2.12.6-financial-obligation-pilot-uat-execution-triage`
* **Working Tree Status:** Clean (Không có uncommitted code changes trước khi khởi tạo tài liệu Phase 12H).
* **Scope of Changes in Phase 12H:** Chỉ tạo mới 05 tài liệu markdown quy định đặc tả dữ liệu trong thư mục `docs/`.

---

## 3. Lý Do Cần Dữ Liệu Demo & Trạng Thái UAT (Why Demo Data is Needed & UAT Blocked Reason)
Trong Báo cáo tổng kết Giai đoạn 12G (`docs/LEGALFLOW_V2_PHASE12G_FINANCIAL_OBLIGATION_UAT_EXECUTION_COMPLETION_REPORT.md`) và Sổ đăng ký phát hiện `FO-ISSUE-01`, tình trạng thực thi UAT tương tác live đã bị ghi nhận chặn luồng:

**`UAT is blocked because safe demo data is not available.`**

* **Nguyên nhân chi tiết:** Các bảng dữ liệu nghiệp vụ của phân hệ (`financial_obligation_assessments`, `tax_notice_records`, `payment_evidence_records`) hiện có số lượng bản ghi bằng `0`.
* **Sự cần thiết của Demo Data:** Để Kiểm thử viên (`OFFICER`, `MANAGER`) có thể bấm kiểm thử trọn vẹn các chốt chặn (như upload thông báo thuế, thẩm định chứng từ, chặn hoàn thành khi thiếu điều kiện), hệ thống bắt buộc phải có 8 hồ sơ mô phỏng chuẩn có sẵn các cờ trạng thái tương ứng mà không phải phụ thuộc vào việc nhập liệu thủ công tốn thời gian hay rủi ro lấy nhầm hồ sơ thật của người dân.

---

## 4. Nguyên Tắc Thiết Kế Dữ Liệu Demo (Demo Data Principles)
1. **Hoàn toàn giả lập (100% Simulated & Synthetic):** Mọi thông tin nhân thân, thửa đất và số liệu tiền bạc trong tài liệu và kịch bản đều được tạo giả lập hoàn toàn, không phản ánh bất kỳ vụ việc thực tế nào ngoài xã hội.
2. **Gắn nhãn rõ ràng (Mandatory Watermarking & Labeling):**
   - Mọi bản ghi hồ sơ demo phải có nhãn: **`DEMO ONLY - NOT REAL CITIZEN DATA`**.
   - Các khoản chiết tính tiền mẫu phải có nhãn: **`DEMO ESTIMATE`**.
   - Thông báo thuế mẫu phải có nhãn: **`DEMO TAX NOTICE - NOT OFFICIAL`**.
   - Chứng từ nộp tiền mẫu phải có nhãn: **`DEMO PAYMENT EVIDENCE - NOT REAL`**.
3. **Phân lập tuyệt đối (Strict Isolation):** Dữ liệu demo chỉ được phép tồn tại trên môi trường kiểm thử/UAT (`legalflow_uat` hoặc `legalflow_prod` container local trong giai đoạn thử nghiệm có kiểm soát), được gắn tiền tố mã hồ sơ riêng biệt (`DEMO-FO-2026-xxx`) để không bị nhầm lẫn với hồ sơ hành chính thật (`TTHC-2026-xxx`).

---

## 5. Quy Tắc Bảo Mật & Riêng Tư (Privacy Rules)
1. **Không dùng tên công dân thật:** Chỉ sử dụng định dạng quy chuẩn `Người dân Demo 01`, `Người dân Demo 02`... đến `Người dân Demo 08`.
2. **Không dùng số CCCD/CMND thật:** Chỉ sử dụng dãy số giả định định dạng `000000000101`, `000000000102`...
3. **Không dùng số tờ/số thửa thật:** Chỉ sử dụng các số thửa giả định không gắn liền với tọa độ hay sổ địa chính thực tế (ví dụ: `Thửa số 9999`, `Tờ bản đồ số 999`).
4. **Không dùng địa chỉ thật chi tiết:** Chỉ sử dụng địa chỉ mô phỏng cấp chung chung (ví dụ: `Khu phố Demo A, Phường Kiểm Thử, Thành phố UAT`).
5. **Không lưu trữ thông tin nhạy cảm:** Cấm tuyệt đối đưa mật khẩu, token, secret key hay thông tin tài khoản ngân hàng thật vào đặc tả dữ liệu.

---

## 6. Quy Tắc An Toàn Tuyệt Đối (Safety Rules for Phase 12H)
1. Chỉ tạo/cập nhật tài liệu trong thư mục `docs/`.
2. Không sửa code backend (`legalflow-backend`).
3. Không sửa code frontend (`src`).
4. Không sửa Prisma schema (`schema.prisma`).
5. Không tạo migration database.
6. Không chỉnh sửa tệp `.env`.
7. Không reset database.
8. Không restore database.
9. **Không seed database trong Phase 12H này** (tài liệu chỉ đóng vai trò chuẩn bị kế hoạch cho Phase 12I).
10. Không tạo hồ sơ thật hay hồ sơ demo trực tiếp vào DB trong bước này.
11. Không dùng dữ liệu công dân thật.
12. Không tính toán số tiền chính thức mang tính pháp lý.
13. Không phát hành thông báo thuế.
14. Không thay thế cơ quan thuế.
15. Không tự đánh dấu hồ sơ đã hoàn thành nghĩa vụ tài chính.
16. Không gửi email / SMS / Zalo cho công dân.
17. Không ghi password / token / secret.
18. Không commit / tag thay cho người dùng.
19. Không đưa backup hoặc tệp dữ liệu thật vào Git repository.
20. Đảm bảo mọi đề xuất dữ liệu đều tuân thủ nguyên tắc gắn nhãn `DEMO ONLY - NOT REAL CITIZEN DATA`.

---

## 7. Xác Nhận Không Seed Trong Giai Đoạn Này (No Seeding Confirmation)
Hội đồng kỹ thuật xác nhận **Phase 12H là giai đoạn 100% chuẩn bị tài liệu đặc tả (Docs-only Preparation Phase)**. Việc chạy script tạo dữ liệu hay nạp (seed) vào cơ sở dữ liệu UAT **chưa được thực hiện tại Phase 12H** mà sẽ được thẩm định và thực thi thử nghiệm an toàn tại Phase 12I sau khi kế hoạch này được phê duyệt.

---

## 8. Giai Đoạn Tiếp Theo Được Khuyến Nghị (Recommended Next Phase)
Sau khi hoàn tất 05 tài liệu đặc tả dữ liệu demo tại Phase 12H và được Cán bộ rà soát chấp thuận, giai đoạn tiếp theo được đề xuất triển khai là:

**`Phase 12I: Financial Obligation Demo Data Seed Dry-run Plan`**

*(Ghi chú: Phase 12I sẽ tiến hành viết script nạp dữ liệu kiểm thử demo một cách isolated, chạy kiểm tra dry-run trên môi trường UAT và tiến hành re-test 14 kịch bản UAT tương tác bị blocked ở Phase 12G)*.
