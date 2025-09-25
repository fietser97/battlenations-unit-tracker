import { test, expect } from '@playwright/test';

test('check that icons exist', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await expect(page.getByRole('row', { name: '► Zombie Hunter Zombie Hunter 2 100 84 800 10 20 soldiers Soldier-Hunter' }).getByRole('img')).toBeVisible();
});