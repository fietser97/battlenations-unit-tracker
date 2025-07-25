import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.getByTestId('current-version-btn').click();
    await expect(page.getByTestId('other-filter-wrapper').getByRole('textbox')).toHaveValue('(none), How to Kill People From Quite a Long Way Away, Weapons Factory, Rocket Factory, SpecOps Center, Chemical Weapons Lab, Gun Foundry, Raptor Ranch, Boar Pen, Mammoth Pen, Sandworm Ranch, Armor ShopGun Foundry, Armor Shop, Armor ShopChemical Weapons Lab, Reef Bandit Armory');
    await expect(page.locator('#unlock-range-display')).toContainText('Level: 1 - 46');
    const firstCell = await page.locator('tbody tr:first-child td:first-child').textContent();
    expect(firstCell?.trim()).toBe('Trooper');
});