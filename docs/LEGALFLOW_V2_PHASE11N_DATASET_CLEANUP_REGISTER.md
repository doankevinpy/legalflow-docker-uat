# LEGALFLOW V2 - PHASE 11N
# DATASET CLEANUP REGISTER

## 1. Purpose

Sổ theo dõi và làm sạch dữ liệu (`Dataset Cleanup Register`) được thiết lập nhằm ghi nhận chi tiết mọi khiếm khuyết, lỗi thiếu hụt thông tin siêu dữ liệu (`metadata`), tình trạng pháp lý chưa rõ ràng hoặc mâu thuẫn phạm vi áp dụng trên các bản ghi văn bản pháp lý nguồn thu thập tại Phase 11M.  
Mục tiêu là theo dõi quy trình xử lý, bổ sung thông tin từ các cán bộ chuyên trách (`Owner`) và ra quyết định phân loại cuối cùng trước khi chuyển sang lô phê duyệt nạp.

## 2. Cleanup Register

Dưới đây là bảng phân tích và rà soát khắc phục đối với các bản ghi tri thức pháp lý thực tế tiêu biểu đang được rà soát trong hệ thống:

| Cleanup ID | Source ID | Document Title | Document Number | Issue Type | Missing Field / Problem | Severity | Required Action | Owner | Status | Decision | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :---: | :---: | :--- |
| **CLN-2024-001** | `REG-2024-001` | Luật Đất đai 2024 | 31/2024/QH15 | `Needs Reviewer Approval` / `Amendment Relation Unknown` | Chưa cập nhật đầy đủ danh mục các nghị định quy định chi tiết mới ban hành bổ sung cho Luật và cần chữ ký phê duyệt chính thức của Lãnh đạo Vụ Pháp chế. | `CRITICAL` | Cập nhật quan hệ hướng dẫn/thay thế đầy đủ; trình Lãnh đạo Vụ Pháp chế rà soát và ký duyệt `Approval Status: Approved`. | Legal Lead (`MANAGER`) | `In Review` | `Keep` | Văn bản khung toàn quốc cốt lõi, bắt buộc phải làm sạch và phê duyệt trước khi nạp. |
| **CLN-2024-002** | `REG-2024-002` | Nghị định quy định chi tiết về Đăng ký đất đai, tài sản gắn liền với đất | 101/2024/NĐ-CP | `Needs Reviewer Approval` / `Risk Note Missing` | Trường `risk_note` chưa nêu cụ thể cách xử lý đối với các hồ sơ đăng ký đất đai nộp trước ngày 01/08/2024 nhưng chưa có kết quả giải quyết theo Chương VII Nghị định. | `HIGH` | Viết bổ sung trích đoạn hướng dẫn chuyển tiếp tại `risk_note`; lấy ý kiến xác nhận của cán bộ nghiệp vụ đăng ký đất đai. | Specialist A (`STAFF`) | `Cleaned` | `Keep` | Đã bổ sung `risk_note` chuyển tiếp rõ ràng, chuẩn bị chuyển sang phê duyệt của Lãnh đạo. |
| **CLN-2024-003** | `REG-2024-003` | Quyết định quy định hạn mức giao đất, công nhận đất ở, tách/hợp thửa Tỉnh X | 45/2024/QĐ-UBND | `Local Scope Missing` / `Procedure Mapping Missing` | Ban đầu trường `local_applicability` chỉ ghi "Tỉnh X" chung chung, chưa làm rõ quy định áp dụng riêng cho các phường nội thành hay các xã miền núi/hải đảo thuộc tỉnh. | `HIGH` | Bổ sung phụ lục phân vùng áp dụng địa phương (`Zone 1: Nội thành`, `Zone 2: Miền núi/Hải đảo`); rà soát lại ánh xạ với `TTHC-LAND-05`. | Local Officer B (`STAFF`) | `Cleaned` | `Keep` | Đã chuẩn hóa mã địa bàn chi tiết tới từng khu vực hành chính cấp huyện/xã trong tỉnh X. |
| **CLN-2024-004** | `REG-2024-004` | Quyết định phê duyệt Kế hoạch sử dụng đất năm 2024 Huyện A | 120/QĐ-UBND | `Expired / Superseded` | Văn bản đã hết thời hạn áp dụng kịch bản năm 2024 (`2024-01-01` &rarr; `2024-12-31`), không còn giá trị căn cứ cho năm hiện hành `2026`. | `CRITICAL` | Gán nhãn `Expired`; loại bỏ khỏi danh sách import candidate để tránh bãi bỏ/nhầm lẫn quy hoạch mới. Yêu cầu cung cấp Kế hoạch SDĐ 2026 thay thế. | Planning Clerk C (`STAFF`) | `Approved` (Cleanup Action) | `Reject` | Đã xử lý bóc tách thành công khỏi danh sách ứng viên nạp. Không đưa vào lô nạp DB. |
| **CLN-2024-005** | `REG-2024-005` | Quy trình nội bộ giải quyết TTHC lĩnh vực đất đai (SOP cấp mới) | 888/QĐ-UBND | *(Clean Record)* | Bản ghi đã hoàn thiện đầy đủ 29 cột metadata, nguồn công báo hợp lệ, rõ ràng quy tắc chuyển tiếp và đã được Lãnh đạo Vụ ký duyệt. | `NONE` | Đối chiếu lần cuối với bảng phân công trách nhiệm phòng ban chuyên môn; xác nhận đưa thẳng vào `Approved Import Batch Template`. | SOP Officer D (`STAFF`) | `Ready for Import Batch` | `Ready for Controlled Import` | Bản ghi mẫu chuẩn mực đạt đủ 100% tiêu chí, đủ điều kiện đưa vào lô nạp Phase 11O. |

## 3. Issue Type Guide

Sổ làm sạch định nghĩa 12 loại khiếm khuyết chuẩn (`Issue Type Guide`) để chuẩn hóa ngôn ngữ báo cáo giữa các nhóm làm việc:
1. `Missing Source`: Văn bản chưa có URL nguồn hợp lệ từ Cổng thông tin điện tử cơ quan nhà nước (`.gov.vn`).
2. `Missing Document Number`: Thiếu số/ký hiệu văn bản chuẩn hóa hoặc ghi sai định dạng số/năm/bắt tắt.
3. `Missing Effective Date`: Thiếu ngày có hiệu lực hoặc mốc thời gian không tuân thủ ISO 8601 (`YYYY-MM-DD`).
4. `Unknown Legal Status`: Tình trạng hiệu lực ghi nhận `Unknown` hoặc chưa được kiểm tra đối chiếu công báo mới nhất.
5. `Amendment Relation Unknown`: Chưa rõ mối quan hệ sửa đổi, bổ sung, đính chính hoặc thay thế với văn bản trước đó.
6. `Local Scope Missing`: Văn bản do UBND/HĐND địa phương ban hành nhưng để rỗng mã phạm vi áp dụng (`local_applicability`).
7. `Procedure Mapping Missing`: Chưa gán mã thủ tục `TTHC-LAND-01` &rarr; `TTHC-LAND-05` theo đúng phạm vi điều chỉnh nghiệp vụ.
8. `Risk Note Missing`: Thiếu trường lời nhắc/cảnh báo rủi ro pháp lý (`risk_note`) hướng dẫn xử lý tình huống chuyển tiếp cho cán bộ.
9. `Duplicate Candidate`: Phát hiện bản ghi có nội dung hoặc số ký hiệu trùng lặp với một văn bản khác đã tồn tại trong danh mục.
10. `Expired / Superseded`: Văn bản đã hết hiệu lực thi hành toàn bộ hoặc một phần, hay đã bị bãi bỏ bởi văn bản mới hơn.
11. `Needs Reviewer Approval`: Bản ghi đã đầy đủ thông tin nhưng chưa có chữ ký rà soát/xác nhận của cán bộ chuyên môn phụ trách (`STAFF`).
12. `Needs Manager Approval`: Bản ghi đã qua rà soát của cán bộ chuyên môn nhưng chưa có chữ ký phê duyệt chính thức của Lãnh đạo Vụ/Phòng Pháp chế (`MANAGER`).

## 4. Cleanup Status Values

Hành trình xử lý mỗi khiếm khuyết được theo dõi qua 8 mức trạng thái làm sạch (`Cleanup Status Values`):
- `New`: Lỗi/khiếm khuyết mới được phát hiện và ghi nhận vào sổ theo dõi.
- `In Review`: Cán bộ phụ trách (`Owner`) đang rà soát hồ sơ, đối chiếu văn bản gốc và bổ sung thông tin còn thiếu.
- `Needs More Information`: Yêu cầu cơ quan ban hành hoặc phòng nghiệp vụ cung cấp thêm bản chụp gốc có dấu đỏ để xác thực.
- `Cleaned`: Cán bộ nghiệp vụ đã khắc phục xong khiếm khuyết, hoàn thiện đầy đủ 100% metadata.
- `Approved`: Lãnh đạo Vụ/Phòng Pháp chế đã thẩm định kết quả khắc phục và ký duyệt phê duyệt bản ghi.
- `Rejected`: Khắc phục thất bại hoặc văn bản được xác định đã hết hiệu lực/không thuộc chuyên ngành, bị loại ra khỏi hệ thống.
- `Deferred`: Tạm hoãn xử lý (do đang chờ xin ý kiến hướng dẫn pháp luật từ cấp trên hoặc vướng mắc tranh chấp).
- `Ready for Import Batch`: Bản ghi đã sạch 100%, được ký duyệt hợp lệ và đã chuyển sang bảng mẫu lô nạp (`Approved Import Batch Template`).

## 5. Cleanup Decision Values

Kết quả rà soát cuối cùng trên từng bản ghi sau khi làm sạch được chốt theo 6 mức quyết định (`Cleanup Decision Values`):
- `Keep`: Giữ lại bản ghi trong danh mục nguồn để tiếp tục hoàn thiện các thủ tục phê duyệt cấp cao.
- `Keep with Warning`: Giữ lại bản ghi nhưng phải gắn kèm cảnh báo rủi ro cao (`high risk warning`) cho cán bộ khi tra cứu/áp dụng.
- `Reject`: Loại bỏ hoàn toàn bản ghi khỏi danh sách ứng viên nạp (áp dụng cho văn bản hết thời kỳ, bị bãi bỏ hoặc trùng lặp).
- `Defer`: Trì hoãn việc nạp sang các giai đoạn sau cho đến khi có văn bản hướng dẫn chi tiết của cơ quan thẩm quyền.
- `Needs Legal Review`: Yêu cầu chuyển hồ sơ sang Hội đồng Pháp chế chuyên sâu để họp thẩm định riêng.
- `Ready for Controlled Import`: Chấp thuận đưa chính thức vào lô dữ liệu sẵn sàng nạp có kiểm soát tại Phase 11O tiếp theo.

## 6. Safety Warning

> [!WARNING]
> **CẢNH BÁO AN TOÀN QUẢN TRỊ DỮ LIỆU PHÁP LÝ (`SAFETY WARNING`):**  
> Toàn bộ các bản ghi và thông tin đang được xử lý trong Sổ theo dõi làm sạch (`Dataset Cleanup Register`) này **HOÀN TOÀN CHƯỢC ĐƯỢC IMPORT VÀ CHƯA ĐƯỢC ACTIVE** vào cơ sở dữ liệu `legalflow_prod` đang vận hành thực tế.  
> Việc làm sạch metadata hay chuẩn hóa thông tin chỉ là bước chuẩn bị nguyên liệu kỹ thuật. Hệ thống và Trí tuệ nhân tạo (AI) **TUYỆT ĐỐI KHÔNG TỰ KHẲNG ĐỊNH** các văn bản trong sổ này là hoàn chỉnh, mới nhất hay có hiệu lực pháp lý bắt buộc.  
> Mọi cán bộ nghiệp vụ khi xử lý thủ tục hành chính đất đai phải tự kiểm tra, đối chiếu căn cứ pháp lý với văn bản gốc do cơ quan nhà nước có thẩm quyền ban hành.
