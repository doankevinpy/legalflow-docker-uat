import { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';
import { Loader2, Plus, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { landProfileApi } from '../../lib/landProfileApi';
import { ApiError } from '../../lib/apiClient';
import type { ApiLandProfile, CreateLandProfilePayload } from '../../lib/api-types';
import {
  LAND_PROCEDURE_LABELS,
  LAND_TYPE_LABELS,
  PLANNING_STATUS_LABELS,
  DISPUTE_STATUS_LABELS,
  ORIGIN_OF_LAND_STATUS_LABELS,
  DOCUMENT_COMPLETENESS_LABELS,
  FINANCIAL_OBLIGATION_STATUS_LABELS,
  LAND_OUTCOME_LABELS,
  LAND_REASON_CODE_LABELS,
  COMPLAINT_TYPE_LABELS,
  RISK_REVIEW_STATUS_LABELS,
  NEIGHBORHOOD_LABELS,
  type NeighborhoodCode,
} from '../../lib/constants';

interface LandProfileTabProps {
  caseId: string;
  userCanEdit: boolean;
}

export function LandProfileTab({ caseId, userCanEdit }: LandProfileTabProps) {
  const [profile, setProfile] = useState<ApiLandProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState<string | string[]>('');
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreateLandProfilePayload>({
    procedureType: 'KHAC',
    landType: 'KHAC',
    currentLandUseType: 'KHAC',
    requestedLandUseType: undefined,
    area: 0,
    neighborhood: 'KHAC',
    planningStatus: 'NGOAI_QUY_HOACH',
    disputeStatus: 'KHONG_TRANH_CHAP',
    originOfLandStatus: 'KHAC',
    documentCompleteness: 'DU_HO_SO',
    financialObligationStatus: 'HOAN_THANH',
    outcome: undefined,
    reasonCode: undefined,
    complaintFlag: false,
    complaintType: undefined,
    processingDays: undefined,
    overdueDays: undefined,
    riskReviewStatus: 'AN_TOAN',
  });

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setActionError('');
    try {
      const data = await landProfileApi.getLandProfile(caseId);
      setProfile(data);
      // Pre-fill form
      setFormData({
        procedureType: data.procedureType,
        landType: data.landType,
        currentLandUseType: data.currentLandUseType,
        requestedLandUseType: data.requestedLandUseType || undefined,
        area: data.area,
        neighborhood: data.neighborhood,
        planningStatus: data.planningStatus,
        disputeStatus: data.disputeStatus,
        originOfLandStatus: data.originOfLandStatus,
        documentCompleteness: data.documentCompleteness,
        financialObligationStatus: data.financialObligationStatus,
        outcome: data.outcome || undefined,
        reasonCode: data.reasonCode || undefined,
        complaintFlag: data.complaintFlag,
        complaintType: data.complaintType || undefined,
        processingDays: data.processingDays ?? undefined,
        overdueDays: data.overdueDays ?? undefined,
        riskReviewStatus: data.riskReviewStatus,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setProfile(null);
      } else {
        setError(err instanceof Error ? err.message : 'Lỗi tải thông tin đất đai.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;

    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      finalValue = value === '' ? undefined : Number(value);
    } else if (value === '') {
      finalValue = undefined;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleStartEdit = () => {
    setActionError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setActionError('');
    setIsEditing(false);
    if (profile) {
      setFormData({
        procedureType: profile.procedureType,
        landType: profile.landType,
        currentLandUseType: profile.currentLandUseType,
        requestedLandUseType: profile.requestedLandUseType || undefined,
        area: profile.area,
        neighborhood: profile.neighborhood,
        planningStatus: profile.planningStatus,
        disputeStatus: profile.disputeStatus,
        originOfLandStatus: profile.originOfLandStatus,
        documentCompleteness: profile.documentCompleteness,
        financialObligationStatus: profile.financialObligationStatus,
        outcome: profile.outcome || undefined,
        reasonCode: profile.reasonCode || undefined,
        complaintFlag: profile.complaintFlag,
        complaintType: profile.complaintType || undefined,
        processingDays: profile.processingDays ?? undefined,
        overdueDays: profile.overdueDays ?? undefined,
        riskReviewStatus: profile.riskReviewStatus,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');

    // Pre-validation client side
    if (formData.area <= 0) {
      setActionError('Diện tích đất phải là số dương lớn hơn 0.');
      return;
    }

    // Clean up empty fields to send correctly
    const payload: CreateLandProfilePayload = {
      ...formData,
      requestedLandUseType: formData.requestedLandUseType || null as any,
      outcome: formData.outcome || null as any,
      reasonCode: formData.reasonCode || null as any,
      complaintType: formData.complaintFlag ? (formData.complaintType || null as any) : null as any,
      processingDays: formData.processingDays ?? null as any,
      overdueDays: formData.overdueDays ?? null as any,
    };

    setIsLoading(true);
    try {
      if (profile) {
        // Update
        const updated = await landProfileApi.updateLandProfile(caseId, payload);
        setProfile(updated);
      } else {
        // Create
        const created = await landProfileApi.createLandProfile(caseId, payload);
        setProfile(created);
      }
      setIsEditing(false);
      loadProfile();
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message);
      } else {
        setActionError('Có lỗi xảy ra khi lưu thông tin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isEditing) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <p className="text-red-600 font-medium">{error}</p>
        <Button variant="outline" onClick={loadProfile}>Thử lại</Button>
      </div>
    );
  }

  // --- 1. Giao diện EMPTY STATE ---
  if (!profile && !isEditing) {
    return (
      <div className="p-12 text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Chưa có thông tin đất đai</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Hồ sơ này chưa có thông tin đất đai.
          </p>
        </div>
        {userCanEdit && (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" /> Khởi tạo thông tin đất đai
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-lg font-semibold">Thông tin đất đai</h3>
        {userCanEdit && !isEditing && (
          <Button onClick={handleStartEdit} variant="outline" className="flex items-center gap-2">
            <Edit2 className="w-4 h-4" /> Chỉnh sửa
          </Button>
        )}
      </div>

      {actionError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm space-y-1">
          {Array.isArray(actionError) ? (
            actionError.map((msg, i) => (
              <p key={i} className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {msg}
              </p>
            ))
          ) : (
            <p className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" /> {actionError}
            </p>
          )}
        </div>
      )}

      {/* --- 2. Giao diện READ-ONLY VIEW --- */}
      {!isEditing && profile && (
        <div className="space-y-6">
          {/* Nhóm 1: Thông tin thửa đất */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary border-l-4 border-primary pl-2 text-sm uppercase tracking-wider">
              1. Thông tin thửa đất
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/10 p-4 rounded-lg">
              <Field label="Loại thủ tục đất đai" value={LAND_PROCEDURE_LABELS[profile.procedureType] || profile.procedureType} />
              <Field label="Loại đất hiện tại" value={LAND_TYPE_LABELS[profile.landType] || profile.landType} />
              <Field label="Mục đích sử dụng hiện tại" value={LAND_TYPE_LABELS[profile.currentLandUseType] || profile.currentLandUseType} />
              <Field label="Mục đích sử dụng yêu cầu" value={LAND_TYPE_LABELS[profile.requestedLandUseType || ''] || '–'} />
              <Field label="Diện tích (m²)" value={`${profile.area} m²`} />
              <Field label="Khu phố" value={NEIGHBORHOOD_LABELS[profile.neighborhood as NeighborhoodCode] || profile.neighborhood} />
            </div>
          </div>

          {/* Nhóm 2: Trạng thái pháp lý & quy hoạch */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary border-l-4 border-primary pl-2 text-sm uppercase tracking-wider">
              2. Trạng thái pháp lý & quy hoạch
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/10 p-4 rounded-lg">
              <Field label="Tình trạng quy hoạch" value={PLANNING_STATUS_LABELS[profile.planningStatus] || profile.planningStatus} />
              <Field label="Tình trạng tranh chấp" value={DISPUTE_STATUS_LABELS[profile.disputeStatus] || profile.disputeStatus} />
              <Field label="Nguồn gốc sử dụng đất" value={ORIGIN_OF_LAND_STATUS_LABELS[profile.originOfLandStatus] || profile.originOfLandStatus} />
              <Field label="Độ đầy đủ của hồ sơ" value={DOCUMENT_COMPLETENESS_LABELS[profile.documentCompleteness] || profile.documentCompleteness} />
              <Field label="Nghĩa vụ tài chính" value={FINANCIAL_OBLIGATION_STATUS_LABELS[profile.financialObligationStatus] || profile.financialObligationStatus} />
            </div>
          </div>

          {/* Nhóm 3: Kết quả xử lý */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary border-l-4 border-primary pl-2 text-sm uppercase tracking-wider">
              3. Kết quả xử lý
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/10 p-4 rounded-lg">
              <Field label="Kết quả phê duyệt" value={LAND_OUTCOME_LABELS[profile.outcome || ''] || 'Đang xử lý'} />
              <Field label="Lý do từ chối/trả lại" value={LAND_REASON_CODE_LABELS[profile.reasonCode || ''] || '–'} />
              <Field label="Số ngày xử lý" value={profile.processingDays !== null ? `${profile.processingDays} ngày` : '–'} />
              <Field label="Số ngày quá hạn" value={profile.overdueDays !== null ? `${profile.overdueDays} ngày` : '–'} />
            </div>
          </div>

          {/* Nhóm 4: Khiếu nại & rà soát rủi ro */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary border-l-4 border-primary pl-2 text-sm uppercase tracking-wider">
              4. Khiếu nại & rà soát rủi ro
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/10 p-4 rounded-lg">
              <Field label="Có khiếu nại phát sinh" value={profile.complaintFlag ? 'Có' : 'Không'} />
              {profile.complaintFlag && (
                <Field label="Loại khiếu nại" value={COMPLAINT_TYPE_LABELS[profile.complaintType || ''] || profile.complaintType || ''} />
              )}
              <Field label="Mức độ đánh giá rủi ro" value={RISK_REVIEW_STATUS_LABELS[profile.riskReviewStatus] || profile.riskReviewStatus} />
            </div>
          </div>
        </div>
      )}

      {/* --- 3. Giao diện CREATE/EDIT FORM --- */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nhóm 1: Thông tin thửa đất */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary border-l-4 border-primary pl-2 text-sm uppercase tracking-wider">
              1. Thông tin thửa đất
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/10 p-4 rounded-lg">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Loại thủ tục đất đai</label>
                <select
                  name="procedureType"
                  value={formData.procedureType}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.keys(LAND_PROCEDURE_LABELS).map((k) => (
                    <option key={k} value={k}>{LAND_PROCEDURE_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Loại đất hiện tại</label>
                <select
                  name="landType"
                  value={formData.landType}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.keys(LAND_TYPE_LABELS).map((k) => (
                    <option key={k} value={k}>{LAND_TYPE_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Mục đích sử dụng hiện tại</label>
                <select
                  name="currentLandUseType"
                  value={formData.currentLandUseType}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.keys(LAND_TYPE_LABELS).map((k) => (
                    <option key={k} value={k}>{LAND_TYPE_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Mục đích sử dụng yêu cầu (Tùy chọn)</label>
                <select
                  name="requestedLandUseType"
                  value={formData.requestedLandUseType || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">– Không yêu cầu –</option>
                  {Object.keys(LAND_TYPE_LABELS).map((k) => (
                    <option key={k} value={k}>{LAND_TYPE_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Diện tích (m²)</label>
                <input
                  type="number"
                  step="0.01"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Khu phố</label>
                <select
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.keys(NEIGHBORHOOD_LABELS).map((k) => (
                    <option key={k} value={k}>{NEIGHBORHOOD_LABELS[k as NeighborhoodCode]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Nhóm 2: Trạng thái pháp lý & quy hoạch */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary border-l-4 border-primary pl-2 text-sm uppercase tracking-wider">
              2. Trạng thái pháp lý & quy hoạch
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/10 p-4 rounded-lg">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Tình trạng quy hoạch</label>
                <select
                  name="planningStatus"
                  value={formData.planningStatus}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.keys(PLANNING_STATUS_LABELS).map((k) => (
                    <option key={k} value={k}>{PLANNING_STATUS_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Tình trạng tranh chấp</label>
                <select
                  name="disputeStatus"
                  value={formData.disputeStatus}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.keys(DISPUTE_STATUS_LABELS).map((k) => (
                    <option key={k} value={k}>{DISPUTE_STATUS_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Nguồn gốc sử dụng đất</label>
                <select
                  name="originOfLandStatus"
                  value={formData.originOfLandStatus}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.keys(ORIGIN_OF_LAND_STATUS_LABELS).map((k) => (
                    <option key={k} value={k}>{ORIGIN_OF_LAND_STATUS_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Độ đầy đủ của hồ sơ</label>
                <select
                  name="documentCompleteness"
                  value={formData.documentCompleteness}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.keys(DOCUMENT_COMPLETENESS_LABELS).map((k) => (
                    <option key={k} value={k}>{DOCUMENT_COMPLETENESS_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Nghĩa vụ tài chính</label>
                <select
                  name="financialObligationStatus"
                  value={formData.financialObligationStatus}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.keys(FINANCIAL_OBLIGATION_STATUS_LABELS).map((k) => (
                    <option key={k} value={k}>{FINANCIAL_OBLIGATION_STATUS_LABELS[k]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Nhóm 3: Kết quả xử lý */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary border-l-4 border-primary pl-2 text-sm uppercase tracking-wider">
              3. Kết quả xử lý
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/10 p-4 rounded-lg">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Kết quả phê duyệt (Tùy chọn)</label>
                <select
                  name="outcome"
                  value={formData.outcome || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">– Đang xử lý –</option>
                  {Object.keys(LAND_OUTCOME_LABELS).map((k) => (
                    <option key={k} value={k}>{LAND_OUTCOME_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Lý do từ chối/trả lại (Tùy chọn)</label>
                <select
                  name="reasonCode"
                  value={formData.reasonCode || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">– Không có lý do –</option>
                  {Object.keys(LAND_REASON_CODE_LABELS).map((k) => (
                    <option key={k} value={k}>{LAND_REASON_CODE_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Số ngày xử lý (Tùy chọn)</label>
                <input
                  type="number"
                  name="processingDays"
                  value={formData.processingDays ?? ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Số ngày quá hạn (Tùy chọn)</label>
                <input
                  type="number"
                  name="overdueDays"
                  value={formData.overdueDays ?? ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Nhóm 4: Khiếu nại & rà soát rủi ro */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary border-l-4 border-primary pl-2 text-sm uppercase tracking-wider">
              4. Khiếu nại & rà soát rủi ro
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center gap-3 h-10 sm:col-span-2">
                <input
                  type="checkbox"
                  id="complaintFlag"
                  name="complaintFlag"
                  checked={formData.complaintFlag}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="complaintFlag" className="text-sm font-semibold text-foreground cursor-pointer">
                  Có phát sinh khiếu nại
                </label>
              </div>

              {formData.complaintFlag && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Loại khiếu nại</label>
                  <select
                    name="complaintType"
                    value={formData.complaintType || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">– Chọn loại khiếu nại –</option>
                    {Object.keys(COMPLAINT_TYPE_LABELS).map((k) => (
                      <option key={k} value={k}>{COMPLAINT_TYPE_LABELS[k]}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Mức độ đánh giá rủi ro</label>
                <select
                  name="riskReviewStatus"
                  value={formData.riskReviewStatus}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.keys(RISK_REVIEW_STATUS_LABELS).map((k) => (
                    <option key={k} value={k}>{RISK_REVIEW_STATUS_LABELS[k]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancelEdit} className="flex items-center gap-2">
              <X className="w-4 h-4" /> Hủy
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Lưu thông tin
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h5 className="text-xs font-semibold text-muted-foreground mb-0.5">{label}</h5>
      <p className="font-semibold text-sm text-foreground">{value}</p>
    </div>
  );
}
