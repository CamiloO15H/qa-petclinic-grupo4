import { test, expect } from '@playwright/test';

test('CP-03 - Aceptar teléfono de 10 dígitos', async ({ page }) => {

  await page.goto('/');

  await page.getByRole('link', { name: /find owners/i }).click();
  await page.getByRole('link', { name: /add owner/i }).click();

  await page.getByLabel('First Name').fill('Ana');
  await page.getByLabel('Last Name').fill('PruebaCP03');
  await page.getByLabel('Address').fill('Calle 10 # 5-20');
  await page.getByLabel('City').fill('Medellin');
  await page.getByLabel('Telephone').fill('1234567890');

  await page.getByRole('button', { name: /add owner/i }).click();

  // Comprobar que el dueño se haya registrado
  await expect(page.getByText('PruebaCP03')).toBeVisible();

  // Comprobar el teléfono registrado
  await expect(page.getByText('1234567890')).toBeVisible();

  await page.screenshot({
    path: '../../evidencias/automatizadas/CP-03-telefono-10-digitos.png',
    fullPage: true
  });

});