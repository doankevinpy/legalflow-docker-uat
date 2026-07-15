import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient, Role, ProcedureField, ProcedureGroup, ProcedureStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * PHASE 12J: CONTROLLED FINANCIAL OBLIGATION DEMO DATA SEED SCRIPT
 * 
 * Safety & Compliance Rules:
 * 1. Requires explicit confirmation text: `I UNDERSTAND THIS SEEDS DEMO DATA ONLY` (via env CONFIRM_DEMO_SEED or CLI argument).
 * 2. Checks `backups/` directory for existing valid backup file > 0 KB before execution.
 * 3. Idempotent execution (using upsert) strictly scoped to prefix `DEMO-FO-UAT-`.
 * 4. Never modifies real administrative cases or real citizen data.
 * 5. All records tagged with mandatory safety notices (`DEMO ONLY - NOT REAL CITIZEN DATA`).
 */

const CONFIRMATION_TEXT = 'I UNDERSTAND THIS SEEDS DEMO DATA ONLY';

async function verifyBackupExists(): Promise<void> {
  const backupsDir = path.resolve(__dirname, '../../backups');
  if (!fs.existsSync(backupsDir)) {
    console.error('❌ [SAFETY ERROR] Backups directory not found at:', backupsDir);
    throw new Error('DEMO SEED BLOCKED - PRE-SEED BACKUP MISSING');
  }

  const files = fs.readdirSync(backupsDir);
  const sqlBackups = files.filter(f => f.endsWith('.sql') || f.endsWith('.dump') || f.includes('pre_'));
  
  let validBackupFound = false;
  for (const file of sqlBackups) {
    const filePath = path.join(backupsDir, file);
    const stats = fs.statSync(filePath);
    if (stats.size > 0) {
      validBackupFound = true;
      console.log(`✅ [SAFETY CHECK] Valid pre-seed backup detected: ${file} (${stats.size} bytes)`);
      break;
    }
  }

  if (!validBackupFound) {
    console.error('❌ [SAFETY ERROR] No valid backup file (> 0 bytes) found in:', backupsDir);
    throw new Error('DEMO SEED BLOCKED - PRE-SEED BACKUP MISSING OR 0 BYTES');
  }
}

function verifyConfirmation(): void {
  const isConfirmedEnv = process.env.CONFIRM_DEMO_SEED === CONFIRMATION_TEXT;
  const isConfirmedArg = process.argv.some(arg => arg === CONFIRMATION_TEXT || arg === `--confirm="${CONFIRMATION_TEXT}"` || arg === `--confirm=${CONFIRMATION_TEXT}`);
  const isCleanup = process.argv.includes('--cleanup') || process.argv.includes('cleanup');

  if (!isConfirmedEnv && !isConfirmedArg && !isCleanup) {
    console.error('❌ [SAFETY ERROR] Explicit confirmation required to seed demo data.');
    console.error(`Please provide confirmation via environment variable or CLI argument:`);
    console.error(`  CONFIRM_DEMO_SEED="${CONFIRMATION_TEXT}" npx ts-node scripts/seed-financial-obligation-demo.ts`);
    console.error(`Or run with argument:`);
    console.error(`  npx ts-node scripts/seed-financial-obligation-demo.ts "${CONFIRMATION_TEXT}"`);
    process.exit(1);
  }
}

async function runDemoSeed(): Promise<void> {
  console.log('=== PHASE 12J: CONTROLLED FINANCIAL OBLIGATION DEMO DATA SEED ===\n');

  // 1. Verify confirmation
  verifyConfirmation();

  // 2. Verify pre-seed backup exists
  await verifyBackupExists();

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing in environment variables');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Check if cleanup mode requested
    if (process.argv.includes('--cleanup') || process.argv.includes('cleanup')) {
      console.log('--- RUNNING TARGETED CLEANUP OF DEMO RECORDS ONLY ---');
      const deletedLogs = await prisma.financialObligationAuditLog.deleteMany({
        where: { assessment: { procedureCase: { caseCode: { startsWith: 'DEMO-FO-UAT-' } } } }
      });
      const deletedPayments = await prisma.paymentEvidenceRecord.deleteMany({
        where: { assessment: { procedureCase: { caseCode: { startsWith: 'DEMO-FO-UAT-' } } } }
      });
      const deletedTaxNotices = await prisma.taxNoticeRecord.deleteMany({
        where: { assessment: { procedureCase: { caseCode: { startsWith: 'DEMO-FO-UAT-' } } } }
      });
      const deletedItems = await prisma.financialObligationItem.deleteMany({
        where: { assessment: { procedureCase: { caseCode: { startsWith: 'DEMO-FO-UAT-' } } } }
      });
      const deletedAssessments = await prisma.financialObligationAssessment.deleteMany({
        where: { procedureCase: { caseCode: { startsWith: 'DEMO-FO-UAT-' } } }
      });
      const deletedCases = await prisma.administrativeProcedureCase.deleteMany({
        where: { caseCode: { startsWith: 'DEMO-FO-UAT-' } }
      });

      console.log(`✅ Cleanup completed successfully:`);
      console.log(`   - Deleted Audit Logs: ${deletedLogs.count}`);
      console.log(`   - Deleted Payment Evidences: ${deletedPayments.count}`);
      console.log(`   - Deleted Tax Notices: ${deletedTaxNotices.count}`);
      console.log(`   - Deleted Assessment Items: ${deletedItems.count}`);
      console.log(`   - Deleted Assessments: ${deletedAssessments.count}`);
      console.log(`   - Deleted Demo Cases: ${deletedCases.count}`);
      return;
    }

    // Ensure Admin & Staff users exist for attribution
    const adminUser = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
    const staffUser = await prisma.user.findFirst({ where: { role: Role.STAFF } }) || adminUser;
    
    if (!adminUser) {
      throw new Error('DEMO SEED BLOCKED - REQUIRED BASE DATA NOT AVAILABLE (No Admin user found)');
    }

    // Ensure procedure types exist
    const landFirstProc = await prisma.procedureType.findFirst({ where: { code: 'LAND_FIRST_CERTIFICATE' } });
    const purposeChangeProc = await prisma.procedureType.findFirst({ where: { code: 'LAND_USE_PURPOSE_CHANGE' } });

    if (!landFirstProc || !purposeChangeProc) {
      throw new Error('DEMO SEED BLOCKED - REQUIRED BASE DATA NOT AVAILABLE (Procedure types missing)');
    }

    console.log('--- STARTING IDEMPOTENT UPSERT FOR 8 DEMO CASES ---');

    let createdCount = 0;
    let updatedCount = 0;

    const demoCasesData = [
      {
        caseCode: 'DEMO-FO-UAT-01',
        procedureTypeId: landFirstProc.id,
        applicantName: 'Người dân Demo 01',
        parcelNumber: 'Thửa số 9901',
        mapSheetNumber: 'Tờ số 901',
        address: 'Khu phố Demo 1, TP UAT',
        status: ProcedureStatus.SUBMITTED,
        assessmentStatus: 'MISSING_INFORMATION' as const,
        assessmentMode: 'MANUAL' as const,
        estimatedTotalAmount: 0,
        officialTotalAmount: null,
        isEstimate: true,
        taxNoticeStatus: 'NONE' as const,
        paymentStatus: 'PENDING' as const,
        officerReviewStatus: 'UNVERIFIED' as const,
        managerReviewStatus: 'NOT_REQUIRED' as const,
        riskLevel: 'LOW' as const,
        warningText: 'DEMO ONLY - NOT REAL CITIZEN DATA',
        items: []
      },
      {
        caseCode: 'DEMO-FO-UAT-02',
        procedureTypeId: purposeChangeProc.id,
        applicantName: 'Người dân Demo 02',
        parcelNumber: 'Thửa số 9902',
        mapSheetNumber: 'Tờ số 902',
        address: 'Khu phố Demo 2, TP UAT',
        status: ProcedureStatus.IN_REVIEW,
        assessmentStatus: 'ESTIMATED' as const,
        assessmentMode: 'AI_ASSISTED' as const,
        estimatedTotalAmount: 120600000,
        officialTotalAmount: null,
        isEstimate: true,
        taxNoticeStatus: 'NONE' as const,
        paymentStatus: 'PENDING' as const,
        officerReviewStatus: 'UNVERIFIED' as const,
        managerReviewStatus: 'NOT_REQUIRED' as const,
        riskLevel: 'MEDIUM' as const,
        warningText: 'DEMO ESTIMATE - NOT OFFICIAL AMOUNT | DEMO ONLY - NOT REAL CITIZEN DATA',
        items: [
          {
            itemType: 'LAND_USE_FEE' as const,
            itemLabel: 'Tiền sử dụng đất chuyển mục đích (Dự kiến)',
            estimatedAmount: 120000000,
            officialAmount: null,
            dataSource: 'AI_ESTIMATOR',
            notes: 'DEMO ESTIMATE - NOT OFFICIAL AMOUNT | DEMO ONLY - NOT REAL CITIZEN DATA'
          },
          {
            itemType: 'REGISTRATION_FEE' as const,
            itemLabel: 'Lệ phí trước bạ (Dự kiến)',
            estimatedAmount: 600000,
            officialAmount: null,
            dataSource: 'AI_ESTIMATOR',
            notes: 'DEMO ESTIMATE - NOT OFFICIAL AMOUNT | DEMO ONLY - NOT REAL CITIZEN DATA'
          }
        ]
      },
      {
        caseCode: 'DEMO-FO-UAT-03',
        procedureTypeId: purposeChangeProc.id,
        applicantName: 'Người dân Demo 03',
        parcelNumber: 'Thửa số 9903',
        mapSheetNumber: 'Tờ số 903',
        address: 'Khu phố Demo 3, TP UAT',
        status: ProcedureStatus.IN_REVIEW,
        assessmentStatus: 'TAX_NOTICE_RECEIVED' as const,
        assessmentMode: 'MANUAL' as const,
        estimatedTotalAmount: 150000000,
        officialTotalAmount: 150000000,
        isEstimate: false,
        taxNoticeStatus: 'RECEIVED' as const,
        paymentStatus: 'PENDING' as const,
        officerReviewStatus: 'UNVERIFIED' as const,
        managerReviewStatus: 'NOT_REQUIRED' as const,
        riskLevel: 'MEDIUM' as const,
        warningText: 'DEMO TAX NOTICE - NOT OFFICIAL - DO NOT USE FOR REAL PAYMENT | DEMO ONLY - NOT REAL CITIZEN DATA',
        taxNotice: {
          noticeNumber: 'TBT-DEMO-2026/003',
          issuingAuthority: 'Chi cục Thuế Demo UAT (Giả lập)',
          issueDate: new Date('2026-07-01'),
          receivedDate: new Date('2026-07-05'),
          totalAmount: 150000000,
          fileAttachmentId: 'demo_tax_03.pdf',
          notes: 'DEMO TAX NOTICE - NOT OFFICIAL - DO NOT USE FOR REAL PAYMENT | DEMO ONLY - NOT REAL CITIZEN DATA'
        },
        items: []
      },
      {
        caseCode: 'DEMO-FO-UAT-04',
        procedureTypeId: landFirstProc.id,
        applicantName: 'Người dân Demo 04',
        parcelNumber: 'Thửa số 9904',
        mapSheetNumber: 'Tờ số 904',
        address: 'Khu phố Demo 4, TP UAT',
        status: ProcedureStatus.IN_REVIEW,
        assessmentStatus: 'PAYMENT_UPLOADED' as const,
        assessmentMode: 'MANUAL' as const,
        estimatedTotalAmount: 25000000,
        officialTotalAmount: 25000000,
        isEstimate: false,
        taxNoticeStatus: 'RECEIVED' as const,
        paymentStatus: 'PAID_FULL' as const,
        officerReviewStatus: 'UNVERIFIED' as const,
        managerReviewStatus: 'NOT_REQUIRED' as const,
        riskLevel: 'LOW' as const,
        warningText: 'DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT | DEMO ONLY - NOT REAL CITIZEN DATA',
        taxNotice: {
          noticeNumber: 'TBT-DEMO-2026/004',
          issuingAuthority: 'Chi cục Thuế Demo UAT (Giả lập)',
          issueDate: new Date('2026-07-01'),
          receivedDate: new Date('2026-07-03'),
          totalAmount: 25000000,
          fileAttachmentId: 'demo_tax_04.pdf',
          notes: 'DEMO TAX NOTICE - NOT OFFICIAL - DO NOT USE FOR REAL PAYMENT | DEMO ONLY - NOT REAL CITIZEN DATA'
        },
        paymentEvidences: [
          {
            paymentDate: new Date('2026-07-10'),
            amountPaid: 25000000,
            payerName: 'Người dân Demo 04',
            receiptNumber: 'BNT-DEMO-2026/004',
            treasuryOrBank: 'Kho bạc Nhà nước Demo UAT',
            fileAttachmentId: 'demo_payment_04.pdf',
            notes: 'DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT | DEMO ONLY - NOT REAL CITIZEN DATA'
          }
        ],
        items: []
      },
      {
        caseCode: 'DEMO-FO-UAT-05',
        procedureTypeId: landFirstProc.id,
        applicantName: 'Người dân Demo 05',
        parcelNumber: 'Thửa số 9905',
        mapSheetNumber: 'Tờ số 905',
        address: 'Khu phố Demo 5, TP UAT',
        status: ProcedureStatus.IN_REVIEW,
        assessmentStatus: 'OFFICER_VERIFIED' as const,
        assessmentMode: 'MANUAL' as const,
        estimatedTotalAmount: 12500000,
        officialTotalAmount: 12500000,
        isEstimate: false,
        taxNoticeStatus: 'VERIFIED' as const,
        paymentStatus: 'VERIFIED' as const,
        officerReviewStatus: 'OFFICER_VERIFIED' as const,
        managerReviewStatus: 'NOT_REQUIRED' as const,
        riskLevel: 'LOW' as const,
        warningText: 'DEMO ONLY - NOT REAL CITIZEN DATA | VERIFIED DEMO RECORD - READY FOR PILOT TEST',
        taxNotice: {
          noticeNumber: 'TBT-DEMO-2026/005',
          issuingAuthority: 'Chi cục Thuế Demo UAT (Giả lập)',
          issueDate: new Date('2026-07-01'),
          receivedDate: new Date('2026-07-02'),
          totalAmount: 12500000,
          fileAttachmentId: 'demo_tax_05.pdf',
          verifiedById: staffUser!.id,
          verifiedAt: new Date('2026-07-08'),
          notes: 'DEMO TAX NOTICE - NOT OFFICIAL - DO NOT USE FOR REAL PAYMENT | DEMO ONLY - NOT REAL CITIZEN DATA'
        },
        paymentEvidences: [
          {
            paymentDate: new Date('2026-07-08'),
            amountPaid: 12500000,
            payerName: 'Người dân Demo 05',
            receiptNumber: 'BNT-DEMO-2026/005',
            treasuryOrBank: 'Kho bạc Nhà nước Demo UAT',
            fileAttachmentId: 'demo_payment_05.pdf',
            verifiedById: staffUser!.id,
            verifiedAt: new Date('2026-07-09'),
            notes: 'DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT | DEMO ONLY - NOT REAL CITIZEN DATA'
          }
        ],
        items: []
      },
      {
        caseCode: 'DEMO-FO-UAT-06',
        procedureTypeId: landFirstProc.id,
        applicantName: 'Người dân Demo 06',
        parcelNumber: 'Thửa số 9906',
        mapSheetNumber: 'Tờ số 906',
        address: 'Khu phố Demo 6, TP UAT',
        status: ProcedureStatus.IN_REVIEW,
        assessmentStatus: 'NOT_APPLICABLE' as const,
        assessmentMode: 'MANUAL' as const,
        estimatedTotalAmount: 0,
        officialTotalAmount: 0,
        isEstimate: false,
        taxNoticeStatus: 'NONE' as const,
        paymentStatus: 'VERIFIED' as const,
        officerReviewStatus: 'OFFICER_VERIFIED' as const,
        managerReviewStatus: 'NOT_REQUIRED' as const,
        riskLevel: 'LOW' as const,
        warningText: 'DEMO ONLY - NOT REAL CITIZEN DATA | DEMO EXEMPTION CASE - FOR TESTING ONLY',
        items: [
          {
            itemType: 'OTHER_FEE' as const,
            itemLabel: 'Trường hợp miễn/không phát sinh nghĩa vụ tài chính (Demo)',
            estimatedAmount: 0,
            officialAmount: 0,
            dataSource: 'OFFICER_INPUT',
            notes: 'DEMO ONLY - NOT REAL CITIZEN DATA | Miễn thuế/không phát sinh theo quy định giả lập UAT'
          }
        ]
      },
      {
        caseCode: 'DEMO-FO-UAT-07',
        procedureTypeId: landFirstProc.id,
        applicantName: 'Người dân Demo 07',
        parcelNumber: 'Thửa số 9907',
        mapSheetNumber: 'Tờ số 907',
        address: 'Khu phố Demo 7, TP UAT',
        status: ProcedureStatus.IN_REVIEW,
        assessmentStatus: 'OFFICER_VERIFIED' as const,
        assessmentMode: 'MANUAL' as const,
        estimatedTotalAmount: 80000000,
        officialTotalAmount: 80000000,
        isEstimate: false,
        taxNoticeStatus: 'RECEIVED' as const,
        paymentStatus: 'PARTIAL' as const,
        officerReviewStatus: 'OFFICER_VERIFIED' as const,
        managerReviewStatus: 'PENDING' as const,
        riskLevel: 'HIGH' as const,
        warningText: 'DEMO ONLY - NOT REAL CITIZEN DATA | MANAGER APPROVAL REQUIRED - DEMO DEBT RECORD',
        taxNotice: {
          noticeNumber: 'TBT-DEMO-2026/007',
          issuingAuthority: 'Chi cục Thuế Demo UAT (Giả lập)',
          issueDate: new Date('2026-07-01'),
          receivedDate: new Date('2026-07-03'),
          totalAmount: 80000000,
          fileAttachmentId: 'demo_tax_07.pdf',
          notes: 'DEMO TAX NOTICE - NOT OFFICIAL - DO NOT USE FOR REAL PAYMENT | DEMO ONLY - NOT REAL CITIZEN DATA | Quyết định ghi nợ tiền SDĐ'
        },
        paymentEvidences: [
          {
            paymentDate: new Date('2026-07-09'),
            amountPaid: 10000000,
            payerName: 'Người dân Demo 07',
            receiptNumber: 'BNT-DEMO-2026/007',
            treasuryOrBank: 'Kho bạc Nhà nước Demo UAT',
            fileAttachmentId: 'demo_payment_07.pdf',
            notes: 'DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT | DEMO ONLY - NOT REAL CITIZEN DATA'
          }
        ],
        items: []
      },
      {
        caseCode: 'DEMO-FO-UAT-08',
        procedureTypeId: purposeChangeProc.id,
        applicantName: 'Người dân Demo 08',
        parcelNumber: 'Thửa số 9908',
        mapSheetNumber: 'Tờ số 908',
        address: 'Khu phố Demo 8, TP UAT',
        status: ProcedureStatus.IN_REVIEW,
        assessmentStatus: 'ESTIMATED' as const,
        assessmentMode: 'AI_ASSISTED' as const,
        estimatedTotalAmount: 300000000,
        officialTotalAmount: null,
        isEstimate: true,
        taxNoticeStatus: 'NONE' as const,
        paymentStatus: 'PENDING' as const,
        officerReviewStatus: 'UNVERIFIED' as const,
        managerReviewStatus: 'NOT_REQUIRED' as const,
        riskLevel: 'HIGH' as const,
        warningText: 'DEMO ESTIMATE - NOT OFFICIAL AMOUNT | DEMO ONLY - NOT REAL CITIZEN DATA | CRITICAL SAFETY GUARD - CANNOT COMPLETE ON AI DRAFT',
        items: [
          {
            itemType: 'LAND_USE_FEE' as const,
            itemLabel: 'Tiền sử dụng đất (Chiết tính AI draft lớn)',
            estimatedAmount: 300000000,
            officialAmount: null,
            dataSource: 'AI_ESTIMATOR',
            notes: 'DEMO ESTIMATE - NOT OFFICIAL AMOUNT | DEMO ONLY - NOT REAL CITIZEN DATA'
          }
        ]
      }
    ];

    for (const demoCase of demoCasesData) {
      // Check existing case
      const existingCase = await prisma.administrativeProcedureCase.findUnique({
        where: { caseCode: demoCase.caseCode }
      });

      if (existingCase) {
        updatedCount++;
      } else {
        createdCount++;
      }

      // Upsert AdministrativeProcedureCase
      const procCase = await prisma.administrativeProcedureCase.upsert({
        where: { caseCode: demoCase.caseCode },
        update: {
          applicantName: demoCase.applicantName,
          status: demoCase.status,
          landParcelSummary: {
            parcelNumber: demoCase.parcelNumber,
            mapSheetNumber: demoCase.mapSheetNumber,
            address: demoCase.address,
            note: 'DEMO ONLY - NOT REAL CITIZEN DATA'
          },
          notes: 'DEMO ONLY - NOT REAL CITIZEN DATA'
        },
        create: {
          caseCode: demoCase.caseCode,
          procedureTypeId: demoCase.procedureTypeId,
          field: ProcedureField.DAT_DAI,
          applicantName: demoCase.applicantName,
          status: demoCase.status,
          landParcelSummary: {
            parcelNumber: demoCase.parcelNumber,
            mapSheetNumber: demoCase.mapSheetNumber,
            address: demoCase.address,
            note: 'DEMO ONLY - NOT REAL CITIZEN DATA'
          },
          createdById: adminUser.id,
          notes: 'DEMO ONLY - NOT REAL CITIZEN DATA'
        }
      });

      // Upsert FinancialObligationAssessment
      const assessment = await prisma.financialObligationAssessment.upsert({
        where: { caseId: procCase.id },
        update: {
          procedureType: demoCase.caseCode.includes('01') || demoCase.caseCode.includes('04') || demoCase.caseCode.includes('05') || demoCase.caseCode.includes('06') || demoCase.caseCode.includes('07') ? 'Cấp GCN lần đầu' : 'Chuyển mục đích sử dụng đất',
          assessmentStatus: demoCase.assessmentStatus,
          assessmentMode: demoCase.assessmentMode,
          estimatedTotalAmount: demoCase.estimatedTotalAmount,
          officialTotalAmount: demoCase.officialTotalAmount,
          isEstimate: demoCase.isEstimate,
          taxNoticeStatus: demoCase.taxNoticeStatus,
          paymentStatus: demoCase.paymentStatus,
          officerReviewStatus: demoCase.officerReviewStatus,
          managerReviewStatus: demoCase.managerReviewStatus,
          riskLevel: demoCase.riskLevel,
          warningText: demoCase.warningText,
          reviewedById: demoCase.officerReviewStatus === 'OFFICER_VERIFIED' ? staffUser!.id : null
        },
        create: {
          caseId: procCase.id,
          procedureType: demoCase.caseCode.includes('01') || demoCase.caseCode.includes('04') || demoCase.caseCode.includes('05') || demoCase.caseCode.includes('06') || demoCase.caseCode.includes('07') ? 'Cấp GCN lần đầu' : 'Chuyển mục đích sử dụng đất',
          assessmentStatus: demoCase.assessmentStatus,
          assessmentMode: demoCase.assessmentMode,
          estimatedTotalAmount: demoCase.estimatedTotalAmount,
          officialTotalAmount: demoCase.officialTotalAmount,
          isEstimate: demoCase.isEstimate,
          taxNoticeStatus: demoCase.taxNoticeStatus,
          paymentStatus: demoCase.paymentStatus,
          officerReviewStatus: demoCase.officerReviewStatus,
          managerReviewStatus: demoCase.managerReviewStatus,
          riskLevel: demoCase.riskLevel,
          warningText: demoCase.warningText,
          createdById: adminUser.id,
          reviewedById: demoCase.officerReviewStatus === 'OFFICER_VERIFIED' ? staffUser!.id : null
        }
      });

      // Clear existing child items to make upsert cleanly idempotent
      await prisma.financialObligationItem.deleteMany({ where: { assessmentId: assessment.id } });
      if (demoCase.items && demoCase.items.length > 0) {
        for (const item of demoCase.items) {
          await prisma.financialObligationItem.create({
            data: {
              assessmentId: assessment.id,
              itemType: item.itemType,
              itemLabel: item.itemLabel,
              estimatedAmount: item.estimatedAmount,
              officialAmount: item.officialAmount,
              dataSource: item.dataSource,
              notes: item.notes
            }
          });
        }
      }

      // Upsert Tax Notice if applicable
      if ('taxNotice' in demoCase && demoCase.taxNotice) {
        await prisma.taxNoticeRecord.upsert({
          where: { assessmentId: assessment.id },
          update: {
            noticeNumber: demoCase.taxNotice.noticeNumber,
            issuingAuthority: demoCase.taxNotice.issuingAuthority,
            issueDate: demoCase.taxNotice.issueDate,
            receivedDate: demoCase.taxNotice.receivedDate,
            totalAmount: demoCase.taxNotice.totalAmount,
            fileAttachmentId: demoCase.taxNotice.fileAttachmentId,
            verifiedById: 'verifiedById' in demoCase.taxNotice ? demoCase.taxNotice.verifiedById : null,
            verifiedAt: 'verifiedAt' in demoCase.taxNotice ? demoCase.taxNotice.verifiedAt : null,
            notes: demoCase.taxNotice.notes
          },
          create: {
            assessmentId: assessment.id,
            noticeNumber: demoCase.taxNotice.noticeNumber,
            issuingAuthority: demoCase.taxNotice.issuingAuthority,
            issueDate: demoCase.taxNotice.issueDate,
            receivedDate: demoCase.taxNotice.receivedDate,
            totalAmount: demoCase.taxNotice.totalAmount,
            fileAttachmentId: demoCase.taxNotice.fileAttachmentId,
            verifiedById: 'verifiedById' in demoCase.taxNotice ? demoCase.taxNotice.verifiedById : null,
            verifiedAt: 'verifiedAt' in demoCase.taxNotice ? demoCase.taxNotice.verifiedAt : null,
            notes: demoCase.taxNotice.notes
          }
        });
      } else {
        await prisma.taxNoticeRecord.deleteMany({ where: { assessmentId: assessment.id } });
      }

      // Upsert Payment Evidences if applicable
      await prisma.paymentEvidenceRecord.deleteMany({ where: { assessmentId: assessment.id } });
      if ('paymentEvidences' in demoCase && demoCase.paymentEvidences && demoCase.paymentEvidences.length > 0) {
        for (const payment of demoCase.paymentEvidences) {
          await prisma.paymentEvidenceRecord.create({
            data: {
              assessmentId: assessment.id,
              paymentDate: payment.paymentDate,
              amountPaid: payment.amountPaid,
              payerName: payment.payerName,
              receiptNumber: payment.receiptNumber,
              treasuryOrBank: payment.treasuryOrBank,
              fileAttachmentId: payment.fileAttachmentId,
              verifiedById: 'verifiedById' in payment ? payment.verifiedById : null,
              verifiedAt: 'verifiedAt' in payment ? payment.verifiedAt : null,
              notes: payment.notes
            }
          });
        }
      }

      // Add audit log
      await prisma.financialObligationAuditLog.create({
        data: {
          assessmentId: assessment.id,
          actorId: adminUser.id,
          action: 'ASSESSMENT_CREATED',
          reason: 'DEMO ONLY - NOT REAL CITIZEN DATA (Phase 12J Controlled Seed)'
        }
      });

      console.log(`   Processed Demo Case: ${demoCase.caseCode} [${assessment.assessmentStatus}]`);
    }

    console.log('\n✅ Demo Seeding Completed Successfully!');
    console.log(`   - Created Records: ${createdCount}`);
    console.log(`   - Updated Records: ${updatedCount}`);
    console.log(`   - Skipped Records: 0`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

runDemoSeed().catch((error) => {
  console.error('\n❌ [SEED EXECUTION FAILED]', error.message || error);
  process.exit(1);
});
