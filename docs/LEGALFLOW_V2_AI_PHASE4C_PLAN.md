# Kế Hoạch Kỹ Thuật LegalFlow v2 AI – Phase 4C: UAT UI Polish (Hoàn Thiện Giao Diện Trợ Lý AI)

**Phiên bản mục tiêu:** `v2.3.1-ai-phase4c-ui-polish`  
**Trạng thái:** Kế hoạch kỹ thuật (Chưa triển khai code)  
**Ngày lập kế hoạch:** 28/06/2026  

---

## 1. Mục Tiêu Phase 4C

Sau khi nghiệm thu thành công mốc UAT với kết quả 17/17 chức năng đạt yêu cầu, Phase 4C tập trung hoàn thiện 03 góp ý nhỏ về trải nghiệm người dùng (UI/UX) tại khối chức năng **"📝 Soạn thảo văn bản nháp thông minh"** trong tab Trợ lý AI (`CaseDetail.tsx`).

Mục tiêu là mang lại trải nghiệm thao tác mượt mà, trực quan và làm nổi bật hơn nữa các nguyên tắc an toàn **Human-in-the-Loop** trước khi bước vào giai đoạn xuất tài liệu chính thức (Phase 5).

---

## 2. Phạm Vi Cải Thiện UI/UX (3 Hạng Mục)

### Hạng mục 1: Tăng chiều cao ô Textarea chỉnh sửa bản nháp
* **Hiện trạng:** Ô hiển thị nội dung văn bản nháp sinh ra đang có chiều cao mặc định khá ngắn (`rows={8}` hoặc tương đương), khiến cán bộ phải cuộn chuột nhiều lần khi kiểm tra các văn bản dài như *Thông báo thụ lý* hay *Văn bản chuyển đơn*.
* **Cải thiện:** Tăng chiều cao mặc định lên tối thiểu `rows={16}` (hoặc chiều cao `h-80` / `h-96`), đồng thời hỗ trợ font chữ rõ ràng, thanh cuộn mượt mà giúp cán bộ dễ dàng rà soát toàn bộ văn bản.

### Hạng mục 2: Bổ sung gợi ý nhanh mẫu câu input cho ô "Hướng dẫn bổ sung"
* **Hiện trạng:** Ô input *"Hướng dẫn bổ sung cho AI"* đang để trống, cán bộ phải tự gõ tay toàn bộ câu lệnh hướng dẫn mỗi lần soạn nháp.
* **Cải thiện:** Thêm một hàng nút bấm nhanh (Quick Suggestion Chips / Buttons) ngay phía dưới ô input. Khi nhấp vào nút, text gợi ý sẽ tự động nối vào ô input. Các gợi ý mẫu gồm:
  - ⚡ *“Soạn ngắn gọn, trang trọng”*
  - ⚡ *“Nhấn mạnh cần bổ sung hồ sơ”*
  - ⚡ *“Giữ nguyên vai trò bản nháp nội bộ”*
  - ⚡ *“Nêu rõ nội dung cần cán bộ kiểm tra”*

### Hạng mục 3: Làm nổi bật Banner cảnh báo Human-in-the-Loop
* **Hiện trạng:** Dòng cảnh báo đang nằm chung bên trong text của bản nháp hoặc dòng thông báo chữ nhỏ.
* **Cải thiện:** Thêm một khối Banner cảnh báo cố định màu vàng/cam nổi bật (`bg-amber-50 border-l-4 border-amber-500 p-3 mb-3 rounded-r`) đặt ngay phía trên khung Textarea với nội dung chuẩn:  
  ⚠️ **“BẢN NHÁP AI – CHƯA PHÁT HÀNH. CÁN BỘ PHẢI KIỂM TRA, CHỈNH SỬA VÀ CHỊU TRÁCH NHIỆM TRƯỚC KHI SỬ DỤNG.”**

---

## 3. Các Yêu Cầu An Toàn Bắt Buộc (Safety Guardrails)

Kế hoạch tuân thủ nghiêm ngặt 10 nguyên tắc an toàn của hệ thống:
1. **Không sửa đổi Database/Schema:** Khẳng định 100% không chạm vào `schema.prisma`.
2. **Không tạo Migration mới:** Cơ sở dữ liệu giữ nguyên hoàn toàn.
3. **Không thay đổi Logic Backend:** API `aiSuggestDraft` và `aiSubmitFeedback` giữ nguyên cách hoạt động.
4. **Không thay đổi cơ chế AI Drafting:** Logic sinh prompt và xử lý placeholder `[Cán bộ bổ sung...]` không thay đổi.
5. **Bất biến `LegalCase.status`:** Trạng thái hồ sơ giữ nguyên trong mọi tình huống.
6. **Bất biến `assignedToId`:** Phân công cán bộ thụ lý không thay đổi.
7. **Không tự gửi văn bản/email:** Không phát sinh bất kỳ kết nối gửi thông điệp nào ra bên ngoài.
8. **Không tự tạo file Word/PDF:** Vẫn quản lý dưới dạng plain text trong `CaseNote`.
9. **Không tự ban hành văn bản:** Bản nháp chỉ lưu trong lịch sử nội bộ hồ sơ.
10. **Tập trung thuần túy vào UI/UX:** Chỉ thay đổi các thẻ HTML/TailwindCSS tại Frontend phục vụ trải nghiệm kiểm thử.

---

## 4. Chi Tiết Kế Hoạch Triển Khai Kỹ Thuật

### 4.1. File dự kiến sửa đổi duy nhất
* **`src/pages/CaseDetail.tsx`** (Khối giao diện *"Soạn thảo văn bản nháp thông minh"* trong tab *"✨ Trợ lý AI"*).

### 4.2. Vị trí UI chi tiết sẽ cải thiện
1. **Khối Input hướng dẫn (Around line 830-840):**  
   Thêm thẻ `<div>` chứa danh sách nút bấm `type="button"` với kiểu dáng chip nhỏ gọn (`text-xs bg-secondary/50 hover:bg-secondary px-2 py-1 rounded border`). Sự kiện `onClick` sẽ nối chuỗi vào state `customDraftInstructions`.
2. **Khối Kết quả bản nháp (Around line 850-880):**  
   * Thêm khối `<div>` Banner cảnh báo màu vàng ngay trước thẻ `<textarea>`.  
   * Cập nhật thuộc tính của `<textarea>` từ `rows={8}` lên `rows={16}` (hoặc class `min-h-[320px]`).

### 4.3. Ảnh hưởng đến người dùng
* **Tích cực:** Cán bộ thao tác nhanh hơn 30% nhờ các nút gợi ý hướng dẫn có sẵn; tầm nhìn rà soát bản nháp rộng rãi, thoải mái hơn; cảnh báo pháp lý trực quan, đập ngay vào mắt giúp tăng cao ý thức kiểm duyệt trước khi trình ký.
* **Tiêu cực / Rủi ro:** Không có (hoàn toàn không làm thay đổi thói quen hay luồng dữ liệu hiện tại).

---

## 5. Kế Hoạch Kiểm Thử & Xác Minh (Verification Plan)

### 5.1. Test thủ công trên trình duyệt (Manual UAT)
1. Mở chi tiết hồ sơ, chọn tab **"✨ Trợ lý AI"**.
2. Cuộn xuống khối soạn thảo, nhấp thử vào 2-3 nút gợi ý hướng dẫn nhanh $\rightarrow$ Xác nhận text xuất hiện trong ô input.
3. Chọn loại văn bản và nhấn *"✨ Tạo bản nháp AI"*.
4. Xác nhận Banner cảnh báo vàng hiển thị rõ ràng phía trên khung trình soạn thảo.
5. Xác nhận khung Textarea cao ráo, dễ đọc toàn bộ nội dung văn bản.
6. Chỉnh sửa text và nhấn *"💾 Lưu vào ghi chú hồ sơ"* $\rightarrow$ Xác nhận lưu thành công vào `CaseNote` và trạng thái hồ sơ không đổi.

### 5.2. Lệnh kiểm thử & biên dịch tự động (Automated Commands)
Sau khi hoàn tất chỉnh sửa `CaseDetail.tsx`, thực hiện chuỗi lệnh xác minh bắt buộc:
```bash
# 1. Kiểm tra tích hợp Backend (Đảm bảo không ảnh hưởng logic API)
cd legalflow-backend && npm test

# 2. Biên dịch Backend
cd legalflow-backend && npm run build

# 3. Biên dịch Frontend (Xác minh cú pháp JSX và TailwindCSS mới)
cd .. && npm run build
```
