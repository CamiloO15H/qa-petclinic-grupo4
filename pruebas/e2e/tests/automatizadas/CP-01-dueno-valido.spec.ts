import { test, expect } from '@playwright/test';

test('CP-01 - Registrar dueño con datos válidos', async ({ page }) => {

  // 1. Abrir la aplicación
  await page.goto('/');

  // 2. Entrar a Find Owners
  await page.getByRole('link', { name: /find owners/i }).click();

  // 3. Entrar a Add Owner
  await page.getByRole('link', { name: /add owner/i }).click();

  // 4. Completar los datos del dueño
  await page.getByLabel('First Name').fill('Ana');
  await page.getByLabel('Last Name').fill('PruebaCP01');
  await page.getByLabel('Address').fill('Calle 10 # 5-20');
  await page.getByLabel('City').fill('Medellin');
  await page.getByLabel('Telephone').fill('3001234567');

  // 5. Guardar el dueño
  await page.getByRole('button', { name: /add owner/i }).click();

  // 6. Comprobar que aparece la ficha del dueño
  await expect(page.getByText('PruebaCP01')).toBeVisible();

  // 7. Guardar evidencia
  await page.screenshot({
    path: '../../evidencias/automatizadas/CP-01-dueno-valido.png',
    fullPage: true
  });

});