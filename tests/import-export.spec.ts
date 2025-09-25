import {expect, test} from '@playwright/test';

test('import test', async ({page}) => {

    await page.goto('http://localhost:8080/');
    const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        await page.getByTestId('import-button').click(),
    ]);
    await fileChooser.setFiles('tests/fixtures/importTest.json');
    await expect(page.getByTestId('unlock-rank-display')).toContainText('Unlock rank: 0 - 46');
    await expect(page.getByTestId('unlock-range-display')).toContainText('Level: 0 - 46');
    await expect(page.getByTestId('ranked-count')).toContainText('1');
    await expect(page.getByTestId('torank-count')).toContainText('17');
    await expect(page.getByTestId('owned-count')).toContainText('3');
    await expect(page.getByTestId('other-filter-wrapper').getByRole('textbox')).toHaveValue('(none), How to Kill People From Quite a Long Way Away, Weapons Factory, Rocket Factory, SpecOps Center, Chemical Weapons Lab, Gun Foundry, Raptor Ranch, Boar Pen, Mammoth Pen, Sandworm Ranch, Armor ShopGun Foundry, Armor Shop, Armor ShopChemical Weapons Lab, Reef Bandit Armory');
    await expect(page.getByTestId('rank-filter-wrapper').getByRole('textbox')).toHaveValue('2');
    await expect(page.getByTestId('nanopods-filter-wrapper').getByRole('textbox')).toHaveValue('No');
    await expect(page.getByTestId('category-filter-wrapper').getByRole('textbox')).toBeEmpty();
    await expect(page.getByTestId('building-filter-wrapper').getByRole('textbox')).toBeEmpty();
    await expect(page.locator('#unitTable_paginate')).toContainText('1');
    await expect(page.getByTestId('checkbox-filter-owned')).toBeChecked();
    await expect(page.getByTestId('username')).toHaveValue("Fietser97");
});

test('download no username', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('export-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain("unitTracking_unknown")
});


test('download username test', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.getByTestId('username').fill("test");
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('export-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain("unitTracking_test");
});