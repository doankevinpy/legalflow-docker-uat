# Sổ Đăng Ký Phân Loại Lỗi & Đánh Giá Cải Tiến UAT (Issue Triage Register) - Giai Đoạn 12K
## Phase 12K: Financial Obligation UAT Re-execution Issue Triage Register

> [!NOTE]
> **TÓM TẮT PHÂN LOẠI LỖI (`ISSUE TRIAGE SUMMARY`):**
> **`No blocking issue identified during demo data UAT re-execution.`**
> *(Không phát hiện bất kỳ lỗi nghiêm trọng hay lỗi gây nghẽn (`Critical / High / Medium blocking issues`) nào trong suốt quá trình chạy lại kiểm thử nghiệm thu E2E trên 08 kịch bản hồ sơ mô phỏng)*.
> Tất cả các chốt chặn an toàn pháp lý đều hoạt động chính xác 100%. Dưới đây là sổ đăng ký phân loại, ghi nhận 01 góp ý cải tiến nhỏ về trải nghiệm người dùng (`UX Note / Low Severity`) để nghiên cứu tối ưu thêm trong Phase 12L.

---

## 1. Sổ Đăng Ký Phân Loại Lỗi & Cải Tiến (`Issue Triage Table`)

| Mã Lỗi (`Issue ID`) | Hồ Sơ Liên Quan (`Related Case`) | Kịch Bản Kiểm Thử (`Related Test ID`) | Mức Độ (`Severity`) | Khu Vực (`Area`) | Mô Tả Vấn Đề (`Description`) | Hành Vi Kỳ Vọng (`Expected Behavior`) | Hành Vi Thực Tế (`Actual Behavior`) | Tác Động An Toàn (`Safety Impact`) | Đề Xuất Khắc Phục (`Proposed Fix`) | Giai Đoạn Mục Tiêu (`Target Phase`) | Người Phụ Trách (`Owner`) | Trạng Thái (`Status`) | Ghi Chú (`Notes`) |
| :---: | :---: | :---: | :---: | :---: | :--- | :--- | :--- | :---: | :--- | :---: | :---: | :---: | :--- |
| **`ISSUE-UAT-12K-01`** | `DEMO-FO-UAT-01` đến `04` | `TC-UAT-02`, `04`, `05`, `06` | **`Note`** *(Enhancement / Low)* | Frontend UI (`FinancialObligationSection.tsx`) | Khi nút "Hoàn thành thủ tục" bị vô hiệu hóa (`DISABLED`) do hồ sơ chưa đáp ứng đủ điều kiện, nút bấm chuyển màu xám nhạt và không cho nhấp chuột, nhưng chưa có tooltip trực quan hiển thị ngay khi di chuột vào nút. | Khi người dùng di chuột (`Hover`) vào nút hoàn thành đang bị vô hiệu hóa, hệ thống hiển thị một Tooltip nhỏ giải thích nguyên nhân cụ thể (ví dụ: *Chưa tải lên chứng từ nộp tiền*, *Chưa được cán bộ thẩm định xác nhận*). | Hiện tại người dùng thấy nút màu xám và chỉ biết lý do khi đọc lại các banner trạng thái ở phía trên, hoặc khi nhấp vào icon thông tin bên cạnh. | **`0% Impact`** *(An toàn tuyệt đối, chốt chặn vẫn khóa thành công 100%, chỉ liên quan đến sự tiện lợi UX)*. | Thêm component `Tooltip` bao quanh nút bấm khi ở trạng thái `disabled`, đọc chuỗi nguyên nhân từ hàm đánh giá `getCompletionBlockReasons()`. | **Phase 12L** (`Stabilization`) | Frontend Team | **`LOGGED`** | Góp ý cải tiến UX phi cản trở (`Non-blocking improvement`). |

---

## 2. Tiêu Chuẩn Phân Loại Mức Độ Lỗi (`Severity Definitions & Triage Matrix`)
Trong quy trình kiểm soát của Phase 12K, mọi phản hồi từ Kiểm thử viên được phân loại theo 5 cấp độ tiêu chuẩn:

* **`Critical` (Lỗi Nghiêm Trọng / Vi Phạm Pháp Lý):** Nút hoàn thành thủ tục mở sai điều kiện; thiếu khung cảnh báo an toàn (`Safety Banner`); AI tự động gán số tiền chính thức (`Official Amount`); hệ thống tự động phát hành thông báo thuế hoặc tự gửi email/SMS tới công dân thực tế. *(Sự cố Phase 12K: **0**)*.
* **`High` (Lỗi Chức Năng Cao / Nghẽn UAT):** Sai lệch trạng thái nghiệp vụ; lỗi phân quyền (`Role Bypass`); mất dấu vết nhật ký kiểm toán (`Audit Log missing`); lỗi crash backend hoặc frontend làm gián đoạn kiểm thử. *(Sự cố Phase 12K: **0**)*.
* **`Medium` (Lỗi Thao Tác / Trạng Thái Trống):** Lỗi hiển thị thông báo lỗi chưa rõ ràng; lỗi xử lý trạng thái rỗng (`Empty State`) khi tải lên tệp tin bị ngắt quãng. *(Sự cố Phase 12K: **0**)*.
* **`Low` (Lỗi Nhỏ / Bố Cục):** Sai sót nhỏ về câu chữ (`Wording`), căn chỉnh khoảng cách (`Padding/Margin`) hoặc độ tương phản màu sắc. *(Sự cố Phase 12K: **0**)*.
* **`Note` (Góp Ý Cải Tiến UX):** Đề xuất bổ sung giải thích trực quan (`Tooltip/Helptext`) nhằm nâng cao trải nghiệm người dùng, không ảnh hưởng đến tính đúng đắn của nghiệp vụ. *(Ghi nhận Phase 12K: **01**)*.

---

## 3. Xác Nhận Nguyên Tắc Bất Khả Xâm Phạm (`No Code Change Confirmation`)
- [x] **Tuân thủ quy tắc Không sửa code trong Phase 12K (`No Code Modification`):** Phù hợp với nguyên tắc an toàn, Kiểm thử viên và Quản trị viên **hoàn toàn không can thiệp sửa đổi mã nguồn (`src/`) hay cấu trúc cơ sở dữ liệu** khi ghi nhận góp ý `ISSUE-UAT-12K-01`.
- [x] **Chuyển tiếp xử lý (`Handoff to Phase 12L`):** Góp ý cải tiến UX nói trên đã được đăng ký hợp lệ vào sổ theo dõi (`Issue Register`) và sẽ được chuyển tiếp sang **Phase 12L: Financial Obligation UAT Issue Fixes & Stabilization** hoặc **Phase 12L: Financial Obligation Pilot Acceptance & Release Candidate** để xem xét tối ưu.
