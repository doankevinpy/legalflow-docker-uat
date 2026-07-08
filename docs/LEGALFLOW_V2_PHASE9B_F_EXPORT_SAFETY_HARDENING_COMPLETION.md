# LEGALFLOW V2 — PHASE 9B-F: EXPORT SAFETY HARDENING COMPLETION REPORT

**Ngày phát hành:** 08/07/2026  
**Mã giai đoạn:** Phase 9B-F (`v2.9.10-export-safety-hardening`)  
**Mục tiêu chính:** Gia cố an toàn giao diện xuất và in ấn văn bản (Word/PDF) từ kết quả gợi ý AI, ngăn chặn tối đa rủi ro hiểu nhầm văn bản gợi ý AI là văn bản chính thức đã ban hành.

---

## 1. MỤC TIÊU PHASE
Giai đoạn **Phase 9B-F (Export Safety Hardening)** tập trung gia cố toàn diện lớp bảo vệ trên giao diện người dùng (*UI Safety Layer*) khi cán bộ thao tác xem trước (*Preview*), in ấn (*Print*) và xuất file (*Export Word/PDF*) các phiếu rà soát hồ sơ thủ tục hành chính đất đai do AI gợi ý. 

Mục tiêu cốt lõi là bảo đảm **không một văn bản nào** do hệ thống AI hỗ trợ tạo ra bị hiểu nhầm, lạm dụng hoặc phát hành như một văn bản hành chính chính thức đã được thẩm định, ký duyệt và ban hành, tuân thủ tuyệt đối các quy định về nghiệp vụ hành chính công.

---

## 2. FILE ĐÃ SỬA
Toàn bộ logic gia cố an toàn xuất văn bản trong giai đoạn này được tập trung triển khai và tối ưu tại một file duy nhất ở tầng giao diện người dùng:
* `src/pages/ProcedureCaseDetail.tsx` — Trang chi tiết hồ sơ TTHC (Cấp Giấy chứng nhận quyền sử dụng đất lần đầu & Chuyển mục đích sử dụng đất).

---

## 3. SECTION ĐÃ BỔ SUNG / HOÀN THIỆN
Đã cấu trúc và hoàn thiện một khu vực hành động chuyên biệt với tiêu đề:
### `🖨️ Dự thảo / In / Xuất văn bản`

**Đặc tính kỹ thuật & UX:**
* **Vị trí cố định (Always-Visible):** Section được đặt ngay bên dưới khu vực `Căn cứ pháp lý đã sử dụng` (*Legal Snapshot*) và ngay phía trên danh sách thẻ kết quả `aiAnalyses`.
* **Không biến mất im lặng:** Section luôn hiển thị trong mọi tình huống (kể cả khi hồ sơ mới mở, chưa chạy rà soát AI, hoặc tài khoản chỉ có quyền xem), bảo đảm cán bộ luôn nhận biết được quy trình an toàn và trạng thái hiện tại của khả năng xuất văn bản.

---

## 4. CẢNH BÁO AI CHUẨN
Ngay bên trong khu vực `Dự thảo / In / Xuất văn bản`, hệ thống hiển thị khối cảnh báo nổi bật (*Warning Banner*) với nền vàng cam (`bg-amber-100/60 border-amber-300`) chứa tiêu đề cảnh báo tiêu chuẩn bắt buộc:

> ### `⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`

---

## 5. CÂU CẢNH BÁO DỰ THẢO / GỢI Ý ĐÃ DÙNG
Đồng hành cùng tiêu đề cảnh báo AI là câu tuyên bố trách nhiệm và quy tắc pháp lý đầy đủ (*Safety Disclaimer*), được in nghiêng rõ ràng:

> *"Văn bản này là bản dự thảo/gợi ý do hệ thống hỗ trợ tạo. Cán bộ có thẩm quyền phải kiểm tra, chỉnh sửa, ký số/ký tay và ban hành theo đúng quy định trước khi sử dụng chính thức."*

---

## 6. CHUẨN HÓA TÊN FILE EXPORT WORD (TIỀN TỐ `DU_THAO_GOI_Y_AI_`)
Nhằm ngăn chặn vi phạm quy định lưu trữ và ban hành văn bản ngay từ khâu tải file về máy tính cá nhân của cán bộ, toàn bộ logic đặt tên file khi xuất file Word (`.docx`) đã được khóa cứng với tiền tố an toàn:
* **Quy tắc đặt tên mới:** `DU_THAO_GOI_Y_AI_ + [Tên_Phiếu_Rà_Soát] + [ID_Phiếu/Hồ_Sơ].docx`
* **Áp dụng cụ thể:**
  * Phiếu rà soát Cấp GCN lần đầu:  
    `DU_THAO_GOI_Y_AI_Phieu_Ra_Soat_Cap_GCN_{analysisId}.docx`
  * Phiếu rà soát Chuyển mục đích sử dụng đất:  
    `DU_THAO_GOI_Y_AI_Phieu_Ra_Soat_Chuyen_MDSD_{analysisId}.docx`
* Việc bổ sung rõ tiền tố `DU_THAO_GOI_Y_AI_` giúp bất kỳ ai khi nhìn thấy file trên hệ thống tệp tin local hoặc trong hệ thống quản lý văn bản đều nhận biết ngay đây chưa phải là văn bản trình ký chính thức.

---

## 7. TRẠNG THÁI KHI CHƯA CÓ AI ANALYSIS
Nếu hồ sơ chưa được chạy rà soát AI hoặc danh sách kết quả trống (`aiAnalyses.length === 0`), section không ẩn đi mà hiển thị trạng thái Empty State an toàn và rõ ràng:
* **Giao diện:** Khối thông báo trắng/xám (`bg-white border-indigo-100 text-gray-600`) với biểu tượng thông tin (`ℹ️`).
* **Nội dung thông báo:**  
  `Chưa có kết quả AI để tạo bản dự thảo/in/xuất văn bản. Vui lòng chạy AI review trước.`
* Ngăn chặn hoàn toàn việc cán bộ bấm vào các nút xuất văn bản rỗng hoặc gây lỗi ngoại lệ không mong muốn.

---

## 8. TRẠNG THÁI KHI KHÔNG ĐỦ QUYỀN
Hệ thống kiểm tra chặt chẽ quyền hành động của người dùng trên hồ sơ thông qua cờ `canAct` (được tính toán từ vai trò và phân quyền trên bước thụ lý hiện tại):
* **Khi không có thẩm quyền (`!canAct`):** Toàn bộ các nút bấm hành động trong section đều bị ẩn đi, thay thế bằng banner cảnh báo quyền hạn:
* **Giao diện:** Khối cảnh báo đỏ (`bg-red-50 border-red-200 text-red-700 font-semibold`) với biểu tượng từ chối (`🚫`).
* **Nội dung thông báo:**  
  `Bạn không có quyền preview/in/xuất văn bản này. Vui lòng liên hệ lãnh đạo hoặc quản trị hệ thống.`
* Bảo đảm tính riêng tư, bảo mật và phân cấp trách nhiệm thụ lý theo đúng quy chế làm việc.

---

## 9. TRẠNG THÁI KHI THIẾU LEGAL SNAPSHOT
Căn cứ pháp lý (*Legal Snapshot*) là nền tảng cốt lõi của phiếu rà soát. Tích hợp chặt chẽ với kết quả từ **Phase 9B-E**:
* **Trên giao diện trang chi tiết:** Khu vực `Căn cứ pháp lý đã sử dụng` luôn hiển thị sát phía trên khu vực xuất văn bản. Nếu bản kết quả AI không có snapshot hợp lệ, hệ thống lập tức hiển thị cảnh báo thiếu hụt dữ liệu pháp lý (`LF-LEGAL-SNAPSHOT-SECTION...`).
* **Trong bản in / xem trước (`ProcedureReviewPrintModal`, `PurposeChangeReviewPrintModal`):** Khi cán bộ bấm `Xem bản dự thảo` hoặc `In bản gợi ý AI`, modal lập tức kiểm tra trường `legalSnapshot`. Nếu thiếu snapshot hoặc snapshot bị hỏng, hệ thống hiển thị rõ cảnh báo thiếu hụt căn cứ pháp lý, giúp cán bộ nhận thức rõ rủi ro trước khi quyết định in hoặc tải phiếu rà soát về.

---

## 10. XÁC NHẬN ĐÃ XÓA MARKER NGHIỆM THU
Sau khi quá trình kiểm thử UI kết thúc thành công, các marker nghiệm thu tạm thời đã được dọn dẹp sạch sẽ nhằm bảo đảm mã nguồn gọn gàng cho bản phát hành:
* **Đã xóa:** Thuộc tính `data-marker="LF-EXPORT-SAFETY-SECTION-20260705"` trên thẻ `div` container.
* **Đã xóa:** Thẻ `<span ...>LF-EXPORT-SAFETY-SECTION-20260705</span>` hiển thị mã nhãn kỹ thuật trên góc phải tiêu đề section.
* **Xác nhận qua `grep`:** Không còn bất kỳ sự xuất hiện nào của chuỗi `LF-EXPORT-SAFETY-SECTION-20260705` trên toàn bộ mã nguồn `src/`.

---

## 11. XÁC NHẬN KHÔNG TỰ KÝ
* **Tuyệt đối KHÔNG thực hiện ký tự động:** Hệ thống không gắn chữ ký số (*Digital Signature*), không chèn ảnh chữ ký tay, và không đóng dấu của cơ quan hay cá nhân vào bất kỳ file Word hay bản PDF xem trước nào.
* Phiếu rà soát tải về hoàn toàn để trống khu vực trình ký hoặc chỉ để nhãn chức danh (ví dụ: *Người rà soát / Cán bộ thụ lý*) để cán bộ tự chủ động kiểm tra thực tế trước khi ký tay/ký số theo quy trình hành chính TTHC.

---

## 12. XÁC NHẬN KHÔNG TỰ BAN HÀNH
* **Tuyệt đối KHÔNG thay đổi tính chất pháp lý của văn bản:** Các nút bấm trong section `Dự thảo / In / Xuất văn bản` chỉ thực hiện chức năng kết xuất dữ liệu sang định dạng văn bản dự thảo tiện lợi cho người dùng.
* Hệ thống không có bất kỳ logic tự động nào chuyển trạng thái văn bản thành "Đã ban hành" (*Issued/Approved*) hoặc tự ý cấp số văn bản chính thức cho các bản gợi ý AI này.

---

## 13. XÁC NHẬN KHÔNG TỰ GỬI VĂN BẢN
* **Tuyệt đối KHÔNG tự động phát hành ngoài hệ thống:** Việc bấm nút `Xem bản dự thảo`, `In bản gợi ý AI`, `Xuất Word` hay `Xuất PDF` hoàn toàn hoạt động cục bộ (*client-side download/print* hoặc *backend stream buffer*).
* Hệ thống **không** tự động gửi email, không gửi tin nhắn SMS/Zalo, không tự động đẩy văn bản qua cổng dịch vụ công hay bất kỳ kênh liên lạc ngoài nào tới người dân hoặc tổ chức. Cán bộ thụ lý giữ quyền kiểm soát 100% đối với việc phát hành văn bản sau thẩm định.

---

## 14. XÁC NHẬN KHÔNG SỬA TRẠNG THÁI HỒ SƠ
* **Thao tác Read-Only / Export-Only:** Quá trình tải bản dự thảo hoặc xem trước hoàn toàn độc lập với state machine của hồ sơ TTHC.
* Bấm xuất file **không** làm thay đổi trạng thái hồ sơ (`ProcedureCase.status`), không làm chuyển bước quy trình, không tự động đóng hồ sơ hay tự động chuyển sang bước tiếp nhận/phê duyệt.

---

## 15. XÁC NHẬN KHÔNG SỬA `ProcedureAiAnalysis` CŨ
* Toàn bộ dữ liệu của các lần chạy AI review trước đây (`ProcedureAiAnalysis`) trong cơ sở dữ liệu được bảo toàn tuyệt đối.
* Không có bất kỳ câu lệnh `UPDATE` hay logic chỉnh sửa nào làm tác động đến nội dung, điểm số, rủi ro hay cấu trúc của các bản ghi rà soát AI cũ.

---

## 16. XÁC NHẬN KHÔNG SỬA `ProcedureAiAnalysisLegalSnapshot` CŨ
* Tuân thủ triệt để nguyên tắc **Audit Trail Integrity** đã thiết lập tại Phase 9B-E:
* Các bản ghi `ProcedureAiAnalysisLegalSnapshot` (bảo sao bất biến của căn cứ pháp lý tại thời điểm chạy AI review) tuyệt đối không bị chỉnh sửa, ghi đè hoặc xóa bỏ.

---

## 17. XÁC NHẬN KHÔNG SỬA SCHEMA / MIGRATION / `.env`
* **Zero Database Schema Change:** Không thêm bảng, không thêm cột, không sửa đổi bất kỳ model Prisma/ORM nào.
* **Zero Migration:** Không tạo bất kỳ file migration mới nào trong thư mục migrations.
* **Zero `.env` Modification:** Không yêu cầu hay chỉnh sửa bất kỳ biến môi trường nào trong `.env`, bảo đảm tính tương thích 100% với hạ tầng Docker UAT và Production hiện tại.

---

## 18. KẾT QUẢ BUILD (`npm run build`)
Toàn bộ mã nguồn đã được biên dịch kiểm chứng bằng trình biên dịch chính thức `tsc -b && vite build`. Kết quả đạt **PASS 100%** không lỗi cú pháp, không lỗi kiểu dữ liệu (TypeScript Zero Errors):

```text
> legalflow@0.0.0 build
> tsc -b && vite build

vite v8.0.12 building client environment for production...
transforming...✓ 3177 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.47 kB │ gzip:   0.30 kB
dist/assets/index-7rA83CKW.css    103.10 kB │ gzip:  15.75 kB
dist/assets/index-CknnK6jn.js   1,471.84 kB │ gzip: 384.59 kB

✓ built in 1.56s
```

---

## 19. CÁC GIỚI HẠN CÒN LẠI (KNOWN LIMITATIONS)
1. **Phạm vi hỗ trợ theo loại phân tích (`analysisType`):**  
   Tính năng `Xem bản dự thảo`, `In bản gợi ý AI` và `Xuất Word` hiện được tối ưu hoàn chỉnh cho 2 nghiệp vụ TTHC chuyên sâu:
   * `LAND_FIRST_CERTIFICATE_REVIEW` (Cấp GCN quyền sử dụng đất lần đầu).
   * `LAND_USE_PURPOSE_CHANGE_REVIEW` (Chuyển mục đích sử dụng đất).  
   Đối với các loại phân tích mở rộng hoặc tùy chỉnh khác, UI hiện hiển thị thông báo hướng dẫn: *"Loại phân tích này hiện hỗ trợ Xem bản dự thảo và Xuất Word trong các tính năng chuyên sâu."*
2. **Trách nhiệm hậu thẩm định của cán bộ:**  
   Hệ thống đã thực hiện đầy đủ các biện pháp cảnh báo bằng lời văn, màu sắc và tiền tố tên file. Tuy nhiên, tính an toàn pháp lý cuối cùng phụ thuộc vào việc cán bộ tuân thủ quy chế kiểm tra kỹ lưỡng nội dung trước khi ký và ban hành.

---

## 20. NEXT PHASE ĐỀ XUẤT
### `Phase 9B-G: Final UAT Fixes & Release Candidate`
Sau khi các giai đoạn gia cố an toàn dữ liệu, tính toàn vẹn căn cứ pháp lý và an toàn xuất văn bản (**Phase 9B-A → Phase 9B-F**) đã hoàn tất và nghiệm thu, bước tiếp theo được đề xuất là:
* **Mục tiêu:** Tổng rà soát toàn bộ hệ thống trên môi trường UAT thực tế với dữ liệu mẫu nghiệp vụ đa dạng, kiểm thử chéo giữa các vai trò (Chuyên viên thụ lý, Lãnh đạo phòng, Quản trị viên).
* **Nội dung:**
  1. Ghi nhận và tinh chỉnh nhanh các lỗi nhỏ về trải nghiệm người dùng (*Micro UX/UI Fixes*) nếu phát sinh trong quá trình UAT cuối cùng.
  2. Rà soát hiệu năng tải trang và tối ưu hóa kích thước gói bundle (`index.js` split chunk optimization nếu cần).
  3. Đóng gói phiên bản ứng cử viên phát hành chính thức (`v2.10.0-RC1`) sẵn sàng bàn giao cho triển khai thực tế.

---
*Báo cáo được lập tự động dựa trên kết quả kiểm thử thực tế và mã nguồn đã hoàn thiện trên nhánh làm việc hiện tại.*
