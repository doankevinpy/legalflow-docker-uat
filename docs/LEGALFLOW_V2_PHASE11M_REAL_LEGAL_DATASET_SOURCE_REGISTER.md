# LEGALFLOW V2 - PHASE 11M
# REAL LEGAL DATASET SOURCE REGISTER

## 1. Purpose

Danh mục nguồn dữ liệu pháp lý thật (`Real Legal Dataset Source Register`) được lập nhằm quản lý tập trung và rà soát chi tiết toàn bộ các văn bản quy phạm pháp luật, quyết định quy hoạch, lưu đồ thủ tục và hướng dẫn nghiệp vụ thực tế mà các cơ quan quản lý hành chính nhà nước đề xuất nạp vào hệ thống tri thức pháp lý LegalFlow V2.  
Mục tiêu là minh bạch hóa thông tin siêu dữ liệu (`metadata`), tình trạng kiểm tra và độ sẵn sàng của từng văn bản trước thời điểm ra quyết định cho phép nạp chính thức.

## 2. Source Register

*Lưu ý tình trạng dữ liệu hiện tại:* Tại thời điểm rà soát Phase 11M, hệ thống đang trong giai đoạn tiếp nhận và thẩm định hồ sơ nguồn. Bảng dưới đây thể hiện danh mục mẫu các nhóm văn bản pháp lý thực tế tiêu biểu đang được đăng ký rà soát (các bản ghi đang ở trạng thái `Source Collected / Verified`, chưa nạp vào DB và chưa kích hoạt):

| Source ID | Document Title | Document Number | Issuing Authority | Document Type | Issue Date | Effective Date | Expiry Date | Legal Status | Local Scope | Related Procedure | Source Location / URL | Amendment / Replacement Relation | Reviewer | Review Status | Approval Status | Import Readiness | Risk Note | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **REG-2024-001** | Luật Đất đai 2024 | 31/2024/QH15 | Quốc hội | Law | 2024-01-18 | 2024-08-01 | — | Effective | National | TTHC-LAND-01 &rarr; 05 | Cổng TTĐT Chính phủ (`chinhphu.vn`) | Thay thế Luật Đất đai 2013 (`45/2013/QH13`) | Legal Lead | Source Verified | Pending Review | Not Ready | Đang chờ đối chiếu toàn bộ các nghị định hướng dẫn thi hành mới ban hành. | Văn bản gốc khung pháp lý toàn quốc. |
| **REG-2024-002** | Nghị định quy định chi tiết về Đăng ký đất đai, tài sản gắn liền với đất | 101/2024/NĐ-CP | Chính phủ | Decree | 2024-07-29 | 2024-08-01 | — | Effective | National | TTHC-LAND-01, 05 | Công báo Chính phủ (`congbao.chinhphu.vn`) | Thay thế Nghị định 43/2014/NĐ-CP | Specialist A | Effective Date Checked | Pending Review | Not Ready | Cần kiểm tra kỹ các quy định chuyển tiếp tại Chương VII đối với hồ sơ nộp trước 01/08/2024. | Hướng dẫn chi tiết thủ tục cấp GCN và đăng ký biến động. |
| **REG-2024-003** | Quyết định quy định hạn mức giao đất, hạn mức công nhận đất ở, hạn mức tách/hợp thửa tỉnh X | 45/2024/QĐ-UBND | UBND Tỉnh X | Decision | 2024-08-15 | 2024-08-25 | — | Effective | Province X | TTHC-LAND-05 | Cổng TTĐT UBND Tỉnh X | Thay thế Quyết định 12/2020/QĐ-UBND tỉnh X | Local Officer B | Local Scope Checked | Pending Review | Not Ready | Phạm vi chỉ áp dụng nghiêm ngặt tại địa bàn tỉnh X; không áp dụng cho tỉnh/thành phố lân cận. | Quy định đặc thù địa phương phục vụ TTHC tách thửa. |
| **REG-2024-004** | Quyết định phê duyệt Kế hoạch sử dụng đất năm 2024 Huyện A | 120/QĐ-UBND | UBND Tỉnh X | Plan | 2024-01-10 | 2024-01-15 | 2024-12-31 | Expired / Warning | District A, Province X | TTHC-LAND-02 | Cổng TTĐT Huyện A | — | Planning Clerk C | Reviewed | Rejected | Rejected | Văn bản đã hết thời hạn áp dụng kịch bản năm 2024; cần phê duyệt Kế hoạch sử dụng đất 2025 thay thế. | Bị từ chối import vì đã hết thời kỳ quy hoạch/kế hoạch sử dụng đất. |
| **REG-2024-005** | Quy trình nội bộ giải quyết thủ tục hành chính lĩnh vực đất đai (SOP cấp mới) | 888/QĐ-UBND | UBND Tỉnh X | SOP | 2024-09-01 | 2024-09-15 | — | Effective | Province X | TTHC-LAND-01 | Cổng TTĐT Sở TNMT Tỉnh X | Thay thế SOP cũ theo QĐ 500/QĐ-UBND | SOP Officer D | Reviewed | Approved | Ready for Dry-run | Định mức thời gian xử lý SLA là 10 ngày làm việc; các lời nhắc AI chỉ mang tính tham khảo hỗ trợ cán bộ. | Chuẩn bị sẵn sàng rà soát dry-run bước tiếp theo. |

## 3. Review Status Values

Mỗi văn bản pháp lý trong danh mục nguồn được theo dõi trạng thái rà soát theo 10 mức phân cấp chuẩn (`Review Status Values`):
- `New`: Văn bản mới được đưa vào danh mục đăng ký ban đầu, chưa rà soát.
- `Source Collected`: Đã thu thập tệp nguồn văn bản gốc PDF/DOCX từ cơ quan ban hành.
- `Source Verified`: Đã xác thực tính hợp pháp và chính thống của nguồn lưu trữ (`chinhphu.vn`, Cổng TTĐT tỉnh).
- `Effective Date Checked`: Đã rà soát, đối chiếu và xác nhận tính chính xác của mốc ngày có hiệu lực/ngày ban hành.
- `Amendment Checked`: Đã kiểm tra và làm rõ mối quan hệ sửa đổi, bổ sung, bãi bỏ hoặc thay thế với các văn bản khác.
- `Local Applicability Checked`: Đã rà soát và xác định chính xác phạm vi áp dụng (Quốc gia hay địa phương cụ thể).
- `Reviewed`: Cán bộ nghiệp vụ đã hoàn tất toàn bộ các hạng mục kiểm tra kỹ thuật trên văn bản.
- `Approved`: Lãnh đạo phụ trách pháp chế đã ký duyệt chấp thuận chất lượng thông tin siêu dữ liệu của văn bản.
- `Rejected`: Văn bản bị từ chối rà soát/phê duyệt do sai lệch thông tin, hết hiệu lực hoặc không thuộc phạm vi điều chỉnh.
- `Needs More Information`: Yêu cầu cơ quan đề xuất cung cấp thêm bản chụp gốc có dấu đỏ hoặc văn bản hướng dẫn chuyển tiếp.

## 4. Import Readiness Values

Độ sẵn sàng cho phép nạp của từng bản ghi được phân loại theo 5 mức độ kiểm soát (`Import Readiness Values`):
- `Not Ready`: Bản ghi chưa hoàn tất quá trình rà soát hoặc còn thiếu thông tin bắt buộc, tuyệt đối không được phép nạp.
- `Ready for Dry-run`: Đã qua rà soát sơ bộ, đủ điều kiện đưa vào rà soát mô phỏng không ghi DB (`dryRun: true`) tại Phase 11N/11O.
- `Ready for Controlled Import`: Đã hoàn tất 100% rà soát, được Hội đồng phê duyệt bằng văn bản, sẵn sàng cho nạp thực tế có kiểm soát.
- `Blocked`: Bị tạm khóa do vướng mắc về tranh chấp pháp lý, đang chờ giải thích luật hoặc vi phạm quy tắc an toàn hệ thống.
- `Rejected`: Bị từ chối nạp vĩnh viễn (do hết hiệu lực hoặc không thuộc chuyên ngành đất đai).

## 5. Required Warning

> [!WARNING]
> **CẢNH BÁO QUẢN TRỊ PHÁP LÝ & AI GOVERNANCE:**  
> Dữ liệu được liệt kê trong danh mục nguồn (`Source Register`) này **HOÀN TOÀN CHƯA ĐƯỢC IMPORT VÀ CHƯA ĐƯỢC ACTIVE** vào cơ sở dữ liệu đang vận hành thực tế của hệ thống LegalFlow V2.  
> Hệ thống và Trí tuệ nhân tạo (AI) **TUYỆT ĐỐI KHÔNG TỰ KHẲNG ĐỊNH** các văn bản trong danh mục này là mới nhất, còn hiệu lực hay đầy đủ tuyệt đối về mặt pháp lý.  
> Mọi cán bộ công chức, viên chức nghiệp vụ khi xử lý hồ sơ thủ tục hành chính bắt buộc phải tự kiểm tra, đối chiếu căn cứ pháp lý với văn bản gốc có hiệu lực theo quy định của pháp luật hành chính nhà nước.
