export function anonymizeText(text: string): string {
  if (!text) return text;

  let result = text;

  // 1. Email pattern
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  result = result.replace(emailRegex, '[EMAIL_ĐÃ_ẨN]');

  // 2. Phone number pattern (Vietnam)
  const phoneRegex = /(?:\+84|0)[1-9](?:[\s.-]*\d){8}\b/g;
  result = result.replace(phoneRegex, '[SĐT_ĐÃ_ẨN]');

  // 3. ID Card (CCCD/CMND) pattern (9 or 12 digits)
  const idCardRegex = /\b(\d{9}|\d{12})\b/g;
  result = result.replace(idCardRegex, '[CCCD_ĐÃ_ẨN]');

  return result;
}

export function anonymizePayload(payload: any): any {
  if (typeof payload === 'string') {
    return anonymizeText(payload);
  }
  if (Array.isArray(payload)) {
    return payload.map(item => anonymizePayload(item));
  }
  if (payload && typeof payload === 'object') {
    const anonymizedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
      anonymizedObj[key] = anonymizePayload(value);
    }
    return anonymizedObj;
  }
  return payload;
}
