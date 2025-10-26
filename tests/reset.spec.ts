import {expect, test} from '@playwright/test';

test('reset test', async ({page}) => {
    const expected = ['(none)', 'How to Kill People From Quite a Long Way Away', 'Weapons Factory', 'Rocket Factory', 'SpecOps Center', 'Chemical Weapons Lab', 'Raptor Ranch', 'Boar Pen', 'Mammoth Pen', 'Sandworm Ranch', 'Infection Test Facility', 'Armor Shop', 'Armor ShopChemical Weapons Lab', 'Reef Bandit Armory'];
    await page.goto('http://localhost:8080/');
    await page.getByTestId('current-version-btn').click();
    let otherFilter = await page.$$eval('#other_filter option:checked', opts =>
        opts.map(o => o.textContent.trim())
    );
    expect(otherFilter.sort()).toEqual(expected.sort());

    await page.locator('[data-testid="ranked-filter-wrapper"] .select-dropdown.dropdown-trigger').click();
    await page.locator('[data-testid="ranked-filter-wrapper"] ul.select-dropdown li span', { hasText: 'Yes' }).click();
    await page.getByText('Show Unique Units Only').click();
    await page.getByTestId('owned-filter-wrapper').getByRole('textbox').click();
    await page.locator('[data-testid="owned-filter-wrapper"] ul.select-dropdown li span', { hasText: 'yes' }).click();
    await page.getByTestId('category-filter-wrapper').getByRole('textbox').click();
    await page.locator('span').filter({hasText: 'defense'}).first().click();
    await page.getByTestId('building-filter-wrapper').getByRole('textbox').click();
    await page.locator('span').filter({hasText: 'Barrackslevel 7'}).first().click();
    await page.locator('span').filter({hasText: 'Barrackslevel 5'}).first().click();
    await page.getByTestId('category-filter-wrapper').getByRole('textbox').click();
    await page.locator('span').filter({hasText: 'infected'}).first().click();
    await page.getByTestId('rank-filter-wrapper').getByRole('textbox').click();
    await page.locator('span').filter({hasText: '4'}).first().click();
    await page.getByRole('list').getByText('5').click();
    await page.getByTestId("username").fill("test");
    await expect(page.getByTestId('rank-filter-wrapper').getByRole('textbox')).toHaveValue('4, 5');
    await expect(page.getByTestId('nanopods-filter-wrapper').getByRole('textbox')).toHaveValue('All');
    otherFilter = await page.$$eval('#other_filter option:checked', opts =>
        opts.map(o => o.textContent.trim())
    );
    expect(otherFilter.sort()).toEqual(expected.sort());
    await expect(page.getByTestId('category-filter-wrapper').getByRole('textbox')).toHaveValue('defense, infected');
    await expect(page.getByTestId('building-filter-wrapper').getByRole('textbox')).toHaveValue('Barrackslevel 5, Barrackslevel 7');
    await expect(page.getByTestId('owned-filter-wrapper').getByRole('textbox')).toHaveValue('Yes');
    await expect(page.getByTestId('ranked-filter-wrapper').getByRole('textbox')).toHaveValue('Yes');
    await expect(page.getByTestId('checkbox-filter-unique')).toBeChecked();
    await page.getByTestId('clear-all-btn').click();
    await expect(page.getByTestId('rank-filter-wrapper').getByRole('textbox')).toHaveValue('Select Rank(s)');
    await expect(page.getByTestId('nanopods-filter-wrapper').getByRole('textbox')).toHaveValue('All');
    await expect(page.getByTestId('category-filter-wrapper').getByRole('textbox')).toBeEmpty();
    await expect(page.getByTestId('other-filter-wrapper').getByRole('textbox')).toBeEmpty();
    await expect(page.getByTestId('building-filter-wrapper').getByRole('textbox')).toBeEmpty();
    await expect(page.getByTestId('owned-count')).toContainText('0');
    await expect(page.getByTestId('torank-count')).toContainText('0');
    await expect(page.getByTestId('ranked-count')).toContainText('0');
    await expect(page.getByTestId('unlock-range-display')).toContainText('Level: 0 - 70');
    await expect(page.getByTestId('unlock-rank-display')).toContainText('Unlock rank: 0 - 70');
    await expect(page.getByTestId('owned-filter-wrapper').getByRole('textbox')).toHaveValue('All')
    await expect(page.getByTestId('ranked-filter-wrapper').getByRole('textbox')).toHaveValue('All');
    await expect(page.getByTestId('checkbox-filter-unique')).not.toBeChecked();
    await expect(page.getByTestId('username')).toHaveValue("");
});