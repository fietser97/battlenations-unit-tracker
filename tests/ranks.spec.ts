import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.getByTestId('owned-select-all').click();
    await page.getByTestId('ranked-select-all').click();
    await expect(page.getByTestId('ranked-count')).toContainText('100');
    await page.getByTestId('torank-count').click();
    await page.getByTestId('owned-count').click();
});