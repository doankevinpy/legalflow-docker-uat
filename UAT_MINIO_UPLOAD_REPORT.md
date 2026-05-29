# UAT_MINIO_UPLOAD_REPORT

## 1. Scope
MinIO document upload/download UAT

## 2. Environment
- Docker full stack localhost
- Gateway: http://127.0.0.1:8080/api

## 3. Test Data
Fake PDF/TXT only

## 4. Results
- TXT blocked 400: PASS
- PDF upload 201: PASS
- Response no minioKey/bucket/secret/presigned URL: PASS
- Download endpoint presigned URL: PASS
- Presigned URL fetch content starts `%PDF-1.4`: PASS
- Logs privacy scan: PASS
- Shutdown without -v: PASS

## 5. Fix Included
- `docker-compose.full.yml` now passes `MINIO_*` env to backend

## 6. Known Limitations
- UAT used dummy/local MinIO
- No real legal documents
- No production domain/HTTPS
- No antivirus scanning yet
- No advanced file content scanning yet
