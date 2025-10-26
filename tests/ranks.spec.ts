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
    await page.getByTestId('checkbox-owned-Zombie Hunter-2').click();
    await page.getByTestId('checkbox-owned-Trooper-2').click();
    await page.getByTestId('owned-filter-wrapper').getByRole('textbox').click();
    await page.locator('[data-testid="owned-filter-wrapper"] ul.select-dropdown li span', { hasText: 'yes' }).click();
    await page.locator('[data-testid="ranked-filter-wrapper"] .select-dropdown.dropdown-trigger').click();
    await page.locator('[data-testid="ranked-filter-wrapper"] ul.select-dropdown li span', { hasText: 'No' }).click();
    await expect(page.getByTestId('torank-count')).toContainText('12');
    await expect(page.getByTestId('owned-count')).toContainText('2');
    await expect(page.getByTestId('ranked-count')).toContainText('0');
    await page.getByTestId('checkbox-ranked-Zombie Hunter-2').click();
    await page.getByTestId('checkbox-ranked-Zombie Hunter-3').click();
    await expect(page.getByTestId('ranked-count')).toContainText('2');
    await expect(page.getByTestId('torank-count')).toContainText('10');
    await expect(page.getByTestId('owned-count')).toContainText('2');
})