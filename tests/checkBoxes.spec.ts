import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  const pm = new PageManager(page)
  await pm.navigateTo().veterinariansPage()
});

test("Validate selected specialties", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onVeterinariansPage().selectEditVetByName(" Helen Leary ")

  await pm.onEditVeterinariansPage().checkInputValueContain("radiology")

  expect(await page.locator("#radiology").isChecked()).toBeTruthy();
  expect(await page.locator("#surgery").isChecked()).toBeFalsy();
  expect(await page.locator("#dentistry").isChecked()).toBeFalsy();

  await page.locator("#surgery").check();
  await page.locator("#radiology").uncheck();

  await pm.onEditVeterinariansPage().checkInputValueContain("surgery")

  await page.locator("#dentistry").check();

  await pm.onEditVeterinariansPage().checkInputValueContain("surgery, dentistry")
});

test("Select all specialties", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onVeterinariansPage().selectEditVetByName(" Rafael Ortega ")

  await pm.onEditVeterinariansPage().checkInputValueContain("surgery")

  const allSpecialtiesCheckboxes = page.getByRole("checkbox");
  for (const box of await allSpecialtiesCheckboxes.all()) {
    await box.check();
    expect(await box.isChecked()).toBeTruthy();
  }

  await pm.onEditVeterinariansPage().checkInputValueContain("surgery, radiology, dentistry")
});

test("Unselect all specialties", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onVeterinariansPage().selectEditVetByName(" Linda Douglas ")

  await pm.onEditVeterinariansPage().checkInputValueContain("dentistry, surgery")

  const allSpecialtiesCheckboxes = page.getByRole("checkbox");
  for (const box of await allSpecialtiesCheckboxes.all()) {
    await box.uncheck();
    expect(await box.isChecked()).toBeFalsy();
  }

  await expect(page.locator(".dropdown-display .selected-specialties")).toBeEmpty();
});
