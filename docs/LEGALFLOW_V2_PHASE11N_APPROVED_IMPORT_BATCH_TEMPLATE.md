# LEGALFLOW V2 - PHASE 11N
# APPROVED IMPORT BATCH TEMPLATE

## 1. Purpose

Tài liệu này là biểu mẫu chính thức chứa Danh sách bản ghi tri thức pháp lý đã đủ điều kiện (`Approved Import Batch Template`), được Hội đồng Thẩm định Pháp chế ký duyệt sau quá trình rà soát và làm sạch tại Phase 11N.  
Bảng mẫu này là đầu vào hợp lệ duy nhất được phép sử dụng cho giai đoạn nạp dữ liệu thật có kiểm soát (`Controlled Real Legal Dataset Import Execution`) ở phase tiếp theo, bảo đảm 100% bản ghi trong lô nạp đều đã sạch lỗi, rõ ràng nguồn gốc và đạt chứng nhận `Ready for Controlled Import`.

## 2. Import Batch Header

| Batch ID | Batch Name | Dataset Source | Prepared By | Reviewed By | Approved By | Approval Date | Import Readiness | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **BATCH-2024-001** | Lô rà soát số 01 - SOP Quy trình nội bộ TTHC Đất đai | Cổng TTĐT Sở TNMT & UBND Tỉnh X (`sotnmt.tinhx.gov.vn`) | SOP Officer D (`STAFF`) | Legal Lead (`MANAGER`) | Lãnh đạo Vụ Pháp chế (`MANAGER`) | 2026-07-12 | `Ready for Controlled Import` | Lô dữ liệu ứng viên đầu tiên đạt đủ 100% tiêu chí làm sạch và thẩm định pháp lý; sẵn sàng đưa sang Phase 11O. |

## 3. Approved Records Table

Dưới đây là bảng danh sách các bản ghi pháp lý đã được làm sạch trọn vẹn và đủ điều kiện đưa vào lô nạp chính thức:

| Source ID | Document Title | Document Number | Issuing Authority | Document Type | Effective Date | Legal Status | Local Scope | Related Procedure | Approval Status | Risk Note | Import Decision | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **REG-2024-005** | Quy trình nội bộ giải quyết thủ tục hành chính lĩnh vực đất đai (SOP cấp mới) | 888/QĐ-UBND | UBND Tỉnh X | SOP | 2024-09-15 | Effective | Province X | TTHC-LAND-01 | **Approved** | Định mức thời gian xử lý SLA là 10 ngày làm việc; các lời nhắc AI chỉ mang tính tham khảo hỗ trợ cán bộ. | `Ready for Controlled Import` | Bản ghi chuẩn mực đạt 100% tiêu chí thẩm định; metadata sạch và khớp hoàn toàn quy trình xử lý Bộ phận Một cửa. |

*(Lưu ý về danh sách bóc tách và trì hoãn (`Excluded / Deferred Records`): Các bản ghi `REG-2024-001` (Luật Đất đai 2024), `REG-2024-002` (Nghị định 101/2024) và `REG-2024-003` (Quyết định tách thửa tỉnh X) hiện đang tiếp tục rà soát bổ sung tại Sổ làm sạch (`Dataset Cleanup Register`) và chưa được đưa vào lô mẫu này. Riêng bản ghi quy hoạch hết thời kỳ `REG-2024-004` bị loại bỏ vĩnh viễn `Rejected`).*

## 4. Import Readiness Checklist

Trước khi bảng mẫu lô dữ liệu này được chuyển sang công cụ nạp kỹ thuật, `Technical Operator` và `ADMIN` phải thực hiện rà soát chốt chặn lần cuối trên 10 tiêu chí độ sẵn sàng (`Import Readiness Checklist`):

| Item | Required Result | Confirmed: Yes / No / N/A | Evidence | Notes |
| :--- | :--- | :---: | :--- | :--- |
| `all records approved` | 100% bản ghi trong bảng Approved Records Table đều có `Approval Status: Approved`. | `Yes` | Kiểm tra cột `Approval Status` của `REG-2024-005` đạt chuẩn `Approved`. | Không cho phép bất kỳ bản ghi `Pending` hay `In Review` nào tồn tại trong lô nạp. |
| `no Unknown legal status` | Không có bản ghi nào để tình trạng hiệu lực là `Unknown` hoặc `Unverified`. | `Yes` | Cột `Legal Status` ghi nhận chính xác trạng thái `Effective`. | Đã kiểm chứng qua công báo mới nhất. |
| `no missing source` | Không có bản ghi nào thiếu URL nguồn công báo hay tệp gốc chính thống. | `Yes` | Trường `Source Location / URL` dẫn tới trang TTĐT hợp pháp chính phủ (`.gov.vn`). | Bảo đảm tính truy xuất nguồn gốc. |
| `no unresolved duplicate` | Không có bản ghi trùng lặp nội dung hoặc trùng số ký hiệu với DB hiện hữu. | `Yes` | Đã rà soát đối chiếu bằng mã `document_number: 888/QĐ-UBND`. | Ngăn ngừa lỗi xung đột khóa duy nhất trong cơ sở dữ liệu. |
| `local scope checked` | Mã địa bàn áp dụng (`Local Scope`) được xác định chính xác tới cấp tỉnh/huyện. | `Yes` | Ghi nhận rõ phạm vi `Province X` cho SOP địa phương. | Ngăn ngừa áp dụng chéo phạm vi địa bàn trái thẩm quyền. |
| `procedure mapping checked` | Ánh xạ chuẩn xác vào 5 mã quy trình thủ tục `TTHC-LAND-01` &rarr; `05`. | `Yes` | Đã gán mã `TTHC-LAND-01` theo chuyên đề cấp mới giấy chứng nhận. | Phục vụ truy xuất nhanh trong luồng nghiệp vụ. |
| `risk notes present` | 100% bản ghi đều có lời nhắc cảnh báo rủi ro pháp lý (`risk_note`) tường minh. | `Yes` | Trường `risk_note` của bản ghi hướng dẫn cụ thể về mốc thời gian SLA và vai trò AI. | Bảo vệ sự cẩn trọng cho người áp dụng. |
| **`backup required before import`** | Yêu cầu bắt buộc thực thi sao lưu DB (`pg_dump`) ngay trước thời điểm nạp. | `Yes` (`Pre-condition`) | Kịch bản backup `.sql` sẵn sàng chạy tại `Phase 11O` trước khi bấm Execute. | Chốt chặn an toàn số 1 bảo vệ toàn vẹn DB production. |
| **`no auto-active after import`** | Xác nhận cờ `noAutoActive: true` được thi hành tuyệt đối sau khi nạp thành công. | `Yes` (`Pre-condition`) | API trả về cờ `noAutoActive: true`; DB bảo toàn nguyên trạng thái thi hành hiện tại. | Ngăn rủi ro tự động thay thế luật đang áp dụng. |
| **`active approval separate`** | Quy trình kích hoạt phiên bản (`Active Version`) được tách biệt thành luồng 3 bước độc lập. | `Yes` (`Pre-condition`) | Giai đoạn quản trị phiên bản tại `Version Governance UI` (`Phase 8F-E`) thực hiện sau nạp. | Chốt chặn an toàn quản trị cao nhất. |

## 5. Batch Decision

Căn cứ vào kết quả thẩm định rà soát 100% hoàn hảo đối với lô dữ liệu mẫu số 01 (`BATCH-2024-001` gồm bản ghi `REG-2024-005`), Hội đồng Quản trị Kỹ thuật và Pháp chế Đề xuất Quyết định:

### `READY FOR CONTROLLED IMPORT`
*(LÔ DỮ LIỆU ĐÃ SẴN SÀNG ĐỂ THỰC THI NẠP CÓ KIỂM SOÁT TẠI GIAI ĐOẠN TIẾP THEO)*

*(Lưu ý về tình trạng tổng thể của toàn bộ Bộ dữ liệu thật: Đối với tổng thể 5 bản ghi thực tế ban đầu, do mới chỉ có 1 bản ghi đạt chuẩn vào lô `BATCH-2024-001`, tình trạng toàn cục của dự án tại Phase 11N được xác nhận là **`DATASET APPROVAL FRAMEWORK READY`** - Khung quy trình rà soát và lô dữ liệu mẫu chuẩn đã sẵn sàng vận hành).*

## 6. Safety Note

> [!CAUTION]
> **LƯU Ý AN TOÀN NGHIÊM NGẶT KHI THỰC THI NẠP (`SAFETY NOTE`):**  
> Ngay cả khi lô dữ liệu (`Batch ID: BATCH-2024-001`) đã được ký duyệt chính thức với kết luận `READY FOR CONTROLLED IMPORT`, việc thực thi nạp dữ liệu thật vào cơ sở dữ liệu hệ thống **TUYỆT ĐỐI CHƯA ĐƯỢC THỰC HIỆN TRONG PHASE 11N NÀY**.  
> Việc nạp thực tế chỉ được phép thực thi tại một giai đoạn kỹ thuật riêng biệt (`Phase 11O`), nơi hệ thống bắt buộc thi hành 4 lớp rào chắn hành động trực tiếp:
> 1. **Thực thi sao lưu (`Backup Required`):** Chạy `pg_dump` tạo bản sao lưu toàn vẹn ngay trước giờ nạp.
> 2. **Xác nhận tường minh (`Confirmation Required`):** Người thao tác phải nhập chính xác chuỗi từ khóa bảo vệ: `"I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION"`.
> 3. **Ghi nhận lý do (`Reason Required`):** Phải nhập lý do nạp và số công văn phê duyệt lô dữ liệu để lưu vết kiểm toán (`Audit Trail`).
> 4. **Nghiệm thu sau nạp (`Post-import Verification`):** Đối chiếu số lượng bản ghi nạp vào DB, bảo đảm tuyệt đối **không tự động kích hoạt (`noAutoActive: true`)** và không làm biến đổi bất kỳ phiên bản pháp lý nào đang thi hành.
