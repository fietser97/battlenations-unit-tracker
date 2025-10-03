import {expect, test} from "@playwright/test";

test('test rank filter', async ({page}) => {
    await page.goto('http://localhost:8080/');
    await page.locator('#unitTable_filter input[type="search"]').fill('shock');
    await expect(page.locator('[data-testid="unit-table-body"] tr:visible')).toHaveCount(5);
    await page.locator('[data-testid="ranked-filter-wrapper"] .select-dropdown.dropdown-trigger').click();
    await page.locator('[data-testid="ranked-filter-wrapper"] ul.select-dropdown li span', {hasText: 'No'}).click();
    await page.getByTestId('checkbox-ranked-Shock Trooper-2').click();
    await page.getByTestId('checkbox-ranked-Shock Trooper-3').click();
    await page.locator('[data-testid="ranked-filter-wrapper"] .select-dropdown.dropdown-trigger').click();
    await page.locator('[data-testid="ranked-filter-wrapper"] ul.select-dropdown li span', { hasText: 'No' }).click();
    await expect(page.locator('[data-testid="unit-table-body"] tr:visible')).toHaveCount(3);
    await page.locator('[data-testid="ranked-filter-wrapper"] .select-dropdown.dropdown-trigger').click();
    await page.locator('[data-testid="ranked-filter-wrapper"] ul.select-dropdown li span', { hasText: 'Yes' }).click();
    await expect(page.locator('[data-testid="unit-table-body"] tr:visible')).toHaveCount(2)
    await page.locator('[data-testid="ranked-filter-wrapper"] .select-dropdown.dropdown-trigger').click();
    await page.locator('[data-testid="ranked-filter-wrapper"] ul.select-dropdown li span', { hasText: 'All' }).click();
    await expect(page.locator('[data-testid="unit-table-body"] tr:visible')).toHaveCount(5)
});