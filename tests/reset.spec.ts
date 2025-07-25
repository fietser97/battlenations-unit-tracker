import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.getByTestId('current-version-btn').click();
    await expect(page.getByTestId('other-filter-wrapper').getByRole('textbox')).toHaveValue('(none), How to Kill People From Quite a Long Way Away, Weapons Factory, Rocket Factory, SpecOps Center, Chemical Weapons Lab, Gun Foundry, Raptor Ranch, Boar Pen, Mammoth Pen, Sandworm Ranch, Armor ShopGun Foundry, Armor Shop, Armor ShopChemical Weapons Lab, Reef Bandit Armory');
    await page.getByText('Hide ranked').click();
    await page.getByText('Show Unique Units Only').click();
    await page.getByText('Owned only').click();
    await page.getByTestId('category-filter-wrapper').getByRole('textbox').click();
    await page.locator('span').filter({ hasText: 'defense' }).first().click();
    await page.getByTestId('building-filter-wrapper').getByRole('textbox').click();
    await page.locator('span').filter({ hasText: 'Barrackslevel 7' }).first().click();
    await page.locator('span').filter({ hasText: 'Barrackslevel 5' }).first().click();
    await page.getByTestId('category-filter-wrapper').getByRole('textbox').click();
    await page.locator('span').filter({ hasText: 'infected' }).first().click();
    await page.getByTestId('rank-filter-wrapper').getByRole('textbox').click();
    await page.locator('span').filter({ hasText: 'Rank 4' }).first().click();
    await page.getByRole('list').getByText('Rank 5').click();
    await expect(page.getByTestId('rank-filter-wrapper').getByRole('textbox')).toHaveValue('Rank 4, Rank 5');
    await expect(page.getByTestId('nanopods-filter-wrapper').getByRole('textbox')).toHaveValue('All');
    await expect(page.getByTestId('other-filter-wrapper').getByRole('textbox')).toHaveValue('(none), How to Kill People From Quite a Long Way Away, Weapons Factory, Rocket Factory, SpecOps Center, Chemical Weapons Lab, Gun Foundry, Raptor Ranch, Boar Pen, Mammoth Pen, Sandworm Ranch, Armor ShopGun Foundry, Armor Shop, Armor ShopChemical Weapons Lab, Reef Bandit Armory');
    await expect(page.getByTestId('category-filter-wrapper').getByRole('textbox')).toHaveValue('infected, defense');
    await expect(page.getByTestId('building-filter-wrapper').getByRole('textbox')).toHaveValue('Barrackslevel 5, Barrackslevel 7');
    await expect(page.getByTestId('checkbox-filters')).toMatchAriaSnapshot(`
    - checkbox "Owned only" [checked]
    - text: Owned only
    - checkbox "Hide ranked" [checked]
    - text: Hide ranked
    - checkbox "Show Unique Units Only" [checked]
    - text: Show Unique Units Only
    `);
    await page.getByTestId('clear-all-btn').click();
    await expect(page.getByTestId('body')).toMatchAriaSnapshot(`
    - heading "Battle Nations Unit Tracker" [level=4]
    - text: Light
    - checkbox "Light Dark"
    - text: "Dark After playing Battle Nations in it's first form I have been waiting for something like this. Now I have the knowledge to make it myself. The tracker tracks the units u own and have ranked. If you run into any issues or have feature requests goto:"
    - link "https://github.com/feddevanderlist/battlenations-unit-tracker/issues":
      - /url: https://github.com/feddevanderlist/battlenations-unit-tracker/issues
    - button "Export Tracking"
    - button "Import Tracking"
    - slider: "1"
    - slider: /\\d+/
    - paragraph: "/Level: 1 - \\\\d+/"
    - textbox: Select Rank(s)
    - img
    - text: Filter by Rank
    - textbox: All
    - img
    - text: Requires Nanopods
    - checkbox "Owned only"
    - text: Owned only
    - checkbox "Hide ranked"
    - text: Hide ranked
    - checkbox "Show Unique Units Only"
    - text: Show Unique Units Only
    - textbox
    - img
    - text: Building Requirement
    - textbox
    - img
    - text: Other Requirements
    - textbox
    - img
    - text: Category
    - strong: "Owned:"
    - text: Select All Deselect All
    - strong: "Ranked:"
    - text: "Select All Deselect All Set filter Current Version Ranks done: 0 Ranks Ranks todo: 0 Ranks Owned units: 0 Units"
    - button "Clear Filters"
    - button "Clear All"
    - text: Show
    - textbox "Show entries"
    - img
    - text: "entries Search:"
    - searchbox "Search:"`);
});