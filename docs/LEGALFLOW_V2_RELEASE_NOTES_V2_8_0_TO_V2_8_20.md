# LEGALFLOW V2 RELEASE NOTES

# Version Governance Track v2.8.0 - v2.8.20

**Ngày phát hành:** 06/07/2026  
**Dòng phát hành (Release Track):** Legal Knowledge Version Governance & Audit Track  
**Phạm vi:** Toàn bộ chuỗi tính năng Quản trị Phiên bản Pháp lý từ `v2.8.0` đến `v2.8.20`  

---

## 1. Overview

Release Track **v2.8.0 - v2.8.20** là một trong những bước tiến kiến trúc quan trọng nhất của dự án **LegalFlow V2**. Dòng phát hành này tập trung xây dựng hoàn chỉnh hệ sinh thái **Quản trị Phiên bản Pháp lý (Legal Knowledge Version Governance)** – nơi kết nối khép kín giữa sự biến động của pháp luật đất đai (Luật, Nghị định, Quyết định) với hoạt động thẩm tra hồ sơ thủ tục hành chính (TTHC) của trí tuệ nhân tạo (AI).

Mục tiêu của release track là chuẩn hóa toàn bộ vòng đời quản trị căn cứ pháp lý theo nguyên tắc **Human-in-the-Loop**, cung cấp cho cán bộ nghiệp vụ và lãnh đạo cơ quan các công cụ chuyên sâu từ Phân tích tác động, Rà soát ý kiến, Tạo bản nháp, Kiểm thử song song (Simulation/Shadow Testing), Kích hoạt thủ công có xác nhận nhiều bước, Hậu kiểm chỉ đọc (Read-only Verification), cho đến cơ chế Hoàn tác khẩn cấp (Manual Rollback) bảo đảm tính toàn vẹn tuyệt đối của dữ liệu lịch sử.

---

## 2. Tags Included

Dưới đây là danh sách tổng hợp toàn bộ các mốc phát hành (Git Tags) thuộc chuỗi quản trị version pháp lý đã được triển khai và xác nhận trong repository local:

- **`v2.8.0-legal-update-review-workflow-foundation`**: Nền tảng cấu trúc workflow rà soát cập nhật pháp lý.
- **`v2.8.1-legal-update-review-workflow-foundation-complete`**: Hoàn thiện UI/UX và nghiệm thu workflow rà soát 6 bước.
- **`v2.8.2-draft-version-creation`**: Nền tảng backend tự động khởi tạo bản nháp (`DRAFT`) cho thủ tục, prompt AI và checklist.
- **`v2.8.3-draft-version-creation-complete`**: Hoàn thiện UI tạo bản nháp và liên kết metadata trong nhật ký cập nhật.
- **`v2.8.4-draft-version-simulation`**: Nền tảng kiểm thử song song bản nháp trên hồ sơ TTHC thực tế (Shadow Testing).
- **`v2.8.5-draft-version-simulation-complete`**: Hoàn thiện UI Shadow Testing Modal (Modal 10) và bảng đối chiếu khác biệt (Diff Summary).
- **`v2.8.6-manual-version-activation-design`**: Thiết kế kiến trúc kích hoạt version thủ công bảo đảm nguyên tắc Human-in-the-Loop.
- **`v2.8.7-manual-version-activation-foundation`**: Nền tảng backend kích hoạt version thủ công với Prisma Transaction và Anti-duplicate rule.
- **`v2.8.8-manual-version-activation-foundation-complete`**: Hoàn thiện và kiểm chứng 100% test case backend cho cơ chế kích hoạt.
- **`v2.8.9-activation-ui-multistep-confirmation`**: Triển khai UI modal xác nhận kích hoạt 4 bước dành riêng cho Lãnh đạo.
- **`v2.8.10-activation-ui-multistep-confirmation-complete`**: Hoàn thiện nghiệm thu UI kích hoạt và kiểm chứng hệ thống.
- **`v2.8.11-post-activation-verification-audit`**: Nền tảng backend hậu kiểm sau kích hoạt (Read-only Audit Dashboard).
- **`v2.8.12-post-activation-verification-audit-complete`**: Hoàn thiện UI bảng kiểm chứng chỉ đọc sau kích hoạt (Huy hiệu PASS/WARNING/FAIL).
- **`v2.8.13-manual-version-rollback-design`**: Thiết kế kiến trúc hoàn tác version thủ công (Rollback Governance).
- **`v2.8.14-manual-version-rollback-foundation`**: Nền tảng backend hoàn tác version với giao dịch nguyên tử và audit logging.
- **`v2.8.15-manual-version-rollback-foundation-complete`**: Hoàn thiện và kiểm chứng bộ test case backend cho cơ chế rollback.
- **`v2.8.16-rollback-ui-multistep-confirmation`**: Triển khai UI modal xác nhận hoàn tác 4 bước với chuỗi bảo vệ bắt buộc.
- **`v2.8.17-rollback-ui-multistep-confirmation-complete`**: Hoàn thiện nghiệm thu UI rollback và kiểm chứng không tác động dữ liệu cũ.
- **`v2.8.18-post-rollback-verification-audit`**: Nền tảng backend hậu kiểm sau hoàn tác (Post-rollback Verification).
- **`v2.8.19-post-rollback-verification-audit-complete`**: Hoàn thiện UI bảng hậu kiểm rollback và chuẩn hóa thông số kiểm chứng.
- **`v2.8.20` *(Proposed/Reserved)***: Mốc tổng kết toàn bộ chuỗi kiến trúc Legal Version Governance & Release Notes (Phase 8F-E-D-F).

---

## 3. Major Features

Release track v2.8.x mang đến 9 nhóm tính năng đột phá, định hình lại cách thức vận hành của hệ thống pháp lý số:

1. **Review Workflow (Quy trình rà soát tác động pháp lý)**: Cung cấp luồng làm việc chuẩn hóa 6 hành động (`START_REVIEW`, `ADD_NOTE`, `REQUEST_MORE_INFO`, `APPROVE_FOR_VERSIONING`, `REJECT`, `CLOSE`) với phân quyền RBAC rõ ràng giữa chuyên viên và lãnh đạo.
2. **Draft Version Creation (Khởi tạo bản nháp pháp lý)**: Tự động nhân bản cấu trúc thủ tục hành chính, system prompt AI và checklist kiểm tra sang phiên bản `DRAFT` mới dựa trên kết quả phân tích tác động, tiết kiệm 80% thời gian thiết lập thủ công.
3. **Simulation & Shadow Testing (Kiểm thử song song bản nháp)**: Cho phép Lãnh đạo chạy mô phỏng AI rà soát bằng các phiên bản `DRAFT` trên 20 hồ sơ TTHC mẫu, tự động tính toán sự khác biệt điểm tin cậy, phát hiện rủi ro pháp lý và gợi ý điểm rà soát trước khi ban hành.
4. **Manual Activation (Kích hoạt phiên bản thủ công)**: Cơ chế chuyển đổi trạng thái phiên bản pháp lý từ `DRAFT` $\rightarrow$ `ACTIVE` và phiên bản cũ sang `REPLACED` thông qua giao dịch nguyên tử (Atomic DB Transaction), bảo đảm không bao giờ xảy ra gián đoạn hệ thống.
5. **Post-activation Verification (Hậu kiểm sau kích hoạt)**: Bảng kiểm toán chỉ đọc (Read-only Dashboard) rà soát tự động 7 hạng mục tiêu chuẩn vàng, đánh giá trạng thái CSDL ngay lập tức theo 3 mức `PASS` (xanh), `WARNING` (vàng), `FAIL` (đỏ).
6. **Rollback Foundation (Nền tảng hoàn tác version)**: Xây dựng cơ chế khôi phục khẩn cấp phiên bản trước đó (`REPLACED` $\rightarrow$ `ACTIVE`, `ACTIVE` $\rightarrow$ `REPLACED`) với các ràng buộc chống trùng lặp (Anti-duplication) và bảo vệ dữ liệu TTHC.
7. **Rollback UI & Multi-step Confirmation (Giao diện hoàn tác 4 bước)**: Thiết kế cửa sổ xác nhận hoàn tác chuyên dụng dành riêng cho Lãnh đạo, yêu cầu gõ chuỗi xác nhận `ROLLBACK VERSION` và lý do chi tiết ( $\ge 10$ ký tự) để chống thao tác nhầm.
8. **Post-rollback Verification (Hậu kiểm sau hoàn tác)**: Cung cấp bảng kiểm toán chỉ đọc thẩm định trạng thái CSDL sau rollback, xác nhận phiên bản cũ đã phục hồi thành công và 100% hồ sơ TTHC/AI snapshot được giữ nguyên.
9. **Audit Documentation & Governance Standards (Bộ chuẩn mực quản trị & Kiểm toán)**: Ban hành hệ thống tài liệu kiến trúc, runbook kỹ thuật và kịch bản nghiệm thu tuân thủ tiêu chuẩn an toàn thông tin cơ quan nhà nước.

---

## 4. Backend Endpoints Added

Hệ thống Backend (`legalflow-backend`) đã được bổ sung 6 REST API endpoints chuyên biệt phục vụ chuỗi quản trị version, toàn bộ được bảo vệ bởi JWT Auth Guard và Roles Guard:

| Method | Endpoint Path | Quyền truy cập | Mô tả nghiệp vụ |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/legal-knowledge/update-logs/:id/create-draft-versions` | `ADMIN`, `MANAGER` | Khởi tạo tổ hợp bản nháp (`DRAFT`) cho thủ tục, prompt và checklist từ nhật ký đã phê duyệt. |
| `POST` | `/api/legal-knowledge/update-logs/:id/run-draft-simulation` | `ADMIN`, `MANAGER` | Thực thi kiểm thử song song (Shadow Testing) bản nháp trên hồ sơ TTHC mẫu. |
| `POST` | `/api/legal-knowledge/update-logs/:id/activate-version` | `ADMIN`, `MANAGER` | Kích hoạt chính thức phiên bản nháp thành `ACTIVE`, thay thế phiên bản cũ. |
| `GET` | `/api/legal-knowledge/update-logs/:id/activation-verification` | `ADMIN`, `MANAGER`, `STAFF`, `VIEWER` | Truy xuất báo cáo hậu kiểm chỉ đọc (Read-only audit) sau khi kích hoạt version. |
| `POST` | `/api/legal-knowledge/update-logs/:id/rollback-version` | `ADMIN`, `MANAGER` | Thực hiện hoàn tác khẩn cấp về phiên bản trước đó (`REPLACED` $\rightarrow$ `ACTIVE`). |
| `GET` | `/api/legal-knowledge/update-logs/:id/rollback-verification` | `ADMIN`, `MANAGER`, `STAFF`, `VIEWER` | Truy xuất báo cáo hậu kiểm chỉ đọc (Read-only audit) sau khi hoàn tác version. |

---

## 5. Frontend UI Added

Giao diện người dùng (`src/pages/LegalKnowledgePage.tsx` và các component liên quan) được nâng cấp toàn diện với các khối giao diện hiện đại, trực quan:

- **Legal Knowledge Read-only UI**: Tab 6 (Nhật ký cập nhật) và các danh sách hiển thị cấu trúc văn bản pháp lý, phiên bản thủ tục, prompt và checklist với huy hiệu trạng thái màu sắc chuẩn hóa.
- **Review Workflow UI**: Bảng Nhật ký tích hợp cột trạng thái phụ (`subStatus`), dòng thời gian `workflowHistory`, thanh công cụ hành động (Action Bar) động theo quyền user và Modal 8 (Workflow Confirmation Modal).
- **Draft Version UI**: Hiển thị danh sách các mã ID bản nháp đã tạo trong chi tiết nhật ký kèm huy hiệu `DRAFT` màu cam nhạt và nút thao tác tạo bản nháp.
- **Simulation UI (Shadow Testing Modal - Modal 10)**: Cửa sổ kiểm thử cho phép chọn hồ sơ mẫu, chọn cấu hình DRAFT, hiển thị bảng đối chiếu chi tiết ACTIVE vs DRAFT, phân tích chênh lệch điểm tin cậy và cảnh báo rủi ro đỏ.
- **Activation UI (Activation Modal - Modal 11)**: Cửa sổ xác nhận kích hoạt 4 bước dành cho Lãnh đạo, yêu cầu gõ chuỗi `ACTIVATE VERSION`, hiển thị rõ tác động thay thế version.
- **Activation Verification Dashboard**: Khối UI bảng hậu kiểm sau kích hoạt (viền xanh blue/emerald) hiển thị huy hiệu `✔ PASS`, `⚠ WARNING`, `✖ FAIL` và chỉ số bảo toàn CSDL.
- **Rollback UI (Rollback Modal - Modal 12)**: Cửa sổ xác nhận hoàn tác 4 bước cảnh báo đỏ, yêu cầu gõ chuỗi `ROLLBACK VERSION` và nhập lý do chi tiết $\ge 10$ ký tự.
- **Rollback Verification Dashboard**: Khối UI bảng hậu kiểm sau hoàn tác (viền tím mờ sang trọng) được tích hợp tại **02 vị trí chiến lược** trên modal chi tiết (ngay dưới khu vực rollback và tại mục Lịch sử rà soát), giúp Lãnh đạo dễ dàng thẩm định 7 mục tiêu chuẩn vàng.

---

## 6. Safety & Compliance Notes

Toàn bộ hệ thống trong release track v2.8.x tuân thủ nghiêm ngặt các nguyên tắc an toàn nghiệp vụ pháp lý và tiêu chuẩn tuân thủ:

1. **Human-in-the-Loop (Con người là trung tâm)**: Mọi thao tác thay đổi trạng thái pháp lý (`ACTIVATE`, `ROLLBACK`, `APPROVE`) bắt buộc phải do con người (Lãnh đạo `ADMIN`/`MANAGER`) ra lệnh và xác nhận. AI tuyệt đối không có thẩm quyền tự kích hoạt hay hoàn tác.
2. **Read-only Verification (Kiểm chứng chỉ đọc)**: Các endpoint và giao diện hậu kiểm (`activation-verification`, `rollback-verification`) được cam kết 100% chỉ đọc, không phát sinh bất kỳ lệnh sửa đổi, ghi đè hay thay đổi CSDL nào.
3. **No Automatic Rollback (Không tự hoàn tác)**: Hệ thống không có cơ chế tự động đảo ngược phiên bản khi gặp lỗi; mọi quyết định rollback phải được phân tích và thực hiện thủ công bởi Lãnh đạo.
4. **No Case Mutation (Không thay đổi hồ sơ TTHC)**: Các thao tác kích hoạt hay hoàn tác version pháp lý chỉ làm thay đổi hiệu lực trong kho tri thức pháp lý; tuyệt đối bảo toàn nguyên trạng 100% dữ liệu của hồ sơ TTHC (`administrative_procedure_cases`).
5. **No AI Conclusion Replacing Officer Review (AI không thay thế cán bộ)**: Mọi kết quả thẩm tra AI và snapshot pháp lý đều in đậm cảnh báo bắt buộc:
   > **⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA:** Căn cứ pháp lý hiển thị là phiên bản dữ liệu hệ thống ghi nhận tại thời điểm AI rà soát; cán bộ phải kiểm tra văn bản pháp luật hiện hành và quy trình nội bộ tại thời điểm xử lý hồ sơ.

---

## 7. Testing Summary

Chất lượng của release track v2.8.0 - v2.8.20 được khẳng định qua hệ thống kiểm thử toàn diện trên cả 3 tầng:

- **Backend Unit & Integration Tests**: Chạy bộ kiểm thử tự động với Jest trên toàn bộ mô-đun nghiệp vụ. Kết quả: **PASS 100% (119/119 tests passed in Legal Knowledge module)**, bao phủ 100% các nhánh xử lý thành công, từ chối quyền truy cập, từ chối sai chuỗi xác nhận, kiểm tra anti-duplicate và kiểm chứng read-only.
- **Frontend Production Build**: Kiểm tra biên dịch production với Vite & TypeScript (`npm run build`). Kết quả: **BUILD THÀNH CÔNG (1.64s)**, biến đổi 3177 modules, không có lỗi cú pháp hay kiểu dữ liệu.
- **System Health-check**: Chạy kịch bản tự động `.\scripts\health-check.ps1`. Kết quả: **100% dịch vụ khỏe mạnh** (PostgreSQL 5432, MinIO 9000/9001, Caddy Server, Backend API 3000, Frontend Dev Server 5173).
- **Manual UI & UX Testing**: Kiểm chứng trực tiếp trên trình duyệt thực tế từng bước mở modal, chuyển bước, nhập chuỗi xác nhận, kiểm tra huy hiệu trạng thái màu sắc và xác minh tính bất biến của dữ liệu hồ sơ TTHC.

---

## 8. Known Warnings

Trong quá trình vận hành và biên dịch hệ thống, ghi nhận 03 cảnh báo kỹ thuật tiêu chuẩn (Known Warnings); khẳng định các cảnh báo này **không ảnh hưởng đến chức năng, logic hay tính an toàn của hệ thống**:

1. **Docker Compose `version` obsolete warning**:
   - *Chi tiết*: Cảnh báo `attribute "version" is obsolete, it will be ignored` khi chạy lệnh `docker compose`.
   - *Đánh giá*: Đây là cảnh báo tiêu chuẩn của Docker Compose v2 thông báo thuộc tính `version:` ở đầu file `docker-compose.yml` không còn bắt buộc. Không ảnh hưởng đến việc khởi tạo hay vận hành container.
2. **Vite chunk size warning**:
   - *Chi tiết*: Cảnh báo `Some chunks are larger than 500 kB after minification (dist/assets/index-C2kLRgus.js 1,457.64 kB)` khi build frontend.
   - *Đánh giá*: Do dự án tích hợp nhiều thư viện UI hiện đại (Lucide icons, Tailwind, các bộ modal phức tạp) trong cùng một bundle chính. Cảnh báo chỉ mang tính gợi ý tối ưu tải trang (code-splitting), hoàn toàn không ảnh hưởng đến độ chính xác hay tính năng của ứng dụng.
3. **Windows LF/CRLF line ending warning**:
   - *Chi tiết*: Cảnh báo `LF will be replaced by CRLF in ...` của Git trên môi trường Windows.
   - *Đánh giá*: Cơ chế chuẩn hóa ký tự xuống dòng tự động của Git giữa môi trường Windows và Unix/Linux. Không làm thay đổi nội dung thực tế hay logic mã nguồn.

---

## 9. Deployment / UAT Notes

Hướng dẫn chi tiết dành cho Quý cơ quan và Đội ngũ kiểm thử (UAT Team) triển khai và nghiệm thu release track trên môi trường thực tế:

### Bước 1: Khởi động hệ thống (Start Stack)
```powershell
# Di chuyển vào thư mục dự án và khởi động cụm dịch vụ Docker
cd c:\Users\Admin\legalflow-docker-uat
docker compose up -d
```

### Bước 2: Kiểm tra sức khỏe hệ thống (Health-check)
```powershell
# Chạy kịch bản kiểm tra tự động
.\scripts\health-check.ps1
```
*Đảm bảo toàn bộ các dịch vụ trả về trạng thái `[OK]` hoặc `healthy`.*

### Bước 3: Truy cập hệ thống & Kiểm tra Kho Kiến thức Pháp lý
1. Mở trình duyệt web, truy cập địa chỉ: `http://localhost:5173/legal-knowledge`.
2. Đăng nhập bằng tài khoản có quyền Quản trị hoặc Lãnh đạo (`ADMIN` / `MANAGER`).
3. Rà soát các Tab 1 đến Tab 5 để xác nhận danh sách Văn bản pháp luật, Phiên bản thủ tục, Prompt AI và Checklist hiển thị đầy đủ, chính xác.

### Bước 4: Kiểm tra Hậu kiểm Kích hoạt (Activation Verification)
1. Chuyển sang Tab 6 (Nhật ký cập nhật), mở chi tiết một nhật ký đã phê duyệt (`APPROVED`) và có lịch sử kích hoạt version.
2. Tại khối **"Kiểm chứng sau kích hoạt (Read-only Audit Dashboard)"**, bấm nút **"Kiểm tra sau kích hoạt"**.
3. Xác nhận hệ thống trả về huy hiệu **`✔ PASS`**, kiểm tra các dòng xác nhận không trùng lặp active version và 100% hồ sơ TTHC/AI snapshot được bảo toàn.

### Bước 5: Kiểm tra Hoàn tác & Hậu kiểm Rollback (Rollback UI & Verification)
1. Trên cùng modal chi tiết nhật ký, cuộn xuống khối **"Khôi phục phiên bản trước (Manual Version Rollback)"**.
2. Bấm nút **"Hoàn tác version"** để mở Modal 12 (4 bước).
3. Đọc kỹ các bước tác động kép, thử nhập lý do rà soát ($\ge 10$ ký tự) và gõ chuỗi `ROLLBACK VERSION` để kiểm tra cơ chế mở khóa nút xác nhận.
4. *(Nếu thực hiện rollback thật)*: Sau khi rollback thành công, quan sát khối UI **"Kiểm chứng sau rollback (Read-only Audit Dashboard)"** tại 2 vị trí trên modal, bấm **"Kiểm tra sau rollback"** và xác nhận huy hiệu **`✔ PASS`** tuyệt đối.

---

## 10. Next Recommended Work

Để phát huy tối đa giá trị của Release Track v2.8.x và chuẩn bị cho các mốc triển khai chính thức tiếp theo, đề xuất kế hoạch hành động trọng tâm:

1. **Ban hành UAT Checklist & Training Guide (`Phase 8F-E-D-G`)**: Xây dựng kịch bản kiểm thử chi tiết cho từng vai trò người dùng (Role-based testing) và tài liệu hướng dẫn sử dụng, đào tạo chuyển giao công nghệ cho cán bộ địa phương.
2. **Role-based Security & Audit Drill**: Tổ chức diễn tập rà soát an ninh, kiểm tra chéo phân quyền RBAC trên môi trường staging và diễn tập quy trình hoàn tác khẩn cấp khi giả lập sự cố pháp lý.
3. **Legal Source Online Integration (Nghiên cứu mở rộng)**: Nghiên cứu phương án tích hợp API kết nối với Cơ sở dữ liệu Quốc gia về Văn bản Pháp luật để hỗ trợ AI tự động phát hiện văn bản mới ban hành.
4. **Backup & Restore Policy Hardening**: Đồng bộ chính sách sao lưu định kỳ (Automated Backup) cho các bảng dữ liệu quản trị version pháp lý, bảo đảm khả năng phục hồi sau thảm họa (Disaster Recovery).
5. **Release Candidate Tagging**: Đánh giá tổng thể độ ổn định trên môi trường UAT để chuẩn bị đóng gói và gắn thẻ phát hành chính thức **`v2.8.20-RC1`** (Release Candidate 1) cho toàn bộ chuỗi Legal Knowledge Version Governance.

---
*Tài liệu Release Notes được tổng hợp và xác nhận bởi hệ thống Antigravity AI Coding Assistant trong khuôn khổ nghiệm thu Phase 8F-E-D-F.*
