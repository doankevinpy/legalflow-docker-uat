# Automated Scheduled Backup & Remote Storage Plan

## 1. Scope
* Local/UAT only.
* Không dùng dữ liệu thật.
* Không dùng AWS/S3 thật ở phase này.
* Remote storage là mock folder local.

## 2. Backup workflow
* `scheduled-backup.ps1` sẽ là master script trong phase sau.
* Gọi lại các script đã có:
  * `backup-postgres.ps1`
  * `backup-minio.ps1`
  * `verify-latest-backup.ps1` (sau này)
  * `cleanup-old-backups.ps1` (sau này)
* Không chạy nếu preflight fail.

## 3. Backup output
* Local backup root: `C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_ARTIFACTS\backups`
* Remote mock: `C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_REMOTE_BACKUPS`
* Không commit backup artifacts.

## 4. Retention policy
* Local: 7 ngày.
* Remote mock: 30 ngày.
* Không bao giờ xóa backup mới nhất.
* Không chạy cleanup nếu backup mới nhất vừa fail.
* Cleanup phải có dry-run mặc định.

## 5. Verification
* checksum SHA256.
* size > 0.
* Postgres dump exists (file `.dump`).
* MinIO backup folder/object count exists (mặc định script dùng `mc mirror` tạo bản sao thư mục).
* optional restore drill định kỳ.
* không coi backup đạt nếu chưa verify.

## 6. Scheduling strategy
* Windows Task Scheduler cho local.
* cron/systemd timer cho Linux staging sau này.
* Không chạy trong backend app.
* `register-windows-task.ps1` phải có dry-run/confirmation ở phase sau.

## 7. Security
* Không log secret.
* Không in DATABASE_URL.
* Không in MINIO secret/access key.
* Không đưa secret vào command line nếu tránh được.
* Không commit backup artifacts.
* Không dùng `down -v`.

## 8. Remote sync mock
* Copy/mirror sang local mock folder.
* Chỉ sync sau khi verify PASS.
* Nếu sync fail, không xóa local backup.
* Không xóa remote latest backup.

## 9. Failure handling
* Backup fail: dừng.
* Verify fail: không sync remote, không cleanup.
* Cleanup fail: không xóa thêm.
* Storage low: abort.
* Partial backup: đánh dấu failed và không dùng làm latest successful backup.

## 10. Future scripts
(Chỉ mô tả, chưa tạo ở 9.3A):
* `scripts/scheduled-backup.ps1`: Master script chạy toàn bộ quy trình, kiểm tra preflight, chạy backup, verify, sync và dọn dẹp.
* `scripts/cleanup-old-backups.ps1`: Chịu trách nhiệm thực thi Retention policy (Local 7 ngày, Remote 30 ngày), đảm bảo giữ lại file mới nhất và hỗ trợ dry-run.
* `scripts/verify-latest-backup.ps1`: Script độc lập để xác minh checksum, size, và tính toàn vẹn cơ bản.
* `scripts/register-windows-task.ps1`: Script đăng ký cron job trên Windows Task Scheduler.

## 11. Verification 9.3A
(Thực hiện sau khi viết tài liệu: secret scan, git status, git diff, báo cáo file thay đổi, chưa commit nếu chưa duyệt).
