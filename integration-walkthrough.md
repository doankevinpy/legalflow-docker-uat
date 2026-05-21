# Integration Walkthrough – Phase 3 Frontend & Backend

**Commit:** `142361f – feat: integrate frontend with backend api phase 3`
**Ngày:** 2026-05-21
**Phạm vi:** Frontend only – không sửa backend Phase 2

---

## Tổng quan

Phase 3 chuyển frontend LegalFlow từ `localStorage` sang Backend Cases API (Phase 2). Các luồng chính (Auth, Dashboard, Cases CRUD, Notes, Checklist, Status, Stats) đều dùng backend. Drafts vẫn giữ localStorage.

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

- `src/hooks/useCases.ts` – Drafts vẫn dùng localStorage
- `src/utils/storage.ts` – backup/restore localStorage
- `src/pages/Drafts.tsx` – không chạm
- `legalflow-backend/` – không sửa backend Phase 2

---

## Build verification

```
npm run build   ✓  0 TypeScript errors
                   dist/ 1.04 MB (OK for MVP)
```

Commit: `142361f – feat: integrate frontend with backend api phase 3`

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
## Lỗi nhỏ ghi nhận trong quá trình nghiệm thu (chưa sửa)
- **POST /cases/:id/notes**: Backend trả về `CaseNote` object nhưng `casesApi.ts` định nghĩa kiểu trả về là `ApiCase`. Frontend `CaseDetail.tsx` không dùng object trả về mà gọi `load()` để lấy lại data từ backend nên giao diện không bị lỗi, nhưng type khai báo sai.
- **POST /cases**: `checklist` khởi tạo rỗng ngay lúc tạo nhưng sẽ được populate khi lấy `GET /cases/:id`. (Backend tạo checklist trong cùng transaction nhưng có vẻ không trả về ngay trong create response).

