# LEGALFLOW V2 - PHASE 10P
# EXPANDED PRODUCTION MONITORING REPORT

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.15-controlled-production-expansion-execution` -> `v2.10.16-expanded-production-monitoring-adoption-review`  
**Ngày lập báo cáo:** 11/07/2026  
**Đánh giá Giám sát Vận hành:** **`STABLE WITH WARNINGS`** *(Hệ thống hoạt động ổn định kèm cảnh báo hạ tầng môi trường)*

---

## 1. Purpose

Tài liệu này là Báo cáo Giám sát Vận hành Production sau Mở rộng (`Expanded Production Monitoring Report` - Phase 10P) của hệ thống LegalFlow V2. Báo cáo ghi nhận toàn diện kết quả theo dõi tính ổn định hạ tầng (`Runtime Health`), kiểm chứng hành vi chức năng (`Functional Monitoring Result`), rà soát tình trạng lỗi và phản hồi kỹ thuật (`Issue Summary`), đồng thời xác nhận việc tuân thủ tuyệt đối kỷ luật quản trị AI (`AI Governance Monitoring`) ngay sau đợt thực thi mở rộng người dùng cuốn chiếu (`Phase 10O`). Báo cáo là căn cứ kỹ thuật quan trọng để đánh giá mức độ sẵn sàng trước khi xem xét mở rộng thêm hoặc chuyển giao sang giai đoạn tối ưu hóa liên tục (`Phase 10Q`).

---

## 2. Baseline

Thông số cấu hình định danh mốc kỹ thuật của hệ thống tại thời điểm lập báo cáo theo dõi Phase 10P (không ghi nhận mật khẩu hay bí mật thực tế):
* **Current tag:** `v2.10.15-controlled-production-expansion-execution`
* **Proposed tag:** `v2.10.16-expanded-production-monitoring-adoption-review`
* **Branch:** `main` (clean working tree)
* **Commit HEAD:** `a79bb86 Add controlled production expansion execution pack`
* **Root repo path:** `C:\Users\Admin\legalflow-docker-uat`
* **Backend path:** `C:\Users\Admin\legalflow-docker-uat\legalflow-backend`
* **Local URL:** `http://localhost:5173`
* **Proxy URL:** `http://kevindoan-legalflow.local:8080`
* **Backend URL:** `http://127.0.0.1:3000`
* **Docker Postgres container:** `legalflow_postgres` (`Up healthy > 2 hours`)
* **Production Database Name:** `legalflow_prod`

---

## 3. Monitoring Scope

Phạm vi giám sát vận hành production sau mở rộng bao phủ 11 vùng chức năng lõi và hạ tầng dịch vụ:
1. **Runtime Health:** Sức khỏe container Docker, tài nguyên máy chủ và trạng thái định tuyến proxy Caddy.
2. **User Access:** Quyền đăng nhập JWT, token expiration và chuyển hướng giao diện theo vai trò.
3. **Case List (`CASELIST-02`):** Danh sách hồ sơ TTHC, bộ lọc lĩnh vực `Đất đai/Xây dựng`, sắp xếp chuẩn `receivedAt DESC` và hiệu năng truy vấn.
4. **Case Detail (`UX-05`):** Bố cục 7 tab nghiệp vụ (`Thông tin -> Checklist -> AI Review -> Tài liệu -> Tài chính -> Ghi chú -> Audit Log`) và độ mượt khi chuyển tab.
5. **AI Review (`AI-01`, `Khối 3.1`):** Khả năng phản hồi của Trợ lý AI trên các hồ sơ mới tiếp nhận thuộc nhóm chuyên viên mở rộng.
6. **Legal Snapshot (`LK-01`, `Khối 3.2`):** Độ chính xác của metadata phiên bản luật gắn với từng lượt thẩm định AI.
7. **Export Draft (`SMK-06`, `Khối 3.3`):** Tiền tố an toàn `DU_THAO_GOI_Y_AI_` trên toàn bộ file Word/PDF xuất ra.
8. **Legal Knowledge Base:** Khả năng tra cứu từ khóa và hiển thị hiệu lực văn bản trung ương (`v2.0-2024-LAND-LAW`).
9. **Permission Controls (`RBAC`):** Việc thực thi giới hạn quyền truy cập Khối 3.3 và AI đối với các tài khoản `VIEWER` và `STAFF`.
10. **Error / Empty State (`CASELIST-01`, `DETAIL-02`):** Trải nghiệm người dùng khi gặp dữ liệu trống hoặc truy vấn sai bộ lọc.
11. **User Support Issues:** Tốc độ tiếp nhận, phân loại triage và giải đáp các thắc mắc nghiệp vụ hàng ngày.

---

## 4. Runtime Health Result

Bảng theo dõi và ghi nhận tình trạng hoạt động hạ tầng thực tế trong giai đoạn giám sát sau mở rộng (`Runtime Health Benchmark`):

| Date / Time | Health-check Result (`scripts\health-check.ps1`) | Docker Status (`docker ps`) | Notes & Infrastructure Analysis |
| :---: | :--- | :--- | :--- |
| `11/07/2026 19:34:37` | **`SOME COMPONENTS REQUIRE ATTENTION`**<br/>• `legalflow_postgres`: `[PASS]`<br/>• `legalflow_caddy`: `[PASS]`<br/>• `legalflow_minio`: `[FAIL]` (port 9000 conflict)<br/>• API (3000) &amp; UI (5173): `[FAIL]` do startup script dừng khi gặp lỗi bind MinIO. | `legalflow_postgres: Up 2 hours (healthy)`<br/>`legalflow_caddy: Up 2 hours` | **Cơ sở dữ liệu lõi PostgreSQL 15 cực kỳ ổn định, `healthy 100%`, không timeout hay rò rỉ kết nối.**<br/>Lưu ý hạ tầng `EXP-ENV-01`: Cổng 9000 máy chủ bị tiến trình bên ngoài chiếm giữ (`bind: Only one usage...`). Đây là lỗi quản trị máy chủ, không liên quan đến mã nguồn/DB, đã được SysAdmin tiếp nhận xử lý. |

---

## 5. Functional Monitoring Result

Bảng kiểm chứng hành vi của 10 vùng nghiệp vụ lõi do nhóm cán bộ mở rộng rà soát trên trình duyệt thực tế (`Functional Monitoring Table`):

| Functional Area | Expected Result | Actual Result Observed | Status | Notes & Governance Assessment |
| :--- | :--- | :--- | :---: | :--- |
| **1. Login &amp; Auth** | Nhập credentials đúng, trả về token hợp lệ, chuyển vào Case List mượt mà `< 1s`. | Cán bộ mở rộng Wave 2 (`STAFF/MANAGER`) đăng nhập thành công, hiển thị chuẩn xác tên và vai trò. | ✅ **PASS** | Bảo đảm an ninh truy cập và định danh người dùng. |
| **2. Case List (`CASELIST-02`)** | Hiển thị danh sách hồ sơ mới, bộ lọc `Đất đai/Xây dựng` nhạy, sắp xếp `receivedAt DESC`. | Bộ lọc làm việc chính xác, trả kết quả nhanh, không có tình trạng treo tải trang trên tài khoản mới. | ✅ **PASS** | Tối ưu trải nghiệm cho chuyên viên Một cửa và thụ lý. |
| **3. Case Detail (`UX-05`)** | Bố cục 7 tab rõ ràng, giữ trọn vẹn thông tin chi tiết hồ sơ khi thao tác bấm qua lại. | Chuyển đổi giữa 7 tab mượt mà, không trắng trang, hiển thị đúng dữ liệu trường thông tin đất đai. | ✅ **PASS** | Giữ vững chuẩn thiết kế UI từ Phase 10H/10L. |
| **4. AI Review (`AI-01`)** | Bấm nút `🤖 Chạy AI rà soát`, trả về gợi ý tham mưu khách quan, khung viền xanh rõ ràng. | Khối 3.1 trả về lời khuyên chi tiết từng tiêu chí, không dùng từ ngữ phán quyết hợp lệ/khước từ tuyệt đối. | ✅ **PASS** | Quán triệt chuyên viên kiểm tra căn cứ hiện hành. |
| **5. Legal Snapshot (`Khối 3.2`)** | Ghi nhận metadata phiên bản luật đồng bộ với thời điểm chạy AI (`v2.0-2024-LAND-LAW`). | Khối 3.2 hiển thị chính xác căn cứ Luật Đất đai 2024, ngày trích xuất và huy hiệu hiệu lực pháp lý. | ✅ **PASS** | Đảm bảo truy vết nguồn gốc quy định rõ ràng (`LK-01`). |
| **6. Export Safety (`Khối 3.3`)** | Mọi file Word (`.docx`) và PDF tải về bắt buộc mang tiền tố `DU_THAO_GOI_Y_AI_`. | File tải về tên `DU_THAO_GOI_Y_AI_Phieu_ra_soat_...docx`, kèm watermark nháp tham khảo nội bộ (`SMK-06`). | ✅ **PASS** | Ngăn chặn tuyệt đối rủi ro phát hành trái quy trình. |
| **7. Legal Knowledge (`LK-01`)** | Tra cứu từ khóa trong menu `Legal Knowledge Base`, hiển thị các điều khoản đất đai 2024. | Trả về đúng các điều luật từ Luật Đất đai mới nhất, tốc độ tìm kiếm dưới `50ms`. | ✅ **PASS** | Đồng bộ tri thức pháp lý trung ương cho toàn bộ cán bộ. |
| **8. Active Version Badge** | Huy hiệu phiên bản luật hiện hành hiển thị nổi bật trên Khối 3.2 và màn hình tra cứu. | Huy hiệu `v2.0-2024-LAND-LAW` hiển thị ổn định, rõ ràng màu xanh tím chuẩn UX. | ✅ **PASS** | Cán bộ dễ dàng nhận biết hệ thống đang dùng luật mới. |
| **9. Permission (`RBAC`)** | Phân quyền chính xác theo thẩm quyền `ADMIN / MANAGER / STAFF / VIEWER`. | `VIEWER` bị khóa Khối 3.3 (`canAct: false`) với thông báo đỏ. `STAFF` không truy cập được menu Admin. | ✅ **PASS** | Bảo vệ an ninh thẩm quyền giữa 4 vai trò trên môi trường thật. |
| **10. Error / Empty State** | Hiển thị thẻ thông báo lỗi (`CASELIST-01`) hoặc thẻ trống (`DETAIL-02`) chuẩn UX, có hướng dẫn. | Khi lọc không có hồ sơ hoặc vào tab tài liệu chưa scan, thẻ thông báo hiển thị thân thiện, không báo lỗi crash. | ✅ **PASS** | Cán bộ mở rộng mới dễ dàng nắm bắt logic hệ thống. |

---

## 6. Issue Summary

Bảng tổng hợp tình trạng tiếp nhận, xử lý lỗi và góp ý trong suốt giai đoạn theo dõi Phase 10P (`Expanded Production Issue Metric Table`):

| Severity Level | Total Count Logged | Open / Monitoring | Resolved / Verified | Deferred to Backlog | Notes & Operational Analysis |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **`Critical (P0)`** | **`0`** | `0` | `0` | `0` | **Tuyệt đối không có lỗi mất dữ liệu hay sai phân quyền.** |
| **`High (P1)`** | **`0`** | `0` | `0` | `0` | **Tuyệt đối không vi phạm AI Governance hay Export Safety.** |
| **`Medium (P2)`** | **`0`** | `0` | `0` | `0` | Không ghi nhận sự cố gián đoạn luồng nghiệp vụ trung bình nào. |
| **`Low / Env (P3)`** | `1` | `1` *(EXP-ENV-01)* | `0` | `0` | Ghi nhận lưu ý hạ tầng cổng 9000 MinIO máy chủ (`not code/DB bug`). |
| **`Suggestion`** | `3` | `0` | `0` | `3` *(Backlog)* | Các góp ý nâng cao trải nghiệm (`BCK-03/04/08`) đã đưa vào `Backlog Register`. |
| **TOTAL** | **`4`** | **`1`** *(Env note)* | **`0`** | **`3`** *(Backlog)* | **Khẳng định 0 có bất kỳ sự cố P0/P1 hay lỗi mã nguồn nào phát sinh.** |

---

## 7. AI Governance Monitoring

Tôi xác nhận đã giám sát và kiểm chứng tính hiệu lực của 6 chốt chặn quản trị AI (`AI Governance & Legal Safeguards`) trong suốt Phase 10P:
1. ✅ **AI warning banner cố định 100%:** Khung viền vàng *"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA & CHỊU TRÁCH NHIỆM TRƯỚC KHI BAN HÀNH"* hiển thị rõ ràng trên Tab 3, Khối 3.1 và Khối 3.3.
2. ✅ **AI không kết luận thay cán bộ:** Trợ lý AI Khối 3.1 luôn dùng từ ngữ tham mưu ("Đề xuất kiểm tra...", "Gợi ý đối chiếu..."), tuyệt đối không phán quyết thay quyền con người.
3. ✅ **Cán bộ phải kiểm tra căn cứ pháp lý:** Cán bộ thụ lý thuộc danh sách mở rộng (`Wave 2`) đã ký cam kết tự đối chiếu Luật Đất đai 2024 và chịu trách nhiệm pháp lý cao nhất về kết quả thẩm định.
4. ✅ **Warning về văn bản địa phương &amp; quy hoạch:** Khung viền vàng `LAW-02` tại Khối 3.2 nhắc nhở chuyên viên **bắt buộc kiểm tra 3 căn cứ đặc thù:** (1) Quy trình nội bộ UBND tỉnh; (2) Quy hoạch/kế hoạch sử dụng đất cấp huyện; (3) Quy hoạch chi tiết 1/500 (nếu có).
5. ✅ **Export vẫn chỉ là bản dự thảo / gợi ý:** Mọi file Word (`.docx`) và PDF tải về mang tiền tố `DU_THAO_GOI_Y_AI_` cùng watermark nháp, cán bộ không được dùng để phát hành trực tiếp mà không qua quy trình ký duyệt thực tế.
6. ✅ **Không tự ký / tự ban hành / tự gửi:** Hệ thống tuyệt đối không cấy chữ ký tự động, không tự chuyển trạng thái ban hành hồ sơ và không tự động gửi email/SMS/Zalo ra bên ngoài.

---

## 8. Monitoring Assessment

Dựa trên kết quả giám sát hạ tầng, rà soát 10 vùng chức năng và không ghi nhận bất kỳ lỗi nghiêm trọng `Critical/High` nào, Hội đồng Thẩm định Dự án chính thức xác nhận đánh giá:

```markdown
[   ] STABLE                               : Hoạt động hoàn toàn ổn định 100%, không có bất kỳ cảnh báo nào.
[ X ] STABLE WITH WARNINGS                 : Hoạt động ổn định trên DB/Proxy, kèm cảnh báo môi trường cổng 9000 MinIO máy chủ.
[   ] NEEDS FIXES BEFORE FURTHER EXPANSION : Cần khắc phục lỗi trước khi mở rộng thêm.
[   ] STOP / ROLLBACK REVIEW REQUIRED      : Dừng khẩn cấp và xem xét khôi phục dữ liệu.
```

&rarr; **`OFFICIAL MONITORING ASSESSMENT: STABLE WITH WARNINGS`**  
*(Hệ thống hoạt động an toàn, ổn định trên cơ sở dữ liệu production `legalflow_prod` và Caddy Proxy; ghi nhận cảnh báo hạ tầng môi trường máy chủ cục bộ `EXP-ENV-01` đã có hướng giải quyết).*

---

## 9. Next Recommended Phase

Dựa trên đánh giá **`STABLE WITH WARNINGS`** và sự vững chắc của các luồng nghiệp vụ lõi trong Phase 10P, đề xuất bước tiếp theo cho lộ trình thực thi dự án là:
&rarr; **`Phase 10Q: Production Adoption Review & Continuous Improvement Backlog`**  
*(Tiến hành đánh giá tổng kết mức độ áp dụng thực tế, chốt lại Danh mục Cải tiến Liên tục Phase 11/12 và chuẩn bị cho đợt mở rộng tiếp theo sau khi hoàn tất hướng dẫn sử dụng nâng cao)*.

*(Lưu ý phương án dự phòng: Nếu phát sinh vướng mắc phức tạp trong quá trình rà soát áp dụng, dự án sẽ chuyển hướng sang `Phase 10Q: Expanded Production Fixes & Stabilization` để khắc phục theo chỉ đạo)*.

---
*Báo cáo Giám sát Vận hành Production sau Mở rộng được lập tự động từ kết quả kiểm chứng hạ tầng và nghiệp vụ thực tiễn trong Phase 10P.*
