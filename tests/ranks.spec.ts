import { test, expect } from '@playwright/test';

test('testing rank counters', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.getByTestId('owned-select-all').click();
    await page.getByTestId('ranked-select-all').click();
    await expect(page.getByTestId('ranked-count')).toContainText('100');
    await expect(page.getByTestId('torank-count')).toContainText('318');
    await expect(page.getByTestId('owned-count')).toContainText('58');
});

test('test rank todo', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.getByRole('row', { name: '► Zombie Hunter 2 100 84 800' }).locator('span').first().click();
    await page.getByRole('row', { name: '► Trooper 2 120 20 300 1' }).locator('span').first().click();
    await page.getByText('Owned only').click();
    await page.getByText('Hide ranked').click();
    await expect(page.getByTestId('torank-count')).toContainText('12');
    await expect(page.getByTestId('owned-count')).toContainText('2');
    await expect(page.getByTestId('ranked-count')).toContainText('0');
    await page.getByRole('row', { name: '► Zombie Hunter 2 100 84 800' }).locator('span').nth(1).click();
    await page.getByRole('row', { name: '► Zombie Hunter 3 200 108' }).locator('span').nth(1).click();
    await expect(page.getByTestId('ranked-count')).toContainText('2');
    await expect(page.getByTestId('torank-count')).toContainText('10');
    await expect(page.getByTestId('owned-count')).toContainText('2');
})