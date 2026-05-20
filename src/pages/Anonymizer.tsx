import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Shield, ArrowRight, Copy, CheckCircle2 } from 'lucide-react';
import { anonymizeText } from '../utils/anonymize';

export default function Anonymizer() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAnonymize = () => {
    const result = anonymizeText(inputText);
    setOutputText(result);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Công cụ Ẩn danh Dữ liệu
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Loại bỏ số điện thoại, email, CCCD khỏi văn bản để bảo vệ thông tin cá nhân. Quá trình xử lý diễn ra hoàn toàn trên thiết bị của bạn.
          </p>
        </div>
        <Button onClick={handleAnonymize} className="flex items-center gap-2 shrink-0">
          Tiến hành Ẩn danh
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col h-full space-y-2">
          <label className="text-sm font-semibold text-foreground">Văn bản gốc</label>
          <textarea
            className="flex-1 w-full rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            placeholder="Dán nội dung cần ẩn danh vào đây..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        <div className="flex flex-col h-full space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">Kết quả đã xử lý</label>
            {outputText && (
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 flex items-center gap-2">
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Sao chép
                  </>
                )}
              </Button>
            )}
          </div>
          <textarea
            className="flex-1 w-full rounded-md border border-input bg-secondary/30 px-4 py-3 text-base ring-offset-background focus-visible:outline-none resize-none cursor-text"
            placeholder="Kết quả sẽ hiển thị ở đây..."
            value={outputText}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
