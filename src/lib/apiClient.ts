// ============================================================
// apiClient.ts – HTTP client tập trung
// Tự gắn Bearer token, xử lý 401/403/network error
// Không hard-code URL – đọc từ VITE_API_BASE_URL
// ============================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'lf_access_token';

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();

  const isFormData = init.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> ?? {}),
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, 'Lỗi kết nối mạng. Vui lòng kiểm tra server đang chạy.');
  }

  // 401 → clear token, redirect login
  if (res.status === 401) {
    clearToken();
    // Dispatch custom event để AuthContext lắng nghe và redirect
    window.dispatchEvent(new CustomEvent('lf:unauthorized'));
    throw new ApiError(401, 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
  }

  // 403 → ném lỗi để component hiển thị thông báo
  if (res.status === 403) {
    throw new ApiError(403, 'Bạn không có quyền thực hiện thao tác này.');
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    let message = `Lỗi máy chủ (${res.status})`;
    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      // ignore JSON parse error
    }
    throw new ApiError(res.status, message);
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError(0, 'Không thể đọc dữ liệu từ server.');
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
    }),

  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
