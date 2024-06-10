import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.getByText(" Veterinarians").click();
  await page.locator(".dropdown-menu").getByText(" All").click();
});

test("Validate selected specialties", async ({ page }) => {
  await expect(page.locator("h2")).toHaveText("Veterinarians");

  await page.locator("tr", { has: page.getByText(" Helen Leary ") }).getByRole("button", { name: "Edit Vet" }).click();

  const selectedSpecialtiesDropdown = page.locator(".dropdown-display .selected-specialties");
  await expect(selectedSpecialtiesDropdown).toContainText("radiology");
  await selectedSpecialtiesDropdown.click();

  expect(await page.locator("#radiology").isChecked()).toBeTruthy();
  expect(await page.locator("#surgery").isChecked()).toBeFalsy();
  expect(await page.locator("#dentistry").isChecked()).toBeFalsy();

  await page.locator("#surgery").check();
  await page.locator("#radiology").uncheck();

  await expect(selectedSpecialtiesDropdown).toContainText("surgery");

  await page.locator("#dentistry").check();

  await expect(selectedSpecialtiesDropdown).toContainText("surgery, dentistry");
});

test("Select all specialties", async ({ page }) => {
  await page.locator("tr", { has: page.getByText(" Rafael Ortega ") }).getByRole("button", { name: "Edit Vet" }).click();

  const selectedSpecialtiesDropdown = page.locator(".dropdown-display .selected-specialties");
  await expect(selectedSpecialtiesDropdown).toContainText("surgery");
  await selectedSpecialtiesDropdown.click();

  const allSpecialtiesCheckboxes = page.getByRole("checkbox");
  for (const box of await allSpecialtiesCheckboxes.all()) {
    await box.check();
    expect(await box.isChecked()).toBeTruthy();
  }

  await expect(selectedSpecialtiesDropdown).toContainText("surgery, radiology, dentistry, new specialty ");
});

test("Unselect all specialties", async ({ page }) => {
  await page.locator("tr", { has: page.getByText(" Linda Douglas ") }).getByRole("button", { name: "Edit Vet" }).click();

  const selectedSpecialtiesDropdown = page.locator(".dropdown-display .selected-specialties");
  await expect(selectedSpecialtiesDropdown).toContainText("dentistry, surgery");
  await selectedSpecialtiesDropdown.click();

  const allSpecialtiesCheckboxes = page.getByRole("checkbox");
  for (const box of await allSpecialtiesCheckboxes.all()) {
    await box.uncheck();
    expect(await box.isChecked()).toBeFalsy();
  }

  await expect(selectedSpecialtiesDropdown).toBeEmpty();
});
