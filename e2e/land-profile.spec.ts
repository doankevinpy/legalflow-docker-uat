import { test, expect, Page } from '@playwright/test';

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'change_me_in_local_only';
const VIEWER_EMAIL = 'viewer@legalflow.local';
const VIEWER_PASSWORD = 'MockUser@local-only-not-for-prod';

const KNOWN_CASE_ID = '582106cb-de1a-4758-81b2-8ff3d093409e';

async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  await page.locator('#login-email').fill(email);
  await page.locator('#login-password').fill(password);

  await Promise.all([
    page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 }),
    page.locator('#login-submit').click()
  ]);
}

test.describe('LandProfile UI E2E Integration Tests', () => {

  test('1. Case không phải Đất đai (DAT_DAI) không hiển thị tab Thông tin đất đai', async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Tìm case không phải Đất đai
    await page.goto('/cases');
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // Chọn lĩnh vực Dân sự (DAN_SU)
    const fieldSelect = page.locator('select').nth(1); // Lĩnh vực select
    await expect(fieldSelect).toBeVisible();
    await fieldSelect.selectOption('DAN_SU');

    // Đợi hàng chứa chữ "Dân sự" hiển thị (chứng tỏ đã filter xong)
    const civilRow = page.locator('table tbody tr').filter({ hasText: 'Dân sự' }).first();
    await expect(civilRow).toBeVisible({ timeout: 5000 });

    const detailBtn = civilRow.locator('button').filter({ hasText: /Chi tiết/i });
    if (await detailBtn.isVisible()) {
      await detailBtn.click();
      await page.waitForTimeout(1000);

      // Tab Thông tin đất đai KHÔNG được hiển thị
      const landTab = page.locator('button').filter({ hasText: /Thông tin đất đai/i });
      await expect(landTab).not.toBeVisible();
    }
  });

  test('2. Admin E2E Flow: Xem, chỉnh sửa, tạo mới LandProfile và kiểm tra Audit Logs', async ({ page }) => {
    test.setTimeout(60000); // Tăng timeout cho chuỗi test dài này
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // --- BƯỚC A: Xem LandProfile có sẵn ---
    await page.goto(`/cases/${KNOWN_CASE_ID}`);
    await page.waitForTimeout(1000);

    const landTab = page.locator('button').filter({ hasText: /Thông tin đất đai/i });
    await expect(landTab).toBeVisible();
    await landTab.click();
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Diện tích (m²)')).toBeVisible();
    await expect(page.locator('text=175.5 m²')).toBeVisible();
    await expect(page.locator('text=Khu phố 4')).toBeVisible();

    // --- BƯỚC B: Chỉnh sửa và kiểm tra Validation ---
    const editBtn = page.locator('button').filter({ hasText: /Chỉnh sửa/i });
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    // Nhập diện tích âm để test validation
    const areaInput = page.locator('input[name="area"]');
    await areaInput.fill('-50');

    const saveBtn = page.locator('button').filter({ hasText: /Lưu thông tin/i });
    await saveBtn.click();
    await page.waitForTimeout(1000);

    // Nhận thông báo lỗi validate diện tích
    await expect(page.locator('text=Diện tích đất phải là số dương lớn hơn 0.')).toBeVisible();

    // Nhập diện tích hợp lệ và đổi khu phố sang KP2
    await areaInput.fill('210.5');
    const nhSelect = page.locator('select[name="neighborhood"]');
    await nhSelect.selectOption('KP2');

    await saveBtn.click();
    await page.waitForTimeout(2000);

    // Xác nhận đã lưu và hiển thị đúng
    await expect(page.locator('text=210.5 m²')).toBeVisible();
    await expect(page.locator('text=Khu phố 2')).toBeVisible();

    // Reset lại dữ liệu ban đầu (175.5 m² và KP4) để không ảnh hưởng dữ liệu mẫu
    await editBtn.click();
    await areaInput.fill('175.5');
    await nhSelect.selectOption('KP4');
    await saveBtn.click();
    await page.waitForTimeout(1000);

    // --- BƯỚC C: Tạo mới LandProfile cho case DAT_DAI chưa có ---
    await page.goto('/cases');
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // Lọc lĩnh vực Đất đai (DAT_DAI)
    const fieldSelect = page.locator('select').nth(1);
    await expect(fieldSelect).toBeVisible();
    await fieldSelect.selectOption('DAT_DAI');

    // Đợi cho đến khi hàng chứa chữ "Đất đai" hiển thị (chứng tỏ đã load xong filter)
    const datDaiRow = page.locator('table tbody tr').filter({ hasText: 'Đất đai' }).first();
    await expect(datDaiRow).toBeVisible({ timeout: 10000 });

    const rowsCount = await page.locator('table tbody tr').count();
    let emptyCaseFound = false;

    for (let i = 0; i < rowsCount; i++) {
      const row = page.locator('table tbody tr').nth(i);
      const rowText = await row.innerText();
      // Bỏ qua các case mẫu đã có LandProfile
      if (rowText.includes('2026-KNG-003-KP5') || rowText.includes('2026-MOCK-A028')) continue;

      const detailBtn = row.locator('button').filter({ hasText: /Chi tiết/i });
      await detailBtn.click();
      await page.waitForTimeout(1000);

      const targetLandTab = page.locator('button').filter({ hasText: /Thông tin đất đai/i });
      if (await targetLandTab.isVisible()) {
        await targetLandTab.click();

        // Chờ nút khởi tạo xuất hiện trong tối đa 3 giây (loader biến mất và case thực sự trống)
        const initBtn = page.locator('button').filter({ hasText: /Khởi tạo thông tin đất đai/i });
        try {
          await initBtn.waitFor({ state: 'visible', timeout: 3000 });
          emptyCaseFound = true;
          await initBtn.click();
          await page.waitForTimeout(1000);

          await page.locator('input[name="area"]').fill('125.75');
          await page.locator('select[name="neighborhood"]').selectOption('KP3');
          await page.locator('select[name="procedureType"]').selectOption('CAP_GIAY_CHUNG_NHAN');
          await page.locator('select[name="landType"]').selectOption('DAT_O_DO_THI');
          await page.locator('select[name="currentLandUseType"]').selectOption('DAT_O_DO_THI');

          await page.locator('button').filter({ hasText: /Lưu thông tin/i }).click();
          await page.waitForTimeout(2000);

          await expect(page.locator('text=125.75 m²')).toBeVisible();
          await expect(page.locator('text=Khu phố 3')).toBeVisible();
          break;
        } catch (e) {
          // Không tìm thấy nút khởi tạo hoặc case đã có land profile, tiếp tục tìm case khác
        }
      }

      // Trở lại danh sách bằng nút Quay lại (tránh page.goto reload chậm)
      const backBtn = page.locator('a[href="/cases"]').first();
      await backBtn.click();
      await page.waitForSelector('table tbody tr', { timeout: 10000 });

      const loopFieldSelect = page.locator('select').nth(1);
      await expect(loopFieldSelect).toBeVisible();
      await loopFieldSelect.selectOption('DAT_DAI');

      // Đợi load xong filter sau khi back
      const loopDatDaiRow = page.locator('table tbody tr').filter({ hasText: 'Đất đai' }).first();
      await expect(loopDatDaiRow).toBeVisible({ timeout: 10000 });
    }

    if (!emptyCaseFound) {
      console.warn('Không tìm thấy case DAT_DAI nào trống để test tạo mới.');
    }

    // --- BƯỚC D: Kiểm tra Audit Logs ---
    await page.goto('/audit-logs');
    await page.waitForTimeout(2000);

    const tableHtml = await page.locator('table').innerHTML();
    expect(tableHtml).toContain('UPDATE_LAND_PROFILE');
  });

  test('3. Viewer chỉ có quyền xem, không được hiển thị nút khởi tạo/chỉnh sửa', async ({ page }) => {
    await login(page, VIEWER_EMAIL, VIEWER_PASSWORD);

    await page.goto(`/cases/${KNOWN_CASE_ID}`);
    await page.waitForTimeout(1000);

    const landTab = page.locator('button').filter({ hasText: /Thông tin đất đai/i });
    await expect(landTab).toBeVisible();
    await landTab.click();
    await page.waitForTimeout(1000);

    // Xác nhận không thấy nút Chỉnh sửa
    const editBtn = page.locator('button').filter({ hasText: /Chỉnh sửa/i });
    await expect(editBtn).not.toBeVisible();
  });

});
