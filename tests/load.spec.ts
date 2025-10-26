import {expect, test} from '@playwright/test'

test('page load', async ({page}) => {
    await page.goto('http://localhost:8080/');
    await expect(page.getByRole('heading', {name: 'Battle Nations Unit Tracker'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Export Tracking'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Import Tracking'})).toBeVisible();
    await expect(page.getByText('Filter by Rank')).toBeVisible();
    await expect(page.locator('label').filter({hasText: 'Requires Nanopods'})).toBeVisible();
    await expect(page.getByTestId('owned-filter-wrapper').getByRole('textbox')).toBeVisible();
    await expect(page.getByText('Unit Ranked')).toBeVisible();
    await expect(page.getByText('Show Unique Units Only')).toBeVisible();
    await expect(page.locator('label').filter({hasText: 'Category'})).toBeVisible();
    await expect(page.locator('label').filter({hasText: 'Other Requirements'})).toBeVisible();
    await expect(page.locator('label').filter({hasText: 'Building Requirement'})).toBeVisible();
    await expect(page.getByText('Ranks done:')).toBeVisible();
    await expect(page.getByText('Ranks todo:')).toBeVisible();
    await expect(page.getByText('Owned units:')).toBeVisible();
    await expect(page.locator('#owned-select-all')).toBeVisible();
    await expect(page.locator('#owned-deselect-all')).toBeVisible();
    await expect(page.locator('#ranked-select-all')).toBeVisible();
    await expect(page.locator('#ranked-deselect-all')).toBeVisible();
    await expect(page.getByText('Set filter Current Version')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Clear Filters'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Clear All'})).toBeVisible();
});
