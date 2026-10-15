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