# LEGALFLOW V2 - PHASE 12A
# FINANCIAL OBLIGATION SUPPORT REQUIREMENTS

## 1. User Roles & Permission Matrix

Hệ thống thiết lập ma trận quyền hạn rạch ròi giữa các vai trò người dùng nhằm bảo đảm tính an toàn nghiệp vụ và tuân thủ tuyệt đối thẩm quyền pháp lý (`Role Permission Matrix`):

| Role | Allowed Actions | Not Allowed Actions | Notes |
| :--- | :--- | :--- | :--- |
| **`STAFF`** *(Cán bộ thụ lý/chuyên môn)* | - Xem checklist thông tin còn thiếu.<br>- Nhập bổ sung thông tin hồ sơ/thửa đất.<br>- Yêu cầu AI sinh bảng tính dự kiến.<br>- Ghi chú rà soát căn cứ pháp lý.<br>- Tải lên tệp Thông báo thuế và Chứng từ nộp tiền.<br>- Nhập số tiền chính thức từ Thông báo thuế.<br>- Đánh dấu xác nhận (`Mark Officer Verified`). | - Tự kết luận số tiền chính thức nếu không có Thông báo thuế.<br>- Tự ý quyết định miễn/giảm không có quyết định kèm theo.<br>- Tự phát hành thông báo thuế cho công dân.<br>- Đánh dấu hoàn thành khi chưa có chứng từ nộp tiền hợp lệ. | Cán bộ là chốt chặn chịu trách nhiệm trực tiếp về sự chính xác của thông tin đầu vào và việc đối chiếu chứng từ thực tế. |
| **`MANAGER`** *(Lãnh đạo Phòng/Vụ)* | - Rà soát toàn bộ kết quả đánh giá của Cán bộ.<br>- Kiểm tra chứng từ nộp tiền và thông báo thuế.<br>- Phê duyệt (`Mark Manager Verified`) cho phép chuyển hồ sơ sang bước tiếp theo.<br>- Trả lại hồ sơ yêu cầu cán bộ bổ sung thông tin. | - Thay đổi số tiền chính thức trái với Thông báo của Cơ quan Thuế.<br>- Tự động hóa phê duyệt mà không kiểm tra log/chứng từ.<br>- Miễn giảm trái thẩm quyền. | Lãnh đạo chịu trách nhiệm phê duyệt chốt chặn cuối cùng đối với các hồ sơ có rủi ro cao hoặc có miễn giảm. |
| **`ADMIN`** *(Quản trị viên kỹ thuật)* | - Cấu hình tham số hệ thống và phân quyền.<br>- Quản lý danh mục bảng giá đất/hệ số adjustment theo quy định ban hành.<br>- Rà soát nhật ký kiểm toán (`Audit Trail`). | - Sửa đổi trực tiếp số tiền hoặc trạng thái nghiệp vụ của từng hồ sơ cụ thể.<br>- Tự ý kích hoạt phiên bản pháp luật mới mà không qua luồng quy trình.<br>- Tự gửi SMS/Zalo. | Admin chỉ quản trị kỹ thuật và cấu hình nền tảng, không can thiệp vào phán quyết nghiệp vụ từng hồ sơ. |
| **`AI System`** *(Trợ lý trí tuệ nhân tạo)* | - Rà soát hồ sơ tự động và **gợi ý checklist** thông tin còn thiếu.<br>- **Cảnh báo thiếu dữ liệu** quan trọng (nguồn gốc, thời điểm, hạn mức).<br>- **Gợi ý khoản nghĩa vụ có thể phát sinh** dựa trên loại thủ tục.<br>- Hỗ trợ ước tính con số dự kiến (`Estimated Amount`). | - **KHÔNG ĐƯỢC kết luận chính thức (`No Official Conclusion`).**<br>- **KHÔNG ĐƯỢC phát hành thông báo (`No Tax Notice Issuance`).**<br>- **KHÔNG ĐƯỢC đánh dấu đã hoàn thành (`No Auto-completion`).**<br>- **KHÔNG ĐƯỢC gửi SMS/Zalo cho công dân.** | AI đóng vai trò là công cụ trợ lý hỗ trợ rà soát (`Suggestion Only`); toàn bộ phán quyết phải do cán bộ con người xác nhận. |
| **`Tax Authority / External`** *(Cơ quan Thuế / Cổng liên thông)* | - Cung cấp/nhận thông tin xác định nghĩa vụ tài chính theo quy chế phối hợp liên thông.<br>- Ban hành Thông báo nộp tiền nghĩa vụ tài chính đất đai chính thức.<br>- Cung cấp trạng thái nộp tiền qua Kho bạc/Ngân hàng. | - Can thiệp trực tiếp vào quy trình cấp Giấy chứng nhận bên ngoài phạm vi nghĩa vụ tài chính. | Cơ quan Thuế là chủ thể duy nhất có thẩm quyền pháp lý ban hành thông báo số tiền chính thức phải nộp. |
| **`Citizen`** *(Công dân / Người sử dụng đất)* | - Xem kết quả thông báo nộp tiền chính thức (khi được cơ quan có thẩm quyền công bố).<br>- Thực hiện nộp tiền vào Kho bạc/Ngân hàng.<br>- Nộp chứng từ/biên lai nộp tiền cho Cơ quan Một cửa/Cán bộ thụ lý. | - Tự chỉnh sửa thông báo thuế hoặc chứng từ nộp tiền.<br>- Tự xác nhận hoàn thành nghĩa vụ tài chính trên hệ thống. | Công dân là đối tượng thực hiện nghĩa vụ tài chính theo thông báo hợp pháp của cơ quan nhà nước. |

---

## 2. Supported Case Types

Module phân loại và hỗ trợ rà soát 6 nhóm hồ sơ thủ tục hành chính đất đai, quy định rõ các khoản nghĩa vụ tiềm năng, đầu vào bắt buộc và rủi ro (`Supported Case Types`):

| Procedure Type | Possible Financial Obligation | Required Inputs | Output | Risk Notes |
| :--- | :--- | :--- | :--- | :--- |
| **1. Hồ sơ cấp Giấy chứng nhận lần đầu** | - Tiền sử dụng đất (`Land Use Fee`) (nếu vượt hạn mức hoặc đất không giấy tờ/giao trái thẩm quyền).<br>- Tiền thuê đất (nếu cấp GCN thuê đất).<br>- Lệ phí trước bạ (`Registration Fee`).<br>- Phí thẩm định hồ sơ, Lệ phí cấp GCN. | Nguồn gốc sử dụng đất, Thời điểm bắt đầu sử dụng đất, Diện tích thửa đất, Hạn mức công nhận đất ở, Giấy tờ về quyền sử dụng đất, Bảng giá đất. | Checklist thiếu thông tin; Dự kiến tiền sử dụng đất & trước bạ; Cảnh báo rủi ro về thời điểm sử dụng đất. | **Rủi ro cao:** Xác định sai thời điểm sử dụng đất (trước 15/10/1993, từ 1993 đến 01/07/2004, hay từ 2004 đến 01/07/2014) dẫn đến sai tỷ lệ thu tiền sử dụng đất. |
| **2. Hồ sơ chuyển mục đích sử dụng đất** | - Tiền sử dụng đất chênh lệch giữa mục đích mới và mục đích cũ (`Differential Land Use Fee`).<br>- Lệ phí trước bạ (nếu có biến động giá trị chênh lệch/thuộc diện phải nộp).<br>- Phí thẩm định hồ sơ. | Mục đích sử dụng đất hiện trạng, Mục đích sử dụng đất sau chuyển, Nguồn gốc đất hiện trạng, Diện tích chuyển mục đích, Bảng giá đất/Hệ số K. | Checklist mục đích cũ/mới; Dự kiến tiền chênh lệch sử dụng đất; Nhắc nhở căn cứ Luật Đất đai 2024. | **Rủi ro cao:** Áp dụng sai giá đất mục đích cũ (giá đất nông nghiệp trồng cây hàng năm vs lâu năm) hoặc xác định diện tích trong/ngoài hạn mức đất ở. |
| **3. Hồ sơ đăng ký biến động** *(Đổi tên, cập nhật thông tin, gia hạn)* | - Lệ phí chứng nhận đăng ký biến động.<br>- Phí thẩm định hồ sơ.<br>- Tiền sử dụng đất/thuế bổ sung (chỉ phát sinh nếu biến động gắn liền với tăng diện tích do đo đạc lại hoặc thay đổi thời hạn). | Loại biến động nghiệp vụ, Diện tích thay đổi (nếu có), Thông tin GCN cũ, Thông báo thuế/Biên lai lệ phí. | Checklist lệ phí biến động; Trạng thái theo dõi biên lai phí thẩm định/đăng ký. | **Rủi ro trung bình:** Bỏ sót nghĩa vụ tài chính bổ sung đối với phần diện tích tăng thêm do đo đạc lại khi đăng ký biến động. |
| **4. Hồ sơ tách thửa / hợp thửa có phát sinh nghĩa vụ** | - Phí thẩm định hồ sơ tách/hợp thửa.<br>- Lệ phí địa chính/cấp mới GCN.<br>- Tiền sử dụng đất/Thuế TNCN/Lệ phí trước bạ (nếu tách thửa gắn liền với chuyển nhượng hoặc chuyển mục đích sử dụng đất đồng thời). | Quyết định/Mục đích tách hợp thửa, Phương án tách thửa, Diện tích các thửa mới, Căn cứ chuyển mục đích/chuyển nhượng đi kèm (nếu có). | Checklist thủ tục kép (`Dual Procedure Checklist`); Phân loại khoản nộp; Theo dõi chứng từ 2 luồng. | **Rủi ro cao:** Tách thửa kết hợp chuyển mục đích hoặc chuyển nhượng ngầm nhưng bỏ sót hoặc tách rời việc tính thuế thu nhập cá nhân / tiền sử dụng đất. |
| **5. Hồ sơ chuyển nhượng / tặng cho / thừa kế** *(Mở rộng tương lai)* | - Thuế thu nhập cá nhân (`Personal Income Tax - PIT`) (2% giá chuyển nhượng hoặc bảng giá đất).<br>- Lệ phí trước bạ (`Registration Fee - 0.5%`).<br>- Phí thẩm định hồ sơ. | Hợp đồng chuyển nhượng/tặng cho công chứng, Giá trị chuyển nhượng trên hợp đồng, Quan hệ nhân thân (để xét miễn thuế), Bảng giá đất. | Checklist hợp đồng & quan hệ nhân thân; Dự kiến Thuế TNCN & Lệ phí trước bạ; Theo dõi Thông báo nộp thuế TNCN. | **Rủi ro rất cao:** Kê khai giá chuyển nhượng trên hợp đồng thấp hơn bảng giá đất quy định hoặc kê khai sai quan hệ nhân thân để trốn thuế. |
| **6. Hồ sơ có miễn, giảm, ghi nợ hoặc chưa xác định** | - Theo dõi Quyết định miễn/giảm tiền sử dụng đất/thuế.<br>- Đăng ký ghi nợ tiền sử dụng đất trên GCN.<br>- Phân loại lý do chưa xác định (`Pending Determination`). | Đối tượng chính sách (nhà tình nghĩa, thương binh, hộ nghèo vùng ĐBKK), Đơn xin miễn giảm/ghi nợ, Quyết định phê duyệt của UBND/Cơ quan thuế. | Checklist hồ sơ chứng minh ưu đãi; Cảnh báo bắt buộc có Quyết định chính thức; Tracking số ghi nợ. | **Rủi ro pháp lý nghiêm trọng:** Cho phép hưởng miễn/giảm/ghi nợ tiền sử dụng đất chỉ dựa trên đơn đề nghị mà không có Quyết định phê duyệt hợp lệ. |

---

## 3. Required Input Fields

Để bảo đảm tính chính xác trong việc rà soát và gợi ý, Module quy định 12 nhóm dữ liệu đầu vào chuẩn hóa (`Required Input Fields Matrix`):

| Input Group | Field | Required / Optional | Source | Validation Rule | Notes |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **1. Thông tin hồ sơ** | `caseCode`, `procedureType`, `submissionDate`, `receivingAuthority` | **Required** | `Case Details` | Không được rỗng; `procedureType` phải khớp 1 trong 6 nhóm hỗ trợ. | Mã định danh hồ sơ và loại thủ tục để xác định luồng rà soát. |
| **2. Thông tin chủ sử dụng** | `landOwnerName`, `identityNumber` (`CCCD/MST`), `ownerType` (`Cá nhân/Tổ chức`), `policyStatus` | **Required** | `Owner Details` | CCCD 12 số hoặc MST hợp lệ; `ownerType` thuộc danh mục chuẩn. | Thông tin định danh người nộp thuế và kiểm tra diện chính sách ưu đãi. |
| **3. Thông tin thửa đất** | `parcelNumber` (`Số thửa`), `mapSheetNumber` (`Số tờ`), `address`, `locationArea` (`Khu vực/Vị trí`) | **Required** | `Parcel Details` | Số thửa, số tờ > 0; `locationArea` phải khớp bảng giá đất (Vị trí 1, 2, 3, 4). | Dữ liệu định danh vị trí đất để tra cứu giá đất quy định. |
| **4. Diện tích** | `totalArea` (`m2`), `residentialArea` (`m2`), `agriculturalArea` (`m2`), `inLimitArea`, `overLimitArea` | **Required** | `Parcel Details / Cadastral Map` | Các trường diện tích >= 0; `inLimit + overLimit = residentialArea`. | Phân định diện tích trong hạn mức công nhận và vượt hạn mức. |
| **5. Mục đích sử dụng hiện trạng** | `currentLandUseCode` (`ONT`, `ODT`, `LUC`, `BKH`, `CLN`...) | **Required** | `Current Land Profile / Old GCN` | Mã loại đất chuẩn theo quy định của Luật Đất đai. | Căn cứ xác định giá đất hiện trạng trước khi chuyển đổi. |
| **6. Mục đích sử dụng sau chuyển** | `targetLandUseCode` (`ONT`, `ODT`, `SKC`...) | **Required** *(với Chuyển mục đích)* | `Procedure Application` | Khác `currentLandUseCode`; hợp lệ theo quy hoạch sử dụng đất. | Căn cứ xác định giá đất mới để tính chênh lệch tiền sử dụng đất. |
| **7. Nguồn gốc sử dụng đất** | `landOriginCode` (`Giao có thu tiền`, `Giao không thu tiền`, `Công nhận QSDĐ`, `Thuê đất trả 1 lần/hàng năm`) | **Required** | `Land Profile / Inspection Report` | Phải chọn từ danh mục nguồn gốc pháp lý chuẩn. | Yếu tố quyết định bản chất khoản nộp (Tiền sử dụng đất hay Tiền thuê đất). |
| **8. Thời điểm sử dụng đất** | `landUseStartDate` (`Trước 15/10/1993`, `15/10/1993 - 01/07/2004`, `01/07/2004 - 01/07/2014`, `Sau 01/07/2014`) | **Required** *(với Cấp GCN lần đầu/Công nhận)* | `Verification Report / Ward Confirmation` | Phải thuộc các mốc thời gian lịch sử pháp lý theo quy định của Luật Đất đai. | Mốc thời gian quyết định tỷ lệ % thu tiền sử dụng đất (0%, 50%, hoặc 100%). |
| **9. Thông tin bảng giá đất / Hệ số** | `pricePerSqMeter` (`VNĐ`), `adjustmentCoefficientK` (`Hệ số K`), `applicablePriceTableId` | **Required** | `System Price Table / Admin Config` | `pricePerSqMeter > 0`; `adjustmentCoefficientK >= 1.0`. | Đơn giá đất theo bảng giá đất do UBND Tỉnh ban hành và hệ số điều chỉnh giá đất. |
| **10. Thông tin miễn/giảm/ghi nợ** | `exemptionType`, `exemptionDecisionNo`, `exemptionPercentage`, `debtRequestStatus` | **Optional** *(Required nếu có xin miễn/giảm/ghi nợ)* | `Exemption Application / Decision` | Nếu `exemptionType != None`, bắt buộc phải có số quyết định và file đính kèm. | Quản lý nghiêm ngặt các trường hợp giảm nộp hoặc nợ tiền sử dụng đất. |
| **11. Thông báo thuế** | `taxNoticeNumber`, `issuingTaxAuthority`, `noticeIssueDate`, `officialTotalAmount`, `taxNoticeFileId` | **Required before Completion** | `Official Tax Authority Notice` | `officialTotalAmount >= 0`; `taxNoticeNumber` không rỗng; file ID tồn tại. | Dữ liệu chính thức từ Thông báo nộp tiền do Chi cục Thuế / Cơ quan Thuế phát hành. |
| **12. Chứng từ nộp tiền** | `receiptNumber`, `paymentDate`, `treasuryOrBank`, `amountPaid`, `paymentReceiptFileId` | **Required before Completion** | `Citizen / Treasury Receipt` | `amountPaid >= officialTotalAmount` (hoặc bằng số phải nộp trừ đi miễn giảm/ghi nợ). | Biên lai/chứng từ nộp tiền vào ngân sách nhà nước hợp lệ để hoàn tất hồ sơ. |

---

## 4. Output Types

Module “Hỗ trợ nghĩa vụ tài chính” tạo ra 8 loại đối tượng đầu ra phục vụ rà soát nghiệp vụ (`Standard Output Types`):
1. **Financial Obligation Checklist (`Checklist rà soát đầu vào`):** Danh sách rà soát tình trạng đầy đủ của 12 nhóm dữ liệu đầu vào.
2. **Missing Information List (`Danh sách thông tin còn thiếu`):** Liệt kê chi tiết các trường thông tin bắt buộc còn rỗng hoặc chưa được kiểm chứng (`Unverified`), kèm nhắc nhở cán bộ bổ sung.
3. **Estimated Obligation Summary (`Bảng tổng hợp dự kiến nghĩa vụ`):** Bảng chiết tính tham khảo các khoản nghĩa vụ (Tiền sử dụng đất, Trước bạ, Phí thẩm định...) kèm số tiền dự kiến (`Estimated Amount`).
4. **Legal Basis Reminder (`Nhắc nhở căn cứ pháp lý`):** Trích dẫn các điều khoản văn bản quy phạm pháp luật (Luật Đất đai 2024, Nghị định về tiền sử dụng đất/thuê đất) áp dụng cho hồ sơ.
5. **Tax Notice Tracking Status (`Trạng thái theo dõi thông báo thuế`):** Thẻ trạng thái quản lý việc tiếp nhận thông báo thuế (`Awaiting Tax Notice`, `Tax Notice Received`, `Discrepancy Detected`).
6. **Payment Evidence Tracking Status (`Trạng thái theo dõi chứng từ nộp tiền`):** Thẻ trạng thái quản lý chứng từ nộp tiền của công dân (`Awaiting Payment`, `Payment Uploaded`, `Verified by Officer`).
7. **Risk Warning (`Cảnh báo rủi ro nghiệp vụ`):** Thẻ cảnh báo làm nổi bật các bất thường (Ví dụ: *"Cảnh báo: Thời điểm sử dụng đất trước 1993 nhưng thiếu xác nhận của UBND cấp xã"* hoặc *"Cảnh báo: Số tiền trên biên lai nộp tiền thấp hơn số trên Thông báo thuế"*).
8. **Officer Review Note (`Ghi chú rà soát của cán bộ`):** Trường văn bản lưu lại ý kiến thẩm định chuyên môn của cán bộ thụ lý và ý kiến phê chuẩn của Lãnh đạo.

---

## 5. Required Warnings

Toàn bộ các bảng hiển thị kết quả, tài liệu chiết tính dự kiến và báo cáo xuất ra từ Module "Hỗ trợ nghĩa vụ tài chính" đều **bắt buộc phải hiển thị rõ ràng 4 cụm từ cảnh báo pháp lý (`Mandatory Warning Labels`)** sau:

1. **`DỰ KIẾN`** &mdash; *(Khẳng định mọi con số tính toán trong module chỉ là con số dự kiến, chưa phải số phải nộp chính thức).*
2. **`CÁN BỘ PHẢI KIỂM TRA`** &mdash; *(Khẳng định trách nhiệm kiểm tra, đối chiếu căn cứ pháp lý và hồ sơ thực tế thuộc về cán bộ chuyên môn thụ lý).*
3. **`KHÔNG THAY THẾ CƠ QUAN THUẾ`** &mdash; *(Khẳng định kết quả của module không có giá trị thay thế kết luận, quyết định hay thông báo của Cơ quan Thuế có thẩm quyền).*
4. **`KHÔNG PHẢI THÔNG BÁO NỘP TIỀN`** &mdash; *(Khẳng định phiếu tổng hợp dự kiến không được dùng làm thông báo yêu cầu công dân nộp tiền vào kho bạc).*
