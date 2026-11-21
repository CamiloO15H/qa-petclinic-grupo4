import { test, expect } from '@playwright/test';

test('CP-09 - Rechazar mascota con fecha de nacimiento futura', async ({ page }) => {

  // 1. Abrir PetClinic
  await page.goto('/');

  // 2. Ir al formulario de registro de dueño
  await page.getByRole('link', { name: /find owners/i }).click();
  await page.getByRole('link', { name: /add owner/i }).click();

  // 3. Crear un dueño para asociarle la mascota
  await page.getByLabel('First Name').fill('Carlos');
  await page.getByLabel('Last Name').fill('PruebaCP09');
  await page.getByLabel('Address').fill('Calle 20');
  await page.getByLabel('City').fill('Medellin');
  await page.getByLabel('Telephone').fill('3101234567');

  await page.getByRole('button', { name: /add owner/i }).click();

  // 4. Entrar a Add New Pet
  await page.getByRole('link', { name: /add new pet/i }).click();

  // 5. Completar los datos de la mascota
  await page.getByLabel('Name').fill('Max');
  await page.getByLabel('Birth Date').fill('2099-01-01');
  await page.getByLabel('Type').selectOption('dog');

  // 6. Intentar guardar la mascota
  await page.getByRole('button', { name: /add pet/i }).click();

  // 7. Comprobar que aparece el error de fecha
  await expect(
    page.getByText(/invalid date|must be in the past/i)
  ).toBeVisible();

  // 8. Guardar evidencia
  await page.screenshot({
    path: '../../evidencias/automatizadas/CP-09-fecha-futura.png',
    fullPage: true
  });

});