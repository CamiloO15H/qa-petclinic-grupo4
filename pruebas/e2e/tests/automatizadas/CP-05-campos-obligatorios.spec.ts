import { test, expect } from '@playwright/test';

test('CP-05 - Validar campos obligatorios vacíos', async ({ page }) => {

  await page.goto('/');

  await page.getByRole('link', { name: /find owners/i }).click();
  await page.getByRole('link', { name: /add owner/i }).click();

  // Dejar todos los campos vacíos
  await page.getByRole('button', { name: /add owner/i }).click();

  // Comprobar que continúa en el formulario
  await expect(page).toHaveURL(/owners\/new/);

  // Comprobar que aparecen mensajes de validación
  await expect(
    page.locator('.has-error, .help-inline, .text-danger').first()
  ).toBeVisible();

  await page.screenshot({
    path: '../../evidencias/automatizadas/CP-05-campos-obligatorios.png',
    fullPage: true
  });

});