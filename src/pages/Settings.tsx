import { useState, useRef } from 'react';
import { useCases } from '../hooks/useCases';
import { Button } from '../components/ui/Button';
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { storage } from '../utils/storage';
import type { LegalCase } from '../types';

export default function Settings() {
  const { replaceCases } = useCases();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExport = () => {
    try {
      const cases = storage.getCases();
      const dataStr = JSON.stringify(cases, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `legalflow_backup_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      setSuccess('Đã tải xuống dữ liệu thành công.');
      setError(null);
    } catch (err) {
      setError('Có lỗi xảy ra khi xuất dữ liệu.');
    }
  };

  const validateCases = (data: any): data is LegalCase[] => {
    if (!Array.isArray(data)) return false;
    for (const item of data) {
      if (!item.id || !item.caseId || !item.field || !item.status) {
        return false;
      }
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (validateCases(json)) {
          if (window.confirm('Cảnh báo: Thao tác này sẽ ghi đè toàn bộ dữ liệu hiện tại. Bạn có chắc chắn muốn tiếp tục?')) {
            replaceCases(json);
            setSuccess('Khôi phục dữ liệu thành công!');
            setError(null);
          } else {
            // User cancelled
            setSuccess(null);
            setError(null);
          }
        } else {
          setError('File không đúng định dạng dữ liệu LegalFlow.');
          setSuccess(null);
        }
      } catch (err) {
        setError('Không thể đọc file. Vui lòng đảm bảo đây là file JSON hợp lệ.');
        setSuccess(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold tracking-tight">Cài đặt & Dữ liệu</h2>
      
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5" />
          <p>{success}</p>
        </div>
      )}

      <div className="grid gap-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Sao lưu dữ liệu</h3>
            <p className="text-sm text-muted-foreground mt-1">Tải xuống toàn bộ hồ sơ hiện tại dưới dạng file JSON để lưu trữ dự phòng hoặc chuyển sang máy khác.</p>
          </div>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Tải dữ liệu xuống
          </Button>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-destructive">Khôi phục dữ liệu</h3>
            <p className="text-sm text-muted-foreground mt-1">Tải lên file JSON bản sao lưu để khôi phục. <strong className="text-foreground">Lưu ý: Hành động này sẽ ghi đè và thay thế toàn bộ dữ liệu hiện tại.</strong></p>
          </div>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
          <Button variant="destructive" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Khôi phục dữ liệu
          </Button>
        </div>
      </div>
    </div>
  );
}
