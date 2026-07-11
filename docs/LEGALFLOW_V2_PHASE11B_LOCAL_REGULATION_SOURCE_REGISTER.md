# LEGALFLOW V2 - PHASE 11B
# LOCAL REGULATION SOURCE REGISTER

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11B Standard`  
**Ngày ban hành Sổ Đăng ký:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL LOCAL REGULATION SOURCE REGISTER TEMPLATE`** *(Sổ Đăng ký & Theo dõi Thu thập Nguồn Pháp lý Địa phương)*

---

## 1. Purpose

Tài liệu này là Biểu mẫu Sổ Đăng ký Nguồn Pháp lý Địa phương (`Local Regulation Source Register` - Phase 11B) của hệ thống LegalFlow V2. Biểu mẫu được thiết lập làm danh mục ghi nhận, theo dõi và quản trị luồng thu thập các văn bản quy phạm pháp luật địa phương (`Local Regulations`), quyết định phê duyệt quy hoạch/kế hoạch sử dụng đất cấp huyện (`Land Use Plans`), bộ quy trình giải quyết thủ tục hành chính nội bộ (`Internal SOPs`) và biểu mẫu hành chính trước khi nạp vào cơ sở tri thức `Legal Knowledge Base` (`LK-01`). Sổ Đăng ký cung cấp chuẩn định nghĩa loại văn bản (`Document Type Guide`), chuỗi trạng thái kiểm chứng (`Verification Status Guide`), trạng thái phê duyệt kích hoạt (`Approval Status Guide`) và lời nhắc cảnh báo an toàn bắt buộc (`Required Warning`) nhằm bảo đảm 100% dữ liệu nạp vào hệ thống đều chính thống, hợp pháp và rõ ràng ranh giới áp dụng.

---

## 2. Source Register

Bảng Sổ Đăng ký danh mục nguồn văn bản địa phương và quy hoạch sử dụng đất (`Local Regulation Source Register Table` - *Lưu ý: Các bản ghi mẫu dưới đây minh họa quy chuẩn tra cứu, cần kiểm chứng thực tế tại từng tỉnh trước khi nạp vào hệ thống*):

| Source ID | Document Title (`title`) | Document Number (`docNo`) | Issuing Authority (`auth`) | Document Type (`type`) | Issue Date (`issued`) | Effective Date (`effective`) | Status (`status`) | Local Scope (`scope`) | Related Procedure (`procedure`) | Source Location / URL (`location`) | Reviewer (`reviewer`) | Verification Status (`verStatus`) | Approval Status (`apprStatus`) | Notes (`notes`) |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **SRC-LOC-01** | Quyết định ban hành Quy định hạn mức giao đất, công nhận QSDĐ, điều kiện tách/hợp thửa đất trên địa bàn tỉnh X | `25/2024/QĐ-UBND` | UBND tỉnh X | `Quyết định` | `2024-09-15` | `2024-10-01` | `ACTIVE` | Toàn tỉnh X | `TTHC-LAND-01`, `TTHC-LAND-05` | Cổng Thông tin Điện tử Tỉnh X (`congbothongtin...`) | `Legal Reviewer 01` | `Approved for Legal Knowledge` | `Active Candidate` | Thay thế QĐ cũ số 12/2020. Căn cứ cốt lõi cho Khối 3.1. |
| **SRC-LOC-02** | Quyết định phê duyệt Kế hoạch sử dụng đất năm 2026 của Huyện A, tỉnh X | `105/QĐ-UBND` | UBND tỉnh X | `Kế hoạch` | `2025-12-28` | `2026-01-01` | `ACTIVE` | Huyện A, tỉnh X | `TTHC-LAND-02` *(Chuyển mục đích)* | Phòng TN&MT Huyện A / Kho Lưu trữ Nội bộ | `Land Specialist` | `Approved for Legal Knowledge` | `Active Candidate` | Đối chiếu trực tiếp khi thụ lý chuyển mục đích đất nông nghiệp sang đất ở (`LAW-02`). |
| **SRC-LOC-03** | Quyết định phê duyệt Quy hoạch sử dụng đất thời kỳ 2021-2030 của Thành phố B | `88/QĐ-UBND` | UBND tỉnh X | `Quy hoạch` | `2022-04-10` | `2022-04-15` | `ACTIVE` | Thành phố B, tỉnh X | `TTHC-LAND-01 -> 06` | Sở TN&MT / `minio://legal-docs/qh_tpb.pdf` | `Land Specialist` | `Approved for Legal Knowledge` | `Active` | Bản đồ quy hoạch chung cấp huyện, có sự điều chỉnh cục bộ năm 2024. |
| **SRC-LOC-04** | Quyết định công bố Quy trình nội bộ giải quyết TTHC lĩnh vực Đất đai thuộc thẩm quyền cấp tỉnh/huyện | `512/QĐ-UBND` | UBND tỉnh X | `Quy trình nội bộ` | `2024-10-20` | `2024-11-01` | `ACTIVE` | Toàn tỉnh X | Toàn bộ TTHC Đất đai (`CASELIST-02`) | Trung tâm Phục vụ Hành chính công Tỉnh X | `Procedure Lead` | `Approved for Legal Knowledge` | `Active Candidate` | Chuẩn hóa mốc thời gian luân chuyển hồ sơ 10 - 15 ngày làm việc. |
| **SRC-LOC-05** | Công văn hướng dẫn xử lý các hồ sơ chuyển nhượng đất ven trục đường giao thông mới mở | `1850/STNMT-QLĐĐ` | Sở TN&MT tỉnh X | `Công văn hướng dẫn` | `2025-03-12` | `2025-03-12` | `ACTIVE` | Toàn tỉnh X | `TTHC-LAND-01`, `TTHC-LAND-05` | Kho dữ liệu nghiệp vụ Sở TN&MT | `Legal Reviewer 02` | `Reviewed` | `Pending Review` | Hướng dẫn chi tiết áp dụng cho các tình huống đường tự mở hoặc đang thi công. |
| **SRC-LOC-06** | Mẫu Đơn đăng ký biến động đất đai, tài sản gắn liền với đất (`Mẫu số 11/ĐK`) | `Mẫu 11/ĐK` | Bộ TN&MT / UBND tỉnh X | `Biểu mẫu` | `2024-07-31` | `2024-08-01` | `ACTIVE` | Toàn quốc / Tỉnh X | Toàn bộ TTHC biến động đất đai | Phụ lục Nghị định `101/2024/NĐ-CP` | `Document Clerk` | `Approved for Legal Knowledge` | `Active` | Mẫu biểu hành chính chuẩn sử dụng trong thẩm định và tải xuất Khối 3.3. |

---

## 3. Document Type Guide

Bảng định dạng chuẩn hóa 8 loại văn bản (`Document Classification Guide`) được phép tiếp nhận và ghi vào Sổ Đăng ký Nguồn:
1. **`Quyết định` *(Decisions):*** Các Quyết định quy phạm pháp luật do UBND tỉnh ban hành (quy định hạn mức giao đất, công nhận QSDĐ, bồi thường giải phóng mặt bằng, đơn giá đất).
2. **`Kế hoạch` *(Plans):*** Quyết định phê duyệt Kế hoạch sử dụng đất hàng năm của cấp huyện (quy định chỉ tiêu đất nông nghiệp được phép chuyển mục đích trong năm).
3. **`Quy hoạch` *(Master Plans):*** Quyết định phê duyệt Quy hoạch sử dụng đất thời kỳ 10 năm (2021-2030) của cấp huyện hoặc Quy hoạch chi tiết xây dựng tỷ lệ 1/500 của từng dự án/khu vực.
4. **`Công văn hướng dẫn` *(Guidance Letters):*** Các văn bản đôn đốc, hướng dẫn nghiệp vụ của Sở Tài nguyên &amp; Môi trường hoặc Sở Xây dựng tháo gỡ vướng mắc thụ lý thực tế.
5. **`Quy trình nội bộ` *(Internal SOPs):*** Quyết định của UBND tỉnh công bố bộ quy trình nội bộ, quy trình điện tử giải quyết TTHC tại Một cửa và Phòng Chuyên môn.
6. **`Biểu mẫu` *(Administrative Templates):*** Các mẫu đơn, tờ khai, mẫu quyết định chuẩn theo phụ lục Nghị định hướng dẫn Luật Đất đai 2024 và Nghị định 30/2020/NĐ-CP.
7. **`Nghị quyết` *(Resolutions - nếu có):*** Các Nghị quyết của Hội đồng Nhân dân tỉnh thông qua danh mục thu hồi đất hoặc chuyển mục đích đất lúa/đất rừng.
8. **`Văn bản thay thế / sửa đổi / bổ sung` *(Amendments &amp; Replacements):*** Các Quyết định/Nghị định ban hành sau nhằm thay thế, bãi bỏ hoặc sửa đổi một phần văn bản quy phạm pháp luật trước đó.

---

## 4. Verification Status Guide

Định nghĩa chuẩn xác chuỗi 10 trạng thái kiểm chứng nguồn văn bản (`Standardized 10-Step Verification Status Table`):

| Verification Status Tag | Meaning & Definition | Required Officer Action & Check Mandate |
| :--- | :--- | :--- |
| **1. `New`** | Nguồn văn bản mới được đề xuất vào sổ, chưa rà soát metadata. | Cán bộ thu thập (`Source Collector`) nhập thông tin ban đầu. |
| **2. `Source Collected`** | Đã có file gốc (`.pdf/.doc`) hoặc URL lưu trữ chính thức. | Kiểm tra file không bị lỗi phông chữ hay mất trang scan. |
| **3. `Source Verified`** | Đã xác thực tính chính thống từ Công báo tỉnh hoặc cổng UBND tỉnh. | Khẳng định tuyệt đối văn bản không phải là bản photo nhái/giả. |
| **4. `Effective Date Checked`** | Đã kiểm chứng rõ ngày ban hành và ngày bắt đầu có hiệu lực. | Xác định chính xác mốc thời gian áp dụng thụ lý hồ sơ. |
| **5. `Amendment Checked`** | Đã rà soát kỹ quan hệ sửa đổi, bổ sung hay thay thế văn bản cũ. | Ghi nhớ rõ văn bản cũ bị bãi bỏ (`amendmentRelation`). |
| **6. `Local Applicability Checked`** | Đã kiểm tra địa bàn áp dụng (Toàn tỉnh vs. riêng Huyện/Xã). | Ngăn chặn áp dụng nhầm hạn mức giữa các đơn vị hành chính. |
| **7. `Reviewed`** | Cán bộ chuyên môn/Pháp chế (`Legal Reviewer`) đã hoàn tất rà soát. | Đã ký nháy vào phiếu kiểm tra (`Validation Checklist`). |
| **8. `Approved for Legal Knowledge`** | Lãnh đạo Phòng (`MANAGER`) đã ký duyệt đồng ý đưa vào thư viện. | Đủ điều kiện chuyển cho ADMIN nạp vào cơ sở dữ liệu tri thức. |
| **9. `Rejected`** | Đề xuất bị từ chối do sai nguồn, văn bản hết hiệu lực hoặc lỗi phông. | Ghi rõ lý do từ chối vào cột `notes`, lưu trữ hồ sơ bãi bỏ. |
| **10. `Needs More Information`** | Thiếu bản đồ đi kèm hoặc chưa rõ điều khoản chuyển tiếp hiệu lực. | Trả lại cho `Source Collector` bổ sung thêm phụ lục hoặc căn cứ. |

---

## 5. Approval Status Guide

Định nghĩa chuẩn hóa chuỗi 7 trạng thái phê duyệt kích hoạt của bản ghi trong `Legal Knowledge Base` (`Approval Status Life Cycle Table`):

| Approval Status Tag | Meaning & Definition | System Behavior & AI Review Integration (`Khối 3.1 & Khối 3.2`) |
| :--- | :--- | :--- |
| **1. `Draft`** | Bản ghi đang được tạo nháp trên giao diện quản trị hoặc Sổ Đăng ký. | `[HIDDEN]` - Không hiển thị trong Khối 3.2, AI Khối 3.1 không được truy cập. |
| **2. `Pending Review`** | Bản ghi đã hoàn thiện metadata, đang chờ Lãnh đạo Phòng rà soát. | `[HIDDEN]` - Vẫn khóa đối với chuyên viên thụ lý production. |
| **3. `Approved`** | Lãnh đạo Phòng đã ký duyệt, chuẩn bị nạp vào cơ sở dữ liệu. | `[STAGED]` - Sẵn sàng cho Quản trị viên (`ADMIN`) thực hiện nạp DB. |
| **4. `Active Candidate`** | Bản ghi đã nạp vào DB thành công, đang chờ Hội đồng kích hoạt chính thức. | `[STAGED]` - Đủ điều kiện kỹ thuật, chờ lệnh kích hoạt theo lộ trình Phase 11C. |
| **5. `Active`** | Bản ghi chính thức có hiệu lực thi hành (`active: true`, `status: ACTIVE`). | `[LIVE]` - Hiển thị huy hiệu trên Khối 3.2, AI Khối 3.1 sử dụng làm căn cứ tham mưu. |
| **6. `Superseded`** | Bản ghi đã bị thay thế bởi văn bản mới hơn ban hành sau đó. | `[ARCHIVED]` - Hiển thị cờ `SUPERSEDED`, AI chuyển sang dùng văn bản mới. |
| **7. `Archived` / `Expired`** | Bản ghi đã hết hiệu lực pháp lý toàn bộ (`status: EXPIRED`). | `[WARNING]` - Hiển thị cờ đỏ trên UI, ngăn chặn AI và chuyên viên áp dụng nhầm. |

---

## 6. Required Warning

Dưới đây là **Đoạn Lời nhắc Cảnh báo An toàn Bắt buộc (`Required Warning Mandate`)** phải in đậm ở đầu mọi trang Sổ Đăng ký Nguồn Pháp lý Địa phương:

> [!WARNING]
> **CẢNH BÁO AN TOÀN VỀ QUẢN TRỊ NGUỒN DỮ LIỆU PHÁP LÝ (LEGALFLOW V2):**
> 
> *Dữ liệu trong Sổ Đăng ký (`Local Regulation Source Register`) này chỉ được sử dụng và nạp vào Khối 3.2 (`Legal Knowledge Base`) sau khi đã được Cán bộ Pháp chế thẩm định và Lãnh đạo Đơn vị ký xác nhận phê duyệt (`Approved for Legal Knowledge`). Hệ thống Trợ lý AI Khối 3.1 **tuyệt đối không tự khẳng định văn bản là mới nhất hoặc đầy đủ tuyệt đối**. Trong mọi trường hợp, Chuyên viên thụ lý P2 và Lãnh đạo Phòng có trách nhiệm cao nhất đối chiếu căn cứ pháp luật hiện hành, quy hoạch sử dụng đất thực tế của địa phương (`LAW-02`) và quy trình nội bộ trước khi tham mưu kết luận hồ sơ TTHC.*

---
*Sổ Đăng ký Nguồn Pháp lý Địa phương (Local Source Register) được lập tự động từ Kế hoạch Làm giàu Tri thức Phase 11B.*
