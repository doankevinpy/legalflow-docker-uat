import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Không tìm thấy trang</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không thể truy cập.
      </p>
      <Link to="/dashboard">
        <Button size="lg">Về trang chủ</Button>
      </Link>
    </div>
  );
}
