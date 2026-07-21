# Đặc Tả Phân Hệ Mở Rộng Liên Cơ Quan (`Multi-Unit Expansion Feature Specification`) - v2.13

## 1. Mục Đích (`Purpose`)
Quy định cơ chế kết nối, đồng bộ và phân tách dữ liệu an toàn khi ứng dụng được triển khai mở rộng ra nhiều đơn vị hành chính/chi nhánh khác nhau (Multi-Tenant/Multi-Unit).

## 2. Phạm Vi (`Scope`)
Kiểm soát kiến trúc kết nối dữ liệu liên cơ quan trong LegalFlow v2.13, bao gồm cả quyền truy cập chéo và tính toàn vẹn của hồ sơ nghĩa vụ tài chính khi chuyển tiếp giữa các cơ quan.

## 3. Đường Cơ Sở (`Baseline`)
* **Thẻ tham chiếu:** `v2.13-development`
* Kế thừa nguyên trạng kiến trúc bảo mật từ Phase 12R-ALT.

## 4. Trạng Thái Hiện Tại, Hạn Chế & Hành Động Tương Lai (`Current Status, Limitations, Future Actions`)
* **Trạng thái:** Đang trong chu kỳ phát triển (`Development Phase`).
* **Hạn chế:** Hệ thống hiện tại bị giới hạn cô lập ở mức một đơn vị (Single-Unit) in accordance with governance rules.
* **Hành động tương lai:** Phác thảo API Gateway và cơ chế định tuyến (Routing) an toàn giữa các đơn vị.

## 5. Quy Trình Chi Tiết (`Detailed Workflow`)
1. **Data Input:** Hồ sơ điện tử (VD: Thông báo nộp tiền) được cơ quan Thuế đẩy qua API liên thông. Gói dữ liệu mang định danh đơn vị gốc (`Unit_ID`).
2. **Validation:** Hệ thống tiếp nhận tiến hành kiểm tra chữ ký số hoặc Token hợp lệ (`API Contract Freeze`). Từ chối các gói tin sai định dạng, reduces the likelihood việc xâm nhập mạng lưới.
3. **Human Verification:** Hồ sơ liên thông đổ về hàng chờ của Cán bộ Xử lý (`RECEIVING_OFFICER` tại cơ quan đích). Cán bộ kiểm tra đối chiếu tính khớp đúng của hồ sơ trước khi đưa vào luồng giải quyết nội bộ.
4. **Completion:** Gửi xác nhận (ACK) tự động về đơn vị gốc, lưu vết toàn bộ chu trình luân chuyển dữ liệu vào Audit Log.

## 6. Tham Chiếu Bằng Chứng (`Evidence Reference`)
* **Dữ liệu giả lập:** `[PLACEHOLDER - LINK TO MULTI-UNIT SIMULATION LOGS]`
* **Trạng thái kiểm thử:** PASS / VERIFIED within controlled pilot scope.

## 7. Cột Mốc Phát Triển (`Milestones`)
* **Short-term:** Xây dựng khung phân quyền đa đơn vị (Multi-tenant RBAC).
* **Long-term:** Kết nối thí điểm với Cổng Dịch vụ công (DVC) khi có phê duyệt.
