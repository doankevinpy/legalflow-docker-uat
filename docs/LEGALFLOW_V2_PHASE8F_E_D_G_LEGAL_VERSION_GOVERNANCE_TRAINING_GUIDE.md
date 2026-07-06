# LEGALFLOW V2 - PHASE 8F-E-D-G

# LEGAL VERSION GOVERNANCE TRAINING GUIDE

**Ngày phát hành:** 06/07/2026  
**Mô-đun:** Quản trị Phiên bản Pháp lý & Kiểm toán (Legal Knowledge Version Governance & Audit Track)  
**Trạng thái:** ĐÃ HOÀN THÀNH (100% Standard Training & User Guide)  

---

## 1. Purpose

Tài liệu này là **Cẩm nang Đào tạo và Hướng dẫn Sử dụng chuẩn hóa (Training Guide)** dành cho Cán bộ nghiệp vụ và Lãnh đạo cơ quan trong việc khai thác, vận hành và quản trị mô-đun **Quản trị Phiên bản Pháp lý (Legal Knowledge Version Governance)** thuộc hệ thống LegalFlow V2.

Mục tiêu của cẩm nang là trang bị kiến thức nền tảng về cấu trúc tri thức pháp lý số, hướng dẫn thao tác chi tiết từng bước trên giao diện (Step-by-Step), quán triệt sâu sắc các quy tắc an toàn **Human-in-the-Loop**, và cung cấp kịch bản thực hành thực tế để đội ngũ cán bộ tự tin làm chủ công nghệ, nâng cao chất lượng thẩm tra hồ sơ thủ tục hành chính (TTHC) về đất đai.

---

## 2. Intended Users

Tài liệu đào tạo được thiết kế phù hợp với 04 nhóm đối tượng sử dụng trọng tâm trong cơ quan hành chính nhà nước:

1. **Lãnh đạo cơ quan (`ADMIN` / `MANAGER`)**: Người giữ thẩm quyền phê duyệt cập nhật pháp lý, ra quyết định ban hành/kích hoạt phiên bản mới và điều hành hoàn tác khẩn cấp khi cần thiết.
2. **Cán bộ phụ trách pháp chế / TTHC (`STAFF` / `MANAGER`)**: Chuyên viên theo dõi sự biến động của pháp luật, thực hiện rà soát tác động, tạo bản thảo (Draft) và chạy thử nghiệm (Simulation) trước khi trình Lãnh đạo.
3. **Cán bộ tiếp nhận & xử lý hồ sơ tại Bộ phận Một cửa / Phòng chuyên môn (`STAFF`)**: Người trực tiếp sử dụng kết quả thẩm tra AI trên từng hồ sơ TTHC, chịu trách nhiệm kiểm tra, đối chiếu gợi ý AI với quy định pháp luật hiện hành.
4. **Người xem / Cán bộ thanh tra, kiểm toán nội bộ (`VIEWER`)**: Nhóm giám sát tuân thủ, sử dụng hệ thống để tra cứu lịch sử rà soát, kiểm tra dấu vết kiểm toán (Audit Trail) và đọc các bảng hậu kiểm chỉ đọc.

---

## 3. Core Concepts

Để sử dụng thành thạo hệ thống, Cán bộ và Lãnh đạo cần nắm vững 15 khái niệm cốt lõi được định nghĩa bằng ngôn ngữ ngữ cảnh nghiệp vụ dễ hiểu:

1. **`LegalDocument` (Văn bản pháp luật)**: Là các văn bản quy phạm pháp luật gốc (Luật, Nghị định, Thông tư, Quyết định) được số hóa vào hệ thống kèm thông số hiệu lực.
2. **`LegalUpdateLog` (Nhật ký cập nhật pháp lý)**: Là "hồ sơ làm việc trung tâm" theo dõi toàn bộ quá trình xử lý một sự kiện pháp lý mới ban hành, từ lúc phát hiện đến khi kích hoạt áp dụng.
3. **`ProcedureTypeVersion` (Phiên bản thủ tục)**: Cấu hình chi tiết của một thủ tục hành chính (thời gian áp dụng, căn cứ pháp lý, danh mục giấy tờ yêu cầu) tại một thời kỳ pháp lý nhất định.
4. **`AiPromptVersion` (Phiên bản Prompt AI)**: Bộ chỉ dẫn và quy tắc nghiệp vụ "dạy" AI cách thẩm tra hồ sơ TTHC, được chuẩn hóa theo đúng quy định luật pháp của từng giai đoạn.
5. **`ChecklistVersion` (Phiên bản Checklist)**: Danh mục các tiêu chí kiểm tra tính hợp lệ của giấy tờ mà chuyên viên và AI sử dụng để đối chiếu hồ sơ.
6. **`Draft version` (Phiên bản nháp - `DRAFT`)**: Bản dự thảo của Thủ tục, Prompt hoặc Checklist đang trong quá trình xây dựng, rà soát và kiểm thử; **chưa áp dụng** cho hồ sơ thực tế.
7. **`ACTIVE` (Trạng thái đang hiệu lực)**: Phiên bản chính thức duy nhất đang được hệ thống áp dụng để thẩm tra và giải quyết các hồ sơ TTHC hiện tại.
8. **`REPLACED` (Trạng thái đã bị thay thế)**: Phiên bản cũ từng có hiệu lực trong quá khứ nhưng nay đã được thay thế bởi bản mới hơn (được lưu trữ để tra cứu lịch sử).
9. **`DRAFT` (Trạng thái dự thảo)**: Tình trạng của văn bản hoặc phiên bản đang chờ rà soát, thẩm định.
10. **`Simulation / Shadow Testing` (Kiểm thử song song / Mô phỏng)**: Tính năng cho phép chạy thử bản nháp trên các hồ sơ thực tế cũ để xem AI đánh giá ra sao mà không làm sai lệch dữ liệu hồ sơ.
11. **`Activation` (Kích hoạt phiên bản)**: Thao tác chính thức đưa bản nháp (`DRAFT`) vào áp dụng (`ACTIVE`) và chuyển bản cũ sang lịch sử (`REPLACED`).
12. **`Rollback` (Hoàn tác phiên bản)**: Thao tác khẩn cấp lùi hệ thống về phiên bản cũ (`REPLACED` $\rightarrow$ `ACTIVE`) khi phát hiện bản mới ban hành có sai sót nghiệp vụ.
13. **`Verification` (Kiểm chứng / Hậu kiểm)**: Công cụ rà soát tự động của hệ thống giúp Lãnh đạo kiểm tra CSDL có khỏe mạnh, an toàn và đúng trạng thái hay không.
14. **`Audit trail` (Dấu vết kiểm toán)**: Nhật ký ghi lại bất biến từng giây, từng thao tác "Ai đã làm gì, vào lúc nào, lý do là gì" trong hệ thống phục vụ thanh tra.
15. **`Legal snapshot` (Bản chụp căn cứ pháp lý)**: Cơ chế đóng băng và lưu lại chính xác phiên bản luật nào đã được dùng để kiểm tra một hồ sơ TTHC tại thời điểm nộp, bảo đảm không bị ảnh hưởng khi luật sau này thay đổi.

---

## 4. Human-in-the-loop Rules

Khi làm việc với LegalFlow V2, toàn thể Cán bộ và Lãnh đạo cơ quan phải khắc cốt ghi tâm 4 nguyên tắc vàng về an toàn trí tuệ nhân tạo (**Human-in-the-Loop Rules**):

- **1. AI chỉ hỗ trợ (AI Assistance Only)**: Trí tuệ nhân tạo là công cụ trợ lý siêu tốc giúp tổng hợp thông tin, chỉ ra rủi ro và gợi ý rà soát; AI tuyệt đối không phải là chủ thể quyền lực hành chính.
- **2. Cán bộ phải kiểm tra (Human Verification Required)**: Mọi phân tích tác động, điểm tin cậy hay kết quả mô phỏng của AI đều phải được chuyên viên nghiệp vụ rà soát, kiểm chứng bằng trình độ và kinh nghiệm pháp lý thực tế.
- **3. Không dùng AI thay thế kết luận pháp lý**: Quyết định chấp nhận hay từ chối hồ sơ TTHC, quyết định ban hành hay hoàn tác phiên bản pháp lý luôn là quyền hạn và trách nhiệm pháp lý của Cán bộ thụ lý và Lãnh đạo cơ quan có thẩm quyền.
- **4. Cảnh báo pháp lý bắt buộc**: Cán bộ phải ghi nhớ lời nhắc nhở in đậm xuất hiện trên mọi giao diện và phiếu rà soát của hệ thống:
  > **⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA:** Căn cứ pháp lý hiển thị là phiên bản dữ liệu hệ thống ghi nhận tại thời điểm AI rà soát; cán bộ phải kiểm tra văn bản pháp luật hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ địa phương tại thời điểm xử lý hồ sơ.

---

## 5. How to Review a Legal Update

Quy trình rà soát một sự kiện cập nhật pháp lý mới (Review Workflow) dành cho Cán bộ nghiệp vụ và Lãnh đạo:

1. **Mở Kho căn cứ pháp lý**: Đăng nhập hệ thống, từ menu chính chọn mô-đun **Kho Kiến thức Pháp lý (Legal Knowledge)**.
2. **Vào Nhật ký cập nhật**: Bấm chọn **Tab 6 - Nhật ký cập nhật (Update Logs)** để xem danh sách các biến động chính sách đang chờ xử lý.
3. **Mở chi tiết log**: Bấm vào một dòng nhật ký (ví dụ: log về Luật Đất đai sửa đổi) để mở cửa sổ chi tiết Nhật ký cập nhật pháp lý.
4. **Đọc phân tích tác động**: Kiểm tra kỹ mục **Phân tích tác động (Impact Analysis)** do AI gợi ý để xem những thủ tục nào tại địa phương bị ảnh hưởng.
5. **Bắt đầu rà soát & Thêm ý kiến**: 
   - Bấm nút **"Bắt đầu rà soát"** (`START_REVIEW`) để chuyển trạng thái sang Đang rà soát.
   - Nhập ý kiến đánh giá nghiệp vụ vào ô trống và bấm **"Thêm ý kiến rà soát"** (`ADD_NOTE`). Ý kiến sẽ được ghi nhận liền mạch trên dòng thời gian workflow.
6. **Yêu cầu bổ sung (Nếu cần)**: Nếu thông tin chưa rõ ràng, Lãnh đạo hoặc Chuyên viên bấm **"Yêu cầu làm rõ"** (`REQUEST_MORE_INFO`) để giao nhiệm vụ bổ sung tài liệu.
7. **Duyệt để tạo version**: Khi toàn bộ nội dung đã chuẩn xác, Lãnh đạo (`ADMIN`/`MANAGER`) bấm nút màu xanh **"Duyệt tạo version"** (`APPROVE_FOR_VERSIONING`). Nhật ký chính thức chuyển sang trạng thái Đã phê duyệt (`APPROVED`), mở khóa các tính năng tạo bản nháp.

---

## 6. How to Create Draft Version

Sau khi nhật ký pháp lý đã được phê duyệt, Cán bộ tiến hành tạo các bản thảo phiên bản mới:

1. **Chọn log APPROVED**: Tại Tab 6, mở chi tiết một nhật ký đang có trạng thái màu xanh lá **`APPROVED`**.
2. **Bấm tạo draft**: Cuộn xuống khu vực **Phiên bản dự thảo (Draft Versions)**, bấm nút **"Khởi tạo bản nháp mới"** (`CREATE DRAFT`).
3. **Chọn loại draft**: Trong cửa sổ hiện ra, tích chọn các đối tượng cần nhân bản sang dự thảo:
   - *Phiên bản thủ tục (`ProcedureTypeVersion`)*: Để sửa đổi điều kiện, thời gian giải quyết.
   - *Phiên bản Prompt AI (`AiPromptVersion`)*: Để cập nhật lời dặn rà soát luật mới cho AI.
   - *Phiên bản Checklist (`ChecklistVersion`)*: Để thêm/bớt giấy tờ yêu cầu theo quy định mới.
4. **Nhập lý do**: Nhập ghi chú giải thích căn cứ tạo bản nháp (ví dụ: *Tạo bản nháp theo Nghị định 102/2024/NĐ-CP*) và bấm xác nhận.
5. **Kiểm tra draft status**: Quan sát màn hình, xác nhận hệ thống đã tạo thành công các mã ID mới kèm huy hiệu trạng thái **`DRAFT`** màu cam nhạt.

---

## 7. How to Run Draft Simulation

Trước khi trình Lãnh đạo kích hoạt bản nháp, Cán bộ phải thực hiện kiểm thử song song (Shadow Testing) để đo lường chất lượng:

1. **Mở Modal Simulation**: Tại chi tiết nhật ký `APPROVED` đã có bản nháp, bấm nút **"Chạy kiểm thử bản nháp (Shadow Testing)"**. Hệ thống mở Modal 10.
2. **Chọn hồ sơ mẫu**: Trong danh sách hồ sơ TTHC cũ của cơ quan, tích chọn từ **01 đến 05 hồ sơ mẫu** tiêu biểu (hồ sơ hợp lệ, hồ sơ thiếu giấy tờ, hồ sơ phức tạp).
3. **Chạy thử**: Bấm nút **"Thực thi mô phỏng AI rà soát"**. Hệ thống sẽ chạy song song AI thẩm tra bằng cả bản đang dùng (`ACTIVE`) và bản nháp (`DRAFT`).
4. **Đọc kết quả**: Kiểm tra bảng đối chiếu chi tiết (Diff Summary):
   - Xem chênh lệch điểm tin cậy (Confidence Score Diff).
   - Đọc kỹ các **Cờ rủi ro đỏ (Risk Flags)** nếu có (ví dụ: *Bản nháp làm giảm điểm tin cậy trên hồ sơ hợp lệ*).
5. **Hiểu bản chất an toàn**: Cán bộ cần hiểu rõ rằng tính năng Simulation **chỉ là mô phỏng ảo trong bộ nhớ**, hoàn toàn không làm thay đổi trạng thái hay kết quả thẩm định thật của các hồ sơ TTHC mẫu. Toàn bộ lịch sử đối chiếu được lưu tự động vào nhật ký để Lãnh đạo xem xét.

---

## 8. How to Activate Version

Khi bản nháp đã được kiểm thử kỹ lưỡng và đạt yêu cầu, Lãnh đạo cơ quan thực hiện ban hành chính thức:

1. **Kiểm tra thẩm quyền**: Chỉ tài khoản Lãnh đạo (`ADMIN` hoặc `MANAGER`) mới nhìn thấy nút màu xanh **"Kích hoạt version chính thức"**. Chuyên viên (`STAFF`) không có quyền này.
2. **Mở Modal Kích hoạt**: Bấm nút Kích hoạt, hệ thống hiển thị Modal 11 với luồng xác nhận 4 bước an toàn.
3. **Kiểm tra chéo (Bước 1 & 2)**: Đọc kỹ thông số phiên bản hiện hành sẽ bị thay thế (`REPLACED`) và phiên bản nháp chuẩn bị có hiệu lực (`ACTIVE`). Rà soát lại kết quả chạy Simulation.
4. **Nhập lý do chỉ đạo (Bước 3)**: Nhập ý kiến chỉ đạo ban hành vào ô ghi chú (bắt buộc không được để trống).
5. **Nhập confirmationText (Bước 4)**: Tại ô xác nhận bảo mật, gõ chính xác chuỗi ký tự viết hoa: **`ACTIVATE VERSION`** (hoặc `TOI XAC NHAN ACTIVATE VERSION`). Nút bấm cuối cùng sẽ chuyển sang màu xanh.
6. **Xác nhận cuối**: Bấm nút **"Xác nhận kích hoạt version"**. Hệ thống thực thi giao dịch nguyên tử trong tích tắc: bản nháp thành chính thức, bản cũ lui về lịch sử.
7. **Chạy kiểm chứng sau kích hoạt**: Ngay khi modal đóng lại, quan sát khối UI viền xanh **Kiểm chứng sau kích hoạt (Read-only Audit Dashboard)**, bấm nút **"Kiểm tra sau kích hoạt"** để bảo đảm hệ thống trả về huy hiệu **`✔ PASS`**.

---

## 9. How to Verify After Activation

Hướng dẫn Lãnh đạo đọc hiểu và xử lý kết quả trên Bảng hậu kiểm chỉ đọc sau khi kích hoạt version:

1. **Bấm kiểm chứng**: Bấm nút **"Kiểm tra sau kích hoạt"** trên panel hậu kiểm. Hệ thống gọi API read-only kiểm tra sâu 7 hạng mục CSDL.
2. **Hiểu ý nghĩa 3 trạng thái**:
   - **`✔ PASS` (Màu xanh lá)**: Tuyệt vời! CSDL hoàn toàn khỏe mạnh. Phiên bản mới đã ACTIVE, bản cũ đã REPLACED, không có sự trùng lặp bản hiệu lực, 100% dữ liệu hồ sơ TTHC cũ được giữ nguyên vẹn.
   - **`⚠ WARNING` (Màu vàng)**: Cảnh báo nhẹ. Trạng thái version trong CSDL đúng chuẩn an toàn, nhưng nhật ký hệ thống bị thiếu thông tin metadata (thường gặp khi kiểm chứng trên các nhật ký cũ tạo từ các phase trước). Hoàn toàn an toàn để tiếp tục vận hành.
   - **`✖ FAIL` (Màu đỏ)**: Bất thường! Có lỗi nghiêm trọng trong CSDL (ví dụ: phát hiện có 02 phiên bản cùng ACTIVE cùng lúc do xung đột mạng, hoặc phiên bản cũ chưa tắt hiệu lực).
3. **Xử lý khi gặp WARNING**: Đọc chi tiết khuyến cáo trên màn hình, xác nhận CSDL vẫn an toàn và ghi chú vào sổ theo dõi kỹ thuật.
4. **Xử lý khi gặp FAIL**: **Lập tức dừng sử dụng thủ tục bị ảnh hưởng**, chụp màn hình lỗi, báo cáo ngay cho Quản trị viên (`ADMIN`) hoặc Đội ngũ kỹ thuật để rà soát CSDL, tuyệt đối không tự ý thao tác tiếp.
5. **Nguyên tắc nghiệp vụ**: Ghi nhớ tính năng Hậu kiểm chỉ là công cụ kiểm tra sức khỏe kỹ thuật của CSDL; **không thể thay thế** việc Cán bộ kiểm tra chuyên môn pháp lý trên từng hồ sơ.

---

## 10. How to Rollback Version

Trong quá trình vận hành, nếu phát hiện phiên bản pháp lý vừa ban hành có sai sót nghiêm trọng (ví dụ: áp dụng sai điều khoản chuyển tiếp), Lãnh đạo thực hiện Hoàn tác khẩn cấp:

1. **Chỉ dùng khi thật sự cần**: Rollback là tính năng ngoại lệ khẩn cấp, không sử dụng như một thao tác thử nghiệm thông thường.
2. **Kiểm tra thẩm quyền & Cảnh báo**: Chỉ Lãnh đạo (`ADMIN`/`MANAGER`) mới có nút đỏ **"Hoàn tác version"**. Đọc kỹ khuyến cáo: *Rollback chỉ đổi trạng thái luật, không làm thay đổi các hồ sơ TTHC hay kết quả thẩm tra AI cũ*.
3. **Đi qua Modal 4 bước**: Bấm nút Hoàn tác để mở Modal 12, lần lượt rà soát kỹ đối tượng sẽ bị hủy hiệu lực (`REPLACED`) và đối tượng sẽ khôi phục hiệu lực (`ACTIVE`).
4. **Nhập lý do rõ ràng**: Tại bước 3, nhập lý do hoàn tác chi tiết, rõ ràng (yêu cầu **tối thiểu 10 ký tự**, ví dụ: *Hoàn tác do Thông tư hướng dẫn bị tạm dừng thi hành*).
5. **Nhập confirmationText**: Tại bước 4, gõ chính xác chuỗi xác nhận bảo mật: **`ROLLBACK VERSION`** (hoặc `TOI XAC NHAN ROLLBACK VERSION`).
6. **Chỉ rollback trên log phù hợp**: Bảo đảm thao tác trên đúng nhật ký cập nhật pháp lý từng kích hoạt phiên bản bị lỗi. Bấm xác nhận cuối để hệ thống đảo ngược hiệu lực.
7. **Bắt buộc kiểm chứng sau rollback**: Ngay sau khi hoàn tác thành công, Lãnh đạo **bắt buộc phải chạy hậu kiểm rollback** để xác nhận an toàn.

---

## 11. How to Verify After Rollback

Hướng dẫn thẩm định trạng thái CSDL sau khi thực hiện thao tác hoàn tác phiên bản:

1. **Bấm kiểm chứng**: Tại chi tiết nhật ký, tìm khối UI viền tím mờ **Kiểm chứng sau rollback (Read-only Audit Dashboard)** (xuất hiện ở đầu modal và tại mục Lịch sử workflow), bấm nút **"Kiểm tra sau rollback"**.
2. **Đánh giá huy hiệu**:
   - **`✔ PASS` (Xanh lá)**: Hoàn tác thành công tuyệt đối! Bản cũ đã phục hồi `ACTIVE`, bản lỗi đã chuyển `REPLACED`, không có trùng lặp version, toàn bộ hồ sơ TTHC được giữ nguyên.
   - **`⚠ WARNING` (Vàng)**: Hợp lệ nếu nhật ký này chưa từng thực hiện rollback thật trong lịch sử (hệ thống báo không tìm thấy metadata rollback trong log notes).
   - **`✖ FAIL` (Đỏ)**: Phát hiện lỗi nghiêm trọng (xung đột trạng thái version hoặc bất thường dữ liệu).
3. **Xử lý khi FAIL**: Lập tức ngừng giải quyết hồ sơ thuộc thủ tục này, báo cáo Lãnh đạo cao nhất và Quản trị viên hệ thống để can thiệp kỹ thuật khẩn cấp.

---

## 12. What Not To Do

Danh sách "10 KHÔNG" nghiêm ngặt dành cho Cán bộ và Lãnh đạo để bảo đảm an toàn hệ thống:

1. **KHÔNG** bấm kích hoạt version mới nếu chưa đọc hiểu báo cáo Phân tích tác động và chưa chạy thử Simulation.
2. **KHÔNG** bấm hoàn tác (Rollback) version nếu chưa có lý do chính đáng và chưa được sự đồng ý của Lãnh đạo cơ quan.
3. **KHÔNG** dùng các nhật ký cập nhật pháp lý đang chạy thật trên môi trường sản xuất (Production) để làm diễn tập hay bấm thử tùy tiện.
4. **KHÔNG** bao giờ can thiệp sửa đổi trực tiếp vào cơ sở dữ liệu (Database) bằng các công cụ bên ngoài ngoài giao diện LegalFlow.
5. **KHÔNG** bỏ qua hoặc xem nhẹ các huy hiệu cảnh báo **`⚠ WARNING`** hay **`✖ FAIL`** trên bảng hậu kiểm.
6. **KHÔNG** coi kết quả gợi ý hay điểm tin cậy của AI là kết luận pháp lý cuối cùng để tự động ký duyệt hồ sơ TTHC.
7. **KHÔNG** chia sẻ tài khoản có quyền Lãnh đạo (`ADMIN`/`MANAGER`) cho chuyên viên hoặc người không có thẩm quyền.
8. **KHÔNG** để trống hoặc ghi sơ sài lý do rà soát, lý do kích hoạt hay lý do hoàn tác trong hệ thống.
9. **KHÔNG** tự ý xóa bỏ hay làm sai lệch các biên bản, nhật ký trong lịch sử rà soát workflow.
10. **KHÔNG** thao tác trên hệ thống khi kết nối mạng chập chờn hoặc khi máy chủ Docker đang trong quá trình bảo trì/khởi động lại.

---

## 13. Troubleshooting

Bảng chỉ dẫn khắc phục nhanh 09 tình huống vướng mắc thường gặp trong quá trình đào tạo và sử dụng thực tế:

| Hiện tượng / Lỗi gặp phải | Nguyên nhân thực tế | Cách xử lý / Khắc phục nhanh |
| :--- | :--- | :--- |
| **1. Không thấy nút Kích hoạt hoặc Hoàn tác** | Đang đăng nhập bằng tài khoản Chuyên viên (`STAFF`) hoặc Người xem (`VIEWER`). | Đăng xuất và đăng nhập lại bằng tài khoản có quyền Lãnh đạo (`ADMIN` hoặc `MANAGER`). |
| **2. Không thấy nút Tạo bản nháp** | Nhật ký cập nhật đang ở trạng thái `PENDING`, `IN_REVIEW` hoặc `REJECTED`. | Cán bộ cần thực hiện rà soát workflow và trình Lãnh đạo bấm nút **"Duyệt tạo version"** (`APPROVED`). |
| **3. API trả về 204 No Content hoặc Empty** | Dữ liệu nhật ký hoặc version trong CSDL bị trống hoặc chưa được khởi tạo. | Kiểm tra lại kịch bản test, tạo mới một nhật ký cập nhật và tiến hành quy trình từ đầu. |
| **4. Lỗi Network 401 Unauthorized / 403 Forbidden** | Phiên làm việc (JWT Token) đã hết hạn hoặc tài khoản không đủ quyền truy cập endpoint. | F5 làm mới trang web, tiến hành đăng nhập lại hệ thống bằng đúng tài khoản thẩm quyền. |
| **5. Lỗi Network 404 Not Found** | Trình duyệt gọi sai đường dẫn API hoặc Backend chưa đăng ký route mới. | Kiểm tra lại URL, đảm bảo đang chạy đúng phiên bản code backend mới nhất (v2.8.x). |
| **6. Lỗi kết nối / Docker chưa chạy** | Cụm dịch vụ Docker trên máy chủ chưa được bật hoặc bị dừng đột ngột. | Mở Terminal/PowerShell, chạy lệnh `docker compose up -d` và chờ 30 giây để dịch vụ sẵn sàng. |
| **7. Lỗi Port 9000 bị chiếm (MinIO Error)** | Cổng 9000 trên máy chủ đang bị một phần mềm khác (như Portainer, XAMPP) chiếm dụng. | Dừng phần mềm đang chiếm cổng 9000 hoặc đổi cổng MinIO trong cấu hình Docker Compose. |
| **8. Lỗi hiển thị cũ (Caddy / Browser Cache)** | Trình duyệt hoặc Caddy Server đang lưu cache file JavaScript/CSS của phiên bản cũ. | Bấm tổ hợp phím **Ctrl + F5** (hoặc Cmd + Shift + R) để xóa cache trình duyệt và tải lại trang. |
| **9. Lỗi Vite Dev Server khác source** | Máy chủ Frontend đang chạy trên một thư mục code khác không đồng bộ với Backend. | Kiểm tra terminal, đảm bảo lệnh `npm run dev` được chạy đúng trong thư mục `legalflow-docker-uat`. |

---

## 14. Training Scenarios

Để các buổi tập huấn diễn ra sinh động và hiệu quả, Người hướng dẫn (Trainer) cho học viên thực hành theo 03 kịch bản tình huống chuẩn:

### Kịch bản 1: Cập nhật văn bản pháp lý mới và Khởi tạo bản nháp
- **Bối cảnh**: Chính phủ vừa ban hành Nghị định mới hướng dẫn Luật Đất đai.
- **Nhiệm vụ của học viên**:
  1. Đăng nhập tài khoản `STAFF`, vào Kho kiến thức, mở Tab 6.
  2. Chọn nhật ký cập nhật Nghị định mới, bấm **"Bắt đầu rà soát"**, đọc Phân tích tác động AI.
  3. Thêm ý kiến: *"Đề nghị áp dụng cho TTHC Cấp GCN lần đầu từ ngày 01/08"*.
  4. Đăng nhập tài khoản `MANAGER`, vào lại nhật ký, bấm **"Duyệt tạo version"** (`APPROVED`).
  5. Đăng nhập lại `STAFF`, bấm **"Khởi tạo bản nháp mới"**, chọn tạo cả 3 loại (Procedure, Prompt, Checklist), kiểm tra huy hiệu **`DRAFT`**.

### Kịch bản 2: Kiểm thử song song, Kích hoạt version và Hậu kiểm
- **Bối cảnh**: Bản nháp đã có sẵn, cần kiểm tra độ an toàn trước khi áp dụng chính thức cho địa phương.
- **Nhiệm vụ của học viên**:
  1. Đăng nhập tài khoản `MANAGER`, mở nhật ký `APPROVED` có bản nháp.
  2. Bấm **"Chạy kiểm thử bản nháp"** (Modal 10), chọn 03 hồ sơ mẫu, bấm chạy và xem bảng Diff Summary.
  3. Bấm **"Kích hoạt version chính thức"** (Modal 11), xem qua 4 bước.
  4. Nhập ý kiến chỉ đạo: *"Đã kiểm thử an toàn, đồng ý ban hành"*.
  5. Gõ chính xác chuỗi **`ACTIVATE VERSION`**, bấm xác nhận.
  6. Ngay sau kích hoạt, bấm nút **"Kiểm tra sau kích hoạt"**, chụp lại màn hình huy hiệu **`✔ PASS`** và giải thích ý nghĩa cho lớp học.

### Kịch bản 3: Diễn tập Hoàn tác khẩn cấp (Rollback Drill)
- **Bối cảnh**: Giả lập tình huống phát hiện quy định mới có điểm vướng mắc, Lãnh đạo chỉ đạo lùi khẩn cấp về version cũ.
- **Nhiệm vụ của học viên**:
  1. *(Sử dụng nhật ký test riêng)*: Đăng nhập tài khoản `ADMIN`.
  2. Mở nhật ký vừa kích hoạt ở Kịch bản 2, bấm nút đỏ **"Hoàn tác version"** (Modal 12).
  3. Thử nhập lý do dưới 10 ký tự $\rightarrow$ Quan sát hệ thống chặn lại.
  4. Nhập lý do chuẩn: *"Hoàn tác khẩn cấp do chờ hướng dẫn bổ sung từ Bộ Tài nguyên và Môi trường"*.
  5. Gõ chính xác chuỗi **`ROLLBACK VERSION`**, bấm xác nhận hoàn tác.
  6. Bấm nút **"Kiểm tra sau rollback"** trên panel hậu kiểm viền tím, xác nhận huy hiệu **`✔ PASS`**, kiểm tra CSDL xác nhận version cũ đã phục hồi `ACTIVE`.

---

## 15. Trainer Checklist

Danh sách kiểm tra dành riêng cho Giảng viên / Người đào tạo (Trainer) trước, trong và sau buổi tập huấn:

- [ ] **1. Chuẩn bị tài khoản**: Tạo sẵn và kiểm tra 04 tài khoản mẫu (`admin@test.com`, `manager@test.com`, `staff@test.com`, `viewer@test.com`).
- [ ] **2. Chuẩn bị log test**: Tạo sẵn 02 nhật ký cập nhật pháp lý chuyên dùng cho lớp học thực hành (không dùng log thật).
- [ ] **3. Chuẩn bị hồ sơ mẫu**: Đảm bảo trong hệ thống có ít nhất 05 hồ sơ TTHC mẫu ở các trạng thái khác nhau để chạy Simulation.
- [ ] **4. Kiểm tra health-check**: Trước giờ dạy 30 phút, chạy script `.\scripts\health-check.ps1` bảo đảm 100% dịch vụ xanh.
- [ ] **5. Kiểm tra máy chiếu / màn hình**: Đảm bảo độ phân giải màn hình hiển thị rõ ràng các màu sắc huy hiệu (Xanh, Cam, Vàng, Đỏ).
- [ ] **6. Nhắc nguyên tắc an toàn**: Mở đầu buổi học luôn nhấn mạnh Nguyên tắc số 1: **"AI chỉ hỗ trợ, Cán bộ phải kiểm tra"**.
- [ ] **7. Kiểm soát thực hành**: Hướng dẫn học viên làm đúng tuần tự, không để học viên tự ý xóa dữ liệu chung của lớp.
- [ ] **8. Ghi nhận lỗi UAT**: Chuẩn bị sẵn Phiếu ghi nhận lỗi (Defect Log); nếu học viên phát hiện bất thường trong lúc thực hành, ghi nhận lại ngay để chuyển cho đội kỹ thuật.

---

## 16. Final Reminder

> [!IMPORTANT]
> **LỜI NHẮC NHỞ TỐI CAO DÀNH CHO TOÀN THỂ CÁN BỘ & LÃNH ĐẠO CƠ QUAN:**
> 
> Hệ thống **LegalFlow V2** cùng mô-đun **Quản trị Phiên bản Pháp lý** là công cụ trợ lý công nghệ hiện đại, được xây dựng với mục tiêu giảm tải áp lực công việc, tăng tốc độ tra cứu và hạn chế tối đa sai sót rủi ro cho người thực thi công vụ.
> 
> Tuy nhiên, **trí tuệ nhân tạo (AI) và hệ thống phần mềm tuyệt đối không thể và không bao giờ thay thế trách nhiệm công vụ, thẩm quyền thẩm định, nghĩa vụ xác minh sự thật khách quan và trách nhiệm ký ban hành quyết định hành chính cuối cùng** của Quý cán bộ nghiệp vụ và Lãnh đạo cơ quan có thẩm quyền theo quy định của pháp luật.
> 
> Hãy luôn là **"Người làm chủ công nghệ"** – sử dụng AI như một người trợ lý đắc lực, nhưng luôn đưa ra quyết định bằng trí tuệ, bản lĩnh và sự tuân thủ pháp luật nghiêm minh của người cán bộ phục vụ Nhân dân!

---
*Cẩm nang Đào tạo được biên soạn và ban hành trong khuôn khổ hoàn thành Phase 8F-E-D-G của hệ thống LegalFlow V2.*
