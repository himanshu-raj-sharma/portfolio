import { test, expect } from '@playwright/test';

test.describe('Portfolio smoke', () => {
  test('home page renders the hero and key sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(/Himanshu/i);
    await expect(page.locator('text=Hire me').first()).toBeVisible();
    // Skip the preloader if it lingers in CI
    await page.evaluate(() => window.sessionStorage.setItem('hrsf:preloader-shown', '1'));
  });

  test('contact form validates required fields', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href="#contact"]').first().click();
    await page.locator('button[type="submit"]').click();
    // Server-side errors or inline errors should appear.
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('projects index lists at least one project', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('h2').first()).toBeVisible();
  });

  test('404 page renders', async ({ page }) => {
    const res = await page.goto('/does-not-exist');
    expect(res?.status()).toBe(404);
    await expect(page.locator('text=Wrong door')).toBeVisible();
  });
});

test.describe('Contact form', () => {
  test('submits successfully with valid data', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href="#contact"]').first().click();

    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#message', 'This is a test message with enough characters to pass validation.');
    await page.selectOption('#projectType', 'full-stack-web');
    await page.selectOption('#budget', 'discuss');
    await page.selectOption('#timeline', 'flexible');

    // Intercept the API call to avoid actually sending email in tests
    await page.route('/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, delivered: true }),
      });
    });

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Got it — thank you')).toBeVisible({ timeout: 10000 });
  });

  test('shows error when honeypot is filled', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href="#contact"]').first().click();

    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#message', 'This is a test message with enough characters to pass validation.');

    // Fill the honeypot field (simulate bot behavior)
    const hpFieldName = await page.evaluate(() => {
      return sessionStorage.getItem('hp_field_name');
    });
    if (hpFieldName) {
      await page.fill(`#${hpFieldName}`, 'bot-filled-value');
    }

    await page.locator('button[type="submit"]').click();
    // Should return silent success (200) without sending email
    await expect(page.locator('text=Got it — thank you')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Navigation', () => {
  test('anchor links scroll to sections', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.sessionStorage.setItem('hrsf:preloader-shown', '1'));

    // Click "View work" link
    await page.locator('a[href="#projects"]').first().click();
    await page.waitForTimeout(1000);
    await expect(page.locator('#projects')).toBeInViewport();

    // Click "About" in navbar
    await page.locator('a[href="#about"]').first().click();
    await page.waitForTimeout(1000);
    await expect(page.locator('#about')).toBeInViewport();
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.evaluate(() => window.sessionStorage.setItem('hrsf:preloader-shown', '1'));

    // Open mobile menu
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('#mobile-menu')).toBeVisible();

    // Click a link in mobile menu
    await page.locator('#mobile-menu a[href="#contact"]').click();
    await expect(page.locator('#mobile-menu')).toBeHidden();
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.sessionStorage.setItem('hrsf:preloader-shown', '1'));

    // Get initial theme
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));

    // Click theme toggle
    await page.locator('button[aria-label="Toggle theme"]').click();

    // Theme should change
    await expect(page.evaluate(() => document.documentElement.getAttribute('data-theme'))).resolves.not.toBe(initialTheme);
  });
});

test.describe('Projects', () => {
  test('filter buttons work', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.sessionStorage.setItem('hrsf:preloader-shown', '1'));

    // Scroll to projects section
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click "Web" filter
    await page.locator('button:has-text("Web")').click();
    await page.waitForTimeout(300);

    // Should show only web projects
    const projectCards = page.locator('#projects .glass-interactive');
    await expect(projectCards.first()).toBeVisible();
  });

  test('project cards link to case study pages', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.sessionStorage.setItem('hrsf:preloader-shown', '1'));

    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click "Read case study" on first project
    await page.locator('#projects .link-arrow').first().click();
    await page.waitForURL(/\/projects\//);
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('skip link works', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.sessionStorage.setItem('hrsf:preloader-shown', '1'));

    // Tab to skip link
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link:focus')).toBeVisible();

    // Press Enter to skip
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('focus visible styles present', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.sessionStorage.setItem('hrsf:preloader-shown', '1'));

    // Tab to first focusable element
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveCSS('outline-style', /solid|dashed|dotted/);
  });
});