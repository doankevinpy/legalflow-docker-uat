# Land Analytics Planning & Data Audit Report

**Phase**: 10.0A — Land Analytics Planning & Data Audit  
**Status**: Planning & Audit Complete (No code modifications, no migrations)  
**Date**: 2026-06-02  
**Wording Standard Compliance**: Strictly using neutral terms like `risk indicator`, `dấu hiệu cần rà soát`, `chỉ báo bất thường`, `khuyến nghị kiểm tra`, `cần xác minh thêm`. Fully avoiding accusatory language.

---

## 1. Scope & Objectives (Phạm vi & Mục tiêu)

* **Mục tiêu chính:** Phân tích dữ liệu đất đai, xây dựng báo cáo đối chiếu dữ liệu giữa các nhóm hồ sơ để chuẩn bị cho sự phát triển của module Phân tích Đất đai (Land Analytics).
* **So sánh trọng tâm:** Phân tích sự khác biệt giữa nhóm hồ sơ đất đai đã được giải quyết/đủ điều kiện và nhóm hồ sơ bị từ chối/chuyển trả/có khiếu nại, tố cáo, phản ánh đi kèm.
* **Quy tắc an toàn:**
  * Chỉ sử dụng dữ liệu giả lập (mock data), không sử dụng dữ liệu thật của công dân.
  * Không thực hiện database migration hoặc sửa đổi cấu trúc schema trong phase này.
  * Không thay đổi mã nguồn ở cả frontend và backend.
  * **Cảnh báo quan trọng:** Các chỉ báo rủi ro (risk indicators) chỉ là công cụ hỗ trợ lọc quy trình nghiệp vụ để nâng cao chất lượng dịch vụ hành chính công. Hệ thống tuyệt đối không tự động kết luận sai phạm cá nhân, hành vi cố ý làm sai, tham nhũng hoặc bất kỳ hành động vi phạm pháp luật nào của cán bộ thụ lý.

---

## 2. Kết quả kiểm toán Schema hiện tại (Data Audit)

Đã đối chiếu model `LegalCase` trong [schema.prisma](file:///C:/Users/Admin/.gemini/antigravity/scratch/LegalFlow/legalflow-backend/prisma/schema.prisma) đối với các trường thông tin cần thiết:

### A. Fields already available (Các trường đã có sẵn)
1. `field` (Kiểu enum `CaseField`: `DAT_DAI`, `DAN_SU`, `LAO_DONG`, v.v.) -> Có sẵn để lọc các vụ việc thuộc mảng Đất đai (`DAT_DAI`).
2. `neighborhood` (Kiểu enum `Neighborhood`: `KP1`, `KP2`, `KP3`, `KP4`, `KP5`, `KHAC`) -> Có sẵn để thống kê phân bố theo địa bàn khu phố.
3. `createdById` (Kiểu `String` trỏ tới `User`) -> Có sẵn để lưu người tạo hồ sơ.

### B. Fields partially available (Các trường đã có một phần / khác tên)
1. `caseType` -> Hiện tại có sẵn dưới dạng trường `type` (Kiểu enum `CaseType`: `KN` (Khiếu nại), `TC` (Tố cáo), `KNG` (Kiến nghị), `PA` (Phản ánh), `TVPL` (Tư vấn pháp luật), `KHAC`).
2. `assignedOfficerId` -> Hiện tại có sẵn dưới dạng trường `assignedToId` (Kiểu `String` trỏ tới `User` được phân công thụ lý).

### C. Fields missing (Các trường còn thiếu hoàn toàn)
1. `landType`: Loại đất liên quan (Đất ở, Đất nông nghiệp, Đất rừng, Đất sản xuất kinh doanh, v.v.).
2. `currentLandUseType` & `requestedLandUseType`: Loại mục đích sử dụng đất hiện tại và loại mục đích xin chuyển đổi (dùng cho thủ tục chuyển mục đích sử dụng đất).
3. `area`: Diện tích thửa đất liên quan (m²).
4. `planningStatus`: Tình trạng quy hoạch của thửa đất (Trong vùng quy hoạch, Ngoài vùng quy hoạch).
5. `disputeStatus`: Tình trạng tranh chấp đất đai (Đang tranh chấp, Không tranh chấp).
6. `documentCompleteness`: Đánh giá tính đầy đủ của hồ sơ giấy tờ đầu vào (Đủ hồ sơ, Thiếu hồ sơ).
7. `financialObligationStatus`: Trạng thái thực hiện nghĩa vụ tài chính/thuế đất của người dân (Hoàn thành, Chưa hoàn thành, Được miễn giảm).
8. `outcome`: Kết quả giải quyết cuối cùng khi hồ sơ đóng (Chấp thuận/Đủ điều kiện, Từ chối/Không đủ điều kiện, Chuyển trả bổ sung).
9. `reasonCode`: Mã lý do (đặc biệt cần thiết cho các trường hợp chuyển trả hoặc từ chối để đối chiếu thống kê).
10. `complaintFlag` & `complaintType`: Đánh dấu hồ sơ đất đai gốc có phát sinh khiếu nại/tố cáo/phản ánh liên quan sau đó hay không.
11. `processingDays` & `overdueDays`: Số ngày xử lý thực tế và số ngày trễ hạn của hồ sơ (hiện tại hệ thống chỉ có `receivedDate` và `deadline` dạng DateTime nên cần tính toán động).

### D. Fields recommended for Phase 10.0B
Đề xuất trong Phase 10.0B sẽ tạo một bảng phụ tên là `LandProfile` liên kết `1-to-1` với `LegalCase` để lưu trữ các thông tin chuyên sâu về đất đai mà không làm phình to bảng vụ việc chung.

---

## 3. Trạng thái Module Analytics & RBAC hiện tại

### A. Phân tích Module Analytics hiện tại
* **Chức năng hiện có:** Hệ thống có dịch vụ `AnalyticsService` cung cấp thống kê số lượng hồ sơ chung, phân bố hồ sơ theo khu phố (`getByNeighborhood`), theo lĩnh vực (`getByField`), bảng thống kê chéo khu phố x lĩnh vực (`getCrossTab`), và một số nhận định sơ bộ mang tính suy diễn giả thuyết (`getSocialInsights`).
* **Các Endpoint hiện có:**
  * `GET /api/analytics/overview`
  * `GET /api/analytics/by-neighborhood`
  * `GET /api/analytics/by-field`
  * `GET /api/analytics/cross-tab`
  * `GET /api/analytics/social-insights`
* **Biểu đồ/Bảng hiện có:** Hệ thống trả về dữ liệu JSON mô tả số lượng hồ sơ. Frontend sử dụng dữ liệu này để vẽ biểu đồ phân bố và bảng số liệu thô.
* **Giới hạn dữ liệu:** Chưa hỗ trợ phân tích chuyên sâu về thuộc tính đất đai (loại đất, diện tích, kết quả chấp thuận/từ chối, nghĩa vụ tài chính). Chưa có các bộ lọc hoặc bảng hiển thị dành cho dấu hiệu rà soát rủi ro quy trình.

### B. Quyền hạn truy cập hiện tại (RBAC)
* Các endpoint của Analytics hiện tại được bảo vệ bởi `@Roles(Role.ADMIN, Role.MANAGER)`. Người dùng có vai trò `STAFF` hoặc `VIEWER` không thể tiếp cận các endpoint này.

### C. Đề xuất phân quyền & Bảo vệ quyền riêng tư (RBAC & Privacy) cho Phase 10.0B
Để đảm bảo an toàn thông tin và giám sát quy trình nghiệp vụ đúng đắn:
1. **Quyền hạn truy cập:**
   * **ADMIN:** Xem toàn bộ dashboard analytics, danh sách dấu hiệu rà soát. Được phép xem đầy đủ PII (Thông tin cá nhân công dân) của hồ sơ đất đai và thực hiện export dữ liệu (hành động này bắt buộc phải ghi Audit Log).
   * **MANAGER:** Xem toàn bộ dashboard analytics và danh sách dấu hiệu rà soát. Tuy nhiên, thông tin PII của công dân mặc định bị che một phần (masking) trên giao diện.
   * **STAFF:** Không được phép truy cập dashboard analytics tổng hợp của đơn vị hoặc xem thống kê hiệu suất/dấu hiệu rà soát của các cán bộ khác. Chỉ được truy cập dashboard hiệu suất cá nhân để tự quản lý workload của mình.
   * **VIEWER:** Hoàn toàn không được phép truy cập bất kỳ tính năng analytics nào.
2. **Ẩn thông tin cá nhân (PII Masking):** 
   * Mặc định, tên công dân (`senderName`) và thông tin liên hệ (`contact`) phải được ẩn một phần trên dashboard (Ví dụ: `Nguyễn Văn A` -> `Ng*** V*** A`, `090xxxxxxx` -> `090****xxx`).
   * Xem tên thật chi tiết yêu cầu người dùng có quyền `ADMIN` và hệ thống tự động lưu vết sự kiện truy cập.

---

## 4. Hệ thống Audit Log hiện tại

### A. Kiểm tra trạng thái hiện hành
Đã kiểm tra `AdminAuditLogsService`. Hiện tại hệ thống ghi log cho các hoạt động:
* Đăng nhập (`LOGIN`), Đăng xuất (`LOGOUT`), Làm mới token (`REFRESH_TOKEN`).
* Quản lý tài khoản (`CREATE_USER`, `UPDATE_USER_ROLE`, `TOGGLE_USER_STATUS`, `CHANGE_PASSWORD`).
* **Chưa ghi nhận:** Nhật ký khi người dùng truy cập xem chi tiết dữ liệu công dân, xuất báo cáo analytics, xem danh sách chỉ báo rủi ro của cán bộ, lọc theo công dân hoặc cán bộ, tải tệp tin đính kèm.

### B. Đề xuất các sự kiện kiểm toán (Audit Events) cho Phase 10.0B/10.0C
Cần bổ sung ghi nhận các sự kiện sau vào bảng `AdminAuditLog`:
1. `VIEW_CITIZEN_CASE`: Ghi lại khi tài khoản xem thông tin chi tiết một vụ việc chứa dữ liệu PII của người dân.
2. `EXPORT_LAND_ANALYTICS`: Ghi lại khi Admin thực hiện xuất dữ liệu phân tích đất đai ra tệp tin ngoài (CSV/Excel).
3. `ACCESS_RISK_DASHBOARD`: Ghi lại khi Admin/Manager truy cập xem bảng chỉ báo bất thường.
4. `DOWNLOAD_CASE_DOCUMENT`: Ghi lại khi có người tải các tài liệu đính kèm của hồ sơ đất đai.

---

## 5. Đánh giá & Thiết kế Mock Data

### A. Trạng thái Mock Data hiện tại
* **Đánh giá:** **Chưa đáp ứng được yêu cầu demo Land Analytics.**
* Bộ seed dữ liệu hiện tại chỉ tạo ra 30 hồ sơ mock chung chung, thiếu toàn bộ các trường nghiệp vụ đất đai thực tế như loại đất, diện tích, trạng thái quy hoạch, trạng thái tranh chấp, kết quả xử lý và nghĩa vụ tài chính.

### B. Đề xuất Seed Strategy mới cho Phase 10.0B
Đề xuất bổ sung mock data mô phỏng chuyên biệt cho lĩnh vực đất đai với các thuộc tính:
* **Quy mô:** Seed từ **50 đến 100 hồ sơ đất đai giả lập**, tuyệt đối không sử dụng thông tin của người dân thực tế.
* **Tỷ lệ phân bổ trạng thái rủi ro an toàn để demo:**
  * **60% Hồ sơ đã giải quyết xong / Đủ điều kiện (Resolved/Approved):** Các hồ sơ hoàn thành thủ tục đúng thời hạn, đầy đủ nghĩa vụ tài chính và giấy tờ.
  * **25% Hồ sơ bị chuyển trả / Không đủ điều kiện (Returned/Ineligible):** Hồ sơ không khớp quy hoạch hoặc thiếu căn cứ pháp lý được xử lý chuyển trả hoặc từ chối rõ lý do.
  * **10% Hồ sơ cần bổ sung tài liệu / Đang xử lý (Supplement Requested / Pending):** Hồ sơ đang trong quy trình chờ phản hồi từ người dân.
  * **5% Hồ sơ phát sinh khiếu nại, phản ánh đi kèm (Complaint/Appeal Related):**
    * *Quy chuẩn an toàn:* Đây hoàn toàn là dữ liệu mô phỏng giả lập, không sử dụng tên của công dân hoặc cán bộ thật, nội dung phản ánh được viết dưới dạng tóm tắt nghiệp vụ chung chung, không chứa các tình tiết tố cáo hoặc quy kết vi phạm pháp luật thực tế.

---

## 6. Đề xuất Nội dung Phân tích & Dashboard

Để hỗ trợ kiểm soát chất lượng quy trình hành chính đất đai hiệu quả, hệ thống đề xuất các phân tích sau:

### 1. Dashboard tổng quan đất đai
* Biểu đồ tỷ lệ phân bổ hồ sơ đất đai theo từng loại thủ tục (cấp giấy chứng nhận, chuyển mục đích sử dụng đất, v.v.).
* Biểu đồ tròn thể hiện tỷ lệ hồ sơ theo loại đất (Đất nông nghiệp, đất ở, đất rừng).

### 2. So sánh nhóm giải quyết thành công (Resolved) và nhóm bị chuyển trả/từ chối (Returned/Ineligible)
* Đối sánh diện tích trung bình của thửa đất trong hai nhóm để phát hiện sự tập trung của hồ sơ.
* So sánh phân bố tỷ lệ loại đất và tình trạng quy hoạch để nhận diện các điểm nghẽn phổ biến nhất gây ra chuyển trả hồ sơ.

### 3. Bảng xếp hạng Khu phố (Neighborhood Ranking)
* Top địa bàn có số lượng hồ sơ được giải quyết nhiều nhất / ít nhất.
* Địa bàn có tỷ lệ hồ sơ bị chuyển trả bổ sung cao nhất.
* Địa bàn phát sinh nhiều chỉ báo bất thường cần rà soát hoặc phản ánh cao nhất để ưu tiên rà soát thực tế quy hoạch địa phương.

### 4. Báo cáo phân tích hiệu suất thụ lý hồ sơ (Cán bộ xử lý)
* **Workload:** Số lượng hồ sơ đang mở gán cho từng cán bộ.
* **Average processing days:** Thời gian xử lý trung bình tính từ ngày tiếp nhận đến ngày đóng hồ sơ.
* **Return rate:** Tỷ lệ hồ sơ bị chuyển trả/từ chối trên tổng số hồ sơ được giao.
* **Complaint-after-handled rate:** Tỷ lệ hồ sơ phát sinh khiếu nại hoặc phản ánh sau khi cán bộ đã hoàn thành giải quyết.
* **Overdue rate:** Tỷ lệ hồ sơ bị trễ hạn so với ngày hẹn trả kết quả quy định.
* **Risk indicator count:** Số lượng các chỉ báo bất thường được kích hoạt liên quan đến các hồ sơ cán bộ đó thụ lý.
* *Lưu ý: Báo cáo này phục vụ mục đích phân bổ lại tải công việc và phát hiện các nút thắt quy trình của đơn vị, hoàn toàn không suy diễn hành vi tiêu cực của cá nhân cán bộ.*

### 5. Phân tích hồ sơ tương đồng (Similarity Analysis)
* Phát hiện và liệt kê các hồ sơ có cùng tính chất thửa đất (cùng khu phố, cùng diện tích, cùng loại đất, cùng trạng thái quy hoạch và tranh chấp) nhưng nhận được kết quả giải quyết khác nhau (một hồ sơ được `Chấp thuận`, hồ sơ khác lại bị `Từ chối` hoặc `Chuyển trả`). Những hồ sơ này sẽ được xếp vào danh sách "cần rà soát tính nhất quán" (inconsistent outcome candidates).

### 6. Phân tích người nộp hồ sơ (Citizen Analysis)
* Chỉ thống kê tổng hợp tần suất nộp hồ sơ, không hiển thị trực tiếp danh tính.
* Thông tin PII của người dân luôn được ẩn (masked) mặc định. Việc hiển thị thông tin gốc chỉ được cấp quyền cho Admin và có log ghi nhận lý do công vụ cụ thể.

---

## 7. Thiết kế Quy tắc Chỉ báo Rủi ro (Risk Indicator Rules)

Hệ thống đề xuất sử dụng công cụ lọc dựa trên quy tắc (Rule-based Engine) để xác định các hồ sơ có dấu hiệu cần rà soát nghiệp vụ. Dưới đây là 5 nhóm quy tắc được thiết kế:

### Quy tắc 1: Kết quả xử lý không nhất quán (Inconsistent Outcomes)
* **Severity (Mức độ cảnh báo):** **Medium**
* **Reason (Lý do kích hoạt):** Phát hiện hồ sơ đất đai có các thông số đặc trưng tương đồng với các hồ sơ khác nhưng kết quả đầu ra trái ngược nhau mà không có lý do giải trình rõ ràng.
* **Evidence fields (Các trường bằng chứng):** `neighborhood`, `landType`, `area`, `planningStatus`, `disputeStatus`, `outcome`, `reasonCode`.
* **Comparison baseline (Cơ sở đối chiếu):** Tỷ lệ kết quả phổ biến của nhóm hồ sơ có cùng đặc tính trong vòng 12 tháng qua.
* **Suggested review action (Khuyến nghị kiểm tra):** Khuyến nghị bộ phận chuyên môn kiểm tra lại biên bản thẩm định của hồ sơ để xác nhận tính đồng nhất trong việc áp dụng quy định pháp luật.
* **Disclaimer:** Chỉ báo bất thường này nhằm đảm bảo tính đồng đều của dịch vụ công, không tự động kết luận sai phạm cá nhân của cán bộ thụ lý.

### Quy tắc 2: Tỷ lệ chuyển trả của cán bộ cao bất thường
* **Severity (Mức độ cảnh báo):** **Medium**
* **Reason (Lý do kích hoạt):** Tỷ lệ hồ sơ bị chuyển trả hoặc từ chối của một cán bộ vượt mức trung bình của phòng ban một khoảng đáng kể (ví dụ: lớn hơn 1.5 lần mức trung bình của nhóm).
* **Evidence fields (Các trường bằng chứng):** `assignedToId`, `outcome`, `returnRate`, `peerAverageReturnRate`.
* **Comparison baseline (Cơ sở đối chiếu):** Tỷ lệ chuyển trả trung bình của các cán bộ cùng xử lý một loại hồ sơ đất đai trong cùng thời kỳ.
* **Suggested review action (Khuyến nghị kiểm tra):** Khuyến nghị kiểm tra xem cán bộ có đang được giao các vụ việc phức tạp hơn hoặc cần bổ sung hướng dẫn nghiệp vụ/mẫu hồ sơ cho người dân tại khâu tiếp nhận hay không.
* **Disclaimer:** Đây là chỉ báo rà soát chất lượng quy trình tiếp nhận thông tin, không đại diện cho bất kỳ kết luận tiêu cực hay hành vi gây khó khăn cho người dân của cán bộ.

### Quy tắc 3: Địa bàn có tỷ lệ chuyển trả hoặc khiếu nại vượt ngưỡng
* **Severity (Mức độ cảnh báo):** **High**
* **Reason (Lý do kích hoạt):** Số lượng đơn khiếu nại hoặc hồ sơ đất đai bị chuyển trả tập trung bất thường tại một khu phố cụ thể, vượt quá ngưỡng an toàn hệ thống (ví dụ: > 30% tổng số hồ sơ của khu phố đó).
* **Evidence fields (Các trường bằng chứng):** `neighborhood`, `complaintFlag`, `outcome`, `complaintRate`.
* **Comparison baseline (Cơ sở đối chiếu):** Tỷ lệ khiếu nại và chuyển trả trung bình của toàn huyện/xã.
* **Suggested review action (Khuyến nghị kiểm tra):** Khuyến nghị tổ chức rà soát thực tế quy hoạch hoặc đo đạc địa chính tại khu vực để làm rõ các vướng mắc chung mà người dân đang gặp phải.
* **Disclaimer:** Chỉ báo này phản ánh tính chất phức tạp của địa bàn dân cư, không kết luận vi phạm của cá nhân hay tập thể cán bộ quản lý địa bàn.

### Quy tắc 4: Hồ sơ giữ lâu rồi chuyển trả hoặc quá hạn kéo dài
* **Severity (Mức độ cảnh báo):** **Critical**
* **Reason (Lý do kích hoạt):** Hồ sơ bị lưu giữ trong trạng thái xử lý vượt quá thời gian quy định (`processingDays > 45 ngày`) nhưng cuối cùng lại ra kết quả `Chuyển trả/Từ chối`, hoặc hồ sơ đang mở đã quá hạn trả kết quả trên 30 ngày mà không có CaseNote ghi nhận cập nhật tiến độ.
* **Evidence fields (Các trường bằng chứng):** `processingDays`, `overdueDays`, `outcome`, `lastNoteCreatedAt`.
* **Comparison baseline (Cơ sở đối chiếu):** Quy chuẩn thời hạn giải quyết thủ tục hành chính đất đai theo quy định pháp luật (thường là 15-30 ngày tùy loại hồ sơ).
* **Suggested review action (Khuyến nghị kiểm tra):** Cần xác minh thêm nguyên nhân ách tắc ở các bước trung gian (ví dụ: chờ xác minh thực địa, chờ người dân thực hiện nghĩa vụ thuế) để đẩy nhanh tiến độ trả kết quả.
* **Disclaimer:** Chỉ báo bất thường hỗ trợ cải tiến hiệu quả xử lý hồ sơ hành chính, không đại diện cho hành vi cố ý trì hoãn hay tiêu cực của cán bộ.

### Quy tắc 5: Hồ sơ thiếu mã lý do hoặc thiếu căn cứ xử lý
* **Severity (Mức độ cảnh báo):** **High**
* **Reason (Lý do kích hoạt):** Hồ sơ kết thúc bằng việc `Chuyển trả` hoặc `Từ chối` nhưng trường `reasonCode` bị để trống hoặc không có ghi nhận cụ thể lý do trong lịch sử thay đổi trạng thái.
* **Evidence fields (Các trường bằng chứng):** `outcome`, `reasonCode`, `notesCount`, `histories`.
* **Comparison baseline (Cơ sở đối chiếu):** Yêu cầu bắt buộc của quy trình nghiệp vụ: mọi hồ sơ trả lại hoặc từ chối phải đính kèm lý do bằng văn bản hoặc mã lý do quy chuẩn.
* **Suggested review action (Khuyến nghị kiểm tra):** Yêu cầu cán bộ phụ trách cập nhật bổ sung lý do chuyển trả để hoàn thiện dữ liệu số hóa của hồ sơ.
* **Disclaimer:** Chỉ báo rà soát chất lượng cập nhật dữ liệu nghiệp vụ của hệ thống, không kết luận sai phạm cá nhân.

---

## 8. Đề xuất Kế hoạch Cơ sở dữ liệu cho Phase 10.0B

Để chuẩn bị lưu trữ dữ liệu bổ sung mà không ảnh hưởng tới vận hành của Phase 10.0A:
1. **Thiết kế bảng `LandProfile` đề xuất:**
   Bảng này sẽ chứa toàn bộ các trường dữ liệu thiếu liên quan tới thuộc tính thửa đất và kết quả giải quyết.
2. **Kế hoạch Migration:** Sẽ được thực thi dưới dạng một migration độc lập trong Phase 10.0B. Tuyệt đối không thay đổi schema ở Phase 10.0A hiện tại.
