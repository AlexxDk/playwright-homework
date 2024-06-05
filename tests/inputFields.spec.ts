import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.getByText(" Pet Types").click();
  await expect(page.locator("h2")).toHaveText("Pet Types");
});

test("Update pet type", async ({ page }) => {
  const catPetTypeInTable = page.locator("tr", {
    has: page.locator('[id="0"]'),
  });
  await catPetTypeInTable.getByRole("button", { name: "Edit" }).click();

  await expect(page.locator("h2")).toHaveText("Edit Pet Type");

  const petTypeInput = page.locator("#name");
  await petTypeInput.click();
  await petTypeInput.clear();

  await petTypeInput.fill("rabbit");
  await page.getByRole("button", { name: "Update" }).click();

  await expect(catPetTypeInTable.locator("input")).toHaveValue("rabbit");

  await catPetTypeInTable.getByRole("button", { name: "Edit" }).click();

  await petTypeInput.click();
  await petTypeInput.clear();
  await petTypeInput.fill("cat");
  await page.getByRole("button", { name: "Update" }).click();

  await expect(catPetTypeInTable.locator("input")).toHaveValue("cat");
});

test("Cancel pet type update", async ({ page }) => {
  const dogPetTypeInTable = page.locator("tr", {
    has: page.locator('[id="1"]'),
  });
  await dogPetTypeInTable.getByRole("button", { name: "Edit" }).click();

  const petTypeInput = page.locator("#name");
  await petTypeInput.click();
  await petTypeInput.clear();
  await petTypeInput.fill("moose");

  await expect(petTypeInput).toHaveValue("moose");

  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(dogPetTypeInTable.locator("input")).toHaveValue("dog");
});

test("Pet type name is required validation", async ({ page }) => {
  const lizardPetTypeInTable = page.locator("tr", {
    has: page.locator('[id="2"]'),
  });
  await lizardPetTypeInTable.getByRole("button", { name: "Edit" }).click();

  const petTypeInput = page.locator("#name");
  await petTypeInput.click();
  await petTypeInput.clear();

  const validationMessage = await petTypeInput
    .locator("..")
    .locator(".help-block")
    .textContent();
  expect(validationMessage).toEqual("Name is required");

  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(page.locator("h2")).toHaveText("Pet Types");
});
