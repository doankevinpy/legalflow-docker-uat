// ============================================================
// rbac.ts – Helper kiểm tra quyền phía frontend
// ============================================================

export function canCreate(role: string): boolean {
  return ['ADMIN', 'MANAGER', 'STAFF'].includes(role);
}

export function canDelete(role: string): boolean {
  return ['ADMIN', 'MANAGER'].includes(role);
}

export function canEdit(
  role: string,
  createdById?: string | null,
  assignedToId?: string | null,
  userId?: string | null,
): boolean {
  if (['ADMIN', 'MANAGER'].includes(role)) return true;
  if (role === 'STAFF') {
    return createdById === userId || assignedToId === userId;
  }
  return false;
}

export function canViewOnly(role: string): boolean {
  return role === 'VIEWER';
}

export function isAdminOrManager(role: string): boolean {
  return ['ADMIN', 'MANAGER'].includes(role);
}
