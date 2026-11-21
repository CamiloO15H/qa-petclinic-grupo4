import { test, expect } from '@playwright/test';

test('CP-02 - Rechazar teléfono de 9 dígitos', async ({ page }) => {

  await page.goto('/');

  await page.getByRole('link', { name: /find owners/i }).click();
  await page.getByRole('link', { name: /add owner/i }).click();

  await page.getByLabel('First Name').fill('Ana');
  await page.getByLabel('Last Name').fill('PruebaCP02');
  await page.getByLabel('Address').fill('Calle 10 # 5-20');
  await page.getByLabel('City').fill('Medellin');
  await page.getByLabel('Telephone').fill('123456789');

  await page.getByRole('button', { name: /add owner/i }).click();

  // Comprobar que no se haya creado el dueño
  await expect(page).toHaveURL(/owners\/new/);

  // Comprobar que se muestra una validación
  await expect(
    page.locator('.has-error, .help-inline, .text-danger').first()
  ).toBeVisible();

  await page.screenshot({
    path: '../../evidencias/automatizadas/CP-02-telefono-9-digitos.png',
    fullPage: true
  });

});