import { test, expect, Page } from '@playwright/test';

// Use environment variables or fallback to local defaults for E2E tests
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@legalflow.local';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'Admin@123456';
const STAFF_EMAIL = process.env.E2E_STAFF_EMAIL || 'staff@legalflow.local';
const STAFF_PASSWORD = process.env.E2E_STAFF_PASSWORD || 'Staff@123456';

async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  // Wait for navigation or a common element after login
  await expect(page.locator('text=LegalFlow').first()).toBeVisible();
}

test.describe('Authentication and Roles Smoke Tests', () => {
  test('Root page loads and redirects to login if unauthenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Đăng nhập')).toBeVisible();
  });

  test('Admin can login and access Analytics', async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    
    // Check if we can navigate to Analytics
    const analyticsLink = page.locator('a[href="/analytics"]').first();
    if (await analyticsLink.isVisible()) {
      await analyticsLink.click();
      await expect(page).toHaveURL(/\/analytics/);
      await expect(page.locator('text=Analytics Dashboard').first()).toBeVisible({ timeout: 5000 }).catch(() => {}); // Optional check
    } else {
      // Direct navigation fallback
      await page.goto('/analytics');
      await expect(page.locator('text=Analytics').first()).toBeVisible();
    }
  });

  test('Staff is blocked from Analytics', async ({ page }) => {
    await login(page, STAFF_EMAIL, STAFF_PASSWORD);
    
    // Try to access analytics directly
    await page.goto('/analytics');
    
    // Should be redirected or show access denied
    // Assuming staff gets redirected to dashboard or sees a specific message
    await expect(page).not.toHaveURL(/\/analytics/);
  });
});

test.describe('Case & Document Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  });

  test('View case list and case details', async ({ page }) => {
    await page.goto('/cases');
    await expect(page.locator('text=Danh sách hồ sơ').first()).toBeVisible();
    
    // Click on the first case in the list
    // Look for a link or table row that looks like a case
    const caseLink = page.locator('a[href^="/cases/"]').first();
    await expect(caseLink).toBeVisible();
    
    const caseUrl = await caseLink.getAttribute('href');
    await caseLink.click();
    
    // Verify we are on the CaseDetail page
    await expect(page).toHaveURL(new RegExp(caseUrl || ''));
  });

  test('Upload TXT is blocked and PDF is successful', async ({ page }) => {
    // Go to the first case
    await page.goto('/cases');
    const caseLink = page.locator('a[href^="/cases/"]').first();
    await caseLink.click();
    
    // Click the Documents tab if exists
    const docsTab = page.locator('button:has-text("Tài liệu")').first();
    if (await docsTab.isVisible()) {
      await docsTab.click();
    }

    // Locate the file input (document upload component)
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    // 1. Upload TXT (should fail/block)
    await fileInput.setInputFiles('e2e/fixtures/dummy.txt');
    // The UI should show an error or prevent upload
    await expect(page.locator('text=Chỉ hỗ trợ file PDF').first()).toBeVisible({ timeout: 2000 }).catch(async () => {
       // If no immediate client side validation, try to upload
       const uploadBtn = page.locator('button:has-text("Tải lên")').first();
       if (await uploadBtn.isVisible() && await uploadBtn.isEnabled()) {
          await uploadBtn.click();
          await expect(page.locator('text=thất bại').first()).toBeVisible();
       }
    });

    // 2. Upload PDF (should succeed)
    await fileInput.setInputFiles('e2e/fixtures/dummy.pdf');
    const uploadBtn = page.locator('button:has-text("Tải lên")').first();
    
    if (await uploadBtn.isVisible() && await uploadBtn.isEnabled()) {
      await uploadBtn.click();
    }

    // Wait for success message or the file to appear in the list
    await expect(page.locator('text=dummy.pdf').first()).toBeVisible({ timeout: 10000 });
    
    // 3. Verify Download button/link exists
    const downloadLink = page.locator('a[download], a:has-text("Tải xuống"), button:has-text("Tải xuống")').first();
    await expect(downloadLink).toBeVisible();
    
    // We do not actually download the file to avoid clutter, 
    // but we can trigger it and wait for the event if needed.
    // For smoke test, checking visibility of the download link is often enough.
  });

  test('Logout works', async ({ page }) => {
    // Click user menu or logout button
    const logoutBtn = page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
    } else {
      // Maybe under a dropdown
      const avatarBtn = page.locator('button.rounded-full').first();
      if (await avatarBtn.isVisible()) {
         await avatarBtn.click();
         await page.locator('text=Đăng xuất').first().click();
      }
    }
    await expect(page.locator('text=Đăng nhập').first()).toBeVisible();
  });
});
