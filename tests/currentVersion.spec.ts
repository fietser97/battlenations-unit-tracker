import {expect, test} from '@playwright/test';

test('Current version test', async ({page}) => {
    await page.goto('http://localhost:8080/');
    await page.getByTestId('current-version-btn').click();
    const otherFilter = await page.$$eval('#other_filter option:checked', opts =>
        opts.map(o => o.textContent.trim())
    );
    const expected = ['(none)', 'How to Kill People From Quite a Long Way Away', 'Weapons Factory', 'Rocket Factory', 'SpecOps Center', 'Chemical Weapons Lab', 'Raptor Ranch', 'Boar Pen', 'Mammoth Pen', 'Sandworm Ranch', 'Infection Test Facility', 'Armor Shop', 'Armor ShopChemical Weapons Lab', 'Reef Bandit Armory'];
    expect(otherFilter.sort()).toEqual(expected.sort());
    await expect(page.locator('#unlock-range-display')).toContainText('Level: 0 - 46');
    const firstCell = await page.getByRole('cell', {name: 'Trooper', exact: true}).first().textContent();
    expect(firstCell?.trim()).toBe('Trooper');
});