import { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { FileText, Download, Loader2, UploadCloud, AlertCircle, X } from 'lucide-react';
import { casesApi } from '../../lib/casesApi';
import { ApiError } from '../../lib/apiClient';
import type { DocumentMeta } from '../../lib/api-types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface DocumentUploadProps {
  caseId: string;
  documents: DocumentMeta[];
  userCanEdit: boolean;
  onUploadSuccess: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
];

export function DocumentUpload({ caseId, documents, userCanEdit, onUploadSuccess }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    if (file.size > MAX_FILE_SIZE) {
      setError('File quá lớn. Vui lòng chọn file <= 5MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (!ALLOWED_MIMES.includes(file.type)) {
      setError('Định dạng không hỗ trợ (chỉ nhận PDF, DOC, DOCX, PNG, JPG).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (documents.length >= 10) {
      setError('Hồ sơ đã đạt giới hạn 10 tài liệu.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    try {
      await casesApi.uploadDocument(caseId, file);
      onUploadSuccess();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Lỗi tải lên tài liệu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (docId: string, originalName: string) => {
    setError('');
    setDownloadingId(docId);
    try {
      const { url } = await casesApi.downloadDocument(caseId, docId);
      
      // Tạo temporary link để trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName); // download attribute works for same-origin or when Content-Disposition is set
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Lỗi tải xuống tài liệu.');
    } finally {
      setDownloadingId(null);
    }
  };

  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Tài liệu đính kèm ({documents.length}/10)
        </h3>
        {userCanEdit && documents.length < 10 && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              Tải lên tài liệu
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed rounded-xl bg-secondary/20">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-20" />
          <p className="text-muted-foreground text-sm font-medium">Chưa có tài liệu nào.</p>
          <p className="text-xs text-muted-foreground mt-1">Hỗ trợ PDF, DOCX, PNG, JPG (tối đa 5MB).</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {documents.map((doc, idx) => {
            // Support fallback cho old mock data
            const isOldMock = !doc.id;
            const docId = doc.id || `mock-${idx}`;
            const docName = doc.originalName || doc.name || 'Tài liệu';
            
            return (
              <div key={docId} className="flex flex-col p-4 rounded-xl border bg-card hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 overflow-hidden">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate" title={docName}>{docName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        {doc.size ? <span>{formatBytes(doc.size)}</span> : null}
                        {doc.uploadedAt && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span>{format(new Date(doc.uploadedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                          </>
                        )}
                      </div>
                      {doc.uploadedBy && (
                        <p className="text-xs text-muted-foreground mt-1 truncate" title={doc.uploadedBy}>
                          Bởi: {doc.uploadedBy}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-3 border-t flex justify-end">
                  {isOldMock && doc.url ? (
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs w-full sm:w-auto"
                    >
                      <Download className="w-3.5 h-3.5 mr-2" /> Tải xuống
                    </a>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc.id!, docName)}
                      disabled={downloadingId === doc.id || isOldMock}
                      className="w-full sm:w-auto h-8 text-xs"
                    >
                      {downloadingId === doc.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                      ) : (
                        <Download className="w-3.5 h-3.5 mr-2" />
                      )}
                      Tải xuống
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
