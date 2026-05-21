# Integration Walkthrough – Phase 3 Frontend & Backend

**Commit:** `142361f – feat: integrate frontend with backend api phase 3`
**Ngày:** 2026-05-21
**Phạm vi:** Frontend only – không sửa backend Phase 2

---

## Tổng quan

Phase 3 chuyển frontend LegalFlow từ `localStorage` sang Backend Cases API (Phase 2). Các luồng chính (Auth, Dashboard, Cases CRUD, Notes, Checklist, Status, Stats) đều dùng backend.

Trong **Phase 3.1**, chức năng Drafts (Dự thảo văn bản) cũng đã được chuyển hoàn toàn sang sử dụng dữ liệu realtime từ Backend API, loại bỏ sự phụ thuộc vào `localStorage` của trình duyệt đối với thông tin hồ sơ chính.


---

## Các file mới (New)

| File | Mô tả |
|---|---|
| `.env.local.example` | Template biến môi trường; `.env.local` không commit |
| `src/lib/constants.ts` | Source of truth cho mọi code↔label (type, field, status, neighborhood, role) |
| `src/lib/api-types.ts` | TypeScript interfaces phản ánh backend response |
| `src/lib/apiClient.ts` | HTTP client tập trung: Bearer token, 401/403 handler, event `lf:unauthorized` |
| `src/lib/authApi.ts` | Wrapper `/auth/login`, `/auth/profile` |
| `src/lib/casesApi.ts` | Wrapper tất cả `/cases/*` endpoints |
| `src/lib/rbac.ts` | `canCreate()`, `canDelete()`, `canEdit()` helpers |
| `src/contexts/AuthContext.tsx` | AuthProvider + `useAuth()` hook; token lưu `sessionStorage` |
| `src/components/auth/ProtectedRoute.tsx` | Redirect `/login` nếu chưa xác thực |
| `src/pages/LoginPage.tsx` | Màn hình đăng nhập dark-gradient; redirect về URL gốc sau login |
| `src/hooks/useApiCases.ts` | Async hook bổ trợ (giữ `useCases.ts` cho Drafts) |
| `src/components/migration/MigrationPanel.tsx` | 5-step migration localStorage → backend |

---

## Các file sửa (Modified)

| File | Thay đổi chính |
|---|---|
| `src/App.tsx` | Bọc `AuthProvider`, thêm route `/login`, `ProtectedRoute` cho tất cả route còn lại |
| `src/components/layout/Header.tsx` | Hiển thị `fullName`, `email`, `role badge`; nút Đăng xuất |
| `src/components/layout/Sidebar.tsx` | Ẩn "Tạo mới" nếu `role === VIEWER`; hiển thị user thật từ `AuthContext` |
| `src/components/ui/StatusBadge.tsx` | Nhận code backend (`NEW`, `IN_PROGRESS`...) → label tiếng Việt từ `constants.ts` |
| `src/utils/deadline.ts` | Hỗ trợ cả `deadline` (backend) và `deadlineDate` (localStorage cũ) |
| `src/pages/Dashboard.tsx` | `GET /cases/stats` + recent cases + overdue list từ backend |
| `src/pages/CaseList.tsx` | `GET /cases` với pagination server-side, filter params, RBAC delete button |
| `src/pages/NewCase.tsx` | `POST /cases` với code backend thay label tiếng Việt; RBAC guard |
| `src/pages/CaseDetail.tsx` | Full rewrite: load/status/note/checklist/history từ backend; RBAC edit/delete |
| `src/pages/Settings.tsx` | Giữ backup/restore localStorage cũ + thêm `MigrationPanel` section |

---

## Kiến trúc Auth

```
sessionStorage("lf_access_token")
    ↑ saveToken()
    ↓ getToken()

Login → POST /auth/login → accessToken
     → GET /auth/profile → ApiUser

401 from any API → dispatchEvent("lf:unauthorized")
               → AuthContext.logout()
               → Navigate to /login
```

- Token lưu `sessionStorage` → mất khi đóng tab (MVP, không persist)
- Sau login: redirect về URL gốc người dùng đang truy cập (state.from)

---

## RBAC UI

| Role | Tạo hồ sơ | Xóa hồ sơ | Sửa/Status/Note/Checklist |
|---|---|---|---|
| ADMIN | ✅ | ✅ | ✅ |
| MANAGER | ✅ | ✅ | ✅ |
| STAFF | ✅ | ❌ | Chỉ own/assigned |
| VIEWER | ❌ | ❌ | ❌ (read-only) |

- Nếu API trả 403: hiển thị `"Bạn không có quyền thực hiện thao tác này."`
- Nút "Tạo mới" trong Sidebar bị ẩn hoàn toàn với VIEWER

---

## MigrationPanel (6 bước)

1. **Detect** – Đọc `localStorage["legalflow_cases"]`; hiển thị số hồ sơ tìm thấy
2. **Export backup** – Tải JSON xuống trước khi thao tác; bắt buộc trước bước preview
3. **Preview** – Chọn/bỏ chọn từng hồ sơ; hiển thị mapping type/status tiếng Việt
4. **Import** – Gọi `POST /cases` cho từng hồ sơ; import note nếu có
5. **Report** – Thành công/thất bại từng hồ sơ; nếu lỗi hiển thị lý do cụ thể
6. **Xóa localStorage** – Chỉ khi người dùng bấm nút thủ công sau import 100% pass

---

## Giữ nguyên (không thay đổi)

- `src/utils/storage.ts` – backup/restore localStorage
- `legalflow-backend/` – không sửa backend API hiện tại

---

## Phase 3.1: Chuyển Drafts sang dữ liệu Backend

### Tóm tắt thay đổi
- **Nguồn dữ liệu**: `Drafts.tsx` loại bỏ hoàn toàn hook `useCases` và dữ liệu `localStorage`.
- **Luồng hoạt động**:
  1. Khi người dùng truy cập trang `/drafts`, ứng dụng tự động thực hiện gọi API `casesApi.getCases({ limit: 100 })` để tải danh sách các hồ sơ hiện có từ backend DB.
  2. Khi người dùng chọn hồ sơ và bấm **Tạo dự thảo**, ứng dụng sẽ thực hiện gọi `casesApi.getCase(selectedCaseId)` để lấy dữ liệu chi tiết mới nhất theo thời gian thực (bao gồm danh sách checklist chi tiết, thông tin liên hệ, lĩnh vực, trạng thái).
  3. Định dạng mã hồ sơ sử dụng trực tiếp trường `caseCode` thay vì trường `caseId` cũ.
  4. Thực hiện ánh xạ (mapping) ngôn ngữ tiếng Việt tự động cho các thông tin hiển thị trên văn bản dự thảo bằng cách sử dụng `constants.ts` (ví dụ: `field` thành `CASE_FIELD_LABELS[field]`, `type` thành `CASE_TYPE_LABELS[type]`, `status` thành `CASE_STATUS_LABELS[status]`, `neighborhood` thành `NEIGHBORHOOD_LABELS[neighborhood]`). Bản dự thảo hoàn toàn không hiển thị raw code của backend ngoại trừ mã hồ sơ `caseCode`.
  5. Thông tin chuyên viên đảm nhận được cập nhật theo định dạng `assignedTo?.fullName` (nếu chưa có sẽ hiển thị `"Chưa phân công"`).

### Logic Checklist Mới
- Chuyển hoàn toàn logic kiểm tra trạng thái từ `checked` sang `isCompleted`.
- Nhãn mô tả của checklist item sử dụng `title` thay vì `label` cũ.
- Tài liệu còn thiếu được tính toán động dựa trên điều kiện `isCompleted === false`.

### Quyết định thiết kế & Quyền hạn
- **Không ghi log Drafts vào Backend**: Để tránh làm loãng và nhiễu các ghi chú chuyên môn nghiệp vụ của hồ sơ pháp lý, hoạt động tạo dự thảo trong Phase 3.1 sẽ **không** tự động tạo Note qua endpoint `POST /cases/:id/notes` hay ghi audit log vào DB. Thao tác audit riêng sẽ được thiết kế ở phase sau nếu cần.
- **RBAC**: Do trang Drafts là chức năng đọc và xuất dữ liệu (không làm thay đổi trạng thái hay ghi dữ liệu mới lên DB), bất kỳ tài khoản nào có quyền xem hồ sơ (Admin, Manager, Staff, Viewer) đều có thể sử dụng đầy đủ các tính năng tạo, copy và xuất file Word `.docx` của Drafts.

---

## Phase 3.2: Safe localStorage Migration & Cleanup Dashboard

Phiên bản `v0.4.2-migration-cleanup` bổ sung các cơ chế an toàn tối đa để bảo vệ, di chuyển có kiểm soát và dọn dẹp an toàn dữ liệu `localStorage` cũ trên trình duyệt mà không gây rủi ro mất mát hay tạo trùng lặp dữ liệu trên Backend máy chủ.

### 1. Báo cáo tiến trình di chuyển (`legalflow_migration_report`)
- Toàn bộ hồ sơ trong `localStorage['legalflow_cases']` (không chỉ những hồ sơ được chọn) được theo dõi chặt chẽ dưới một báo cáo lưu trữ tập trung.
- Các trạng thái theo dõi gồm:
  - `pending`: Chờ di chuyển.
  - `imported`: Tạo mới thành công trên backend.
  - `already_migrated`: Đã trùng khớp mã `caseCode` từ trước.
  - `possible_duplicate`: Nghi trùng lặp nội dung (yêu cầu người dùng duyệt).
  - `skipped`: Người dùng chủ động loại bỏ/bỏ qua.
  - `failed`: Di chuyển lỗi.
- Chỉ khi **100% hồ sơ** local đã được giải quyết (tức là không còn hồ sơ nào có trạng thái `pending`, `failed`, hoặc `possible_duplicate`), cờ `legalflow_migration_completed: 'true'` mới được kích hoạt.

### 2. Cổng an toàn dọn dẹp bộ nhớ đệm (Cleanup Guard)
- Nút **"Xóa dữ liệu localStorage cũ"** chỉ hiển thị khi đáp ứng đủ các cổng an toàn:
  - Cờ sao lưu đã ghi nhận: `legalflow_migration_backed_up === 'true'` (người dùng đã click nút tải backup JSON).
  - Cờ hoàn thành đã ghi nhận: `legalflow_migration_completed === 'true'`.
  - Không còn hồ sơ chưa giải quyết (`pendingCount === 0` và `failedCount === 0`).
- Áp dụng quy trình **Double Confirm (Cảnh báo hai lớp)** cực kỳ chi tiết, làm nổi bật thông tin:
  - Hành động này chỉ xóa sạch dữ liệu cũ cục bộ trên trình duyệt hiện tại.
  - Không làm mất hay ảnh hưởng bất kỳ dữ liệu nào đã lưu thành công trên Backend máy chủ.
  - Không thể tự động khôi phục nếu chưa lưu trữ file backup JSON an toàn.
- Sau khi xóa, thiết lập marker cleanup vĩnh viễn:
  - `legalflow_local_cleanup_completed: 'true'`
  - `legalflow_local_cleanup_completed_at: ISO Timestamp`
  - Settings Dashboard hiển thị trạng thái hoàn thành sạch sẽ, ẩn đi các panel di chuyển dữ liệu cũ không còn tác dụng.

### 3. Cơ chế Chống trùng lặp đa yếu tố (Multi-factor Duplicate Protection)
- **Kiểm tra mã trực tiếp**: So sánh `caseCode === localCase.caseId` (bỏ qua nếu là mã cũ định dạng `HS-`).
- **Kiểm tra nghi trùng nội dung**: So khớp đồng thời 4 yếu tố nội dung trên Backend:
  - Khớp tương đối không dấu tên người gửi (`senderName`).
  - Khớp loại hồ sơ (`type`).
  - Khớp khu phố (`neighborhood`).
  - Khớp ngày tiếp nhận (`receivedDate`).
- **Xử lý nghi trùng**: Nếu phát hiện trùng 4 yếu tố trên, hệ thống đánh dấu trạng thái `"possible_duplicate"`, hiển thị nhãn màu cam và **ngừng tự động import** để tránh rác DB backend. Cung cấp 2 lựa chọn nhanh:
  - *"Xác nhận đã trùng (Skip)"*: chuyển sang `skipped` để skip an toàn.
  - *"Vẫn import tạo mới"*: đặt cờ `forceImport = true` để đưa vào hàng chờ import tạo mới luôn ở lượt tiếp theo.

### 4. Giải pháp 100% Client-side
- Toàn bộ logic so khớp, tìm kiếm, đánh giá trùng lặp nội dung, skip trùng, quản lý report đều được xử lý gọn gàng phía Client-side trong React Components (`Settings.tsx` và `MigrationPanel.tsx`).
- NestJS Backend giữ nguyên vẹn 100% các API hiện tại nhằm tránh phát sinh rủi ro hệ thống.

---

## Build verification

```bash
cmd /c npm run build   ✓  0 TypeScript errors
                       dist/ 1.06 MB (OK for MVP)
```

Commit: `29e4cc9c3c7723f33e0c381146298eef0d2437f0 – feat: add safe localStorage migration cleanup`

---

## Kết quả nghiệm thu độc lập Runtime (Dữ liệu giả)

Quy trình hoạt động và phản hồi nghiệp vụ của cổng an toàn di chuyển & dọn dẹp đã được xác minh toàn diện thông qua kịch bản kiểm thử giả lập runtime:

1. **Trạng thái ban đầu**: 5 hồ sơ được phát hiện trong `localStorage`. Cờ backup và completed đều chưa được set, nút "Xóa dữ liệu" hoàn toàn bị ẩn. (**PASS**)
2. **Export backup**: Bấm tải dữ liệu xuống, cờ `legalflow_migration_backed_up = 'true'` được thiết lập. Nút xóa vẫn bị ẩn do chưa hoàn tất di chuyển. (**PASS**)
3. **Import một phần**: Di chuyển 2 hồ sơ không trùng lặp. Stats cập nhật: `imported = 2`, `pending = 3`. Cờ completed chưa được kích hoạt, nút xóa vẫn ẩn. (**PASS**)
4. **Trùng lặp & Tránh ghi đè**: Import lại 2 hồ sơ vừa di chuyển. Hệ thống phát hiện khớp mã trên DB và đổi trạng thái sang `already_migrated`, không tạo thêm dữ liệu trùng trên server. (**PASS**)
5. **Cơ chế Nghi trùng (possible_duplicate)**: Import hồ sơ local trùng tên người gửi Nguyễn Văn A, loại đơn, khu phố và ngày nhận đơn với DB. Hệ thống phát hiện nghi trùng, gán trạng thái `"possible_duplicate"`, ngừng tự động import và hiển thị cảnh báo cam cho người dùng duyệt thủ công. (**PASS**)
6. **Xử lý mã cũ HS-**: Tiến hành di chuyển mã cũ `HS-2605-0012`. Backend tự sinh mã mới an toàn (ví dụ: `2026-KN-004-KP1`), không dùng mã HS làm `caseCode` backend. (**PASS**)
7. **Hoàn tất di chuyển**: Khi toàn bộ hồ sơ local đã được di chuyển hoặc chủ động chọn "Bỏ qua" (Skip), `pending` và `failed` bằng 0, cờ `completed` được set thành `'true'` và nút "Xóa dữ liệu" màu đỏ chính thức lộ diện. (**PASS**)
8. **Quy trình Double Confirm**:
   - Bấm nút xóa, chọn hủy ở lớp 1: Dữ liệu localStorage giữ nguyên. (**PASS**)
   - Đồng ý lớp 1, chọn hủy ở lớp 2: Dữ liệu localStorage giữ nguyên. (**PASS**)
   - Đồng ý cả 2 lớp: `legalflow_cases` và các cờ phụ bị xóa hoàn toàn. Marker vĩnh viễn `legalflow_local_cleanup_completed: 'true'` được thiết lập cùng timestamp chuẩn. Giao diện Settings chuyển sang trạng thái đã dọn dẹp hoàn tất. (**PASS**)
9. **Bảo toàn cơ sở dữ liệu server**: Toàn bộ dữ liệu hồ sơ chính đã di chuyển lên backend không bị ảnh hưởng, hoạt động tìm kiếm và truy xuất database của Dashboard/CaseList vẫn nguyên vẹn 100%. (**PASS**)

---

## Checklist test thủ công cần thực hiện

| # | Test | Cách kiểm tra |
|---|---|---|
| 1 | Login admin thành công | Vào `/login`, nhập admin@legalflow.local / Admin@123! |
| 2 | Login sai password báo lỗi | Nhập sai password → thấy thông báo đỏ |
| 3 | Login viewer thành công | Đăng nhập viewer@legalflow.local / Viewer@123! |
| 4 | Viewer không thấy nút tạo hồ sơ | Sidebar không có "Tạo mới"; `/cases/new` redirect |
| 5 | Dashboard load từ backend | Stats hiển thị số liệu thật |
| 6 | CaseList load từ backend | Danh sách hồ sơ có phân trang |
| 7 | Tạo hồ sơ mới, caseCode đúng | `YYYY-TYPH-NNNN` format |
| 8 | Search/filter hoạt động | Tìm kiếm theo tên, filter trạng thái |
| 9 | CaseDetail: checklist/notes/history | Tab đầy đủ |
| 10 | Đổi status ghi nhận | Select status → reload lịch sử |
| 11 | Thêm note thành công | Nhập note, bấm send |
| 12 | Tick checklist | Checkbox → completedAt cập nhật |
| 13 | STAFF không xóa | Nút Trash không hiện với staff |
| 14 | VIEWER bị 403 | Thao tác trái quyền → thông báo |
| 15 | Drafts vẫn hoạt động | Trang `/drafts` bình thường |
| 16 | Refresh browser không mất dữ liệu | Dữ liệu từ backend → reload là thấy lại |
| 17 | localStorage cũ chưa bị xóa | Kiểm tra DevTools → Application → localStorage |
| 18 | MigrationPanel trong Settings | Vào `/settings` → thấy section Migration |

---
## Các cập nhật sau nghiệm thu (Fixes)
Đã sửa 2 lỗi nhỏ được phát hiện trong quá trình nghiệm thu:
- **POST /cases/:id/notes**: Đã sửa kiểu trả về trong `casesApi.ts` thành `ApiCaseNote` thay vì `ApiCase` để khớp hoàn toàn với backend.
- **POST /cases**: Backend `cases.service.ts` đã được sửa để gọi `this.findOne()` sau khi tạo, giúp trả về object đầy đủ kèm theo checklist mặc định ngay lập tức.

