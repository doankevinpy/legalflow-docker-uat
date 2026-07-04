import 'dotenv/config';
import { PrismaClient, Role, ProcedureField, ProcedureGroup } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in environment variables');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedProcedureTypes() {
  console.log('--- Seeding ProcedureTypes ---');
  const types = [
    {
      code: 'LAND_FIRST_CERTIFICATE',
      name: 'Cấp Giấy chứng nhận quyền sử dụng đất lần đầu',
      field: ProcedureField.DAT_DAI,
      group: ProcedureGroup.CAP_GCN_LAN_DAU,
      description: 'Thủ tục cấp GCN QSDĐ lần đầu đối với đất hộ gia đình, cá nhân',
      processingTimeDays: 30,
    },
    {
      code: 'LAND_USE_PURPOSE_CHANGE',
      name: 'Chuyển mục đích sử dụng đất',
      field: ProcedureField.DAT_DAI,
      group: ProcedureGroup.CHUYEN_MUC_DICH_SDD,
      description: 'Thủ tục chuyển mục đích sử dụng đất sang đất ở hoặc đất phi nông nghiệp',
      processingTimeDays: 15,
    },
    {
      code: 'LAND_FINANCIAL_OBLIGATION_REVIEW',
      name: 'Kiểm tra nghĩa vụ tài chính / tiền sử dụng đất',
      field: ProcedureField.DAT_DAI,
      group: ProcedureGroup.NGHIA_VU_TAI_CHINH,
      description: 'Thẩm tra hồ sơ xác định tiền sử dụng đất, lệ phí trước bạ',
      processingTimeDays: 10,
    },
    {
      code: 'CONSTRUCTION_PERMIT',
      name: 'Cấp giấy phép xây dựng công trình',
      field: ProcedureField.XAY_DUNG,
      group: ProcedureGroup.CAP_PHEP_XAY_DUNG,
      description: 'Cấp mới giấy phép xây dựng nhà ở riêng lẻ hoặc công trình xây dựng',
      processingTimeDays: 20,
    },
  ];

  for (const t of types) {
    await prisma.procedureType.upsert({
      where: { code: t.code },
      update: {
        name: t.name,
        field: t.field,
        group: t.group,
        description: t.description,
        processingTimeDays: t.processingTimeDays,
      },
      create: t,
    });
    console.log(`Upserted ProcedureType: ${t.code}`);
  }
}

async function seedCore() {
  console.log('--- Starting Core Seed ---');
  
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminFullName = process.env.SEED_ADMIN_FULL_NAME || 'Administrator';

  if (!adminEmail || !adminPassword) {
    throw new Error('FATAL: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required for Core Seed.');
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      fullName: adminFullName,
      isActive: true,
      // CRITICAL: DO NOT overwrite passwordHash if user already exists
    },
    create: {
      email: adminEmail,
      passwordHash: passwordHash,
      role: Role.ADMIN,
      fullName: adminFullName,
      isActive: true,
    },
  });

  console.log(`Core seed completed. Admin email: ${admin.email}`);
  await seedProcedureTypes();
  await seedLegalKnowledge(admin.id);
}

async function seedLegalKnowledge(adminId: string) {
  console.log('--- Seeding Legal Knowledge Foundation ---');
  const noteText = 'Cần cán bộ kiểm tra văn bản hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có.';

  // 1. Seed LegalDocuments
  const docs = [
    {
      id: 'seed-legal-doc-land-2024',
      documentCode: '31/2024/QH15',
      documentTitle: 'Luật Đất đai 2024',
      documentType: 'LAW' as any,
      issuingAuthority: 'Quốc hội',
      issuedDate: new Date('2024-01-18'),
      effectiveFrom: new Date('2024-08-01'),
      status: 'ACTIVE' as any,
      summary: 'Luật Đất đai năm 2024 quy định về chế độ sở hữu đất đai, quyền và nghĩa vụ của người sử dụng đất.',
      notes: noteText,
      createdById: adminId,
    },
    {
      id: 'seed-legal-doc-decree-102',
      documentCode: '102/2024/NĐ-CP',
      documentTitle: 'Nghị định quy định chi tiết thi hành một số điều của Luật Đất đai',
      documentType: 'DECREE' as any,
      issuingAuthority: 'Chính phủ',
      issuedDate: new Date('2024-07-30'),
      effectiveFrom: new Date('2024-08-01'),
      status: 'ACTIVE' as any,
      summary: 'Quy định chi tiết thi hành Luật Đất đai về chuyển mục đích sử dụng đất, thu hồi đất, giao đất.',
      notes: noteText,
      createdById: adminId,
    },
    {
      id: 'seed-legal-doc-decree-103',
      documentCode: '103/2024/NĐ-CP',
      documentTitle: 'Nghị định quy định về tiền sử dụng đất, tiền thuê đất',
      documentType: 'DECREE' as any,
      issuingAuthority: 'Chính phủ',
      issuedDate: new Date('2024-07-30'),
      effectiveFrom: new Date('2024-08-01'),
      status: 'ACTIVE' as any,
      summary: 'Quy định về việc tính tiền sử dụng đất, tiền thuê đất và miễn giảm tiền sử dụng đất.',
      notes: noteText,
      createdById: adminId,
    },
    {
      id: 'seed-legal-doc-decision-tthc',
      documentCode: 'QĐ-TTHC-DAT-DAI',
      documentTitle: 'Quyết định công bố thủ tục hành chính lĩnh vực đất đai',
      documentType: 'DECISION' as any,
      issuingAuthority: 'UBND Tỉnh',
      issuedDate: new Date('2025-01-01'),
      effectiveFrom: new Date('2025-01-01'),
      status: 'ACTIVE' as any,
      summary: 'Danh mục và thành phần hồ sơ các thủ tục hành chính đất đai áp dụng tại địa phương.',
      notes: noteText,
      createdById: adminId,
    },
  ];

  for (const d of docs) {
    await prisma.legalDocument.upsert({
      where: { id: d.id },
      update: {
        documentCode: d.documentCode,
        documentTitle: d.documentTitle,
        documentType: d.documentType,
        issuingAuthority: d.issuingAuthority,
        status: d.status,
        summary: d.summary,
        notes: d.notes,
      },
      create: d,
    });
    console.log(`Upserted LegalDocument: ${d.documentCode}`);
  }

  // 2. Seed ProcedureTypeVersion
  const procTypes = await prisma.procedureType.findMany();
  const landFirstProc = procTypes.find((p) => p.code === 'LAND_FIRST_CERTIFICATE');
  const purposeChangeProc = procTypes.find((p) => p.code === 'LAND_USE_PURPOSE_CHANGE');

  if (landFirstProc) {
    await prisma.procedureTypeVersion.upsert({
      where: {
        procedureTypeId_version: {
          procedureTypeId: landFirstProc.id,
          version: 'v1.0',
        },
      },
      update: {
        status: 'ACTIVE' as any,
        procedureName: landFirstProc.name,
        processingTimeDays: landFirstProc.processingTimeDays,
      },
      create: {
        procedureTypeId: landFirstProc.id,
        version: 'v1.0',
        effectiveFrom: new Date('2024-08-01'),
        status: 'ACTIVE' as any,
        procedureName: landFirstProc.name,
        procedureCode: landFirstProc.code,
        field: landFirstProc.field as any,
        group: landFirstProc.group as any,
        processingTimeDays: landFirstProc.processingTimeDays,
        requiredDocuments: landFirstProc.requiredDocuments as any,
        legalBasisDocumentIds: ['seed-legal-doc-land-2024', 'seed-legal-doc-decision-tthc'],
        approvedById: adminId,
        approvedAt: new Date('2024-08-01'),
      },
    });
    console.log(`Upserted ProcedureTypeVersion for ${landFirstProc.code}`);
  }

  if (purposeChangeProc) {
    await prisma.procedureTypeVersion.upsert({
      where: {
        procedureTypeId_version: {
          procedureTypeId: purposeChangeProc.id,
          version: 'v1.0',
        },
      },
      update: {
        status: 'ACTIVE' as any,
        procedureName: purposeChangeProc.name,
        processingTimeDays: purposeChangeProc.processingTimeDays,
      },
      create: {
        procedureTypeId: purposeChangeProc.id,
        version: 'v1.0',
        effectiveFrom: new Date('2024-08-01'),
        status: 'ACTIVE' as any,
        procedureName: purposeChangeProc.name,
        procedureCode: purposeChangeProc.code,
        field: purposeChangeProc.field as any,
        group: purposeChangeProc.group as any,
        processingTimeDays: purposeChangeProc.processingTimeDays,
        requiredDocuments: purposeChangeProc.requiredDocuments as any,
        legalBasisDocumentIds: ['seed-legal-doc-land-2024', 'seed-legal-doc-decree-102', 'seed-legal-doc-decision-tthc'],
        approvedById: adminId,
        approvedAt: new Date('2024-08-01'),
      },
    });
    console.log(`Upserted ProcedureTypeVersion for ${purposeChangeProc.code}`);
  }

  // 3. Seed AiPromptVersion
  const promptVersions = [
    {
      promptKey: 'LAND_FIRST_CERTIFICATE_REVIEW',
      version: 'v1.0',
      procedureTypeCode: 'LAND_FIRST_CERTIFICATE',
      procedureGroup: 'CAP_GCN_LAN_DAU',
      analysisType: 'LAND_FIRST_CERTIFICATE_REVIEW',
      systemPrompt: 'Bạn là Trợ lý AI thẩm tra hồ sơ Cấp Giấy chứng nhận quyền sử dụng đất lần đầu. ' + noteText,
      outputSchema: { type: 'object', properties: { summary: { type: 'string' } } },
      legalDocumentIds: ['seed-legal-doc-land-2024', 'seed-legal-doc-decision-tthc'],
      status: 'ACTIVE' as any,
      effectiveFrom: new Date('2024-08-01'),
      approvedById: adminId,
      approvedAt: new Date('2024-08-01'),
    },
    {
      promptKey: 'LAND_USE_PURPOSE_CHANGE_REVIEW',
      version: 'v1.0',
      procedureTypeCode: 'LAND_USE_PURPOSE_CHANGE',
      procedureGroup: 'CHUYEN_MUC_DICH_SDD',
      analysisType: 'LAND_USE_PURPOSE_CHANGE_REVIEW',
      systemPrompt: 'Bạn là Trợ lý AI thẩm tra hồ sơ Chuyển mục đích sử dụng đất. ' + noteText,
      outputSchema: { type: 'object', properties: { summary: { type: 'string' } } },
      legalDocumentIds: ['seed-legal-doc-land-2024', 'seed-legal-doc-decree-102', 'seed-legal-doc-decision-tthc'],
      status: 'ACTIVE' as any,
      effectiveFrom: new Date('2024-08-01'),
      approvedById: adminId,
      approvedAt: new Date('2024-08-01'),
    },
  ];

  for (const p of promptVersions) {
    await prisma.aiPromptVersion.upsert({
      where: {
        promptKey_version: {
          promptKey: p.promptKey,
          version: p.version,
        },
      },
      update: {
        systemPrompt: p.systemPrompt,
        status: p.status,
      },
      create: p,
    });
    console.log(`Upserted AiPromptVersion: ${p.promptKey} ${p.version}`);
  }

  // 4. Seed ChecklistVersion
  const checklistVersions = [
    {
      checklistKey: 'CHK_LAND_FIRST_CERTIFICATE',
      version: 'v1.0',
      procedureTypeCode: 'LAND_FIRST_CERTIFICATE',
      procedureGroup: 'CAP_GCN_LAN_DAU',
      checklistItems: [
        { id: 'item-1', title: 'Đơn đăng ký cấp GCN theo Mẫu', isMandatory: true },
        { id: 'item-2', title: 'Giấy tờ chứng minh quyền sử dụng đất theo Điều 137 Luật Đất đai', isMandatory: false },
      ],
      legalDocumentIds: ['seed-legal-doc-land-2024', 'seed-legal-doc-decision-tthc'],
      status: 'ACTIVE' as any,
      effectiveFrom: new Date('2024-08-01'),
      approvedById: adminId,
      approvedAt: new Date('2024-08-01'),
    },
    {
      checklistKey: 'CHK_LAND_USE_PURPOSE_CHANGE',
      version: 'v1.0',
      procedureTypeCode: 'LAND_USE_PURPOSE_CHANGE',
      procedureGroup: 'CHUYEN_MUC_DICH_SDD',
      checklistItems: [
        { id: 'item-1', title: 'Đơn xin chuyển mục đích sử dụng đất', isMandatory: true },
        { id: 'item-2', title: 'Giấy chứng nhận quyền sử dụng đất hiện có', isMandatory: true },
      ],
      legalDocumentIds: ['seed-legal-doc-land-2024', 'seed-legal-doc-decree-102', 'seed-legal-doc-decision-tthc'],
      status: 'ACTIVE' as any,
      effectiveFrom: new Date('2024-08-01'),
      approvedById: adminId,
      approvedAt: new Date('2024-08-01'),
    },
  ];

  for (const c of checklistVersions) {
    await prisma.checklistVersion.upsert({
      where: {
        checklistKey_version: {
          checklistKey: c.checklistKey,
          version: c.version,
        },
      },
      update: {
        checklistItems: c.checklistItems,
        status: c.status,
      },
      create: c,
    });
    console.log(`Upserted ChecklistVersion: ${c.checklistKey} ${c.version}`);
  }
}


async function seedMock() {
  if (process.env.SEED_MOCK_DATA !== 'true') {
    console.log('--- Mock Seed Skipped (SEED_MOCK_DATA is not true) ---');
    return;
  }
  
  console.log('--- Starting Mock Seed ---');

  if (process.env.SEED_MOCK_USERS === 'true') {
    console.log('Seeding mock users...');
    const saltRounds = 10;
    const mockPassword = process.env.SEED_MOCK_USER_PASSWORD || 'MockUser@local-only-not-for-prod';
    const passwordHash = await bcrypt.hash(mockPassword, saltRounds);

    const mockUsers = [
      { email: 'manager@legalflow.local', role: Role.MANAGER, fullName: 'Mock Manager' },
      { email: 'staff@legalflow.local', role: Role.STAFF, fullName: 'Mock Staff' },
      { email: 'viewer@legalflow.local', role: Role.VIEWER, fullName: 'Mock Viewer' },
    ];

    for (const user of mockUsers) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: { role: user.role, fullName: user.fullName },
        create: {
          email: user.email,
          passwordHash: passwordHash,
          role: user.role,
          fullName: user.fullName,
          isActive: true,
        },
      });
      console.log(`Upserted mock user: ${user.email}`);
    }
  } else {
    console.log('Mock users skipped.');
  }

  if (process.env.SEED_MOCK_CASES === 'true') {
    console.log('Seeding mock cases...');
    const admin = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
    if (!admin) {
      console.log('Cannot seed cases: No admin user found to assign createdById.');
    } else {
      const neighborhoods = ['KP1', 'KP2', 'KP3', 'KP4', 'KP5'];
      const fields = ['DAT_DAI', 'DAN_SU', 'LAO_DONG', 'HON_NHAN_GIA_DINH', 'DOANH_NGHIEP', 'HANH_CHINH', 'KHAC'];
      const types = ['KN', 'TC', 'KNG', 'PA', 'TVPL', 'KHAC'];
      const statuses = ['NEW', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'];

      let seededCount = 0;
      for (let i = 1; i <= 30; i++) {
        const caseCode = `2026-MOCK-A${i.toString().padStart(3, '0')}`;
        
        // Pseudo-random selection based on index to ensure consistent mock data
        const neighborhood = neighborhoods[i % neighborhoods.length];
        const field = fields[(i * 3) % fields.length]; // Skewed a bit for variety
        const type = types[(i * 5) % types.length];
        const status = statuses[(i * 7) % statuses.length];

        const mockCase = {
          caseCode,
          senderName: `Mock Sender ${i}`,
          type,
          field,
          neighborhood,
          summary: `Mock summary for analytics ${i}`,
          request: `Mock request content ${i}`,
          status,
          createdById: admin.id,
        };

        await prisma.legalCase.upsert({
          where: { caseCode: mockCase.caseCode },
          update: { summary: mockCase.summary, status: mockCase.status as any },
          create: {
            caseCode: mockCase.caseCode,
            senderName: mockCase.senderName,
            type: mockCase.type as any,
            field: mockCase.field as any,
            neighborhood: mockCase.neighborhood as any,
            summary: mockCase.summary,
            request: mockCase.request,
            status: mockCase.status as any,
            createdById: mockCase.createdById,
            documents: [{ name: `mock-doc-${i}.pdf`, url: `http://mock.local/doc${i}.pdf` }],
          },
        });
        seededCount++;
      }
      console.log(`Upserted ${seededCount} mock cases for analytics.`);
    }
  } else {
    console.log('Mock cases skipped.');
  }

  console.log('--- Mock Seed Completed ---');
}

async function main() {
  await seedCore();
  await seedMock();
}

main()
  .catch((e) => {
    console.error('Seed script failed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
