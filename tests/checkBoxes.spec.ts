import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  const pm = new PageManager(page)
  await pm.navigateTo().veterinariansPage()
});

test("Validate selected specialties", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onVeterinariansPage().selectEditButtonForVeterinarianWithName(" Helen Leary ")

  await pm.onVeterinariansPage().checkInputValueContain("radiology")

  expect(await page.locator("#radiology").isChecked()).toBeTruthy();
  expect(await page.locator("#surgery").isChecked()).toBeFalsy();
  expect(await page.locator("#dentistry").isChecked()).toBeFalsy();

  await page.locator("#surgery").check();
  await page.locator("#radiology").uncheck();

  await pm.onVeterinariansPage().checkInputValueContain("surgery")

  await page.locator("#dentistry").check();

  await pm.onVeterinariansPage().checkInputValueContain("surgery, dentistry")
});

test("Select all specialties", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onVeterinariansPage().selectEditButtonForVeterinarianWithName(" Rafael Ortega ")

  await pm.onVeterinariansPage().checkInputValueContain("surgery")

  const allSpecialtiesCheckboxes = page.getByRole("checkbox");
  for (const box of await allSpecialtiesCheckboxes.all()) {
    await box.check();
    expect(await box.isChecked()).toBeTruthy();
  }

  await pm.onVeterinariansPage().checkInputValueContain("surgery, radiology, dentistry")
});

test("Unselect all specialties", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onVeterinariansPage().selectEditButtonForVeterinarianWithName(" Linda Douglas ")

  await pm.onVeterinariansPage().checkInputValueContain("dentistry, surgery")

  const allSpecialtiesCheckboxes = page.getByRole("checkbox");
  for (const box of await allSpecialtiesCheckboxes.all()) {
    await box.uncheck();
    expect(await box.isChecked()).toBeFalsy();
  }

  await expect(page.locator(".dropdown-display .selected-specialties")).toBeEmpty();
});
