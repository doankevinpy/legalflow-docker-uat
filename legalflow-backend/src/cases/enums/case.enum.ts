export enum CaseType {
  KN = 'KN',
  TC = 'TC',
  KNG = 'KNG',
  PA = 'PA',
  TVPL = 'TVPL',
  KHAC = 'KHAC',
}

export enum CaseField {
  DAT_DAI = 'DAT_DAI',
  DAN_SU = 'DAN_SU',
  LAO_DONG = 'LAO_DONG',
  HON_NHAN_GIA_DINH = 'HON_NHAN_GIA_DINH',
  DOANH_NGHIEP = 'DOANH_NGHIEP',
  HANH_CHINH = 'HANH_CHINH',
  KHAC = 'KHAC',
}

export enum CaseNeighborhood {
  KP1 = 'KP1',
  KP2 = 'KP2',
  KP3 = 'KP3',
  KP4 = 'KP4',
  KP5 = 'KP5',
  KHAC = 'KHAC',
}

export enum CaseStatus {
  NEW = 'NEW',
  NEEDS_MORE_INFO = 'NEEDS_MORE_INFO',
  IN_PROGRESS = 'IN_PROGRESS',
  RESPONDED = 'RESPONDED',
  CLOSED = 'CLOSED',
}

export enum CaseHistoryAction {
  CREATE_CASE = 'CREATE_CASE',
  UPDATE_CASE = 'UPDATE_CASE',
  CHANGE_STATUS = 'CHANGE_STATUS',
  ADD_NOTE = 'ADD_NOTE',
  UPDATE_CHECKLIST = 'UPDATE_CHECKLIST',
  SOFT_DELETE_CASE = 'SOFT_DELETE_CASE',
}
