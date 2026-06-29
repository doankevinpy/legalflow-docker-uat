export interface AgencyConfig {
  parentName?: string;
  name?: string;
  location?: string;
  signerTitle?: string;
  signerName?: string;
  defaultRecipients?: string[];
  docSymbolPrefix?: string;
  isConfigured: boolean;
  missingFields: string[];
}

export function getAgencyConfig(): AgencyConfig {
  const parentName = process.env.AGENCY_PARENT_NAME?.trim();
  const name = process.env.AGENCY_NAME?.trim();
  const location = process.env.AGENCY_LOCATION?.trim();
  const signerTitle = process.env.AGENCY_SIGNER_TITLE?.trim();
  const signerName = process.env.AGENCY_SIGNER_NAME?.trim();
  const rawRecipients = process.env.AGENCY_DEFAULT_RECIPIENTS?.trim();
  const docSymbolPrefix = process.env.AGENCY_DOCUMENT_SYMBOL_PREFIX?.trim();

  const missingFields: string[] = [];
  if (!parentName) missingFields.push('AGENCY_PARENT_NAME');
  if (!name) missingFields.push('AGENCY_NAME');
  if (!location) missingFields.push('AGENCY_LOCATION');
  if (!signerTitle) missingFields.push('AGENCY_SIGNER_TITLE');
  if (!signerName) missingFields.push('AGENCY_SIGNER_NAME');
  if (!rawRecipients) missingFields.push('AGENCY_DEFAULT_RECIPIENTS');
  if (!docSymbolPrefix) missingFields.push('AGENCY_DOCUMENT_SYMBOL_PREFIX');

  const isConfigured = missingFields.length < 7;

  const defaultRecipients = rawRecipients
    ? rawRecipients.split('\n').map((s) => s.trim()).filter(Boolean)
    : undefined;

  return {
    parentName,
    name,
    location,
    signerTitle,
    signerName,
    defaultRecipients,
    docSymbolPrefix,
    isConfigured,
    missingFields,
  };
}
