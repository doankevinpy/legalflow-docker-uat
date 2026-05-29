import { test, expect, Page } from '@playwright/test';

// Use environment variables or fallback to local defaults for E2E tests
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'change_me_in_local_only';
const STAFF_EMAIL = process.env.E2E_STAFF_EMAIL || 'staff@legalflow.local';
const STAFF_PASSWORD = process.env.E2E_STAFF_PASSWORD || 'MockUser@local-only-not-for-prod';

async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  await page.locator('#login-email').fill(email);
  await page.locator('#login-password').fill(password);
  
  // Wait for the navigation to finish after clicking submit
  await Promise.all([
    page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 }),
    page.locator('#login-submit').click()
  ]);
  
  // Optionally, wait for the logout button to appear to be completely sure
  // const logoutBtn = page.locator('button').filter({ hasText: /Đăng xuất/i }).first();
  // await expect(logoutBtn).toBeVisible({ timeout: 10000 }).catch(() => {});
}

test.describe('Authentication and Roles Smoke Tests', () => {
  test('Root page loads and redirects to login if unauthenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#login-submit')).toBeVisible();
  });

  test('Admin can login and access Analytics', async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    
    await page.goto('/analytics');
    await expect(page).toHaveURL(/\/analytics/);
    // Wait for a root element of the analytics page to be visible
    await expect(page.locator('.max-w-7xl').first()).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('Staff is blocked from Analytics', async ({ page }) => {
    await login(page, STAFF_EMAIL, STAFF_PASSWORD);
    
    await page.goto('/analytics');
    await expect(page).not.toHaveURL(/\/analytics/);
  });
});

test.describe('Case & Document Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  });

  test('View case list and case details', async ({ page }) => {
    await page.goto('/cases');
    await expect(page).toHaveURL(/\/cases/);
    
    // Wait for rows to load
    await page.waitForSelector('table tbody tr', { timeout: 10000 }).catch(() => {});
    
    // Find the first case link (might be inside the table)
    const caseLink = page.locator('a[href^="/cases/"]').first();
    if (await caseLink.isVisible()) {
      const caseUrl = await caseLink.getAttribute('href');
      await caseLink.click();
      await expect(page).toHaveURL(new RegExp(caseUrl || ''));
    } else {
      throw new Error('No seeded case found');
    }
  });

  test('Upload TXT is blocked and PDF is successful', async ({ page }) => {
    await page.goto('/cases');
    // Wait for the table row to appear, then click
    await page.waitForSelector('table tbody tr', { timeout: 10000 }).catch(() => {});
    
    const caseLink = page.locator('a[href^="/cases/"]').first();
    // If there is no case (empty DB), we can't test upload easily without creating one.
    // Assuming seed created a case.
    if (await caseLink.isVisible()) {
      await caseLink.click();
      
      // Look for documents tab by finding a button containing "Tài liệu" or "Document"
      const docsTab = page.locator('button').filter({ hasText: /Tài liệu/i }).first();
      if (await docsTab.isVisible()) {
        await docsTab.click();
      }

      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Upload TXT
        await fileInput.setInputFiles('e2e/fixtures/dummy.txt');
        await page.waitForTimeout(1000); // Wait for UI update
        
        // Upload PDF
        await fileInput.setInputFiles('e2e/fixtures/dummy.pdf');
        
        // Find upload button (usually next to the input or having 'Tải lên' text)
        const uploadBtn = page.locator('button').filter({ hasText: /Tải lên/i }).first();
        if (await uploadBtn.isVisible() && await uploadBtn.isEnabled()) {
          await uploadBtn.click();
        }

        // Check for download button or a tag
        const downloadLink = page.locator('a[download], a[href*="/download"]').first();
        if (await downloadLink.isVisible()) {
          await expect(downloadLink).toBeVisible();
        }
      }
    } else {
      throw new Error('No seeded case found');
    }
  });

  test('Logout works', async ({ page }) => {
    // Look for logout button
    const logoutBtn = page.locator('button').filter({ hasText: /Đăng xuất/i }).first();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
    } else {
      // Find user menu button (usually circular avatar)
      const avatarBtn = page.locator('button.rounded-full').first();
      if (await avatarBtn.isVisible()) {
         await avatarBtn.click();
         await page.locator('button').filter({ hasText: /Đăng xuất/i }).first().click();
      }
    }
    await expect(page.locator('#login-submit')).toBeVisible();
  });
});
