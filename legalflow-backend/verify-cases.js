const fs = require('fs');

async function runTest() {
  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  function record(name, isPass, note = '') {
    if (isPass) passed++;
    else failed++;
    console.log(`${isPass ? '✅ PASS' : '❌ FAIL'}: ${name} ${note ? `(${note})` : ''}`);
  }

  async function login(email, password) {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return data.accessToken;
  }

  try {
    const adminToken = await login('admin@legalflow.local', 'Admin@123!');
    const staffToken = await login('staff@legalflow.local', 'Staff@123!');
    const viewerToken = await login('viewer@legalflow.local', 'Viewer@123!');

    record('Login ADMIN/STAFF/VIEWER', !!(adminToken && staffToken && viewerToken));

    // 1. ADMIN creates case
    const case1Res = await fetch(`${baseUrl}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({
        senderName: 'Nguyen Van A',
        type: 'KN',
        field: 'DAT_DAI',
        neighborhood: 'KP3',
        summary: 'Khieu nai dat dai',
        request: 'Giai quyet',
        receivedDate: '2026-05-20T00:00:00Z'
      })
    });
    const case1 = await case1Res.json();
    record('ADMIN tạo case pass', case1Res.status === 201 && !!case1.id);
    record('Tạo case Khiếu nại KP3 có mã 2026-KN-xxx-KP3', case1.caseCode && case1.caseCode.startsWith('2026-KN-') && case1.caseCode.endsWith('-KP3'), case1.caseCode);

    // 2. STAFF creates case
    const case2Res = await fetch(`${baseUrl}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${staffToken}` },
      body: JSON.stringify({
        senderName: 'Tran Thi B',
        type: 'TC',
        field: 'DAN_SU',
        neighborhood: 'KP2',
        summary: 'To cao',
        request: 'Xu ly',
      })
    });
    const case2 = await case2Res.json();
    record('STAFF tạo case pass', case2Res.status === 201 && !!case2.id);
    record('Tạo case Tố cáo KP2 có mã 2026-TC-xxx-KP2', case2.caseCode && case2.caseCode.includes('-TC-') && case2.caseCode.endsWith('-KP2'), case2.caseCode);

    // 3. VIEWER creates case
    const case3Res = await fetch(`${baseUrl}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${viewerToken}` },
      body: JSON.stringify({
        senderName: 'Le Van C',
        type: 'KNG',
        field: 'LAO_DONG',
        neighborhood: 'KP1',
        summary: 'Kien nghi',
        request: 'Xem xet',
      })
    });
    record('VIEWER tạo case bị 403', case3Res.status === 403);

    // 4. KNG case
    const case4Res = await fetch(`${baseUrl}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({
        senderName: 'Ly Thi D',
        type: 'KNG',
        field: 'HON_NHAN_GIA_DINH',
        neighborhood: 'KP1',
        summary: 'Kien nghi 2',
        request: 'Xem xet 2',
      })
    });
    const case4 = await case4Res.json();
    record('Tạo case Kiến nghị có mã KNG', case4.caseCode && case4.caseCode.includes('-KNG-'), case4.caseCode);

    // 5. KHAC case
    const case5Res = await fetch(`${baseUrl}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({
        senderName: 'Pham Van E',
        type: 'KHAC',
        field: 'KHAC',
        neighborhood: 'KHAC',
        summary: 'Khac',
        request: 'Khac',
      })
    });
    const case5 = await case5Res.json();
    record('Tạo case Khác có KHAC, không có dấu tiếng Việt', case5.caseCode && case5.caseCode.includes('-KHAC-') && case5.caseCode.endsWith('-KHAC'), case5.caseCode);

    // 6. Pagination & Search
    const listRes = await fetch(`${baseUrl}/cases?page=1&limit=2&search=Khieu`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const list = await listRes.json();
    record('GET /cases có pagination', list.meta && list.meta.total !== undefined && list.data);
    record('Search/filter hoạt động', list.data.length > 0 && list.data[0].summary.includes('Khieu nai'));
    const hasPassword = JSON.stringify(list).includes('passwordHash');
    record('Không có passwordHash trong response GET /cases', !hasPassword);

    // 7. GET Case ID
    const detailRes = await fetch(`${baseUrl}/cases/${case1.id}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const detail = await detailRes.json();
    record('GET /cases/:id trả checklist, notes, histories', !!(detail.checklist && detail.notes && detail.histories));

    // 8. PATCH status
    const statusRes = await fetch(`${baseUrl}/cases/${case1.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'IN_PROGRESS' })
    });
    record('PATCH status success', statusRes.status === 200);

    // 9. POST note
    const noteRes = await fetch(`${baseUrl}/cases/${case1.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ content: 'Day la ghi chu' })
    });
    record('POST note success', noteRes.status === 201);

    // 10. PATCH checklist
    if (detail.checklist && detail.checklist.length > 0) {
      const chkId = detail.checklist[0].id;
      const chkRes = await fetch(`${baseUrl}/cases/${case1.id}/checklist/${chkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ isCompleted: true })
      });
      const chk = await chkRes.json();
      record('PATCH checklist ghi completedAt/completedById', chkRes.status === 200 && !!chk.completedAt && !!chk.completedById);
    } else {
      record('PATCH checklist ghi completedAt/completedById', false, 'Checklist empty');
    }

    // Verify CaseHistory
    const verifyHistRes = await fetch(`${baseUrl}/cases/${case1.id}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const verifyHist = await verifyHistRes.json();
    const actions = verifyHist.histories.map(h => h.action);
    record('Ghi đủ CaseHistory (CHANGE_STATUS, ADD_NOTE, UPDATE_CHECKLIST)', actions.includes('CHANGE_STATUS') && actions.includes('ADD_NOTE') && actions.includes('UPDATE_CHECKLIST'));

    // 11. STAFF delete case (Fail)
    const delFailRes = await fetch(`${baseUrl}/cases/${case1.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${staffToken}` }
    });
    record('STAFF không được xóa', delFailRes.status === 403);

    // 12. ADMIN soft delete
    const delRes = await fetch(`${baseUrl}/cases/${case1.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    record('ADMIN soft delete pass', delRes.status === 200);
    const getDeleted = await fetch(`${baseUrl}/cases/${case1.id}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    record('GET case đã xoá trả 404', getDeleted.status === 404);

    // 13. VIEWER update case (Fail)
    const updateFailRes = await fetch(`${baseUrl}/cases/${case2.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${viewerToken}` },
      body: JSON.stringify({ summary: 'test' })
    });
    record('VIEWER không được sửa', updateFailRes.status === 403);

    // 14. GET stats
    const statsRes = await fetch(`${baseUrl}/cases/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const stats = await statsRes.json();
    record('GET /cases/stats trả đúng cấu trúc', statsRes.status === 200 && stats.total !== undefined && stats.byStatus && stats.byType && stats.byField && stats.byNeighborhood && stats.overdue !== undefined && stats.needsMoreInfo !== undefined);
  } catch (e) {
    console.error(e);
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runTest();
